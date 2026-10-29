/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Utility functions for Pakistani and International mobile phone formatting,
 * direct tel: links, sms: links, and official WhatsApp wa.me deep links.
 */

export function cleanPhoneForWa(phone: string): string {
  if (!phone) return '923000000000';
  // Remove all non-digits
  let digits = phone.replace(/\D/g, '');
  // If starts with 0 (e.g. 03001234567), replace 0 with 92
  if (digits.startsWith('0') && digits.length >= 10) {
    digits = '92' + digits.slice(1);
  }
  // If already starts with 92, ensure proper length
  if (!digits.startsWith('92') && digits.length === 10) {
    digits = '92' + digits;
  }
  return digits;
}

export function cleanPhoneForTel(phone: string): string {
  if (!phone) return '+923000000000';
  const clean = cleanPhoneForWa(phone);
  return `+${clean}`;
}

export function formatPakistaniDisplay(phone: string): string {
  if (!phone) return '0300-0000000';
  const clean = cleanPhoneForWa(phone);
  if (clean.startsWith('92') && clean.length === 12) {
    // 92 300 1234567 -> 0300-1234567
    return `0${clean.slice(2, 5)}-${clean.slice(5)}`;
  }
  return phone;
}

export function getWhatsAppUrl(phone: string, message: string = ''): string {
  const waNumber = cleanPhoneForWa(phone);
  const encodedMsg = encodeURIComponent(message || 'السلام علیکم! میں نے زری بک (ZARIBOOK) پر آپ کی پوسٹ دیکھی ہے۔');
  return `https://wa.me/${waNumber}?text=${encodedMsg}`;
}

export function getTelUrl(phone: string): string {
  return `tel:${cleanPhoneForTel(phone)}`;
}

export function getSmsUrl(phone: string, body: string = ''): string {
  const telNumber = cleanPhoneForTel(phone);
  const encodedBody = encodeURIComponent(body || 'السلام علیکم! زری بک پر آپ سے رابطہ کیا جا رہا ہے۔');
  return `sms:${telNumber}?body=${encodedBody}`;
}
