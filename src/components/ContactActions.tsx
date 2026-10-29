/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Phone, MessageSquare, MessageCircle, Copy, Check, ExternalLink } from 'lucide-react';
import {
  formatPakistaniDisplay,
  getWhatsAppUrl,
  getTelUrl,
  getSmsUrl,
} from '../utils/phoneUtils';
import { useApp } from '../context/AppContext';

interface ContactActionsProps {
  phone: string;
  name: string;
  roleLabel?: string;
  contextText?: string;
  variant?: 'inline' | 'compact' | 'badge';
  className?: string;
}

export const ContactActions: React.FC<ContactActionsProps> = ({
  phone,
  name,
  roleLabel,
  contextText,
  variant = 'inline',
  className = '',
}) => {
  const { language, showNotification } = useApp();
  const [copied, setCopied] = useState<boolean>(false);

  if (!phone) return null;

  const displayPhone = formatPakistaniDisplay(phone);
  const waMessage = contextText
    ? `السلام علیکم ${name}! میں نے زری بک (ZARIBOOK) پر آپ کا رابطہ دیکھا: "${contextText}"۔ براہ کرم رہنمائی فرمائیں۔`
    : `السلام علیکم ${name}! میں زری بک (ZARIBOOK) کسان نیٹ ورک کے حوالے سے رابطہ کر رہا ہوں۔`;

  const waUrl = getWhatsAppUrl(phone, waMessage);
  const telUrl = getTelUrl(phone);
  const smsUrl = getSmsUrl(phone, waMessage);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(phone);
    setCopied(true);
    showNotification(language === 'ur' ? `نمبر کاپی ہو گیا: ${displayPhone}` : `Phone copied: ${displayPhone}`);
    setTimeout(() => setCopied(false), 2000);
  };

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-1.5 ${className}`} onClick={(e) => e.stopPropagation()}>
        <a
          href={telUrl}
          title={language === 'ur' ? `کال کریں: ${displayPhone}` : `Call ${displayPhone}`}
          className="p-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white transition-colors"
        >
          <Phone className="w-3.5 h-3.5" />
        </a>
        <a
          href={smsUrl}
          title={language === 'ur' ? 'ایس ایم ایس بھیجیں' : 'Send SMS'}
          className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white transition-colors"
        >
          <MessageSquare className="w-3.5 h-3.5" />
        </a>
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={language === 'ur' ? 'واٹس ایپ پر میسج کریں' : 'Chat on WhatsApp'}
          className="p-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white transition-colors flex items-center justify-center"
        >
          <MessageCircle className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  if (variant === 'badge') {
    return (
      <div
        className={`inline-flex items-center gap-2 bg-stone-100 border border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-800 ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="font-mono font-bold text-stone-900">{displayPhone}</span>
        <div className="flex items-center gap-1">
          <a
            href={telUrl}
            className="p-1 rounded bg-emerald-800 hover:bg-emerald-700 text-white transition-colors"
            title="Call"
          >
            <Phone className="w-3 h-3" />
          </a>
          <a
            href={smsUrl}
            className="p-1 rounded bg-stone-800 hover:bg-stone-700 text-white transition-colors"
            title="SMS"
          >
            <MessageSquare className="w-3 h-3" />
          </a>
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white transition-colors"
            title="WhatsApp"
          >
            <MessageCircle className="w-3 h-3" />
          </a>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-stone-50 border border-stone-200 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs ${className}`}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
          <Phone className="w-3.5 h-3.5" />
        </div>
        <div>
          <span className="font-mono font-bold text-stone-900 block leading-tight">
            {displayPhone}
          </span>
          <span className="text-[10px] text-stone-500">
            {roleLabel || (language === 'ur' ? 'موبائل نمبر (رابطہ)' : 'Direct Mobile')}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1.5 shrink-0">
        {/* Direct Call Button */}
        <a
          href={telUrl}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-bold transition-colors shadow-2xs"
          title={language === 'ur' ? 'براہ راست کال کریں' : 'Direct Phone Call'}
        >
          <Phone className="w-3 h-3" />
          <span>{language === 'ur' ? 'کال' : 'Call'}</span>
        </a>

        {/* Direct SMS Button */}
        <a
          href={smsUrl}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-white font-bold transition-colors shadow-2xs"
          title={language === 'ur' ? 'ایس ایم ایس میسج بھیجیں' : 'Send SMS'}
        >
          <MessageSquare className="w-3 h-3" />
          <span>{language === 'ur' ? 'پیغام' : 'SMS'}</span>
        </a>

        {/* Direct WhatsApp Button */}
        <a
          href={waUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-2xs"
          title={language === 'ur' ? 'واٹس ایپ پر بات کریں' : 'Chat on WhatsApp'}
        >
          <MessageCircle className="w-3 h-3" />
          <span>{language === 'ur' ? 'واٹس ایپ' : 'WhatsApp'}</span>
        </a>

        {/* Copy Button */}
        <button
          onClick={handleCopy}
          className="p-1.5 rounded-lg bg-white border border-stone-300 hover:bg-stone-100 text-stone-700 transition-colors"
          title={language === 'ur' ? 'نمبر کاپی کریں' : 'Copy phone number'}
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};
