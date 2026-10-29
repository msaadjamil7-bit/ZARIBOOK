/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, Language, UserProfile, DiagnosisResult, AppNotification, NotificationCategory } from '../types';
import { USER_PROFILES } from '../data/mockData';
import { cleanPhoneForWa } from '../utils/phoneUtils';

export type AppTab = 'ai' | 'calculator' | 'agri_feed' | 'field_visit' | 'mandi' | 'store';
export type AuthModalMode = 'login' | 'signup' | 'profile';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  users: UserProfile[];
  language: Language;
  setLanguage: (lang: Language) => void;
  activeTab: AppTab;
  setActiveTab: (tab: AppTab) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  lastDiagnosis: DiagnosisResult | null;
  setLastDiagnosis: (diag: DiagnosisResult | null) => void;
  selectedActiveChemical: string | null;
  setSelectedActiveChemical: (chemical: string | null) => void;
  visitPreFillIssue: string | null;
  setVisitPreFillIssue: (issue: string | null) => void;
  notification: string | null;
  showNotification: (msg: string) => void;
  t: (key: string) => string;

  // Notifications State & Actions
  notifications: AppNotification[];
  unreadNotificationsCount: number;
  addNotification: (notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'> & { timestamp?: string }) => void;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;

  // Auth & Profile Modal State & Actions
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: AuthModalMode;
  setAuthModalMode: (mode: AuthModalMode) => void;
  loginWithPhone: (phone: string) => boolean;
  signUpUser: (user: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const TRANSLATIONS: Record<string, { ur: string; en: string }> = {
  app_name: { ur: 'زری بک / ایگری کنیکٹ', en: 'ZARIBOOK / AgriConnect' },
  tagline: { ur: 'پاکستان کا سب سے بڑا ڈیجیٹل زرعی نیٹ ورک', en: "Pakistan's Premier Agri Social & Advisory Network" },
  role_farmer: { ur: 'کسان (Farmer)', en: 'Farmer (کسان)' },
  role_field_officer: { ur: 'فیلڈ آفیسر (Officer)', en: 'Field Officer (فیلڈ آفیسر)' },
  role_scientist: { ur: 'زرعی سائنسدان (Scientist)', en: 'Agri Scientist (زرعی سائنسدان)' },
  role_dealer: { ur: 'زرعی ڈیلر (Agri Dealer)', en: 'Agri Dealer (زرعی ڈیلر)' },
  role_aarti: { ur: 'آڑھی / غلہ منڈی (Aarti)', en: 'Aarti / Grain Market (آڑھی)' },
  tab_ai: { ur: 'AI زرعی معالج', en: 'AI Crop Doctor' },
  tab_calculator: { ur: 'فصل خرچہ کیلکولیٹر', en: 'Crop Expense Calculator' },
  tab_agri_feed: { ur: 'ایگری فیڈ', en: 'Agri Feed' },
  tab_field_visit: { ur: 'فیلڈ وزٹ', en: 'Field Visit' },
  tab_mandi: { ur: 'غلہ منڈی ریٹ (Mandi)', en: 'Live Mandi Board' },
  tab_store: { ur: 'کھاد و ادویات (Store)', en: 'Agri Depot Store' },
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'doctor',
    title: 'AI Crop Doctor Diagnosis Ready',
    titleUrdu: 'AI معالج کی تشخیص مکمل ہو گئی',
    message: 'Cotton leaf cure and voice prescription generated.',
    messageUrdu: 'کپاس کے سفید مکھی اور پتا مروڑ کا مکمل وائس آڈیو نسخہ تیار ہے۔ سنیں!',
    timestamp: '2 منٹ قبل',
    read: false,
    linkTab: 'ai',
  },
  {
    id: 'notif-2',
    type: 'mandi',
    title: 'Live Mandi Rate Update in Sahiwal',
    titleUrdu: 'ساہیوال غلہ منڈی: گندم کا نیا ریٹ',
    message: 'Chaudhry Arshad Aarti offered Rs. 4,180/maund for Dilkash-20.',
    messageUrdu: 'چوہدری ارشد کمیشن شاپ: دلکش-20 گندم کا ریٹ 4,180 روپے فی من ہو گیا۔',
    timestamp: '15 منٹ قبل',
    read: false,
    linkTab: 'mandi',
  },
  {
    id: 'notif-3',
    type: 'field_visit',
    title: 'Field Officer Nearby Alert',
    titleUrdu: 'فیلڈ آفیسر ریڈار الرٹ',
    message: 'Officer Malik Arslan is within 12km in Multan Circle.',
    messageUrdu: 'فیلڈ آفیسر ملک ارسلان آپ کے چک کے قریب معائنہ کیلئے دستیاب ہیں۔',
    timestamp: '1 گھنٹہ قبل',
    read: false,
    linkTab: 'field_visit',
  },
  {
    id: 'notif-4',
    type: 'feed',
    title: 'New Activity in Agri Feed',
    titleUrdu: 'ایگری فیڈ پر نئی پوسٹ',
    message: 'Chaudhry Bashir posted wheat harvesting update.',
    messageUrdu: 'چوہدری بشیر نے گندم کی کٹائی اور فی ایکڑ پیداوار کی رپورٹ شیئر کی۔',
    timestamp: '3 گھنٹے قبل',
    read: true,
    linkTab: 'agri_feed',
  },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('farmer');
  const [language, setLanguage] = useState<Language>('ur');
  const [activeTab, setActiveTab] = useState<AppTab>('ai');
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(false);
  const [lastDiagnosis, setLastDiagnosis] = useState<DiagnosisResult | null>(null);
  const [selectedActiveChemical, setSelectedActiveChemical] = useState<string | null>(null);
  const [visitPreFillIssue, setVisitPreFillIssue] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  // Registered Users list
  const [users, setUsers] = useState<UserProfile[]>(() => {
    return Object.values(USER_PROFILES);
  });
  const [currentUserId, setCurrentUserId] = useState<string>('u-farmer-1');

  // Notifications
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<AuthModalMode>('profile');

  // Derive current user
  const currentUser = users.find((u) => u.id === currentUserId) || USER_PROFILES[role];

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length;

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    // Find matching user or fallback to profile
    const existing = users.find((u) => u.role === newRole);
    if (existing) {
      setCurrentUserId(existing.id);
    }
    const roleName = USER_PROFILES[newRole].nameUrdu;
    showNotification(`پروفائل تبدیل ہو گئی: ${roleName}`);
  };

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification((current) => (current === msg ? null : current));
    }, 4500);
  };

  const addNotification = (
    notif: Omit<AppNotification, 'id' | 'timestamp' | 'read'> & { timestamp?: string }
  ) => {
    const newNotif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: notif.type,
      title: notif.title,
      titleUrdu: notif.titleUrdu,
      message: notif.message,
      messageUrdu: notif.messageUrdu,
      timestamp: notif.timestamp || (language === 'ur' ? 'ابھی' : 'Just now'),
      read: false,
      linkTab: notif.linkTab,
      actionData: notif.actionData,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    showNotification(language === 'ur' ? `🔔 ${notif.titleUrdu}` : `🔔 ${notif.title}`);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showNotification(language === 'ur' ? 'تمام الرٹس پڑھے ہوئے نشان زد کر دیے گئے۔' : 'All notifications marked as read.');
  };

  const clearNotifications = () => {
    setNotifications([]);
    showNotification(language === 'ur' ? 'اطلاعات صاف کر دی گئیں۔' : 'Notifications cleared.');
  };

  // Auth functions
  const loginWithPhone = (phone: string): boolean => {
    const cleanSearch = cleanPhoneForWa(phone);
    const found = users.find((u) => cleanPhoneForWa(u.phone) === cleanSearch || u.phone.includes(phone));
    if (found) {
      setCurrentUserId(found.id);
      setRoleState(found.role);
      addNotification({
        type: 'system',
        title: 'Logged in successfully',
        titleUrdu: 'لاگ اِن کامیاب ہو گیا',
        message: `Welcome back, ${found.name}`,
        messageUrdu: `خوش آمدید، ${found.nameUrdu}`,
      });
      return true;
    }
    return false;
  };

  const signUpUser = (newUser: UserProfile) => {
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUserId(newUser.id);
    setRoleState(newUser.role);
    addNotification({
      type: 'system',
      title: 'Profile Created',
      titleUrdu: 'پروفائل کامیابی سے بن گئی',
      message: `Account activated for ${newUser.phone}`,
      messageUrdu: `موبائل نمبر ${newUser.phone} پر آپ کی پروفائل فعال ہو گئی۔`,
    });
  };

  const updateProfile = (partial: Partial<UserProfile>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === currentUserId ? { ...u, ...partial } : u))
    );
  };

  const t = (key: string): string => {
    const entry = TRANSLATIONS[key];
    if (!entry) return key;
    return language === 'ur' ? entry.ur : entry.en;
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        users,
        language,
        setLanguage,
        activeTab,
        setActiveTab,
        isMobileFrame,
        setIsMobileFrame,
        lastDiagnosis,
        setLastDiagnosis,
        selectedActiveChemical,
        setSelectedActiveChemical,
        visitPreFillIssue,
        setVisitPreFillIssue,
        notification,
        showNotification,
        t,
        notifications,
        unreadNotificationsCount,
        addNotification,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        loginWithPhone,
        signUpUser,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
