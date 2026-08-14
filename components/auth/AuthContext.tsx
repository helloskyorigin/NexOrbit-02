'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db, googleProvider, githubProvider } from '../../lib/firebase';
import { AuthContextType, AuthUser, AuthView } from './types';
import { Language, translations } from './translations';
import {
  AuthErrorInfo,
  getFriendlyAuthErrorMessage,
  validateEmailInput,
  validateNameInput,
  validatePasswordInput,
  evaluatePasswordStrength,
} from './authErrors';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedSession = localStorage.getItem('nexorbit_auth_session');
        if (storedSession) {
          const parsed = JSON.parse(storedSession);
          if (parsed && parsed.language) {
            return parsed.language;
          }
        }
        const savedLang = localStorage.getItem('nexorbit_lang') as Language;
        if (savedLang) {
          return savedLang;
        }
      } catch (e) {}
    }
    return 'en';
  });

  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authInitializing, setAuthInitializing] = useState<boolean>(true);
  const [authView, setAuthView] = useState<AuthView>('welcome');
  const [loading, setLoading] = useState<boolean>(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'github' | null>(null);
  const [authErrorInfo, setAuthErrorInfo] = useState<AuthErrorInfo | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string>('');

  const clearError = useCallback(() => {
    setAuthErrorInfo(null);
  }, []);

  const setAuthError = useCallback((err: AuthErrorInfo | string | null) => {
    if (!err) {
      setAuthErrorInfo(null);
      return;
    }
    if (typeof err === 'string') {
      setAuthErrorInfo({
        code: 'custom',
        message: err,
        targetField: 'general',
      });
    } else {
      setAuthErrorInfo(err);
    }
  }, []);

  // Backwards-compatible string error getter
  const error = authErrorInfo ? authErrorInfo.message : null;

  // Translation helper function
  const t = useCallback(
    (key: string): string => {
      return (
        translations[language]?.[key] ||
        translations['en']?.[key] ||
        key
      );
    },
    [language]
  );

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexorbit_lang', lang);
      }
    } catch (e) {}
  }, []);

  // Helper to load profile from Firestore or localStorage
  const loadUserProfile = async (uid: string) => {
    let profileData: {
      displayName?: string;
      country?: string;
      language?: Language;
      timezone?: string;
      workStyle?: string;
      onboardingCompleted?: boolean;
    } = {};

    // 1. Try local storage cache
    try {
      const stored = localStorage.getItem(`nexorbit_profile_${uid}`);
      if (stored) {
        profileData = JSON.parse(stored);
      }
    } catch (e) {}

    // 2. Try Firestore doc
    try {
      if (db) {
        const userRef = doc(db, 'users', uid);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) {
          const remoteData = snapshot.data();
          profileData = { ...profileData, ...remoteData };
        }
      }
    } catch (e) {
      // Offline / fallback to local storage
    }

    return profileData;
  };

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const profile = await loadUserProfile(firebaseUser.uid);
        const provider = firebaseUser.providerData[0]?.providerId || 'password';
        const displayName =
          profile.displayName ||
          firebaseUser.displayName ||
          firebaseUser.email?.split('@')[0] ||
          '';
        const userLang = profile.language || language || 'en';

        // Check whether onboarding is completed
        const hasCompletedOnboarding =
          profile.onboardingCompleted === true ||
          (!!profile.displayName && !!profile.country);

        const updatedUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: displayName || 'User',
          photoURL: firebaseUser.photoURL || undefined,
          plan: 'Free Plan',
          country: profile.country || 'India 🇮🇳',
          language: userLang,
          timezone: profile.timezone || 'Asia/Kolkata',
          workStyle: profile.workStyle || 'General Productivity',
          onboardingCompleted: hasCompletedOnboarding,
          isNewUser: !hasCompletedOnboarding,
          provider: provider,
        };

        setUser(updatedUser);
        setLanguageState(userLang);

        if (hasCompletedOnboarding) {
          setIsAuthenticated(true);
          setAuthView((prev) => {
            if (
              prev === 'welcome' ||
              prev === 'authenticating' ||
              prev === 'password' ||
              prev === 'create-account' ||
              prev === 'email-signin'
            ) {
              return 'success';
            }
            return prev;
          });
        } else {
          // Direct new users to onboarding profile setup
          setAuthView('profile-setup');
          setIsAuthenticated(false);
        }
      } else {
        // No user logged in
        setUser(null);
        setIsAuthenticated(false);
        setAuthView((prev) => {
          if (prev === 'success' || prev === 'profile-setup' || prev === 'authenticating') {
            return 'welcome';
          }
          return prev;
        });
      }
      setAuthInitializing(false);
    });

    return () => unsubscribe();
  }, [language]);

  // REAL GOOGLE AUTHENTICATION
  const signInWithGoogle = async () => {
    setLoading(true);
    setOauthLoading('google');
    clearError();

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;
      const profile = await loadUserProfile(firebaseUser.uid);

      const hasCompleted =
        profile.onboardingCompleted === true ||
        (!!profile.displayName && !!profile.country);

      if (hasCompleted) {
        setAuthView('success');
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsAuthenticated(true);
      } else {
        setAuthView('profile-setup');
      }
    } catch (err: unknown) {
      console.warn('Google Sign-In error:', err);
      const friendlyError = getFriendlyAuthErrorMessage(err);
      setAuthErrorInfo(friendlyError);
    } finally {
      setLoading(false);
      setOauthLoading(null);
    }
  };

  // REAL GITHUB AUTHENTICATION
  const signInWithGitHub = async () => {
    setLoading(true);
    setOauthLoading('github');
    clearError();

    try {
      const result = await signInWithPopup(auth, githubProvider);
      const firebaseUser = result.user;
      const profile = await loadUserProfile(firebaseUser.uid);

      const hasCompleted =
        profile.onboardingCompleted === true ||
        (!!profile.displayName && !!profile.country);

      if (hasCompleted) {
        setAuthView('success');
        await new Promise((resolve) => setTimeout(resolve, 500));
        setIsAuthenticated(true);
      } else {
        setAuthView('profile-setup');
      }
    } catch (err: unknown) {
      console.warn('GitHub Sign-In error:', err);
      const friendlyError = getFriendlyAuthErrorMessage(err);
      setAuthErrorInfo(friendlyError);
    } finally {
      setLoading(false);
      setOauthLoading(null);
    }
  };

  // EMAIL STEP 1: VALIDATE EMAIL PRE-CHECK
  const signInWithEmail = async (rawEmail: string) => {
    const emailValidation = validateEmailInput(rawEmail);
    if (!emailValidation.isValid) {
      setAuthErrorInfo({
        code: 'validation/invalid-email',
        message: emailValidation.error || 'Enter a valid email address.',
        targetField: 'email',
      });
      return;
    }

    clearError();
    setPendingEmail(emailValidation.cleanEmail);
    setAuthView('password');
  };

  // SUBMIT PASSWORD (EMAIL SIGN IN)
  const submitPassword = async (password: string) => {
    const passwordValidation = validatePasswordInput(password);
    if (!passwordValidation.isValid) {
      setAuthErrorInfo({
        code: 'validation/empty-password',
        message: passwordValidation.error || 'Enter your password.',
        targetField: 'password',
      });
      return;
    }

    setLoading(true);
    clearError();

    try {
      await signInWithEmailAndPassword(auth, pendingEmail, password);
      // onAuthStateChanged will handle routing to success or profile-setup
    } catch (err: unknown) {
      console.warn('Email Sign-In error:', err);
      const friendlyError = getFriendlyAuthErrorMessage(err);
      setAuthErrorInfo(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  // SIGN UP WITH EMAIL
  const signUpWithEmail = async (rawEmail: string, password: string, fullName?: string) => {
    // 1. Full name validation
    if (fullName !== undefined) {
      const nameValidation = validateNameInput(fullName);
      if (!nameValidation.isValid) {
        setAuthErrorInfo({
          code: 'validation/invalid-name',
          message: nameValidation.error || 'Enter your name.',
          targetField: 'name',
        });
        return;
      }
    }

    // 2. Email validation
    const emailValidation = validateEmailInput(rawEmail);
    if (!emailValidation.isValid) {
      setAuthErrorInfo({
        code: 'validation/invalid-email',
        message: emailValidation.error || 'Enter a valid email address.',
        targetField: 'email',
      });
      return;
    }

    // 3. Password validation
    const passwordEval = evaluatePasswordStrength(password);
    if (!passwordEval.isValid) {
      setAuthErrorInfo({
        code: 'validation/weak-password',
        message: 'Password must be at least 8 characters.',
        targetField: 'password',
      });
      return;
    }

    setLoading(true);
    clearError();
    setPendingEmail(emailValidation.cleanEmail);

    try {
      const credential = await createUserWithEmailAndPassword(
        auth,
        emailValidation.cleanEmail,
        password
      );

      const createdUser = credential.user;

      if (fullName && fullName.trim()) {
        const cleanName = fullName.trim();
        try {
          await updateProfile(createdUser, {
            displayName: cleanName,
          });
          // Cache temporary name for onboarding step 1
          localStorage.setItem('nexorbit_temp_fullname', cleanName);
        } catch (e) {}
      }

      setAuthView('profile-setup');
    } catch (err: unknown) {
      console.warn('Email Sign-Up error:', err);
      const friendlyError = getFriendlyAuthErrorMessage(err);
      setAuthErrorInfo(friendlyError);
      setAuthView('create-account');
    } finally {
      setLoading(false);
    }
  };

  // PASSWORD RESET
  const sendPasswordReset = async (rawEmail: string) => {
    const emailValidation = validateEmailInput(rawEmail);
    if (!emailValidation.isValid) {
      setAuthErrorInfo({
        code: 'validation/invalid-email',
        message: emailValidation.error || 'Enter a valid email address.',
        targetField: 'email',
      });
      return;
    }

    setLoading(true);
    clearError();

    try {
      await sendPasswordResetEmail(auth, emailValidation.cleanEmail);
    } catch (err: unknown) {
      console.warn('Password Reset error:', err);
      const friendlyError = getFriendlyAuthErrorMessage(err);
      setAuthErrorInfo(friendlyError);
    } finally {
      setLoading(false);
    }
  };

  // COMPLETE PROFILE SETUP & FIRST-TIME ONBOARDING
  const completeProfileSetup = async (profileData: {
    displayName: string;
    country: string;
    language: Language;
    timezone?: string;
    workStyle?: string;
  }) => {
    const nameValidation = validateNameInput(profileData.displayName);
    if (!nameValidation.isValid) {
      setAuthErrorInfo({
        code: 'validation/invalid-name',
        message: nameValidation.error || 'Enter your name.',
        targetField: 'name',
      });
      return;
    }

    setLoading(true);
    clearError();

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error('No authenticated user session found.');
      }

      // Update Firebase auth profile
      await updateProfile(firebaseUser, {
        displayName: nameValidation.cleanName,
      });

      const fullProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: nameValidation.cleanName,
        country: profileData.country || 'India 🇮🇳',
        language: profileData.language || 'en',
        timezone: profileData.timezone || 'Asia/Kolkata',
        workStyle: profileData.workStyle || 'General Productivity',
        onboardingCompleted: true,
        updatedAt: new Date().toISOString(),
      };

      // Save to localStorage cache
      localStorage.setItem(`nexorbit_profile_${firebaseUser.uid}`, JSON.stringify(fullProfile));
      localStorage.setItem('nexorbit_lang', profileData.language);
      try {
        localStorage.removeItem('nexorbit_temp_fullname');
      } catch (e) {}

      // Save to Firestore database if accessible
      try {
        if (db) {
          const userRef = doc(db, 'users', firebaseUser.uid);
          await setDoc(userRef, fullProfile, { merge: true });
        }
      } catch (e) {
        console.warn('Firestore user profile sync warning (local cache used):', e);
      }

      // Update local state
      const updatedUser: AuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: nameValidation.cleanName,
        photoURL: firebaseUser.photoURL || undefined,
        plan: 'Free Plan',
        country: fullProfile.country,
        language: fullProfile.language,
        timezone: fullProfile.timezone,
        workStyle: fullProfile.workStyle,
        onboardingCompleted: true,
        isNewUser: false,
        provider: firebaseUser.providerData[0]?.providerId || 'password',
      };

      setUser(updatedUser);
      setLanguageState(profileData.language);

      setAuthView('success');
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsAuthenticated(true);
    } catch (err: unknown) {
      console.warn('Profile Setup caught error:', err);
      const friendlyError = getFriendlyAuthErrorMessage(err);
      setAuthErrorInfo(friendlyError);
      setAuthView('profile-setup');
    } finally {
      setLoading(false);
    }
  };

  // REAL SIGN OUT
  const signOut = async () => {
    setLoading(true);
    clearError();
    try {
      await firebaseSignOut(auth);
    } catch (err: unknown) {
      console.warn('Sign-Out error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setAuthView('welcome');
      setPendingEmail('');
      setLoading(false);
      if (typeof window !== 'undefined') {
        window.location.hash = '';
      }
    }
  };

  // STUB FOR DEMO AUTH TOGGLE
  const toggleDemoAuth = () => {
    console.warn('Real Firebase Authentication is active.');
  };

  // Derived / exposed values
  const uid = user?.uid || null;
  const displayName = user?.displayName || null;
  const email = user?.email || null;
  const photoURL = user?.photoURL || null;
  const provider = user?.provider || null;
  const authLoading = loading || authInitializing;

  return (
    <AuthContext.Provider
      value={{
        user,
        currentUser: user,
        uid,
        displayName,
        email,
        photoURL,
        provider,
        isAuthenticated,
        authInitializing,
        authLoading,
        authView,
        loading,
        oauthLoading,
        error,
        authErrorInfo,
        pendingEmail,
        language,
        setLanguage,
        t,
        setPendingEmail,
        setAuthView,
        setAuthError,
        clearError,
        signInWithGoogle,
        signInWithGitHub,
        signInWithEmail,
        submitPassword,
        signUpWithEmail,
        sendPasswordReset,
        completeProfileSetup,
        signOut,
        toggleDemoAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

