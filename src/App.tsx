/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp, AppTab } from './context/AppContext';
import { Header } from './components/Header';
import { MandiTicker } from './components/MandiTicker';
import { CropDoctor } from './components/CropDoctor';
import { CropExpenseCalculator } from './components/CropExpenseCalculator';
import { FieldOfficerRadar } from './components/FieldOfficerRadar';
import { MandiBoard } from './components/MandiBoard';
import { DealerStore } from './components/DealerStore';
import { AgriFeed } from './components/AgriFeed';
import { AuthProfileModal } from './components/AuthProfileModal';
import { RoleBadge } from './components/RoleBadge';
import {
  Sparkles,
  Calculator,
  Radio,
  Rss,
  Scale,
  Store,
  Wifi,
  Battery,
  Signal,
  CheckCircle,
} from 'lucide-react';

const MainLayout: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    isMobileFrame,
    language,
    notification,
    currentUser,
    role,
  } = useApp();

  const navigationTabs: Array<{ id: AppTab; labelUrdu: string; labelEn: string; icon: React.ReactNode }> = [
    {
      id: 'ai',
      labelUrdu: 'AI زرعی معالج',
      labelEn: 'AI Crop Doctor',
      icon: <Sparkles className="w-4 h-4" />,
    },
    {
      id: 'calculator',
      labelUrdu: 'خرچہ کیلکولیٹر',
      labelEn: 'Expense Calculator',
      icon: <Calculator className="w-4 h-4" />,
    },
    {
      id: 'agri_feed',
      labelUrdu: 'ایگری فیڈ',
      labelEn: 'Agri Feed',
      icon: <Rss className="w-4 h-4" />,
    },
    {
      id: 'field_visit',
      labelUrdu: 'فیلڈ وزٹ',
      labelEn: 'Field Visit',
      icon: <Radio className="w-4 h-4" />,
    },
    {
      id: 'mandi',
      labelUrdu: 'غلہ منڈی',
      labelEn: 'Live Mandi',
      icon: <Scale className="w-4 h-4" />,
    },
    {
      id: 'store',
      labelUrdu: 'کھاد و ادویات',
      labelEn: 'Agri Depot',
      icon: <Store className="w-4 h-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Toast Notification Alert */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 max-w-sm bg-stone-900 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl border border-stone-700 flex items-center gap-3 animate-slide-in">
          <CheckCircle className="w-4 h-4 text-lime-400 shrink-0" />
          <span className="font-medium font-urdu leading-relaxed" dir="rtl">
            {notification}
          </span>
        </div>
      )}

      {/* Top Application Header */}
      <Header />

      {/* Profile & Mobile Authentication Modal */}
      <AuthProfileModal />

      {/* Live Grain Market Ticker */}
      <MandiTicker />

      {/* Main Container: Mobile Frame Simulator or Responsive Fluid View */}
      <div className="flex-1 flex flex-col items-center justify-start p-3 sm:p-6 lg:p-8">
        {isMobileFrame ? (
          /* Smartphone Frame Mockup View (iPhone/Android Shell) */
          <div className="w-full max-w-[410px] bg-stone-900 rounded-[48px] p-3 shadow-2xl border-4 border-stone-800 ring-12 ring-stone-900/40 relative">
            {/* Notch / Dynamic Island */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-stone-950 rounded-full z-40 flex items-center justify-end px-3">
              <span className="w-2.5 h-2.5 rounded-full bg-stone-800"></span>
            </div>

            {/* Mobile Status Bar */}
            <div className="pt-2 px-6 pb-2 text-[11px] text-stone-400 font-bold flex items-center justify-between">
              <span>09:41</span>
              <div className="flex items-center gap-1.5">
                <Signal className="w-3 h-3" />
                <Wifi className="w-3 h-3" />
                <Battery className="w-3.5 h-3.5 text-lime-400" />
              </div>
            </div>

            {/* Phone Screen Container */}
            <div className="bg-stone-100 rounded-[36px] overflow-hidden flex flex-col min-h-[720px] max-h-[820px] border border-stone-200">
              {/* Internal Mobile Header: App name and user name with tagged role */}
              <div className="bg-emerald-900 text-white px-4 py-2.5 flex items-center justify-between">
                <span className="font-extrabold text-xs tracking-tight text-white flex items-center gap-1.5">
                  ZARIBOOK <span className="text-lime-300 font-urdu text-[11px]">زری بک</span>
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-white text-xs font-bold truncate max-w-[110px]">
                    {language === 'ur' ? currentUser.nameUrdu.split('(')[0] : currentUser.name}
                  </span>
                  <RoleBadge role={currentUser.role} size="sm" language={language} />
                </div>
              </div>

              {/* Mobile Scrollable Viewport */}
              <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
                {activeTab === 'ai' && <CropDoctor />}
                {activeTab === 'calculator' && <CropExpenseCalculator />}
                {activeTab === 'agri_feed' && <AgriFeed />}
                {activeTab === 'field_visit' && <FieldOfficerRadar />}
                {activeTab === 'mandi' && <MandiBoard />}
                {activeTab === 'store' && <DealerStore />}
              </div>

              {/* Mobile Bottom Navigation Bar - Simple & Solid */}
              <div className="bg-white border-t border-stone-200 px-2 py-1.5 flex items-center justify-around shadow-xs">
                {navigationTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex flex-col items-center gap-1 py-1 px-1.5 rounded-lg transition-colors ${
                        isActive ? 'text-emerald-800 font-bold bg-emerald-50' : 'text-stone-500 hover:text-stone-800'
                      }`}
                    >
                      {tab.icon}
                      <span className="text-[9px] font-urdu leading-none">
                        {language === 'ur' ? tab.labelUrdu : tab.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Home Indicator Bar */}
              <div className="bg-white pb-1 flex justify-center">
                <div className="w-28 h-1 bg-stone-300 rounded-full"></div>
              </div>
            </div>
          </div>
        ) : (
          /* Full Desktop / Responsive View */
          <div className="w-full max-w-7xl mx-auto space-y-6">
            {/* Desktop Navigation Tab Bar - Simple & Solid */}
            <div className="bg-white rounded-xl p-1.5 border border-stone-200 shadow-xs flex items-center justify-between gap-2 overflow-x-auto scrollbar-none">
              <div className="flex items-center gap-1">
                {navigationTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-colors whitespace-nowrap cursor-pointer ${
                        isActive
                          ? 'bg-emerald-800 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
                      }`}
                    >
                      {tab.icon}
                      <span>{language === 'ur' ? tab.labelUrdu : tab.labelEn}</span>
                    </button>
                  );
                })}
              </div>

              <div className="hidden lg:flex items-center gap-2 px-3 text-xs text-stone-500 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                <span>ZARIBOOK 2026 Live</span>
              </div>
            </div>

            {/* Active Workspace View */}
            <main>
              {activeTab === 'ai' && <CropDoctor />}
              {activeTab === 'calculator' && <CropExpenseCalculator />}
              {activeTab === 'agri_feed' && <AgriFeed />}
              {activeTab === 'field_visit' && <FieldOfficerRadar />}
              {activeTab === 'mandi' && <MandiBoard />}
              {activeTab === 'store' && <DealerStore />}
            </main>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 py-6 px-4 text-xs mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-black text-white text-sm">ZARIBOOK / AgriConnect</span>
            <span>·</span>
            <span>AgTech Mobile Platform for Pakistan</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-stone-400">
            <button onClick={() => setActiveTab('ai')} className="hover:text-white transition-colors cursor-pointer">
              AI Crop Doctor
            </button>
            <button onClick={() => setActiveTab('calculator')} className="hover:text-white transition-colors cursor-pointer">
              Crop Calculator
            </button>
            <button onClick={() => setActiveTab('agri_feed')} className="hover:text-white transition-colors cursor-pointer">
              Agri Feed
            </button>
            <button onClick={() => setActiveTab('field_visit')} className="hover:text-white transition-colors cursor-pointer">
              Field Visit
            </button>
            <button onClick={() => setActiveTab('mandi')} className="hover:text-white transition-colors cursor-pointer">
              Mandi Rates
            </button>
            <button onClick={() => setActiveTab('store')} className="hover:text-white transition-colors cursor-pointer">
              Agri Depot
            </button>
          </div>

          <p className="text-stone-400">
            © 2026 ZARIBOOK Platform. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
