'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  User,
  ArrowRight,
  ArrowLeft,
  Search,
  Check,
  ChevronDown,
  Clock,
  Loader2,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { AuthErrorBanner } from '../AuthErrorBanner';
import { Language, SUPPORTED_LANGUAGES } from '../translations';
import { COUNTRIES, Country, getSensibleDetectedTimezone } from '../countries';
import { validateNameInput } from '../authErrors';
import { cn } from '../../../lib/utils';

const WORK_STYLES = [
  { id: 'Engineering & Code', label: 'Engineering & Code', icon: '💻' },
  { id: 'AI & Data Science', label: 'AI & Data Science', icon: '🧠' },
  { id: 'Product & Management', label: 'Product & Management', icon: '🚀' },
  { id: 'Design & Creative', label: 'Design & Creative', icon: '🎨' },
  { id: 'Writing & Research', label: 'Writing & Research', icon: '📚' },
  { id: 'General Productivity', label: 'General Productivity', icon: '⚡' },
];

export const ProfileSetupView: React.FC = () => {
  const { user, completeProfileSetup, loading, authErrorInfo, clearError } = useAuth();

  // Multi-step onboarding state: 1 = Name, 2 = Language, 3 = Country/Timezone & Workstyle
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form states with lazy initializers
  const [displayName, setDisplayName] = useState(() => {
    if (user?.displayName && user.displayName !== 'User') {
      return user.displayName;
    }
    if (typeof window !== 'undefined') {
      try {
        const tempName = localStorage.getItem('nexorbit_temp_fullname');
        if (tempName) return tempName;
      } catch (e) {}
    }
    if (user?.email) {
      const emailPrefix = user.email.split('@')[0];
      return emailPrefix
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
    return '';
  });

  const [nameError, setNameError] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(() => user?.language || 'en');
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    () => COUNTRIES.find((c) => c.code === 'IN') || COUNTRIES[0]
  );
  const [selectedTimezone, setSelectedTimezone] = useState<string>(() => getSensibleDetectedTimezone());
  const [selectedWorkStyle, setSelectedWorkStyle] = useState<string>('General Productivity');

  // Country dropdown state
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  // Click outside listener for country picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return COUNTRIES;
    const q = searchQuery.toLowerCase().trim();
    return COUNTRIES.filter(
      (country) =>
        country.name.toLowerCase().includes(q) ||
        country.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleCountrySelect = (country: Country) => {
    setSelectedCountry(country);
    if (country.timezone) {
      setSelectedTimezone(country.timezone);
    }
    setIsCountryOpen(false);
    setSearchQuery('');
  };

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setNameError(null);

    const validation = validateNameInput(displayName);
    if (!validation.isValid) {
      setNameError(validation.error || 'Enter your name.');
      nameInputRef.current?.focus();
      return;
    }

    clearError();
    setStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setStep(3);
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    const validation = validateNameInput(displayName);
    if (!validation.isValid) {
      setStep(1);
      setNameError(validation.error || 'Enter your name.');
      return;
    }

    clearError();
    completeProfileSetup({
      displayName: validation.cleanName,
      country: selectedCountry ? `${selectedCountry.name} ${selectedCountry.flag}` : 'India 🇮🇳',
      language: selectedLanguage,
      timezone: selectedTimezone,
      workStyle: selectedWorkStyle,
    });
  };

  return (
    <div className="space-y-5 text-left animate-in fade-in zoom-in-95 duration-200">
      {/* Step Indicator Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>
            {step === 1 && 'Step 1 of 3: Your Name'}
            {step === 2 && 'Step 2 of 3: Language'}
            {step === 3 && 'Step 3 of 3: Preferences'}
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {step === 1 && '33%'}
            {step === 2 && '66%'}
            {step === 3 && '100%'}
          </span>
        </div>

        {/* Multi-segment Progress Bar */}
        <div className="grid grid-cols-3 gap-1.5 h-1.5 w-full">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              step >= 1 ? 'bg-slate-950' : 'bg-slate-200'
            )}
          />
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              step >= 2 ? 'bg-slate-950' : 'bg-slate-200'
            )}
          />
          <div
            className={cn(
              'h-full rounded-full transition-all duration-300',
              step >= 3 ? 'bg-slate-950' : 'bg-slate-200'
            )}
          />
        </div>
      </div>

      {authErrorInfo && (
        <AuthErrorBanner
          error={authErrorInfo}
          onDismiss={clearError}
        />
      )}

      {/* ================= STEP 1: NAME ================= */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-5 animate-in fade-in duration-150" noValidate>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              What&apos;s your name?
            </h1>
            <p className="text-sm text-slate-500 font-normal leading-relaxed">
              We&apos;ll use this to personalize your intelligent workspace.
            </p>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="displayname-input" className="text-xs font-medium text-slate-700 block">
              Full name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="h-4 w-4" />
              </div>
              <input
                ref={nameInputRef}
                id="displayname-input"
                name="name"
                type="text"
                autoComplete="name"
                value={displayName}
                disabled={loading}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (nameError) setNameError(null);
                  if (authErrorInfo) clearError();
                }}
                placeholder="e.g. Satyam Sharma"
                required
                autoFocus
                className={`w-full h-11 pl-10 pr-3.5 text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border transition-all duration-150 disabled:opacity-60 disabled:bg-slate-50 focus:outline-none ${
                  nameError
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15'
                    : 'border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10'
                }`}
              />
            </div>
            {nameError && (
              <p className="text-xs text-rose-600 font-medium pt-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                {nameError}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-11 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group"
          >
            <span>Continue</span>
            <ArrowRight className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </form>
      )}

      {/* ================= STEP 2: LANGUAGE ================= */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="space-y-5 animate-in fade-in duration-150" noValidate>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Select your language
            </h1>
            <p className="text-sm text-slate-500 font-normal leading-relaxed">
              Choose your preferred interface language. You can change this anytime.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1 py-0.5">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={cn(
                    'p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer',
                    isSelected
                      ? 'border-slate-950 bg-slate-950 text-white shadow-xs'
                      : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50/80'
                  )}
                >
                  <div className="truncate">
                    <div className="text-xs font-semibold truncate leading-tight">
                      {lang.nativeName}
                    </div>
                    <div
                      className={cn(
                        'text-[11px] truncate leading-tight mt-0.5',
                        isSelected ? 'text-slate-300' : 'text-slate-400'
                      )}
                    >
                      {lang.englishName}
                    </div>
                  </div>
                  {isSelected && <Check className="h-3.5 w-3.5 text-white shrink-0 ml-1.5" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              className="flex-1 h-11 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-white font-medium text-sm shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </form>
      )}

      {/* ================= STEP 3: PREFERENCES & LOCATION ================= */}
      {step === 3 && (
        <form onSubmit={handleFinalSubmit} className="space-y-4 animate-in fade-in duration-150" noValidate>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Where are you based?
            </h1>
            <p className="text-sm text-slate-500 font-normal leading-relaxed">
              Configure your regional settings and workspace focus.
            </p>
          </div>

          {/* Country / Region Picker */}
          <div className="space-y-1" ref={dropdownRef}>
            <label className="text-xs font-medium text-slate-700 block">
              Country / Region
            </label>
            <div className="relative">
              <button
                ref={triggerRef}
                type="button"
                disabled={loading}
                onClick={() => {
                  setIsCountryOpen(!isCountryOpen);
                  setSearchQuery('');
                }}
                className="w-full h-10 px-3.5 text-sm bg-white hover:bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 focus:outline-none text-left flex items-center justify-between transition-all duration-150 cursor-pointer disabled:opacity-60"
              >
                {selectedCountry ? (
                  <span className="flex items-center gap-2">
                    <span className="text-base leading-none select-none">{selectedCountry.flag}</span>
                    <span className="font-medium text-slate-900 text-xs sm:text-sm">{selectedCountry.name}</span>
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs">Select country</span>
                )}
                <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
              </button>

              {isCountryOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
                  <div className="relative border-b border-slate-100 p-2">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search countries..."
                      className="w-full h-8 pl-8 pr-3 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 rounded-lg border-none focus:ring-1 focus:ring-slate-950 focus:outline-none"
                      autoFocus
                    />
                  </div>

                  <div className="max-h-44 overflow-y-auto py-1">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className={cn(
                            'w-full px-3 py-2 text-xs text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer',
                            selectedCountry?.code === country.code
                              ? 'bg-slate-50 text-slate-950 font-semibold'
                              : 'text-slate-700'
                          )}
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-base leading-none select-none">{country.flag}</span>
                            <span>{country.name}</span>
                          </span>
                          {selectedCountry?.code === country.code && (
                            <Check className="h-3.5 w-3.5 text-slate-950 shrink-0" />
                          )}
                        </button>
                      ))
                    ) : (
                      <div className="px-3 py-4 text-xs text-center text-slate-400 font-medium">
                        No country found
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Timezone (Detected) */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700 block">
                Timezone
              </label>
              <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                Auto-detected
              </span>
            </div>
            <div className="h-10 px-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center gap-2 text-xs text-slate-700">
              <Clock className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="truncate font-medium">{selectedTimezone}</span>
            </div>
          </div>

          {/* Work Style Focus */}
          <div className="space-y-1.5 pt-1">
            <label className="text-xs font-medium text-slate-700 block">
              Primary focus (optional)
            </label>
            <div className="grid grid-cols-2 gap-1.5">
              {WORK_STYLES.map((ws) => {
                const isSelected = selectedWorkStyle === ws.id;
                return (
                  <button
                    key={ws.id}
                    type="button"
                    onClick={() => setSelectedWorkStyle(ws.id)}
                    className={cn(
                      'p-2 rounded-xl border text-left flex items-center gap-2 transition-all cursor-pointer',
                      isSelected
                        ? 'border-slate-950 bg-slate-950 text-white shadow-2xs font-medium'
                        : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs'
                    )}
                  >
                    <span className="text-sm select-none">{ws.icon}</span>
                    <span className="text-[11px] truncate leading-tight">{ws.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => setStep(2)}
              className="h-11 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium text-sm transition-colors cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-50"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back</span>
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 h-11 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium text-sm shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-slate-300" />
                  <span>Preparing workspace...</span>
                </>
              ) : (
                <>
                  <span>Complete setup</span>
                  <ArrowRight className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
