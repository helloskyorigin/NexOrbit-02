'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Check, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { COUNTRIES, Country } from '../countries';
import { Language } from '../translations';
import { cn } from '../../../lib/utils';

export const ProfileSetupView: React.FC = () => {
  const { user, completeProfileSetup, error, clearError, language, setLanguage } = useAuth();
  
  // Try retrieving any name pre-filled from signup
  const getInitialName = () => {
    if (user?.displayName && user.displayName !== 'User') return user.displayName;
    if (typeof window !== 'undefined') {
      try {
        const savedTemp = localStorage.getItem('nexorbit_temp_fullname');
        if (savedTemp) return savedTemp;
      } catch (e) {}
    }
    return '';
  };

  const [displayName, setDisplayName] = useState(getInitialName);
  
  // Country dropdown state
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(
    COUNTRIES.find((c) => c.name === 'India' || c.code === 'IN') || COUNTRIES[0]
  );
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const filteredCountries = COUNTRIES.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

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
        setFocusedIndex((prev) => (prev < filteredCountries.length - 1 ? prev + 1 : 0));
        e.preventDefault();
        break;
      case 'ArrowUp':
        setFocusedIndex((prev) => (prev > 0 ? prev - 1 : filteredCountries.length - 1));
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
    <div className="space-y-6 text-left animate-in fade-in zoom-in-95 duration-200">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-950">
          Complete your profile
        </h1>
        <p className="text-sm text-slate-500 font-normal leading-relaxed">
          Tell us a little about yourself to set up your workspace.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-medium flex items-center justify-between">
          <span className="leading-relaxed">{error}</span>
          <button
            onClick={clearError}
            type="button"
            className="text-rose-500 hover:text-rose-700 font-bold ml-2 cursor-pointer p-0.5"
            aria-label="Dismiss error"
          >
            ×
          </button>
        </div>
      )}

      {/* Setup Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="displayname-input" className="text-xs font-medium text-slate-700 block">
            Your name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <User className="h-4 w-4" />
            </div>
            <input
              id="displayname-input"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your full name"
              required
              autoFocus
              className="w-full h-11 pl-10 pr-3.5 text-sm bg-white text-slate-900 placeholder:text-slate-400 rounded-xl border border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 focus:outline-none transition-all duration-150"
            />
          </div>
        </div>

        {/* Searchable Country Dropdown */}
        <div className="space-y-1.5" ref={dropdownRef}>
          <label className="text-xs font-medium text-slate-700 block">
            Country / Region
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
              className="w-full h-11 px-3.5 text-sm bg-white hover:bg-slate-50 text-slate-900 rounded-xl border border-slate-200 focus:border-slate-950 focus:ring-2 focus:ring-slate-950/10 focus:outline-none text-left flex items-center justify-between transition-all duration-150 cursor-pointer"
            >
              {selectedCountry ? (
                <span className="flex items-center gap-2.5">
                  <span className="text-base leading-none select-none">{selectedCountry.flag}</span>
                  <span className="font-medium text-slate-900">{selectedCountry.name}</span>
                </span>
              ) : (
                <span className="text-slate-400">Select your country</span>
              )}
              <ChevronDown className="h-4 w-4 text-slate-400" />
            </button>

            {isCountryOpen && (
              <div className="absolute z-50 left-0 right-0 mt-1.5 bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-1 duration-100">
                <div className="relative border-b border-slate-100 p-2">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setFocusedIndex(-1);
                    }}
                    placeholder="Search country..."
                    className="w-full h-8 pl-8 pr-3 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 rounded-lg border-none focus:ring-1 focus:ring-slate-950 focus:outline-none"
                    autoFocus
                  />
                </div>

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
                          'w-full px-3 py-2 text-xs text-left flex items-center justify-between hover:bg-slate-50 cursor-pointer',
                          (selectedCountry?.code === country.code || focusedIndex === idx)
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

        {/* Preferred Language */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-700 block">
            Interface language
          </label>
          <div className="grid grid-cols-2 gap-1.5 bg-slate-100/70 p-1 rounded-xl border border-slate-200/80">
            <button
              type="button"
              onClick={() => setLanguage('en')}
              className={cn(
                'py-2 text-xs font-medium rounded-lg transition-all cursor-pointer',
                language === 'en' ? 'bg-white text-slate-950 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
              )}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setLanguage('hi')}
              className={cn(
                'py-2 text-xs font-medium rounded-lg transition-all cursor-pointer',
                language === 'hi' ? 'bg-white text-slate-950 shadow-2xs font-semibold' : 'text-slate-500 hover:text-slate-900'
              )}
            >
              हिन्दी
            </button>
          </div>
        </div>

        {/* Continue button */}
        <button
          type="submit"
          className="w-full h-11 px-4 rounded-xl bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-white font-medium text-sm shadow-xs transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 mt-4"
        >
          <span>Continue to workspace</span>
          <ArrowRight className="h-4 w-4 opacity-80" />
        </button>
      </form>
    </div>
  );
};
