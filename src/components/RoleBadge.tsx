/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { UserRole } from '../types';
import { Sprout, ShieldCheck, Microscope, Store, Scale } from 'lucide-react';

interface RoleBadgeProps {
  role: UserRole | string;
  size?: 'sm' | 'md';
  language?: 'ur' | 'en';
  className?: string;
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({
  role,
  size = 'sm',
  language = 'ur',
  className = '',
}) => {
  let labelUrdu = 'کسان';
  let labelEn = 'Farmer';
  let icon = <Sprout className={size === 'sm' ? 'w-3 h-3 text-emerald-700' : 'w-3.5 h-3.5 text-emerald-700'} />;
  let colorClasses = 'bg-emerald-50 text-emerald-900 border-emerald-300';

  const normalized = (role || '').toLowerCase();

  if (normalized.includes('field_officer') || normalized.includes('officer') || normalized.includes('فیلڈ')) {
    labelUrdu = 'فیلڈ آفیسر';
    labelEn = 'Field Officer';
    icon = <ShieldCheck className={size === 'sm' ? 'w-3 h-3 text-blue-700' : 'w-3.5 h-3.5 text-blue-700'} />;
    colorClasses = 'bg-blue-50 text-blue-900 border-blue-300';
  } else if (normalized.includes('scientist') || normalized.includes('سائنسدان') || normalized.includes('ماہر')) {
    labelUrdu = 'زرعی سائنسدان';
    labelEn = 'Agri Scientist';
    icon = <Microscope className={size === 'sm' ? 'w-3 h-3 text-purple-700' : 'w-3.5 h-3.5 text-purple-700'} />;
    colorClasses = 'bg-purple-50 text-purple-900 border-purple-300';
  } else if (normalized.includes('dealer') || normalized.includes('ڈیلر')) {
    labelUrdu = 'زرعی ڈیلر';
    labelEn = 'Agri Dealer';
    icon = <Store className={size === 'sm' ? 'w-3 h-3 text-amber-800' : 'w-3.5 h-3.5 text-amber-800'} />;
    colorClasses = 'bg-amber-50 text-amber-950 border-amber-300';
  } else if (normalized.includes('aarti') || normalized.includes('آڑھی') || normalized.includes('آڑھتی')) {
    labelUrdu = 'آڑھتی / منڈی';
    labelEn = 'Commission Agent';
    icon = <Scale className={size === 'sm' ? 'w-3 h-3 text-rose-700' : 'w-3.5 h-3.5 text-rose-700'} />;
    colorClasses = 'bg-rose-50 text-rose-950 border-rose-300';
  }

  const label = language === 'ur' ? labelUrdu : labelEn;

  return (
    <span
      className={`inline-flex items-center gap-1 font-bold rounded-md border shrink-0 ${
        size === 'sm' ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-0.5 text-xs'
      } ${colorClasses} ${className}`}
    >
      {icon}
      <span>{label}</span>
    </span>
  );
};
