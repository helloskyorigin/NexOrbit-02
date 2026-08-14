import { Language, translations } from './translations';

export type AuthView =
  | 'welcome'
  | 'create-account'
  | 'email-signin'
  | 'password'
  | 'forgot-password'
  | 'authenticating'
  | 'error'
  | 'profile-setup'
  | 'success';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  plan: string;
  role?: string;
  country?: string;
  language?: Language;
  timezone?: string;
  isNewUser?: boolean;
  provider?: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  currentUser: AuthUser | null;
  uid: string | null;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  provider: string | null;
  isAuthenticated: boolean;
  authInitializing: boolean;
  authLoading: boolean;
  authView: AuthView;
  loading: boolean;
  error: string | null;
  pendingEmail: string;
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations['en']) => string;
  setPendingEmail: (email: string) => void;
  setAuthView: (view: AuthView) => void;
  clearError: () => void;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInWithEmail: (email: string) => Promise<void>;
  submitPassword: (password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  completeProfileSetup: (profileData: { displayName: string; country: string; language: Language }) => Promise<void>;
  signOut: () => void;
  toggleDemoAuth: () => void;
}
