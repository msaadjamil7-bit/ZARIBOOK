import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { MandiRateItem } from '../types';
import { PAKISTANI_MANDIS } from '../data/mockData';
import { ContactActions } from './ContactActions';
import { RoleBadge } from './RoleBadge';
import {
  Scale,
  TrendingUp,
  TrendingDown,
  Minus,
  Plus,
  Phone,
  MapPin,
  Calendar,
  Search,
  CheckCircle2,
  DollarSign,
  Truck,
} from 'lucide-react';

export const MandiBoard: React.FC = () => {
  const { role, currentUser, language, showNotification, addNotification } = useApp();
  const [rates, setRates] = useState<MandiRateItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCrop, setSelectedCrop] = useState<string>('all');
  const [showPostModal, setShowPostModal] = useState<boolean>(false);
  const [showHarvestModal, setShowHarvestModal] = useState<boolean>(false);
  const [selectedAartiItem, setSelectedAartiItem] = useState<MandiRateItem | null>(null);

  // New Rate Posting Form State
  const [formCrop, setFormCrop] = useState<string>('Wheat');
  const [formCropUrdu, setFormCropUrdu] = useState<string>('گندم (Wheat)');
  const [formVariety, setFormVariety] = useState<string>('Dilkash-20 / Akbar');
  const [formMandi, setFormMandi] = useState<string>(PAKISTANI_MANDIS[0]);
  const [formMinPrice, setFormMinPrice] = useState<number>(3900);
  const [formMaxPrice, setFormMaxPrice] = useState<number>(4150);

  // Harvest Booking Form
  const [harvestFarmerName, setHarvestFarmerName] = useState<string>(currentUser.nameUrdu);
  const [harvestFarmerPhone, setHarvestFarmerPhone] = useState<string>(currentUser.phone);
  const [harvestQuantityMaunds, setHarvestQuantityMaunds] = useState<number>(200);

  useEffect(() => {
    loadRates();
  }, []);

  const loadRates = () => {
    setLoading(true);
    fetch('/api/mandi-rates')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.rates) {
          setRates(data.rates);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  const handlePostRate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/mandi-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          aartiName: currentUser.nameUrdu,
          aartiPhone: currentUser.phone,
          mandiName: formMandi,
          crop: formCrop,
          cropUrdu: formCropUrdu,
          variety: formVariety,
          minPrice: formMinPrice,
          maxPrice: formMaxPrice,
          district: formMandi.split('(')[1]?.replace(')', '') || 'Punjab',
        }),
      });

      const data = await res.json();
      if (data.success && data.rate) {
        setRates([data.rate, ...rates]);
        setShowPostModal(false);
        addNotification({
          type: 'mandi',
          title: `New Mandi Rate: ${formCrop} in ${formMandi}`,
          titleUrdu: `${formCropUrdu} کا نیا منڈی ریٹ جاری`,
          message: `Posted by ${currentUser.name}: Rs. ${formMinPrice} - ${formMaxPrice}/maund`,
          messageUrdu: `${currentUser.nameUrdu} کی طرف سے ${formMandi} میں بولی: ${formMinPrice} تا ${formMaxPrice} روپے فی من`,
          linkTab: 'mandi',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleBookHarvest = (e: React.FormEvent) => {
    e.preventDefault();
    setShowHarvestModal(false);
    addNotification({
      type: 'mandi',
      title: 'Harvest Booking Request Sent',
      titleUrdu: 'فصل کی بکنگ درخواست روانہ ہو گئی',
      message: `Request sent to ${selectedAartiItem?.aartiName} for ${harvestQuantityMaunds} maunds`,
      messageUrdu: `${selectedAartiItem?.aartiName} کو ${harvestQuantityMaunds} من فصل کی بکنگ درخواست بھیج دی گئی۔ رابطہ نمبر: ${currentUser.phone}`,
      linkTab: 'mandi',
    });
  };

  const filteredRates = rates.filter((r) => {
    const matchesCrop = selectedCrop === 'all' || r.crop.toLowerCase().includes(selectedCrop.toLowerCase());
    const matchesSearch =
      r.crop.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.cropUrdu.includes(searchTerm) ||
      r.mandiName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.aartiName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCrop && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner - Simple & Solid */}
      <div className="bg-amber-900 rounded-2xl p-5 text-white shadow-sm border border-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-stone-950 text-xs font-bold mb-2 shadow-xs">
            <Scale className="w-3.5 h-3.5 text-amber-800" />
            <span>روزانہ کی سرکاری و آڑھتی بولیاں (Per 40kg Maund)</span>
          </div>
          <h2 className="text-xl font-black">
            {language === 'ur' ? 'لائیو غلہ منڈی ریٹ بورڈ' : 'Live Grain Mandi Bidding Board'}
          </h2>
          <p className="text-amber-100 text-xs max-w-2xl mt-1">
            {language === 'ur'
              ? 'مستند کمیشن ایجنٹس کے ذریعے روزانہ 9 بجے اپڈیٹ ہونے والے گندم، کپاس، چاول، مکئی اور کینولا کے شفاف منڈی ریٹس۔'
              : 'Direct bidding rates posted by verified commission agents across major grain markets in Pakistan.'}
          </p>
        </div>

        {/* Post Rate Button for Aarti */}
        <button
          onClick={() => setShowPostModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-amber-50 text-stone-950 font-bold text-xs shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-amber-800" />
          <span>{language === 'ur' ? 'آج کے ریٹ درج کریں (آڑھتی)' : 'Post Today’s Mandi Rate'}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="منڈی یا فصل تلاش کریں (مثلاً: عارف والا، گندم)..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-600 font-urdu text-right"
            dir="rtl"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {['all', 'Wheat', 'Cotton', 'Rice', 'Maize', 'Canola'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCrop(c)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                selectedCrop === c
                  ? 'bg-amber-800 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {c === 'all' ? (language === 'ur' ? 'تمام جنسیں' : 'All') : c}
            </button>
          ))}
        </div>
      </div>

      {/* Mandi Rates Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-stone-400 border border-stone-200">
          منڈی ریٹس لوڈ ہو رہے ہیں...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRates.map((item) => {
            const isUp = item.changeTrend === 'up';
            const isDown = item.changeTrend === 'down';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 space-y-3 hover:border-amber-400 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <span className="text-[11px] font-bold text-stone-500 uppercase">
                        {item.variety}
                      </span>
                      <h3 className="font-black text-base text-stone-900">{item.cropUrdu}</h3>
                    </div>

                    <div
                      className={`flex items-center gap-1 text-xs font-extrabold px-2 py-0.5 rounded-full ${
                        isUp
                          ? 'bg-emerald-100 text-emerald-800'
                          : isDown
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {isUp && <TrendingUp className="w-3.5 h-3.5" />}
                      {isDown && <TrendingDown className="w-3.5 h-3.5" />}
                      {!isUp && !isDown && <Minus className="w-3.5 h-3.5" />}
                      <span>
                        {item.changeAmount > 0
                          ? `+${item.changeAmount} PKR`
                          : item.changeAmount === 0
                          ? 'مستحکم'
                          : `${item.changeAmount} PKR`}
                      </span>
                    </div>
                  </div>

                  {/* Price Box */}
                  <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-center my-2">
                    <span className="text-[11px] text-stone-500 block mb-0.5">
                      اوسط بھاؤ (Average Boli Rate)
                    </span>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-2xl font-black text-amber-950 font-mono">
                        Rs. {item.avgPrice.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-amber-800">/ 40 کلو (من)</span>
                    </div>

                    <div className="flex items-center justify-center gap-4 text-xs text-stone-600 mt-1.5 pt-1.5 border-t border-amber-200/60 font-mono">
                      <span>کم سے کم: {item.minPrice}</span>
                      <span>·</span>
                      <span>زیادہ سے زیادہ: {item.maxPrice}</span>
                    </div>
                  </div>

                  {/* Mandi & Aarti Information */}
                  <div className="space-y-1 text-xs text-stone-600 pt-1">
                    <p className="flex items-center gap-1.5 font-bold text-stone-800">
                      <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span>{item.mandiName}</span>
                    </p>
                    <div className="flex items-center gap-1.5 flex-wrap text-stone-700">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="font-bold">{item.aartiName}</span>
                      <RoleBadge role="aarti" size="sm" language={language} />
                    </div>

                    {/* Direct Contact: Call, SMS, WhatsApp */}
                    <div className="pt-2">
                      <ContactActions
                        phone={item.aartiPhone || '+92 301 9988776'}
                        name={item.aartiName}
                        roleLabel="آڑھتی موبائل رابطہ"
                        contextText={`غلہ منڈی ریٹ: ${item.cropUrdu} (${item.avgPrice}/من) - ${item.mandiName}`}
                        variant="inline"
                      />
                    </div>
                  </div>
                </div>

                {/* Farmer Booking Button */}
                <div className="pt-2.5 border-t border-stone-100 flex items-center justify-between gap-2">
                  <span className="text-[10px] text-stone-400">{item.date}</span>
                  <button
                    onClick={() => {
                      setSelectedAartiItem(item);
                      setShowHarvestModal(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-colors shadow-2xs"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>فصل کی بکنگ کروائیں</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Post Daily Rate Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">
                آج کے منڈی ریٹس بورڈ پر لگائیں
              </h3>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePostRate} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">غلہ منڈی کا انتخاب:</label>
                <select
                  value={formMandi}
                  onChange={(e) => setFormMandi(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                >
                  {PAKISTANI_MANDIS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">فصل (Crop):</label>
                  <select
                    value={formCrop}
                    onChange={(e) => {
                      setFormCrop(e.target.value);
                      setFormCropUrdu(`${e.target.value} (منڈی ریٹ)`);
                    }}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                  >
                    <option value="Wheat">Wheat / گندم</option>
                    <option value="Cotton">Cotton / کپاس</option>
                    <option value="Basmati Rice">Basmati Rice / دھان</option>
                    <option value="Maize">Maize / مکئی</option>
                    <option value="Canola">Canola / سرسوں</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">ورائٹی / قسم:</label>
                  <input
                    type="text"
                    value={formVariety}
                    onChange={(e) => setFormVariety(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">کم سے کم ریٹ (PKR):</label>
                  <input
                    type="number"
                    value={formMinPrice}
                    onChange={(e) => setFormMinPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">زیادہ سے زیادہ (PKR):</label>
                  <input
                    type="number"
                    value={formMaxPrice}
                    onChange={(e) => setFormMaxPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-bold"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold"
                >
                  بورڈ پر شائع کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Harvest Booking Modal for Farmers */}
      {showHarvestModal && selectedAartiItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  فصل بیچنے کیلئے آڑھتی سے رابطہ
                </h3>
                <span className="text-xs text-stone-500">
                  {selectedAartiItem.mandiName} · {selectedAartiItem.aartiName}
                </span>
              </div>
              <button
                onClick={() => setShowHarvestModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleBookHarvest} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">کسان کا نام:</label>
                <input
                  type="text"
                  value={harvestFarmerName}
                  onChange={(e) => setHarvestFarmerName(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">رابطہ نمبر (WhatsApp/Call):</label>
                <input
                  type="text"
                  value={harvestFarmerPhone}
                  onChange={(e) => setHarvestFarmerPhone(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  تخمینی مقدار (من / 40 کلو گرام):
                </label>
                <input
                  type="number"
                  value={harvestQuantityMaunds}
                  onChange={(e) => setHarvestQuantityMaunds(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono"
                  required
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl text-amber-900 border border-amber-200 text-xs">
                💡 بغیر کسی مڈل مین (بیوپاری) کے براہ راست منڈی کے اصل بھاؤ پر بکنگ کی جائے گی۔
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowHarvestModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-bold"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold"
                >
                  درخواست بھیجیں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
