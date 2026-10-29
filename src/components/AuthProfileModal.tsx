/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Phone,
  User,
  MapPin,
  ShieldCheck,
  Sprout,
  Store,
  Scale,
  Microscope,
  KeyRound,
  CheckCircle2,
  LogOut,
  Edit3,
  Save,
  MessageCircle,
  MessageSquare,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole, UserProfile } from '../types';
import { ContactActions } from './ContactActions';
import { formatPakistaniDisplay } from '../utils/phoneUtils';

import { RoleBadge } from './RoleBadge';

const DEFAULT_AVATARS: Record<UserRole, string[]> = {
  farmer: [
    'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
  ],
  field_officer: [
    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
  ],
  scientist: [
    'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1582750433449-648ed127bb54?auto=format&fit=crop&w=200&q=80',
  ],
  dealer: [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
  ],
  aarti: [
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
  ],
};

export const AuthProfileModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    currentUser,
    users,
    loginWithPhone,
    signUpUser,
    updateProfile,
    role,
    setRole,
    language,
    showNotification,
  } = useApp();

  // Sign up fields
  const [signupPhone, setSignupPhone] = useState<string>('0303-1234567');
  const [signupName, setSignupName] = useState<string>('محمد علی کسان');
  const [signupRole, setSignupRole] = useState<UserRole>('farmer');
  const [signupLocation, setSignupLocation] = useState<string>('چک 20/ڈبلیو بی، وہاڑی');
  const [signupAvatar, setSignupAvatar] = useState<string>(DEFAULT_AVATARS.farmer[0]);
  const [signupLand, setSignupLand] = useState<number>(15);
  const [signupShop, setSignupShop] = useState<string>('');

  // Login fields
  const [loginPhone, setLoginPhone] = useState<string>('0302-6543210');
  const [otpSent, setOtpSent] = useState<boolean>(false);
  const [otpCode, setOtpCode] = useState<string>('');

  // Profile Edit fields
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [editName, setEditName] = useState<string>(currentUser.nameUrdu);
  const [editRole, setEditRole] = useState<UserRole>(currentUser.role);
  const [editPhone, setEditPhone] = useState<string>(currentUser.phone);
  const [editLocation, setEditLocation] = useState<string>(currentUser.locationUrdu);
  const [editAvatar, setEditAvatar] = useState<string>(currentUser.avatar);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = () => {
    if (!loginPhone.trim()) {
      showNotification('براہ کرم موبائل نمبر درج کریں۔');
      return;
    }
    setOtpSent(true);
    setOtpCode('7860');
    showNotification('4 ہندسوں کا تصدیقی OTP کوڈ (7860) بھیج دیا گیا۔');
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpSent) {
      handleSendOtp();
      return;
    }
    const success = loginWithPhone(loginPhone);
    if (success) {
      setIsAuthModalOpen(false);
      setOtpSent(false);
      showNotification(`کامیابی سے لاگ اِن ہو گئے۔ خوش آمدید!`);
    } else {
      showNotification('اس موبائل نمبر پر کوئی اکاؤنٹ نہیں ملا، سائن اپ کریں۔');
      setAuthModalMode('signup');
      setSignupPhone(loginPhone);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signupPhone.trim() || !signupName.trim()) {
      showNotification('موبائل نمبر اور نام درج کرنا لازمی ہے۔');
      return;
    }

    const newUser: UserProfile = {
      id: `u-custom-${Date.now()}`,
      name: signupName,
      nameUrdu: signupName,
      role: signupRole,
      phone: signupPhone,
      location: signupLocation,
      locationUrdu: signupLocation,
      avatar: signupAvatar,
      isVerified: true,
      metadata: {
        landAcres: signupRole === 'farmer' ? signupLand : undefined,
        shopName: signupRole === 'dealer' ? signupShop : undefined,
      },
    };

    signUpUser(newUser);
    setIsAuthModalOpen(false);
    showNotification(`مبارک ہو! آپ کا ZARIBOOK اکاؤنٹ اور پروفائل بن گئی۔`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      nameUrdu: editName,
      name: editName,
      role: editRole,
      phone: editPhone,
      locationUrdu: editLocation,
      location: editLocation,
      avatar: editAvatar,
    });
    setRole(editRole);
    setIsEditingProfile(false);
    showNotification('پروفائل اور کردار کامیابی سے محفوظ ہو گئے۔');
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-stone-200 shadow-2xl overflow-hidden my-auto animate-slide-in">
        {/* Modal Top Header */}
        <div className="bg-[#089212] text-white p-4 flex items-center justify-between border-b border-emerald-900">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white text-emerald-800 flex items-center justify-center font-black shadow-xs">
              <Sprout className="w-5 h-5 text-[#089212]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                {authModalMode === 'signup' && (language === 'ur' ? 'نیا اکاؤنٹ بنائیں (سائن اپ)' : 'Create Account & Profile')}
                {authModalMode === 'login' && (language === 'ur' ? 'موبائل نمبر سے لاگ اِن' : 'Sign In with Mobile')}
                {authModalMode === 'profile' && (language === 'ur' ? 'میری پروفائل و رابطہ' : 'My Profile & Direct Contact')}
              </h3>
              <p className="text-[11px] text-emerald-100">
                {language === 'ur'
                  ? 'کال، ایس ایم ایس اور واٹس ایپ رابطہ سے لیس اکاؤنٹ'
                  : 'Callable, textable and WhatsApp enabled agriculture profile'}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 rounded-lg bg-emerald-900 hover:bg-emerald-950 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Mode Selector Tabs (Simple & Solid) */}
        <div className="bg-stone-100 border-b border-stone-200 p-2 flex items-center gap-1.5">
          <button
            onClick={() => setAuthModalMode('profile')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
              authModalMode === 'profile'
                ? 'bg-[#089212] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            {language === 'ur' ? 'میری پروفائل' : 'My Profile'}
          </button>
          <button
            onClick={() => setAuthModalMode('login')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
              authModalMode === 'login'
                ? 'bg-[#089212] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            {language === 'ur' ? 'لاگ اِن (Login)' : 'Sign In'}
          </button>
          <button
            onClick={() => setAuthModalMode('signup')}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-bold transition-colors ${
              authModalMode === 'signup'
                ? 'bg-[#089212] text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            {language === 'ur' ? 'نیا سائن اپ (Sign Up)' : 'Register'}
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 max-h-[80vh] overflow-y-auto space-y-4">
          {/* ===================== VIEW 1: PROFILE ===================== */}
          {authModalMode === 'profile' && (
            <div className="space-y-4">
              {!isEditingProfile ? (
                <div className="space-y-4">
                  {/* Current Profile Card */}
                  <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center gap-4">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600 shadow-xs"
                    />
                    <div className="text-center sm:text-left flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <h4 className="font-extrabold text-base text-stone-900">
                          {language === 'ur' ? currentUser.nameUrdu : currentUser.name}
                        </h4>
                        {/* Role Tagged with Name */}
                        <RoleBadge role={currentUser.role} size="sm" language={language} />
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      </div>
                      <p className="text-xs text-stone-500 flex items-center justify-center sm:justify-start gap-1 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        <span>{language === 'ur' ? currentUser.locationUrdu : currentUser.location}</span>
                      </p>
                    </div>
                  </div>

                  {/* Callable, Textable & WhatsApp Actions Widget */}
                  <div className="space-y-1.5">
                    <span className="text-xs font-bold text-stone-700 block">
                      {language === 'ur' ? 'آپ کا فعال رابطہ (Direct Phone, SMS & WhatsApp):' : 'Direct Active Contact:'}
                    </span>
                    <ContactActions
                      phone={currentUser.phone}
                      name={currentUser.nameUrdu}
                      roleLabel="Active Profile Number"
                      contextText="ZARIBOOK کسان نیٹ ورک پروفائل"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => {
                        setEditName(currentUser.nameUrdu);
                        setEditRole(currentUser.role);
                        setEditPhone(currentUser.phone);
                        setEditLocation(currentUser.locationUrdu);
                        setEditAvatar(currentUser.avatar);
                        setIsEditingProfile(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>{language === 'ur' ? 'پروفائل و کردار تبدیل کریں' : 'Edit Profile & Role'}</span>
                    </button>

                    <button
                      onClick={() => setAuthModalMode('login')}
                      className="py-2 px-3 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-stone-500" />
                      <span>{language === 'ur' ? 'اکاؤنٹ سوئچ کریں' : 'Switch'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Profile Edit Form */
                <form onSubmit={handleSaveProfile} className="space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'ur' ? 'پورا نام (Urdu/English):' : 'Full Name:'}
                    </label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#089212]"
                    />
                  </div>

                  {/* Role Selector during Profile Making/Editing */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1.5">
                      {language === 'ur' ? 'آپ کا کردار / شعبہ منتخب کریں:' : 'Select Your Role:'}
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                      {[
                        { id: 'farmer', ur: 'کسان (Farmer)', en: 'Farmer' },
                        { id: 'field_officer', ur: 'فیلڈ آفیسر (Officer)', en: 'Field Officer' },
                        { id: 'scientist', ur: 'زرعی سائنسدان', en: 'Agri Scientist' },
                        { id: 'dealer', ur: 'زرعی ڈیلر', en: 'Agri Dealer' },
                        { id: 'aarti', ur: 'آڑھتی / منڈی', en: 'Commission Agent' },
                      ].map((r) => {
                        const isSelected = editRole === r.id;
                        return (
                          <button
                            key={r.id}
                            type="button"
                            onClick={() => setEditRole(r.id as UserRole)}
                            className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-emerald-800 text-white border-emerald-950 shadow-xs'
                                : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                            }`}
                          >
                            {language === 'ur' ? r.ur : r.en}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'ur' ? 'موبائل نمبر (کال، ایس ایم ایس اور واٹس ایپ کیلئے):' : 'Mobile Number (Call, SMS & WhatsApp):'}
                    </label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      required
                      placeholder="0300-1234567"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#089212]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'ur' ? 'مقام / ضلع / مارکیٹ:' : 'Location / District:'}
                    </label>
                    <input
                      type="text"
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      required
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#089212]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      {language === 'ur' ? 'اواتار تصویر (URL):' : 'Avatar Photo URL:'}
                    </label>
                    <input
                      type="text"
                      value={editAvatar}
                      onChange={(e) => setEditAvatar(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#089212]"
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                    <button
                      type="submit"
                      className="flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-[#089212] hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>{language === 'ur' ? 'تبدیلیاں محفوظ کریں' : 'Save Changes'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="py-2 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      {language === 'ur' ? 'منسوخ' : 'Cancel'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* ===================== VIEW 2: LOGIN ===================== */}
          {authModalMode === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ur' ? 'اپنا رجسٹرڈ موبائل فون نمبر درج کریں:' : 'Enter Mobile Phone Number:'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full pl-9 pr-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#089212]"
                    required
                  />
                </div>
                <span className="text-[10px] text-stone-500 mt-1 block">
                  {language === 'ur'
                    ? 'مثال: 0302-6543210 (کسان) یا 0300-9876543 (فیلڈ آفیسر)'
                    : 'Pakistani format: 03XX-XXXXXXX'}
                </span>
              </div>

              {otpSent && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                      <span>{language === 'ur' ? '4 ہندسوں کا OTP کوڈ درج کریں:' : 'Enter 4-Digit OTP:'}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => setOtpCode('7860')}
                      className="text-[11px] font-bold text-emerald-800 underline"
                    >
                      {language === 'ur' ? 'کوڈ درج کریں (7860)' : 'Auto-fill (7860)'}
                    </button>
                  </div>
                  <input
                    type="text"
                    maxLength={4}
                    value={otpCode}
                    onChange={(e) => setOtpCode(e.target.value)}
                    placeholder="7860"
                    className="w-full text-center tracking-[1em] text-lg font-black py-2 bg-white border border-emerald-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#089212]"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#089212] hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <span>{otpSent ? (language === 'ur' ? 'تصدیق کر کے لاگ اِن کریں' : 'Verify & Log In') : (language === 'ur' ? 'او ٹی پی (OTP) کوڈ حاصل کریں' : 'Send Verification OTP')}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              {/* Quick Preset login buttons */}
              <div className="pt-3 border-t border-stone-200">
                <span className="text-xs font-bold text-stone-700 block mb-2">
                  {language === 'ur' ? 'یا 1-کلک سے لاگ اِن کریں:' : 'Or Quick 1-Click Login:'}
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      loginWithPhone('0302-6543210');
                      setIsAuthModalOpen(false);
                    }}
                    className="p-2 rounded-xl border border-stone-200 hover:bg-emerald-50 text-left"
                  >
                    <span className="font-bold text-stone-900 block truncate">چوہدری بشیر</span>
                    <span className="text-[10px] text-stone-500 font-mono">0302-6543210 (کسان)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      loginWithPhone('0300-9876543');
                      setIsAuthModalOpen(false);
                    }}
                    className="p-2 rounded-xl border border-stone-200 hover:bg-emerald-50 text-left"
                  >
                    <span className="font-bold text-stone-900 block truncate">ملک ارسلان</span>
                    <span className="text-[10px] text-stone-500 font-mono">0300-9876543 (آفیسر)</span>
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* ===================== VIEW 3: SIGN UP ===================== */}
          {authModalMode === 'signup' && (
            <form onSubmit={handleSignupSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ur' ? 'موبائل نمبر (کال، ایس ایم ایس اور واٹس ایپ فعال):' : 'Mobile Number:'}
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value)}
                    placeholder="0300-1234567"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-mono text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#089212]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ur' ? 'پورا نام (اردو یا انگلش):' : 'Full Name:'}
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={signupName}
                    onChange={(e) => setSignupName(e.target.value)}
                    placeholder="محمد علی"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#089212]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ur' ? 'اپنا زرعی کردار منتخب کریں:' : 'Select Agricultural Role:'}
                </label>
                <select
                  value={signupRole}
                  onChange={(e) => {
                    const r = e.target.value as UserRole;
                    setSignupRole(r);
                    setSignupAvatar(DEFAULT_AVATARS[r][0]);
                  }}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#089212]"
                >
                  <option value="farmer">کسان (Farmer) - فصل و لائیو سٹاک</option>
                  <option value="field_officer">فیلڈ آفیسر (Field Officer) - محکمہ توسیع زراعت</option>
                  <option value="scientist">زرعی سائنسدان (Agri Scientist) - ریسرچ ادارہ</option>
                  <option value="dealer">زرعی ڈیلر (Agri Dealer) - کھاد، ادویات و بیج</option>
                  <option value="aarti">آڑھتی / کمیشن ایجنٹ (Aarti) - غلہ منڈی</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ur' ? 'گاؤں / چک / ضلع یا غلہ منڈی کا نام:' : 'Location / Village / Mandi:'}
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={signupLocation}
                    onChange={(e) => setSignupLocation(e.target.value)}
                    placeholder="چک 20/ڈبلیو بی، وہاڑی"
                    className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#089212]"
                    required
                  />
                </div>
              </div>

              {signupRole === 'farmer' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'ur' ? 'رقبہ (ایکڑ):' : 'Land Size (Acres):'}
                  </label>
                  <input
                    type="number"
                    value={signupLand}
                    onChange={(e) => setSignupLand(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#089212]"
                  />
                </div>
              )}

              {signupRole === 'dealer' && (
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'ur' ? 'دکان / ایجنسی کا نام:' : 'Shop / Agency Name:'}
                  </label>
                  <input
                    type="text"
                    value={signupShop}
                    onChange={(e) => setSignupShop(e.target.value)}
                    placeholder="رحمان زرعی سروسز"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#089212]"
                  />
                </div>
              )}

              {/* Avatar Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1.5">
                  {language === 'ur' ? 'پروفائل اواتار منتخب کریں:' : 'Select Avatar Image:'}
                </label>
                <div className="flex items-center gap-2">
                  {DEFAULT_AVATARS[signupRole].map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSignupAvatar(img)}
                      className={`relative rounded-full p-0.5 border-2 transition-all ${
                        signupAvatar === img ? 'border-[#089212] ring-2 ring-emerald-500/30' : 'border-stone-200'
                      }`}
                    >
                      <img src={img} alt="Avatar" className="w-10 h-10 rounded-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#089212] hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition-colors mt-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{language === 'ur' ? 'اکاؤنٹ بنائیں اور لاگ اِن کریں' : 'Register & Create Profile'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
