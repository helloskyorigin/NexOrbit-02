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
  Globe,
  Languages,
} from 'lucide-react';
import { useAuth } from '../AuthContext';
import { AuthErrorBanner } from '../AuthErrorBanner';
import { Language, SUPPORTED_LANGUAGES } from '../translations';
import { COUNTRIES, Country, getSensibleDetectedTimezone } from '../countries';
import { validateNameInput } from '../authErrors';
import { cn } from '../../../lib/utils';

export const ProfileSetupView: React.FC = () => {
  const { user, completeProfileSetup, loading, authErrorInfo, clearError } = useAuth();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

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
  const [selectedTimezone, setSelectedTimezone] = useState<string>(() => getSensibleDetectedTimezone().timezone);

  // Country dropdown state
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

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

  const handleStep3Submit = (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setStep(4);
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
    });
  };

  return (
    <div className="space-y-6 text-left animate-in fade-in zoom-in-95 duration-200">
      {/* Step Indicator Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
          <span>
            {step === 1 && 'Step 1 of 4: Your Name'}
            {step === 2 && 'Step 2 of 4: Country / Region'}
            {step === 3 && 'Step 3 of 4: Language'}
            {step === 4 && 'Step 4 of 4: Timezone'}
          </span>
          <span className="text-[11px] font-medium text-slate-500">
            {step === 1 && '25%'}
            {step === 2 && '50%'}
            {step === 3 && '75%'}
            {step === 4 && '100%'}
          </span>
        </div>
        {/* Multi-segment Progress Bar */}
        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
          <div className={cn('h-full rounded-full transition-all duration-300', step >= 1 ? 'bg-slate-950' : 'bg-slate-200')} />
          <div className={cn('h-full rounded-full transition-all duration-300', step >= 2 ? 'bg-slate-950' : 'bg-slate-200')} />
          <div className={cn('h-full rounded-full transition-all duration-300', step >= 3 ? 'bg-slate-950' : 'bg-slate-200')} />
          <div className={cn('h-full rounded-full transition-all duration-300', step >= 4 ? 'bg-slate-950' : 'bg-slate-200')} />
        </div>
      </div>

      {authErrorInfo && (
        <AuthErrorBanner error={authErrorInfo} onDismiss={clearError} />
      )}

      {/* ================= STEP 1: NAME ================= */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-4 animate-in fade-in duration-150" noValidate>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              What&apos;s your name?
            </h1>
            <p className="text-sm text-slate-500 font-normal leading-relaxed">
              We&apos;ll use this name across your workspace profile.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-700 block">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                ref={nameInputRef}
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  if (nameError) setNameError(null);
                }}
                placeholder="e.g. Alex Morgan"
                className={cn(
                  'w-full h-11 pl-10 pr-3.5 text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border focus:outline-none transition-all duration-150',
                  nameError
                    ? 'border-red-300 focus:border-red-500 focus:ring-2 focus:ring-red-500/10'
                    : 'border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10'
                )}
                autoFocus
              />
            </div>
            {nameError && (
              <p className="text-xs text-red-600 font-medium animate-in fade-in-50">
                {nameError}
              </p>
            )}
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full h-11 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-white font-medium text-sm shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group"
            >
              <span>Continue</span>
              <ArrowRight className="h-4 w-4 opacity-80 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </form>
      )}

      {/* ================= STEP 2: COUNTRY / REGION ================= */}
      {step === 2 && (
        <form onSubmit={handleStep2Submit} className="space-y-4 animate-in fade-in duration-150" noValidate>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Where are you based?
            </h1>
            <p className="text-sm text-slate-500 font-normal leading-relaxed">
              Select your country or region for localized settings.
            </p>
          </div>

          <div className="space-y-1.5" ref={dropdownRef}>
            <label className="text-xs font-medium text-slate-700 block">
              Country / Region
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setIsCountryOpen(!isCountryOpen);
                  setSearchQuery('');
                }}
                className="w-full h-11 px-3.5 text-sm bg-white hover:bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 focus:outline-none text-left flex items-center justify-between transition-all duration-150 cursor-pointer"
              >
                {selectedCountry ? (
                  <span className="flex items-center gap-2.5">
                    <span className="text-lg leading-none select-none">{selectedCountry.flag}</span>
                    <span className="font-medium text-slate-900 text-sm">{selectedCountry.name}</span>
                  </span>
                ) : (
                  <span className="text-slate-400 text-xs">Select country</span>
                )}
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </button>

              {isCountryOpen && (
                <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
                  <div className="relative border-b border-slate-100 p-2">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search countries..."
                      className="w-full h-8 pl-9 pr-3 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 rounded-lg border-none focus:ring-1 focus:ring-slate-950 focus:outline-none"
                      autoFocus
                    />
                  </div>
                  <div className="max-h-52 overflow-y-auto py-1">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country) => (
                        <button
                          key={country.code}
                          type="button"
                          onClick={() => handleCountrySelect(country)}
                          className={cn(
                            'w-full px-3.5 py-2 text-xs text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer',
                            selectedCountry?.code === country.code
                              ? 'bg-slate-50 text-slate-950 font-semibold'
                              : 'text-slate-700'
                          )}
                        >
                          <span className="flex items-center gap-2.5">
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

          <div className="flex items-center gap-2 pt-2">
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

      {/* ================= STEP 3: PREFERRED LANGUAGE ================= */}
      {step === 3 && (
        <form onSubmit={handleStep3Submit} className="space-y-4 animate-in fade-in duration-150" noValidate>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Preferred Language
            </h1>
            <p className="text-sm text-slate-500 font-normal leading-relaxed">
              Choose your primary language for the application interface.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto pr-1">
            {SUPPORTED_LANGUAGES.map((lang) => {
              const isSelected = selectedLanguage === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => setSelectedLanguage(lang.code)}
                  className={cn(
                    'p-3 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer',
                    isSelected
                      ? 'border-slate-950 bg-slate-950 text-white shadow-xs font-medium'
                      : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50 text-xs'
                  )}
                >
                  <span className="flex items-center gap-2 truncate">
                    <Languages className="h-4 w-4 opacity-70 shrink-0" />
                    <span className="truncate text-xs font-medium">{lang.nativeName}</span>
                  </span>
                  {isSelected && <Check className="h-3.5 w-3.5 shrink-0" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
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

      {/* ================= STEP 4: TIMEZONE ================= */}
      {step === 4 && (
        <form onSubmit={handleFinalSubmit} className="space-y-4 animate-in fade-in duration-150" noValidate>
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-slate-950">
              Confirm your timezone
            </h1>
            <p className="text-sm text-slate-500 font-normal leading-relaxed">
              We auto-detected your local timezone. You can adjust it if needed.
            </p>
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-700 block">
                Timezone
              </label>
              <span className="text-[10px] font-medium text-indigo-600 bg-indigo-50 px-1.5 py-0.5 rounded">
                Auto-detected
              </span>
            </div>
            <div className="relative">
              <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                placeholder="e.g. America/New_York or Asia/Kolkata"
                className="w-full h-11 pl-10 pr-3.5 text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 focus:outline-none transition-all duration-150"
              />
            </div>
          </div>

          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-1">
            <div className="text-xs font-semibold text-slate-900 flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-slate-500" />
              <span>Summary</span>
            </div>
            <div className="text-xs text-slate-600 space-y-0.5 pl-5">
              <p><span className="font-medium text-slate-900">Name:</span> {displayName}</p>
              <p><span className="font-medium text-slate-900">Country:</span> {selectedCountry?.name} {selectedCountry?.flag}</p>
              <p><span className="font-medium text-slate-900">Language:</span> {SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.nativeName || selectedLanguage}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <button
              type="button"
              disabled={loading}
              onClick={() => setStep(3)}
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
                  <span>Setting up profile...</span>
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
