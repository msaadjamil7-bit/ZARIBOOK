/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { NotificationCenter } from './NotificationCenter';
import { RoleBadge } from './RoleBadge';
import { formatPakistaniDisplay } from '../utils/phoneUtils';
import {
  Sprout,
  Smartphone,
  Monitor,
  Languages,
  User,
  Phone,
  CheckCircle2,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    currentUser,
    language,
    setLanguage,
    isMobileFrame,
    setIsMobileFrame,
    setIsAuthModalOpen,
    setAuthModalMode,
  } = useApp();

  return (
    <header className="bg-[#089212] text-white border-b border-[#066d0e] shadow-xs sticky top-0 z-50">
      {/* Top Banner with branding, User Profile & Controls */}
      <div className="bg-[#089212] max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Logo and Tagline */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center text-[#089212] shadow-xs">
            <Sprout className="w-5 h-5 text-[#089212]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-white flex items-center gap-1.5">
                ZARIBOOK <span className="text-emerald-200 font-urdu text-base font-normal">زری بک</span>
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-900 text-emerald-100 border border-emerald-700">
                AgriConnect
              </span>
            </div>
            <p className="text-xs text-emerald-100 hidden sm:block">
              {language === 'ur'
                ? 'کسان، فیلڈ آفیسر، سائنسدان، ڈیلر اور آڑھتی کا مشترکہ ڈیجیٹل زرعی پلیٹ فارم'
                : 'Unified Mobile Ecosystem for Farmers, Field Officers, Scientists, Dealers & Mandi'}
            </p>
          </div>
        </div>

        {/* Global Controls & User Profile Preview with Tagged Role */}
        <div className="flex items-center gap-2 text-xs">
          {/* Notification Bell Icon Component */}
          <NotificationCenter />

          {/* User Profile Preview Snippet: Name with Role Tag attached */}
          <button
            onClick={() => {
              setAuthModalMode('profile');
              setIsAuthModalOpen(true);
            }}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 border border-emerald-700 shadow-xs transition-colors cursor-pointer text-left"
            title={language === 'ur' ? 'پروفائل میں کردار اور معلومات دیکھنے یا تبدیل کرنے کیلئے کلک کریں' : 'Click to view profile & change role'}
          >
            <div className="relative shrink-0">
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover border border-white"
                />
              ) : (
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-950 border border-white flex items-center justify-center text-white font-bold">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5 leading-tight">
                <span className="font-bold text-white text-xs truncate max-w-[85px] sm:max-w-[130px]">
                  {language === 'ur' ? currentUser.nameUrdu.split('(')[0] : currentUser.name}
                </span>
                {/* Role Tagged with Name */}
                <RoleBadge role={currentUser.role} size="sm" language={language} />
              </div>
              <div className="flex items-center gap-1 mt-0.5">
                <span className="text-[10px] text-emerald-200 font-mono">
                  {formatPakistaniDisplay(currentUser.phone).split('-')[0]}
                </span>
                <span className="text-[10px] text-emerald-300">·</span>
                <span className="text-[10px] text-emerald-300 truncate max-w-[90px]">
                  {language === 'ur' ? currentUser.locationUrdu.split('،')[0] : currentUser.location.split(',')[0]}
                </span>
              </div>
            </div>
          </button>

          {/* Quick Sign Up / Register Profile Button */}
          <button
            onClick={() => {
              setAuthModalMode('signup');
              setIsAuthModalOpen(true);
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white hover:bg-emerald-50 text-emerald-950 font-bold shadow-xs transition-colors"
            title="Create Profile & Select Role"
          >
            <Phone className="w-3 h-3 text-emerald-700" />
            <span>{language === 'ur' ? 'پروفائل بنائیں' : 'Make Profile'}</span>
          </button>

          {/* Device viewport frame toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
              isMobileFrame
                ? 'bg-white text-emerald-900 font-bold'
                : 'bg-emerald-900 hover:bg-emerald-950 text-white border border-emerald-700'
            }`}
            title={isMobileFrame ? 'Switch to Full Screen Desktop' : 'Switch to Smartphone Mobile Frame'}
          >
            {isMobileFrame ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
            <span className="hidden md:inline">
              {isMobileFrame ? (language === 'ur' ? 'موبائل' : 'Mobile') : (language === 'ur' ? 'ڈیسک ٹاپ' : 'Desktop')}
            </span>
          </button>

          {/* Bilingual Language Switcher */}
          <button
            onClick={() => setLanguage(language === 'ur' ? 'en' : 'ur')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white border border-emerald-700 font-semibold transition-colors"
          >
            <Languages className="w-3.5 h-3.5 text-emerald-200" />
            <span>{language === 'ur' ? 'English' : 'اردو'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
