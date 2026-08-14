'use client';

import React, { useState, useRef, useEffect } from 'react';
import { User, Search, ChevronDown, ArrowRight, Sparkles, Check } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { COUNTRIES, Country } from '../countries';
import { Language } from '../translations';
import { cn } from '../../../lib/utils';

export const ProfileSetupView: React.FC = () => {
  const { user, completeProfileSetup, error, clearError, t, language, setLanguage } = useAuth();
  const [displayName, setDisplayName] = useState(user?.displayName || '');
  
  // Country search and dropdown state
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    COUNTRIES.find(c => c.name === 'India' || c.code === 'IN') || null
  );
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Filter countries by search query
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle outside click to close country dropdown
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard navigation inside searchable dropdown
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isCountryOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsCountryOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        setFocusedIndex(prev => (prev < filteredCountries.length - 1 ? prev + 1 : 0));
        e.preventDefault();
        break;
      case 'ArrowUp':
        setFocusedIndex(prev => (prev > 0 ? prev - 1 : filteredCountries.length - 1));
        e.preventDefault();
        break;
      case 'Enter':
        if (focusedIndex >= 0 && focusedIndex < filteredCountries.length) {
          setSelectedCountry(filteredCountries[focusedIndex]);
          setIsCountryOpen(false);
        }
        e.preventDefault();
        break;
      case 'Escape':
        setIsCountryOpen(false);
        triggerRef.current?.focus();
        e.preventDefault();
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim()) {
      completeProfileSetup({
        displayName: displayName.trim(),
        country: selectedCountry ? `${selectedCountry.name} ${selectedCountry.flag}` : 'India 🇮🇳',
        language: language,
      });
    }
  };

  return (
    <div className="space-y-4 text-left">
      {/* Onboarding Header */}
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-md">
          {t('progressIndicator')}
        </span>
        <div className="h-1.5 w-16 bg-indigo-100 rounded-full overflow-hidden">
          <div className="h-full w-full bg-indigo-600 rounded-full" />
        </div>
      </div>

      <div className="space-y-1.5 text-center">
        <div className="inline-flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shadow-2xs mb-1">
          <Sparkles className="h-5 w-5 text-indigo-600" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-slate-900 font-sans">
          {t('profileSetupTitle')}
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-xs mx-auto">
          {t('profileSetupSubtitle')}
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200/80 text-rose-700 text-xs font-medium flex items-center justify-between">
          <span>{error}</span>
          <button onClick={clearError} className="text-rose-500 hover:text-rose-700 font-bold ml-2 cursor-pointer">
            ×
          </button>
        </div>
      )}

      {/* Setup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {t('nameLabel')}
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder={t('namePlaceholder')}
              required
              className="w-full h-10 pl-9 pr-3.5 text-xs sm:text-sm bg-slate-50/50 hover:bg-slate-50 focus:bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none transition-all duration-150"
            />
          </div>
        </div>

        {/* Searchable Country Dropdown */}
        <div className="space-y-1" ref={dropdownRef}>
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {t('countryLabel')}
          </label>
          <div className="relative">
            <button
              ref={triggerRef}
              type="button"
              onClick={() => {
                setIsCountryOpen(!isCountryOpen);
                setSearchQuery('');
                setFocusedIndex(-1);
              }}
              onKeyDown={handleKeyDown}
              className="w-full h-10 px-3.5 text-xs sm:text-sm bg-slate-50/50 hover:bg-slate-50 text-slate-800 rounded-xl border border-slate-200 focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 focus:outline-none text-left flex items-center justify-between transition-all duration-150 cursor-pointer"
            >
              {selectedCountry ? (
                <span className="flex items-center gap-2">
                  <span className="text-base leading-none select-none">{selectedCountry.flag}</span>
                  <span>{selectedCountry.name}</span>
                </span>
              ) : (
                <span className="text-slate-400">{t('countryPlaceholder')}</span>
              )}
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {isCountryOpen && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
                {/* Country Search Box */}
                <div className="relative border-b border-slate-100 p-2">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setFocusedIndex(-1);
                    }}
                    placeholder={t('searchCountry')}
                    className="w-full h-8 pl-8 pr-3 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 rounded-lg border-none focus:ring-1 focus:ring-indigo-600 focus:outline-none"
                    autoFocus
                  />
                </div>

                {/* Country Options List */}
                <div className="max-h-48 overflow-y-auto py-1">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country, idx) => (
                      <button
                        key={country.code}
                        type="button"
                        onClick={() => {
                          setSelectedCountry(country);
                          setIsCountryOpen(false);
                        }}
                        className={cn(
                          "w-full px-3 py-2 text-xs text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer",
                          (selectedCountry?.code === country.code || focusedIndex === idx) ? "bg-indigo-50/60 text-indigo-700 font-semibold" : "text-slate-700"
                        )}
                      >
                        <span className="flex items-center gap-2.5">
                          <span className="text-base leading-none select-none">{country.flag}</span>
                          <span>{country.name}</span>
                        </span>
                        {selectedCountry?.code === country.code && (
                          <Check className="h-3.5 w-3.5 text-indigo-600 shrink-0" />
                        )}
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-xs text-center text-slate-400 font-medium">
                      No results found
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preferred Language */}
        <div className="space-y-1">
          <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
            {t('languageLabel')}
          </label>
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={cn(
                "py-2 text-xs font-bold rounded-lg transition-all cursor-pointer",
                language === 'en' ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
              )}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={cn(
                "py-2 text-xs font-bold rounded-lg transition-all cursor-pointer",
                language === 'hi' ? "bg-white text-indigo-600 shadow-xs" : "text-slate-500 hover:text-slate-800"
              )}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Continue button */}
        <button
          type="submit"
          className="w-full h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm shadow-2xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 group mt-2"
        >
          <span>{t('completeSetupBtn')}</span>
          <ArrowRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </form>
    </div>
  );
};
