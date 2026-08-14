'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, githubProvider } from '../../lib/firebase';
import { AuthContextType, AuthUser, AuthView } from './types';
import { Language, translations } from './translations';

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
        if (savedLang === 'en' || savedLang === 'hi') {
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
  const [error, setError] = useState<string | null>(null);
  const [pendingEmail, setPendingEmail] = useState<string>('');

  const clearError = () => setError(null);

  // Translation helper function
  const t = (key: keyof typeof translations['en']): string => {
    return translations[language][key] || translations['en'][key] || key;
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('nexorbit_lang', lang);
      }
    } catch (e) {}
  };

  // Listen to Firebase Auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Retrieve custom user profile metadata from local storage
        let savedProfile: { displayName?: string; country?: string; language?: Language } = {};
        try {
          const stored = localStorage.getItem(`nexorbit_profile_${firebaseUser.uid}`);
          if (stored) {
            savedProfile = JSON.parse(stored);
          }
        } catch (e) {
          console.error('Failed to parse local storage profile:', e);
        }

        const provider = firebaseUser.providerData[0]?.providerId || 'password';
        const displayName = savedProfile.displayName || firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User';
        const userLang = savedProfile.language || language || 'en';

        const updatedUser: AuthUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: displayName,
          photoURL: firebaseUser.photoURL || undefined,
          plan: 'Free Plan',
          country: savedProfile.country || 'India 🇮🇳',
          language: userLang,
          isNewUser: false,
          provider: provider,
        };

        setUser(updatedUser);
        setLanguageState(userLang);

        // Check if the user has completed profile setup (needs at least a name saved)
        const hasCompletedProfile = !!savedProfile.displayName || !!firebaseUser.displayName;

        if (hasCompletedProfile) {
          setIsAuthenticated(true);
          setAuthView((prev) => {
            if (prev === 'welcome' || prev === 'authenticating' || prev === 'password' || prev === 'create-account') {
              return 'success';
            }
            return prev;
          });
        } else {
          // If profile setup has not been completed, direct them to profile setup page
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
    setError(null);
    setAuthView('authenticating');

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseUser = result.user;

      let savedProfile: { displayName?: string; country?: string; language?: Language } = {};
      try {
        const stored = localStorage.getItem(`nexorbit_profile_${firebaseUser.uid}`);
        if (stored) {
          savedProfile = JSON.parse(stored);
        }
      } catch (e) {}

      const hasCompletedProfile = !!savedProfile.displayName || !!firebaseUser.displayName;

      if (hasCompletedProfile) {
        if (!savedProfile.displayName) {
          const profile = {
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            country: 'India 🇮🇳',
            language: language,
          };
          localStorage.setItem(`nexorbit_profile_${firebaseUser.uid}`, JSON.stringify(profile));
        }

        setAuthView('success');
        await new Promise((resolve) => setTimeout(resolve, 600));
        setIsAuthenticated(true);
      } else {
        setAuthView('profile-setup');
      }
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      let userFriendlyError = 'An error occurred during Google Sign-In. Please try again.';

      if (err.code === 'auth/popup-closed-by-user') {
        userFriendlyError = 'The sign-in popup was closed before completing authentication.';
      } else if (err.code === 'auth/popup-blocked') {
        userFriendlyError = 'The sign-in popup was blocked by your browser. Please allow popups for this site.';
      } else if (err.code === 'auth/network-request-failed') {
        userFriendlyError = 'A network error occurred. Please check your internet connection.';
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        userFriendlyError = 'An account already exists with the same email address but a different sign-in method. Please sign in using that method.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        userFriendlyError = 'The sign-in request was cancelled.';
      }

      setError(userFriendlyError);
      setAuthView('welcome');
    } finally {
      setLoading(false);
    }
  };

  // REAL GITHUB AUTHENTICATION
  const signInWithGitHub = async () => {
    setLoading(true);
    setError(null);
    setAuthView('authenticating');

    try {
      const result = await signInWithPopup(auth, githubProvider);
      const firebaseUser = result.user;

      let savedProfile: { displayName?: string; country?: string; language?: Language } = {};
      try {
        const stored = localStorage.getItem(`nexorbit_profile_${firebaseUser.uid}`);
        if (stored) {
          savedProfile = JSON.parse(stored);
        }
      } catch (e) {}

      const hasCompletedProfile = !!savedProfile.displayName || !!firebaseUser.displayName;

      if (hasCompletedProfile) {
        if (!savedProfile.displayName) {
          const profile = {
            displayName: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            country: 'India 🇮🇳',
            language: language,
          };
          localStorage.setItem(`nexorbit_profile_${firebaseUser.uid}`, JSON.stringify(profile));
        }

        setAuthView('success');
        await new Promise((resolve) => setTimeout(resolve, 600));
        setIsAuthenticated(true);
      } else {
        setAuthView('profile-setup');
      }
    } catch (err: any) {
      console.error('GitHub Sign-In failed:', err);
      let userFriendlyError = 'An error occurred during GitHub Sign-In. Please try again.';

      if (err.code === 'auth/popup-closed-by-user') {
        userFriendlyError = 'The sign-in popup was closed before completing authentication.';
      } else if (err.code === 'auth/popup-blocked') {
        userFriendlyError = 'The sign-in popup was blocked by your browser. Please allow popups for this site.';
      } else if (err.code === 'auth/network-request-failed') {
        userFriendlyError = 'A network error occurred. Please check your internet connection.';
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        userFriendlyError = 'An account already exists with the same email address but a different sign-in method. Please sign in using that method.';
      } else if (err.code === 'auth/cancelled-popup-request') {
        userFriendlyError = 'The sign-in request was cancelled.';
      }

      setError(userFriendlyError);
      setAuthView('welcome');
    } finally {
      setLoading(false);
    }
  };

  // EMAIL STEP 1: VERIFY EMAIL PRE-CHECK
  const signInWithEmail = async (email: string) => {
    if (!email || !email.includes('@')) {
      setError(t('invalidEmailError'));
      return;
    }
    setError(null);
    setPendingEmail(email);
    setAuthView('password');
  };

  // SUBMIT PASSWORD (EMAIL SIGN IN)
  const submitPassword = async (password: string) => {
    if (!password || password.length < 6) {
      setError(t('passwordMinError'));
      return;
    }

    setLoading(true);
    setError(null);
    setAuthView('authenticating');

    try {
      await signInWithEmailAndPassword(auth, pendingEmail, password);
    } catch (err: any) {
      console.error('Email Sign-In failed:', err);
      let userFriendlyError = 'Incorrect password or account not found. Please try again.';

      if (err.code === 'auth/invalid-email') {
        userFriendlyError = 'Please enter a valid email address.';
      } else if (err.code === 'auth/user-not-found') {
        userFriendlyError = 'No account found with this email. Please sign up instead.';
      } else if (err.code === 'auth/wrong-password') {
        userFriendlyError = 'Incorrect password. Please try again.';
      } else if (err.code === 'auth/too-many-requests') {
        userFriendlyError = 'Too many failed login attempts. Please try again later.';
      } else if (err.code === 'auth/invalid-credential') {
        userFriendlyError = 'Invalid email or password. Please try again.';
      }

      setError(userFriendlyError);
      setAuthView('error');
    } finally {
      setLoading(false);
    }
  };

  // SIGN UP WITH EMAIL
  const signUpWithEmail = async (email: string, password: string) => {
    if (!email || !email.includes('@')) {
      setError(t('invalidEmailError'));
      return;
    }
    if (!password || password.length < 6) {
      setError(t('passwordMinError'));
      return;
    }

    setLoading(true);
    setError(null);
    setPendingEmail(email);
    setAuthView('authenticating');

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      setAuthView('profile-setup');
    } catch (err: any) {
      console.error('Email Sign-Up failed:', err);
      let userFriendlyError = 'Failed to create account. Please try again.';

      if (err.code === 'auth/email-already-in-use') {
        userFriendlyError = 'An account already exists with this email address.';
      } else if (err.code === 'auth/invalid-email') {
        userFriendlyError = 'Please enter a valid email address.';
      } else if (err.code === 'auth/weak-password') {
        userFriendlyError = 'The password is too weak. Please use at least 6 characters.';
      } else if (err.code === 'auth/network-request-failed') {
        userFriendlyError = 'A network error occurred. Please check your internet connection.';
      }

      setError(userFriendlyError);
      setAuthView('error');
    } finally {
      setLoading(false);
    }
  };

  // PASSWORD RESET
  const sendPasswordReset = async (email: string) => {
    if (!email || !email.includes('@')) {
      setError(t('invalidEmailError'));
      return;
    }
    setLoading(true);
    setError(null);

    try {
      await sendPasswordResetEmail(auth, email);
    } catch (err: any) {
      console.error('Password Reset failed:', err);
      let userFriendlyError = 'Failed to send password reset link. Please try again.';

      if (err.code === 'auth/invalid-email') {
        userFriendlyError = 'Please enter a valid email address.';
      } else if (err.code === 'auth/user-not-found') {
        userFriendlyError = 'No account found with this email address.';
      }

      setError(userFriendlyError);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // PROFILE SETUP COMPLETION
  const completeProfileSetup = async (profileData: { displayName: string; country: string; language: Language }) => {
    setLoading(true);
    setError(null);
    setAuthView('authenticating');

    try {
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        throw new Error('No authenticated user found.');
      }

      // Update Firebase auth profile
      await updateProfile(firebaseUser, {
        displayName: profileData.displayName,
      });

      // Save to localStorage for persistence
      const profile = {
        displayName: profileData.displayName,
        country: profileData.country,
        language: profileData.language,
      };

      localStorage.setItem(`nexorbit_profile_${firebaseUser.uid}`, JSON.stringify(profile));
      localStorage.setItem('nexorbit_lang', profileData.language);

      // Update local state
      const updatedUser: AuthUser = {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: profileData.displayName,
        photoURL: firebaseUser.photoURL || undefined,
        plan: 'Free Plan',
        country: profileData.country,
        language: profileData.language,
        isNewUser: false,
        provider: firebaseUser.providerData[0]?.providerId || 'password',
      };

      setUser(updatedUser);
      setLanguageState(profileData.language);

      setAuthView('success');
      await new Promise((resolve) => setTimeout(resolve, 600));
      setIsAuthenticated(true);
    } catch (err: any) {
      console.error('Profile Setup failed:', err);
      setError(err.message || 'Failed to complete profile setup. Please try again.');
      setAuthView('profile-setup');
    } finally {
      setLoading(false);
    }
  };

  // REAL SIGN OUT
  const signOut = async () => {
    setLoading(true);
    setError(null);
    try {
      await firebaseSignOut(auth);
      setUser(null);
      setIsAuthenticated(false);
      setAuthView('welcome');
      setPendingEmail('');
    } catch (err: any) {
      console.error('Sign-Out failed:', err);
    } finally {
      setLoading(false);
    }
  };

  // STUB FOR DEMO AUTH TOGGLE
  const toggleDemoAuth = () => {
    console.warn('Real Firebase Authentication is active in Phase 2B.');
  };

  // Derived / expose values
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
        error,
        pendingEmail,
        language,
        setLanguage,
        t,
        setPendingEmail,
        setAuthView,
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
