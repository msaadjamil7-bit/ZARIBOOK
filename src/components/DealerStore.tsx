import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ProductItem } from '../types';
import { ContactActions } from './ContactActions';
import { RoleBadge } from './RoleBadge';
import {
  Store,
  ShieldCheck,
  Search,
  Filter,
  Plus,
  Phone,
  MessageSquare,
  Sparkles,
  Tag,
  CheckCircle2,
  PackageCheck,
  AlertCircle,
} from 'lucide-react';

export const DealerStore: React.FC = () => {
  const {
    role,
    currentUser,
    language,
    selectedActiveChemical,
    setSelectedActiveChemical,
    showNotification,
    addNotification,
  } = useApp();
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>(selectedActiveChemical || '');
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  // New Product Form
  const [formTitle, setFormTitle] = useState<string>('');
  const [formTitleUrdu, setFormTitleUrdu] = useState<string>('');
  const [formBrand, setFormBrand] = useState<string>('Bayer Crop Science');
  const [formCategory, setFormCategory] = useState<'Pesticide' | 'Fertilizer' | 'Seed' | 'Biostimulant' | 'Equipment'>('Pesticide');
  const [formPrice, setFormPrice] = useState<number>(2500);
  const [formPackSize, setFormPackSize] = useState<string>('500 ml');
  const [formDescription, setFormDescription] = useState<string>('محکمہ زراعت سے تصدیق شدہ اصل زہر۔');
  const [formRegNo, setFormRegNo] = useState<string>('PEST-REG-9912/PK');

  useEffect(() => {
    loadProducts();
  }, [selectedCategory]);

  useEffect(() => {
    if (selectedActiveChemical) {
      setSearchQuery(selectedActiveChemical);
    }
  }, [selectedActiveChemical]);

  const loadProducts = () => {
    setLoading(true);
    fetch(`/api/products?category=${selectedCategory}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setProducts(data.products);
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealerName: currentUser.nameUrdu,
          shopName: currentUser.metadata?.shopName || 'طارق ایگرو سروسز',
          dealerPhone: currentUser.phone,
          title: formTitle,
          titleUrdu: formTitleUrdu || formTitle,
          brand: formBrand,
          category: formCategory,
          description: formDescription,
          price: formPrice,
          packSize: formPackSize,
          registrationNumber: formRegNo,
        }),
      });

      const data = await res.json();
      if (data.success && data.product) {
        setProducts([data.product, ...products]);
        setShowAddModal(false);
        addNotification({
          type: 'store',
          title: `New Stock Arrival: ${formTitle}`,
          titleUrdu: `${formTitleUrdu || formTitle} کا نیا اسٹاک دستیاب`,
          message: `${formBrand} - Price: Rs. ${formPrice} (${formPackSize})`,
          messageUrdu: `ڈپو پر اصل ${formTitleUrdu || formTitle} کا نیا اسٹاک پہنچ گیا۔ کنٹرولڈ ریٹ: Rs. ${formPrice}`,
          linkTab: 'store',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredProducts = products.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.titleUrdu.includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner - Simple & Solid */}
      <div className="bg-emerald-900 rounded-2xl p-5 text-white shadow-sm border border-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-emerald-950 text-xs font-bold mb-2 shadow-xs">
            <Store className="w-3.5 h-3.5 text-emerald-700" />
            <span>محکمہ زراعت سے منظور شدہ اوریجنل زرعی ادویات</span>
          </div>
          <h2 className="text-xl font-black">
            {language === 'ur' ? 'ڈیجیٹل کسان ڈپو (کھاد، ادویات و بیج)' : 'Agri-Dealer Digital Storefront'}
          </h2>
          <p className="text-emerald-100 text-xs max-w-2xl mt-1">
            {language === 'ur'
              ? 'مستند کیڑے مار ادویات، کھادیں اور تصدیق شدہ بیج کنٹرولڈ ریٹس پر قریبی بااعتماد ڈیلرز سے حاصل کریں۔ 100% اصل پروڈکٹس کی ضمانت۔'
              : 'Direct purchasing from authorized input retailers. Verified registration numbers to combat counterfeit agrochemicals.'}
          </p>
        </div>

        {/* Add Product for Dealers */}
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-950 font-bold text-xs shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          <span>{language === 'ur' ? 'نیا پروڈکٹ درج کریں (ڈیلر)' : 'Add Product to Depot'}</span>
        </button>
      </div>

      {/* Active Chemical Filter Banner if coming from Crop Doctor */}
      {selectedActiveChemical && (
        <div className="bg-emerald-100 border border-emerald-300 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-700" />
            <span>
              <strong>AI معالج کا تجویز کردہ فارمولا: </strong>
              {selectedActiveChemical} پر مشتمل ادویات دکھائی جا رہی ہیں۔
            </span>
          </div>
          <button
            onClick={() => {
              setSelectedActiveChemical(null);
              setSearchQuery('');
            }}
            className="text-xs font-bold text-emerald-800 underline hover:text-emerald-950"
          >
            فلٹر ختم کریں
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="دوا، کیمیکل یا کھاد کا نام تلاش کریں..."
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-urdu text-right"
            dir="rtl"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'تمام اشیاء' },
            { id: 'Pesticide', label: 'کیڑے مار ادویات' },
            { id: 'Fertilizer', label: 'کھادیں' },
            { id: 'Seed', label: 'بیج' },
            { id: 'Biostimulant', label: 'زرعی ٹانک' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-stone-400 border border-stone-200">
          پروڈکٹس لوڈ ہو رہے ہیں...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center text-xs text-stone-400 border border-stone-200">
          کوئی پراڈکٹ دستیاب نہیں۔
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between hover:border-emerald-400 transition-all"
            >
              <div>
                {/* Product Image & Badges */}
                <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                  <img
                    src={prod.imageUrl}
                    alt={prod.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-lg bg-emerald-900/90 text-white text-[11px] font-bold backdrop-blur-xs">
                    {prod.brand}
                  </span>
                  <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 rounded-lg bg-lime-400 text-emerald-950 text-[11px] font-extrabold shadow-xs">
                    {prod.packSize}
                  </span>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-extrabold text-sm text-stone-900 leading-snug">
                        {prod.titleUrdu}
                      </h3>
                      <p className="text-xs text-stone-500 font-mono text-[11px]">{prod.title}</p>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600 font-urdu leading-relaxed text-right" dir="rtl">
                    {prod.description}
                  </p>

                  {/* Govt Registration Number */}
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-800 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-200/60 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                    <span>Reg: {prod.registrationNumber}</span>
                  </div>

                  {/* Dealer Information */}
                  <div className="pt-2 text-[11px] text-stone-500 border-t border-stone-100 flex items-center justify-between flex-wrap gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-stone-800">{prod.shopName}</span>
                      <RoleBadge role="dealer" size="sm" language={language} />
                    </div>
                    <span className="text-stone-400">{prod.location}</span>
                  </div>
                </div>
              </div>

              {/* Price & Order Action */}
              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] text-stone-400 block">کنٹرولڈ قیمت</span>
                  <span className="text-lg font-black text-emerald-900 font-mono">
                    Rs. {prod.price.toLocaleString()}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <ContactActions
                    phone={prod.dealerPhone}
                    name={prod.dealerName}
                    roleLabel={prod.shopName}
                    contextText={`زرعی دوائی/کھاد: ${prod.titleUrdu || prod.title} (${prod.packSize}) - قیمت: Rs. ${prod.price}`}
                    variant="compact"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Product Modal for Dealers */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">
                ڈیجیٹل سٹور میں نئی پروڈکٹ شامل کریں
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddProduct} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">دوا / کھاد کا نام:</label>
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="Confidor 200 SL"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">اردو نام:</label>
                  <input
                    type="text"
                    value={formTitleUrdu}
                    onChange={(e) => setFormTitleUrdu(e.target.value)}
                    placeholder="کانفیڈور 200 ایس ایل"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-urdu text-right"
                    dir="rtl"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">کمپنی / برانڈ:</label>
                  <input
                    type="text"
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">کیٹیگری:</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                  >
                    <option value="Pesticide">کیڑے مار دوا (Pesticide)</option>
                    <option value="Fertilizer">کھاد (Fertilizer)</option>
                    <option value="Seed">بیج (Seed)</option>
                    <option value="Biostimulant">ٹانک (Biostimulant)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">قیمت (PKR):</label>
                  <input
                    type="number"
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">پیکنگ سائز:</label>
                  <input
                    type="text"
                    value={formPackSize}
                    onChange={(e) => setFormPackSize(e.target.value)}
                    placeholder="250 ml / 50 Kg"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  محکمہ زراعت رجسٹریشن نمبر:
                </label>
                <input
                  type="text"
                  value={formRegNo}
                  onChange={(e) => setFormRegNo(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">تفصیل و فوائد:</label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 font-urdu text-right"
                  dir="rtl"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-bold"
                >
                  منسوخ کریں
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold"
                >
                  سٹور میں شائع کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
