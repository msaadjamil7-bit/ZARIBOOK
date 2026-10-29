/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  CheckCheck,
  Trash2,
  Sparkles,
  Radio,
  Scale,
  Rss,
  Store,
  Users,
  ChevronRight,
  X,
  PlusCircle,
  Calculator,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AppNotification, NotificationCategory } from '../types';

export const NotificationCenter: React.FC = () => {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotifications,
    addNotification,
    setActiveTab,
    language,
  } = useApp();

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filter, setFilter] = useState<NotificationCategory | 'all'>('all');
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleNotificationClick = (item: AppNotification) => {
    markNotificationAsRead(item.id);
    if (item.linkTab) {
      setActiveTab(item.linkTab);
    }
    setIsOpen(false);
  };

  const filteredNotifications = notifications.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  const getCategoryIcon = (type: NotificationCategory) => {
    switch (type) {
      case 'doctor':
        return <Sparkles className="w-4 h-4 text-emerald-600" />;
      case 'field_visit':
        return <Radio className="w-4 h-4 text-teal-600" />;
      case 'mandi':
        return <Scale className="w-4 h-4 text-amber-600" />;
      case 'feed':
        return <Rss className="w-4 h-4 text-blue-600" />;
      case 'calculator':
        return <Calculator className="w-4 h-4 text-emerald-700" />;
      case 'store':
        return <Store className="w-4 h-4 text-stone-700" />;
      default:
        return <Bell className="w-4 h-4 text-stone-600" />;
    }
  };

  const handleSendTestNotification = () => {
    const samples: Array<{
      type: NotificationCategory;
      title: string;
      titleUrdu: string;
      message: string;
      messageUrdu: string;
      linkTab: any;
    }> = [
      {
        type: 'doctor',
        title: 'New AI Crop Doctor Prescription Ready',
        titleUrdu: 'نئی AI نسخہ رپورٹ تیار ہے',
        message: 'Cotton leaf cure and voice prescription generated.',
        messageUrdu: 'کپاس کے سفید مکھی کے تدارک کیلئے وائس آڈیو نسخہ تیار ہے۔',
        linkTab: 'ai',
      },
      {
        type: 'mandi',
        title: 'Wheat Mandi Rate Jumped in Sahiwal',
        titleUrdu: 'ساہیوال منڈی میں گندم کی نئی بولی',
        message: 'Chaudhry Arshad Aarti raised rate to Rs. 4,180/maund.',
        messageUrdu: 'چوہدری ارشد کمیشن شاپ نے گندم کا ریٹ 4,180 روپے فی من مقرر کیا۔',
        linkTab: 'mandi',
      },
      {
        type: 'field_visit',
        title: 'Field Officer Accepted Visit Request',
        titleUrdu: 'فیلڈ آفیسر نے وزٹ قبول کر لیا',
        message: 'Officer Malik Arslan is en route to Chak 148/9-L.',
        messageUrdu: 'فیلڈ آفیسر ملک ارسلان آپ کے فارم پر معائنہ کیلئے روانہ ہو چکے ہیں۔',
        linkTab: 'field_visit',
      },
      {
        type: 'feed',
        title: 'New Harvest Activity in Multan Circle',
        titleUrdu: 'ایگری فیڈ پر نئی سرگرمی شیئر ہوئی',
        message: 'Chaudhry Bashir posted bumper wheat harvest photos.',
        messageUrdu: 'چوہدری بشیر نے گندم کی نئی کٹائی کی ویڈیو اور پیداوار اپلوڈ کی۔',
        linkTab: 'agri_feed',
      },
    ];

    const random = samples[Math.floor(Math.random() * samples.length)];
    addNotification({
      type: random.type,
      title: random.title,
      titleUrdu: random.titleUrdu,
      message: random.message,
      messageUrdu: random.messageUrdu,
      linkTab: random.linkTab,
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 rounded-lg transition-colors flex items-center justify-center ${
          isOpen
            ? 'bg-white text-emerald-900 shadow-xs'
            : 'bg-emerald-900 hover:bg-emerald-950 text-white border border-emerald-700'
        }`}
        title={language === 'ur' ? 'اطلاعات و الرٹس (Notifications)' : 'Notifications & Alerts'}
        aria-label="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadNotificationsCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-rose-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center border-2 border-emerald-800 shadow-xs">
            {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown Drawer / Popover */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 z-50 overflow-hidden animate-slide-in">
          {/* Header */}
          <div className="bg-[#089212] text-white p-3.5 flex items-center justify-between border-b border-emerald-900">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-white text-emerald-800 flex items-center justify-center shadow-xs">
                <Bell className="w-4 h-4 text-[#089212]" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-tight text-white flex items-center gap-1.5">
                  <span>{language === 'ur' ? 'اطلاعات و الرٹس' : 'Notifications & Alerts'}</span>
                  {unreadNotificationsCount > 0 && (
                    <span className="text-[10px] bg-white text-emerald-900 px-1.5 py-0.5 rounded-full font-black">
                      {unreadNotificationsCount} {language === 'ur' ? 'نئی' : 'new'}
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-emerald-100">
                  {language === 'ur' ? 'تمام لائیو زرعی سرگرمیوں کی فوری اطلاع' : 'Real-time updates across ZARIBOOK'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={handleSendTestNotification}
                className="p-1 rounded hover:bg-emerald-800 text-emerald-100 hover:text-white transition-colors"
                title={language === 'ur' ? 'ٹیسٹ الرٹ بھیجیں' : 'Simulate Test Alert'}
              >
                <PlusCircle className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-emerald-800 text-emerald-100 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Action Bar: Filter & Mark Read */}
          <div className="bg-stone-50 border-b border-stone-200 px-3 py-2 flex items-center justify-between gap-2 text-xs">
            {/* Filter Pills */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none py-0.5">
              {[
                { id: 'all', label: language === 'ur' ? 'تمام' : 'All' },
                { id: 'doctor', label: language === 'ur' ? 'معالج' : 'Doctor' },
                { id: 'field_visit', label: language === 'ur' ? 'وزٹ' : 'Visits' },
                { id: 'mandi', label: language === 'ur' ? 'منڈی' : 'Mandi' },
                { id: 'feed', label: language === 'ur' ? 'فیڈ' : 'Feed' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFilter(f.id as any)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold whitespace-nowrap transition-colors ${
                    filter === f.id
                      ? 'bg-emerald-800 text-white font-bold'
                      : 'text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              {unreadNotificationsCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:underline"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{language === 'ur' ? 'سب پڑھ لیں' : 'Read all'}</span>
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={clearNotifications}
                  className="p-1 rounded text-stone-400 hover:text-rose-600 transition-colors"
                  title={language === 'ur' ? 'تمام الرٹس صاف کریں' : 'Clear all'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Notification List Body */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-stone-100">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 px-4 text-center text-stone-500 space-y-2">
                <Bell className="w-8 h-8 text-stone-300 mx-auto" />
                <p className="text-xs font-semibold">
                  {language === 'ur' ? 'کوئی نئی اطلاع موجود نہیں ہے۔' : 'No notifications in this tab.'}
                </p>
                <button
                  onClick={handleSendTestNotification}
                  className="text-xs font-bold text-emerald-800 hover:underline inline-block pt-1"
                >
                  {language === 'ur' ? '+ لائیو ٹیسٹ نوٹیفکیشن بھیجیں' : '+ Trigger a test alert'}
                </button>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleNotificationClick(item)}
                  className={`p-3 text-left flex items-start gap-3 cursor-pointer transition-colors ${
                    !item.read ? 'bg-emerald-50/70 hover:bg-emerald-100/60' : 'bg-white hover:bg-stone-50'
                  }`}
                >
                  <div className="w-8 h-8 rounded-lg bg-stone-100 border border-stone-200 flex items-center justify-center shrink-0 mt-0.5">
                    {getCategoryIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <span className="font-bold text-xs text-stone-900 truncate">
                        {language === 'ur' ? item.titleUrdu : item.title}
                      </span>
                      <span className="text-[10px] text-stone-400 shrink-0 font-medium">
                        {item.timestamp}
                      </span>
                    </div>

                    <p className="text-[11px] text-stone-600 line-clamp-2 leading-relaxed">
                      {language === 'ur' ? item.messageUrdu : item.message}
                    </p>

                    {item.linkTab && (
                      <div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-800">
                        <span>{language === 'ur' ? 'دیکھنے کیلئے کلک کریں' : 'Tap to open'}</span>
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    )}
                  </div>

                  {!item.read && (
                    <span className="w-2 h-2 rounded-full bg-emerald-600 shrink-0 mt-1.5"></span>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="bg-stone-50 border-t border-stone-200 p-2 text-center text-[10px] text-stone-500">
            {language === 'ur'
              ? 'کسی بھی اپڈیٹ یا ریٹ پر فوری الرٹ بھیجا جاتا ہے'
              : 'Instant notifications are delivered on any app activity'}
          </div>
        </div>
      )}
    </div>
  );
};
