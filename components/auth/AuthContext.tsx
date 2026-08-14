'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setAuthInitializing(false);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // MOCK GOOGLE SIGN IN
  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    setAuthView('authenticating');

    await new Promise((resolve) => setTimeout(resolve, 800));

    const googleUser: AuthUser = {
      uid: 'nxo_google_' + Math.random().toString(36).substring(2, 8),
      displayName: 'Satyam Kumar',
      email: 'satyambihar422@gmail.com',
      photoURL: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      plan: 'Free Plan',
      country: 'India',
      language: language,
      isNewUser: false,
    };

    setUser(googleUser);
    try {
      localStorage.setItem('nexorbit_auth_session', JSON.stringify(googleUser));
    } catch (e) {}
    setAuthView('success');
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsAuthenticated(true);
    setLoading(false);
  };

  // MOCK GITHUB SIGN IN
  const signInWithGitHub = async () => {
    setLoading(true);
    setError(null);
    setAuthView('authenticating');

    await new Promise((resolve) => setTimeout(resolve, 800));

    const githubUser: AuthUser = {
      uid: 'nxo_gh_' + Math.random().toString(36).substring(2, 8),
      displayName: 'Satyam',
      email: 'satyam@github.com',
      plan: 'Free Plan',
      country: 'India',
      language: language,
      isNewUser: false,
    };

    setUser(githubUser);
    try {
      localStorage.setItem('nexorbit_auth_session', JSON.stringify(githubUser));
    } catch (e) {}
    setAuthView('success');
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsAuthenticated(true);
    setLoading(false);
  };

  // MOCK EMAIL STEP 1
  const signInWithEmail = async (email: string) => {
    if (!email || !email.includes('@')) {
      setError(t('invalidEmailError'));
      return;
    }
    setError(null);
    setPendingEmail(email);
    setAuthView('password');
  };

  // MOCK PASSWORD SUBMIT
  const submitPassword = async (password: string) => {
    if (!password || password.length < 6) {
      setError(t('passwordMinError'));
      return;
    }

    setLoading(true);
    setError(null);
    setAuthView('authenticating');

    await new Promise((resolve) => setTimeout(resolve, 800));

    if (password === 'wrongpassword') {
      setError(t('incorrectPasswordError'));
      setAuthView('error');
      setLoading(false);
      return;
    }

    const emailUser: AuthUser = {
      uid: 'nxo_email_' + Math.random().toString(36).substring(2, 8),
      displayName: pendingEmail.split('@')[0],
      email: pendingEmail,
      plan: 'Free Plan',
      language: language,
      isNewUser: false,
    };

    setUser(emailUser);
    try {
      localStorage.setItem('nexorbit_auth_session', JSON.stringify(emailUser));
    } catch (e) {}
    setAuthView('success');
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsAuthenticated(true);
    setLoading(false);
  };

  // MOCK SIGN UP WITH EMAIL
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

    await new Promise((resolve) => setTimeout(resolve, 800));

    const newUser: AuthUser = {
      uid: 'nxo_new_' + Math.random().toString(36).substring(2, 8),
      displayName: '',
      email: email,
      plan: 'Free Plan',
      language: language,
      isNewUser: true,
    };

    setUser(newUser);
    setAuthView('profile-setup');
    setLoading(false);
  };

  // MOCK PASSWORD RESET
  const sendPasswordReset = async (email: string) => {
    if (!email || !email.includes('@')) {
      setError(t('invalidEmailError'));
      return;
    }
    setLoading(true);
    setError(null);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setLoading(false);
  };

  // MOCK PROFILE SETUP COMPLETION
  const completeProfileSetup = async (profileData: { displayName: string; country: string; language: Language }) => {
    setLoading(true);
    setError(null);
    setAuthView('authenticating');

    await new Promise((resolve) => setTimeout(resolve, 600));

    if (user) {
      const updatedUser: AuthUser = {
        ...user,
        displayName: profileData.displayName || user.displayName || 'User',
        country: profileData.country || 'United States',
        language: profileData.language || language,
        isNewUser: false,
      };
      setUser(updatedUser);
      setLanguageState(profileData.language || language);
      try {
        localStorage.setItem('nexorbit_auth_session', JSON.stringify(updatedUser));
        localStorage.setItem('nexorbit_lang', profileData.language || language);
      } catch (e) {}
    }

    setAuthView('success');
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsAuthenticated(true);
    setLoading(false);
  };

  // MOCK SIGN OUT
  const signOut = () => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nexorbit_auth_session');
      }
    } catch (e) {}
    setIsAuthenticated(false);
    setUser(null);
    setAuthView('welcome');
    setError(null);
    setPendingEmail('');
  };

  // TOGGLE DEMO AUTH
  const toggleDemoAuth = () => {
    if (isAuthenticated) {
      signOut();
    } else {
      const demoUser: AuthUser = {
        uid: 'nxo_demo_user',
        displayName: 'Satyam',
        email: 'satyam@nexorbit.ai',
        plan: 'Free Plan',
        country: 'India',
        language: language,
        isNewUser: false,
      };
      setUser(demoUser);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('nexorbit_auth_session', JSON.stringify(demoUser));
        }
      } catch (e) {}
      setIsAuthenticated(true);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        authInitializing,
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
