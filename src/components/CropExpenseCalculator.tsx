/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import {
  Calculator,
  Sprout,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Layers,
  Droplets,
  Fuel,
  Share2,
  Printer,
  ShoppingBag,
  Sparkles,
  Info,
  CheckCircle2,
  ArrowRight,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Percent,
  Wheat,
} from 'lucide-react';

interface ExpenseItem {
  id: string;
  nameUrdu: string;
  nameEn: string;
  category: 'prep' | 'seed' | 'fert' | 'water' | 'spray' | 'harvest' | 'mandi' | 'land';
  quantityPerAcre: number;
  unitUrdu: string;
  unitPrice: number;
}

interface CropPreset {
  id: string;
  nameUrdu: string;
  nameEn: string;
  seasonUrdu: string;
  defaultYieldMaund: number;
  defaultMandiPrice: number;
  recommendedItems: ExpenseItem[];
}

const CROP_PRESETS: CropPreset[] = [
  {
    id: 'wheat',
    nameUrdu: 'گندم (Wheat)',
    nameEn: 'Wheat (گندم)',
    seasonUrdu: 'ربیع فصل (نومبر تا اپریل)',
    defaultYieldMaund: 50,
    defaultMandiPrice: 4200,
    recommendedItems: [
      { id: 'hal', nameUrdu: 'ہل و سہاگہ (3 چکر)', nameEn: 'Ploughing (3 passes)', category: 'prep', quantityPerAcre: 3, unitUrdu: 'چکر', unitPrice: 1800 },
      { id: 'rotavator', nameUrdu: 'روٹاویٹر', nameEn: 'Rotavator', category: 'prep', quantityPerAcre: 1, unitUrdu: 'مرتبہ', unitPrice: 3200 },
      { id: 'laser', nameUrdu: 'لیزر لیولنگ (حصہ)', nameEn: 'Laser Leveling', category: 'prep', quantityPerAcre: 1, unitUrdu: 'مرتبہ', unitPrice: 2000 },
      { id: 'seed', nameUrdu: 'تصدیق شدہ بیج (دلکش/عروج)', nameEn: 'Certified Wheat Seed', category: 'seed', quantityPerAcre: 50, unitUrdu: 'کلو', unitPrice: 120 },
      { id: 'seed_treatment', nameUrdu: 'بیج کی زہر آلودگی', nameEn: 'Fungicide Seed Treatment', category: 'seed', quantityPerAcre: 1, unitUrdu: 'پیک', unitPrice: 900 },
      { id: 'sowing', nameUrdu: 'ڈرل بجائی مزدوری', nameEn: 'Drill Sowing Labor', category: 'seed', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 2500 },
      { id: 'dap', nameUrdu: 'ڈی اے پی کھاد (DAP)', nameEn: 'DAP Fertilizer', category: 'fert', quantityPerAcre: 1.5, unitUrdu: 'بوری', unitPrice: 12500 },
      { id: 'urea', nameUrdu: 'یوریا کھاد (Urea)', nameEn: 'Urea Fertilizer', category: 'fert', quantityPerAcre: 2.5, unitUrdu: 'بوری', unitPrice: 4600 },
      { id: 'sop', nameUrdu: 'پوٹاش کھاد (SOP/MOP)', nameEn: 'Potash (SOP)', category: 'fert', quantityPerAcre: 0.5, unitUrdu: 'بوری', unitPrice: 14500 },
      { id: 'zinc', nameUrdu: 'زنک سلفیٹ (33%)', nameEn: 'Zinc Sulfate', category: 'fert', quantityPerAcre: 6, unitUrdu: 'کلو', unitPrice: 350 },
      { id: 'irrigation_canal', nameUrdu: 'نہری پانی آبیانہ', nameEn: 'Canal Abiana', category: 'water', quantityPerAcre: 1, unitUrdu: 'فصل', unitPrice: 800 },
      { id: 'tubewell', nameUrdu: 'ٹیوب ویل پانی (3 سیرابیاں)', nameEn: 'Tube-well Runs (3 passes)', category: 'water', quantityPerAcre: 12, unitUrdu: 'گھنٹے', unitPrice: 1600 },
      { id: 'weedicide', nameUrdu: 'چوڑے و نوکیلے پتوں کا جڑی بوٹی مار سپرے', nameEn: 'Broadleaf & Grassy Weedicide', category: 'spray', quantityPerAcre: 1, unitUrdu: 'پیک', unitPrice: 3800 },
      { id: 'fungicide_rust', nameUrdu: 'کنگی و رسٹ بچاؤ فنگس کش سپرے', nameEn: 'Rust Prevention Fungicide', category: 'spray', quantityPerAcre: 1, unitUrdu: 'پیک', unitPrice: 2800 },
      { id: 'spray_labor', nameUrdu: 'سپرے مزدوری', nameEn: 'Spray Labor', category: 'spray', quantityPerAcre: 2, unitUrdu: 'سپرے', unitPrice: 700 },
      { id: 'harvesting', nameUrdu: 'کمبائن ہارویسٹر کٹائی و گہائی', nameEn: 'Combine Harvester', category: 'harvest', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 7500 },
      { id: 'carriage', nameUrdu: 'ٹرالی کرایہ منڈی تک', nameEn: 'Trolley Carriage to Mandi', category: 'mandi', quantityPerAcre: 50, unitUrdu: 'من', unitPrice: 80 },
      { id: 'bardana', nameUrdu: 'باردانہ و پلے داری و منڈی اخراجات', nameEn: 'Bags & Mandi Handling', category: 'mandi', quantityPerAcre: 50, unitUrdu: 'من', unitPrice: 60 },
    ],
  },
  {
    id: 'cotton',
    nameUrdu: 'کپاس (Cotton)',
    nameEn: 'Cotton (کپاس)',
    seasonUrdu: 'خریف فصل (مئی تا دسمبر)',
    defaultYieldMaund: 35,
    defaultMandiPrice: 8400,
    recommendedItems: [
      { id: 'hal', nameUrdu: 'گہرا ہل و سہاگہ', nameEn: 'Deep Ploughing', category: 'prep', quantityPerAcre: 4, unitUrdu: 'چکر', unitPrice: 1800 },
      { id: 'rotavator', nameUrdu: 'روٹاویٹر و بیڈ میکر', nameEn: 'Bed/Ridge Maker', category: 'prep', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 4000 },
      { id: 'seed', nameUrdu: 'بی ٹی ہائبرڈ کپاس بیج', nameEn: 'BT Hybrid Cotton Seed', category: 'seed', quantityPerAcre: 6, unitUrdu: 'کلو', unitPrice: 1100 },
      { id: 'seed_sowing', nameUrdu: 'کھیلیوں پر چوپہ لگانے کی مزدوری', nameEn: 'Manual Planting on Ridges', category: 'seed', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 3500 },
      { id: 'dap', nameUrdu: 'ڈی اے پی کھاد', nameEn: 'DAP Fertilizer', category: 'fert', quantityPerAcre: 1.5, unitUrdu: 'بوری', unitPrice: 12500 },
      { id: 'urea', nameUrdu: 'یوریا کھاد (اقساط میں)', nameEn: 'Urea (split)', category: 'fert', quantityPerAcre: 3.5, unitUrdu: 'بوری', unitPrice: 4600 },
      { id: 'potash', nameUrdu: 'پوٹاشیم نائٹریٹ/SOP سپرے و فلڈ', nameEn: 'Potash for Boll Development', category: 'fert', quantityPerAcre: 1, unitUrdu: 'بوری', unitPrice: 14000 },
      { id: 'tubewell', nameUrdu: 'آبپاشی و ٹیوب ویل خرچہ', nameEn: 'Irrigation & Tubewell Fuel', category: 'water', quantityPerAcre: 20, unitUrdu: 'گھنٹے', unitPrice: 1600 },
      { id: 'sucking_pest', nameUrdu: 'سفید مکھی و سبز تیلہ سپرے (3 راؤنڈ)', nameEn: 'Whitefly & Jassid Sprays (3x)', category: 'spray', quantityPerAcre: 3, unitUrdu: 'سپرے', unitPrice: 3400 },
      { id: 'bollworm_spray', nameUrdu: 'گلابی سنڈی کنٹرول سپرے', nameEn: 'Pink Bollworm Defense', category: 'spray', quantityPerAcre: 2, unitUrdu: 'سپرے', unitPrice: 4200 },
      { id: 'spray_labor', nameUrdu: 'سپرے کروانے کی مزدوری', nameEn: 'Spray Application Labor', category: 'spray', quantityPerAcre: 5, unitUrdu: 'سپرے', unitPrice: 750 },
      { id: 'picking', nameUrdu: 'کپاس چنائی مزدوری (4 چنائیاں)', nameEn: 'Cotton Picking Labor', category: 'harvest', quantityPerAcre: 35, unitUrdu: 'من', unitPrice: 900 },
      { id: 'carriage', nameUrdu: 'منڈی ٹرانسپورٹ و باردانہ', nameEn: 'Mandi Transport & Bags', category: 'mandi', quantityPerAcre: 35, unitUrdu: 'من', unitPrice: 150 },
    ],
  },
  {
    id: 'rice',
    nameUrdu: 'دھان / باسمتی چاول (Rice)',
    nameEn: 'Basmati Rice (چاول)',
    seasonUrdu: 'خریف فصل (جون تا نومبر)',
    defaultYieldMaund: 45,
    defaultMandiPrice: 4800,
    recommendedItems: [
      { id: 'puddle', nameUrdu: 'کدو کرنا و زمین تیاری (Puddling)', nameEn: 'Puddling & Land Prep', category: 'prep', quantityPerAcre: 3, unitUrdu: 'چکر', unitPrice: 2500 },
      { id: 'nursery', nameUrdu: 'پنیری کی تیاری و اکھاڑنا', nameEn: 'Nursery Growing & Lifting', category: 'seed', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 5500 },
      { id: 'transplant', nameUrdu: 'دھان پنیری لگانے کی لیبر', nameEn: 'Manual Rice Transplantation', category: 'seed', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 6500 },
      { id: 'dap', nameUrdu: 'ڈی اے پی کھاد', nameEn: 'DAP Fertilizer', category: 'fert', quantityPerAcre: 1, unitUrdu: 'بوری', unitPrice: 12500 },
      { id: 'urea', nameUrdu: 'یوریا کھاد', nameEn: 'Urea Fertilizer', category: 'fert', quantityPerAcre: 3, unitUrdu: 'بوری', unitPrice: 4600 },
      { id: 'zinc', nameUrdu: 'زنک سلفیٹ (ہلدی/پتوں کا سوکھنا)', nameEn: 'Zinc Sulfate (Khaira cure)', category: 'fert', quantityPerAcre: 10, unitUrdu: 'کلو', unitPrice: 320 },
      { id: 'tubewell', nameUrdu: 'مسلسل کھڑا پانی (ٹیوب ویل ایندھن)', nameEn: 'Ponding Irrigation Hours', category: 'water', quantityPerAcre: 24, unitUrdu: 'گھنٹے', unitPrice: 1600 },
      { id: 'borer_spray', nameUrdu: 'تنے کی سنڈی دانے دار زہر (Cartap/Fipronil)', nameEn: 'Stem Borer Granules', category: 'spray', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 3200 },
      { id: 'blast_spray', nameUrdu: 'بیکٹیریل بلاسٹ و جھلساؤ فنگس کش', nameEn: 'Blast / Blight Fungicide', category: 'spray', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 3400 },
      { id: 'harvest', nameUrdu: 'رائس ہارویسٹر کٹائی', nameEn: 'Rice Harvester', category: 'harvest', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 8000 },
      { id: 'carriage', nameUrdu: 'منڈی ترسیل و اترائی', nameEn: 'Mandi Transport & Labor', category: 'mandi', quantityPerAcre: 45, unitUrdu: 'من', unitPrice: 120 },
    ],
  },
  {
    id: 'maize',
    nameUrdu: 'مکئی (Maize/Corn)',
    nameEn: 'Hybrid Maize (مکئی)',
    seasonUrdu: 'بہاریہ / خریف مکئی',
    defaultYieldMaund: 90,
    defaultMandiPrice: 2800,
    recommendedItems: [
      { id: 'prep', nameUrdu: 'ہل، روٹاویٹر و رجر بیڈز', nameEn: 'Plough, Rotavator & Ridger', category: 'prep', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 7500 },
      { id: 'seed', nameUrdu: 'ہائبرڈ مکئی بیج (Pioneer/DK)', nameEn: 'High Yield Hybrid Seed', category: 'seed', quantityPerAcre: 8, unitUrdu: 'کلو', unitPrice: 1800 },
      { id: 'sowing', nameUrdu: 'مکئی چوپہ مزدوری', nameEn: 'Manual Planting Labor', category: 'seed', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 3500 },
      { id: 'dap', nameUrdu: 'ڈی اے پی کھاد', nameEn: 'DAP Fertilizer', category: 'fert', quantityPerAcre: 2, unitUrdu: 'بوری', unitPrice: 12500 },
      { id: 'urea', nameUrdu: 'یوریا کھاد (4 اقساط)', nameEn: 'Urea (4 splits)', category: 'fert', quantityPerAcre: 4, unitUrdu: 'بوری', unitPrice: 4600 },
      { id: 'potash', nameUrdu: 'پوٹاش کھاد', nameEn: 'Potash SOP', category: 'fert', quantityPerAcre: 1, unitUrdu: 'بوری', unitPrice: 14500 },
      { id: 'tubewell', nameUrdu: 'ٹیوب ویل پانی (6 سیرابیاں)', nameEn: 'Tubewell Irrigation Hours', category: 'water', quantityPerAcre: 18, unitUrdu: 'گھنٹے', unitPrice: 1600 },
      { id: 'fall_armyworm', nameUrdu: 'فال آرمی ورم اور جڑی بوٹی کنٹرول', nameEn: 'Fall Armyworm & Weed Spray', category: 'spray', quantityPerAcre: 2, unitUrdu: 'سپرے', unitPrice: 3200 },
      { id: 'harvest', nameUrdu: 'مکئی ہارویسٹر و دانہ نکالنا', nameEn: 'Combine Sheller Harvest', category: 'harvest', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 9500 },
      { id: 'carriage', nameUrdu: 'منڈی ٹرانسپورٹ و باردانہ', nameEn: 'Carriage to Mandi', category: 'mandi', quantityPerAcre: 90, unitUrdu: 'من', unitPrice: 65 },
    ],
  },
  {
    id: 'sugarcane',
    nameUrdu: 'کماد / گنا (Sugarcane)',
    nameEn: 'Sugarcane (کماد)',
    seasonUrdu: 'سالانہ فصل (12 تا 14 ماہ)',
    defaultYieldMaund: 850,
    defaultMandiPrice: 450,
    recommendedItems: [
      { id: 'prep', nameUrdu: 'گہرا چزل ہل، روٹاویٹر و 4 فٹ ٹرینچز', nameEn: 'Deep Chiseling & Trenches', category: 'prep', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 11000 },
      { id: 'seed', nameUrdu: 'کماد بیج سمے (100 تا 120 من)', nameEn: 'Sugarcane Seed Setts', category: 'seed', quantityPerAcre: 100, unitUrdu: 'من', unitPrice: 450 },
      { id: 'sowing', nameUrdu: 'سمے کٹائی، بجائی و مٹی چڑھانا', nameEn: 'Sett Cutting & Earthing-up', category: 'seed', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 7500 },
      { id: 'dap', nameUrdu: 'ڈی اے پی کھاد', nameEn: 'DAP Fertilizer', category: 'fert', quantityPerAcre: 2, unitUrdu: 'بوری', unitPrice: 12500 },
      { id: 'urea', nameUrdu: 'یوریا کھاد (پوری مدت میں)', nameEn: 'Urea (Full Season)', category: 'fert', quantityPerAcre: 6, unitUrdu: 'بوری', unitPrice: 4600 },
      { id: 'potash', nameUrdu: 'پوٹاش کھاد وزن و مٹھاس کیلئے', nameEn: 'Potash for Weight & Sugar', category: 'fert', quantityPerAcre: 1.5, unitUrdu: 'بوری', unitPrice: 14500 },
      { id: 'tubewell', nameUrdu: 'سال بھر کے ٹیوب ویل چکر (پانی)', nameEn: 'Annual Irrigation Runs', category: 'water', quantityPerAcre: 35, unitUrdu: 'گھنٹے', unitPrice: 1600 },
      { id: 'borer_spray', nameUrdu: 'گورداسپور بورر و دیمک زہر', nameEn: 'Termite & Borer Drenching', category: 'spray', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 5500 },
      { id: 'harvest', nameUrdu: 'گنا چھلائی و لوڈنگ مزدوری', nameEn: 'Cane Harvesting & Loading', category: 'harvest', quantityPerAcre: 850, unitUrdu: 'من', unitPrice: 45 },
      { id: 'carriage', nameUrdu: 'شوگر مل ترسیل ٹرالی کرایہ', nameEn: 'Sugar Mill Transport', category: 'mandi', quantityPerAcre: 850, unitUrdu: 'من', unitPrice: 35 },
    ],
  },
  {
    id: 'potato',
    nameUrdu: 'آلو (Potato)',
    nameEn: 'Autumn Potato (آلو)',
    seasonUrdu: 'سرمائی فصل (اکتوبر تا جنوری)',
    defaultYieldMaund: 280,
    defaultMandiPrice: 1600,
    recommendedItems: [
      { id: 'prep', nameUrdu: 'گہری زمین تیاری و رجز', nameEn: 'Deep Tillage & Bed Making', category: 'prep', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 9000 },
      { id: 'seed', nameUrdu: 'آلو تصدیق شدہ درآمدی/مقامی بیج', nameEn: 'Certified Seed Tubers', category: 'seed', quantityPerAcre: 28, unitUrdu: 'بوری', unitPrice: 3800 },
      { id: 'sowing', nameUrdu: 'پوٹیٹو پلانٹر بجائی مزدوری', nameEn: 'Potato Planter Sowing', category: 'seed', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 5000 },
      { id: 'dap', nameUrdu: 'ڈی اے پی کھاد', nameEn: 'DAP Fertilizer', category: 'fert', quantityPerAcre: 3, unitUrdu: 'بوری', unitPrice: 12500 },
      { id: 'urea', nameUrdu: 'یوریا کھاد', nameEn: 'Urea Fertilizer', category: 'fert', quantityPerAcre: 4, unitUrdu: 'بوری', unitPrice: 4600 },
      { id: 'sop', nameUrdu: 'سلفیٹ آف پوٹاش (SOP)', nameEn: 'SOP Potash Fertilizer', category: 'fert', quantityPerAcre: 2.5, unitUrdu: 'بوری', unitPrice: 14500 },
      { id: 'tubewell', nameUrdu: 'ہفتہ وار آبپاشی و ٹیوب ویل', nameEn: 'Weekly Irrigation Runs', category: 'water', quantityPerAcre: 20, unitUrdu: 'گھنٹے', unitPrice: 1600 },
      { id: 'blight_spray', nameUrdu: 'اگیتا و پچھیتا جھلساؤ سپرے (Early/Late Blight)', nameEn: 'Early/Late Blight Sprays', category: 'spray', quantityPerAcre: 4, unitUrdu: 'سپرے', unitPrice: 3200 },
      { id: 'harvest', nameUrdu: 'پوٹیٹو ڈگر و چنائی مزدور', nameEn: 'Digger & Picking Labor', category: 'harvest', quantityPerAcre: 1, unitUrdu: 'ایکڑ', unitPrice: 14000 },
      { id: 'bags', nameUrdu: 'ریڈ جالی دار تھیلے و سلائی', nameEn: 'Red Mesh Bags & Stitching', category: 'mandi', quantityPerAcre: 110, unitUrdu: 'تھیلے', unitPrice: 75 },
    ],
  },
];

export const CropExpenseCalculator: React.FC = () => {
  const { language, currentUser, setActiveTab, showNotification, addNotification } = useApp();

  // Basic Setup State
  const [selectedCropId, setSelectedCropId] = useState<string>('wheat');
  const [acres, setAcres] = useState<number>(5);
  const [landTenure, setLandTenure] = useState<'own' | 'theka'>('own');
  const [thekaPerAcre, setThekaPerAcre] = useState<number>(75000); // PKR per year/crop
  const [irrigationType, setIrrigationType] = useState<'mixed' | 'canal' | 'tubewell'>('mixed');
  const [budgetStrategy, setBudgetStrategy] = useState<'recommended' | 'economic' | 'high_yield'>('recommended');

  const selectedCrop = useMemo(() => {
    return CROP_PRESETS.find((c) => c.id === selectedCropId) || CROP_PRESETS[0];
  }, [selectedCropId]);

  // Editable Items per acre
  const [items, setItems] = useState<ExpenseItem[]>(selectedCrop.recommendedItems);
  const [expectedYieldMaund, setExpectedYieldMaund] = useState<number>(selectedCrop.defaultYieldMaund);
  const [expectedMandiPrice, setExpectedMandiPrice] = useState<number>(selectedCrop.defaultMandiPrice);
  const [showAdvancedItems, setShowAdvancedItems] = useState<boolean>(true);

  // When crop changes, re-initialize items and defaults
  const handleSelectCrop = (cropId: string) => {
    const crop = CROP_PRESETS.find((c) => c.id === cropId) || CROP_PRESETS[0];
    setSelectedCropId(cropId);
    setExpectedYieldMaund(crop.defaultYieldMaund);
    setExpectedMandiPrice(crop.defaultMandiPrice);
    setItems(crop.recommendedItems);
  };

  // Adjust Strategy Multipliers
  const handleStrategyChange = (strat: 'recommended' | 'economic' | 'high_yield') => {
    setBudgetStrategy(strat);
    const baseItems = selectedCrop.recommendedItems;

    if (strat === 'economic') {
      // 15% less fertilizer & inputs, standard yield
      setItems(
        baseItems.map((item) => {
          if (item.category === 'fert' || item.category === 'spray') {
            return { ...item, quantityPerAcre: parseFloat((item.quantityPerAcre * 0.8).toFixed(1)) };
          }
          return item;
        })
      );
      setExpectedYieldMaund(Math.round(selectedCrop.defaultYieldMaund * 0.88));
      showNotification('کم خرچ اور بچت والا پلان لاگو کر دیا گیا۔');
    } else if (strat === 'high_yield') {
      // 25% higher inputs for target bumper harvest
      setItems(
        baseItems.map((item) => {
          if (item.category === 'fert' || item.category === 'spray') {
            return { ...item, quantityPerAcre: parseFloat((item.quantityPerAcre * 1.25).toFixed(1)) };
          }
          return item;
        })
      );
      setExpectedYieldMaund(Math.round(selectedCrop.defaultYieldMaund * 1.2));
      showNotification('زیادہ پیداوار (بمپر کراپ) کا فارمولا لاگو ہو گیا۔');
    } else {
      setItems(selectedCrop.recommendedItems);
      setExpectedYieldMaund(selectedCrop.defaultYieldMaund);
      showNotification('محکمہ زراعت پنجاب کی مستند سفارشات لاگو ہو گئیں۔');
    }
  };

  // Update single item
  const updateItem = (id: string, field: 'quantityPerAcre' | 'unitPrice', val: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: Math.max(0, val) } : item))
    );
  };

  // Calculations
  const calculations = useMemo(() => {
    // Sum of items per acre
    const itemsCostPerAcre = items.reduce((sum, item) => sum + item.quantityPerAcre * item.unitPrice, 0);

    // Land rent if theka
    const landRentPerAcre = landTenure === 'theka' ? thekaPerAcre : 0;

    const totalCostPerAcre = Math.round(itemsCostPerAcre + landRentPerAcre);
    const totalFieldCost = Math.round(totalCostPerAcre * acres);

    // Production & Revenue
    const totalYieldMaunds = Math.round(expectedYieldMaund * acres);
    const grossRevenue = Math.round(totalYieldMaunds * expectedMandiPrice);
    const grossRevenuePerAcre = Math.round(expectedYieldMaund * expectedMandiPrice);

    // Net Profit & Margins
    const netProfit = grossRevenue - totalFieldCost;
    const netProfitPerAcre = grossRevenuePerAcre - totalCostPerAcre;
    const returnOnInvestment = totalFieldCost > 0 ? ((netProfit / totalFieldCost) * 100).toFixed(1) : '0';

    // Break-even price per maund
    const breakEvenPrice = expectedYieldMaund > 0 ? Math.round(totalCostPerAcre / expectedYieldMaund) : 0;

    // Categorized sub-totals per acre
    const prepCost = items.filter((i) => i.category === 'prep').reduce((s, i) => s + i.quantityPerAcre * i.unitPrice, 0);
    const seedCost = items.filter((i) => i.category === 'seed').reduce((s, i) => s + i.quantityPerAcre * i.unitPrice, 0);
    const fertCost = items.filter((i) => i.category === 'fert').reduce((s, i) => s + i.quantityPerAcre * i.unitPrice, 0);
    const waterCost = items.filter((i) => i.category === 'water').reduce((s, i) => s + i.quantityPerAcre * i.unitPrice, 0);
    const sprayCost = items.filter((i) => i.category === 'spray').reduce((s, i) => s + i.quantityPerAcre * i.unitPrice, 0);
    const harvestCost = items.filter((i) => i.category === 'harvest').reduce((s, i) => s + i.quantityPerAcre * i.unitPrice, 0);
    const mandiCost = items.filter((i) => i.category === 'mandi').reduce((s, i) => s + i.quantityPerAcre * i.unitPrice, 0);

    return {
      itemsCostPerAcre,
      landRentPerAcre,
      totalCostPerAcre,
      totalFieldCost,
      totalYieldMaunds,
      grossRevenue,
      grossRevenuePerAcre,
      netProfit,
      netProfitPerAcre,
      returnOnInvestment,
      breakEvenPrice,
      categories: {
        prepCost,
        seedCost,
        fertCost,
        waterCost,
        sprayCost,
        harvestCost,
        mandiCost,
      },
    };
  }, [items, acres, landTenure, thekaPerAcre, expectedYieldMaund, expectedMandiPrice]);

  // Share calculation summary to WhatsApp
  const handleShareWhatsApp = () => {
    const text = `🌾 *ZARIBOOK فصل خرچہ و متوقع منافع رپورٹ*
📍 فصل: *${selectedCrop.nameUrdu}*
🌱 رقبہ: *${acres} ایکڑ* (${landTenure === 'theka' ? 'ٹھیکہ پر' : 'ذاتی زمین'})
---
💰 *کل خرچہ فی ایکڑ:* Rs. ${calculations.totalCostPerAcre.toLocaleString()}
💵 *پورے ${acres} ایکڑ کا کل خرچہ:* Rs. ${calculations.totalFieldCost.toLocaleString()}
🌾 *متوقع پیداوار:* ${calculations.totalYieldMaunds.toLocaleString()} من (${expectedYieldMaund} من/ایکڑ)
📈 *منڈی ریٹ تخمینہ:* Rs. ${expectedMandiPrice.toLocaleString()} فی من
💵 *کل متوقع آمدن:* Rs. ${calculations.grossRevenue.toLocaleString()}
✅ *خالص منافع / بچت:* *Rs. ${calculations.netProfit.toLocaleString()}*
📊 *منافع فی ایکڑ:* Rs. ${calculations.netProfitPerAcre.toLocaleString()}
⚖️ *بریک ایون ریٹ:* Rs. ${calculations.breakEvenPrice.toLocaleString()} فی من
---
تیار کردہ بذریعہ ZARIBOOK ایگری کنیکٹ ایپ`;

    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/?text=${encoded}`, '_blank');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header Card */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Calculator className="w-5 h-5 text-lime-300" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-stone-900 flex items-center gap-2">
                <span>{language === 'ur' ? 'زرعی فصل خرچہ و منافع کیلکولیٹر' : 'Crop Expense & Profit Calculator'}</span>
                <span className="text-xs bg-emerald-100 text-emerald-900 px-2 py-0.5 rounded font-bold border border-emerald-300">
                  2026 ریٹس
                </span>
              </h2>
              <p className="text-xs text-stone-500">
                {language === 'ur'
                  ? 'مقامی منڈی اور مارکیٹ کے موجودہ نرخوں کے مطابق فی ایکڑ اور پورے رقبے کی لاگت و خالص بچت کا درست تخمینہ'
                  : 'Accurate per-acre and field budget planner synchronized with real Punjab market rates'}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={handleShareWhatsApp}
            className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            title="واٹس ایپ پر شیئر کریں"
          >
            <Share2 className="w-4 h-4 text-lime-300" />
            <span>{language === 'ur' ? 'واٹس ایپ شیئر' : 'WhatsApp'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs border border-stone-300 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden sm:inline">{language === 'ur' ? 'پرنٹ' : 'Print'}</span>
          </button>
        </div>
      </div>

      {/* Crop Selector Horizontal Tabs */}
      <div className="bg-white rounded-2xl p-3 border border-stone-200 shadow-xs">
        <label className="text-xs font-bold text-stone-600 block mb-2 px-1">
          {language === 'ur' ? '1. فصل منتخب کریں (Select Crop):' : '1. Select Crop:'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {CROP_PRESETS.map((crop) => {
            const isSelected = selectedCropId === crop.id;
            return (
              <button
                key={crop.id}
                onClick={() => handleSelectCrop(crop.id)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-sm ring-2 ring-emerald-500/20'
                    : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                <Sprout className={`w-5 h-5 mb-1 ${isSelected ? 'text-lime-300' : 'text-emerald-700'}`} />
                <span className="font-extrabold text-xs">{crop.nameUrdu.split('(')[0]}</span>
                <span className={`text-[10px] ${isSelected ? 'text-emerald-200' : 'text-stone-400'}`}>
                  {crop.nameEn.split('(')[0]}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Configuration Grid: Acres, Land Tenure, Strategy */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Acres Input */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
          <label className="text-xs font-bold text-stone-700 block">
            {language === 'ur' ? '2. رقبہ (ایکڑ میں):' : '2. Field Size (Acres):'}
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              max="1000"
              value={acres}
              onChange={(e) => setAcres(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-24 px-3 py-2 rounded-xl border border-stone-300 font-black text-lg text-stone-900 text-center focus:ring-2 focus:ring-emerald-600 focus:outline-none"
            />
            <span className="text-sm font-bold text-stone-600 font-urdu">ایکڑ</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[1, 2, 5, 10, 15, 25, 50].map((num) => (
              <button
                key={num}
                onClick={() => setAcres(num)}
                className={`px-2 py-1 rounded-lg text-xs font-bold border transition-colors ${
                  acres === num
                    ? 'bg-emerald-700 text-white border-emerald-800'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                }`}
              >
                {num} ایکڑ
              </button>
            ))}
          </div>
        </div>

        {/* Land Ownership / Lease (Theka) */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
          <label className="text-xs font-bold text-stone-700 block">
            {language === 'ur' ? '3. زمین کی ملکیت:' : '3. Land Ownership:'}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => setLandTenure('own')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors text-center ${
                landTenure === 'own'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              {language === 'ur' ? 'ذاتی ملکیت (Own)' : 'Own Land'}
            </button>
            <button
              onClick={() => setLandTenure('theka')}
              className={`py-2 px-3 rounded-xl text-xs font-bold border transition-colors text-center ${
                landTenure === 'theka'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              {language === 'ur' ? 'ٹھیکہ پر (Lease)' : 'Rented / Theka'}
            </button>
          </div>
          {landTenure === 'theka' && (
            <div className="pt-1 space-y-1">
              <span className="text-[11px] text-stone-500 font-urdu block">ٹھیکہ فی ایکڑ (روپے):</span>
              <input
                type="number"
                step="5000"
                value={thekaPerAcre}
                onChange={(e) => setThekaPerAcre(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-1.5 rounded-lg border border-stone-300 font-bold text-xs"
              />
            </div>
          )}
        </div>

        {/* Strategy Preset */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-3">
          <label className="text-xs font-bold text-stone-700 block">
            {language === 'ur' ? '4. حکمت عملی و زرعی پیکیج:' : '4. Farming Strategy:'}
          </label>
          <div className="flex flex-col gap-1.5">
            <button
              onClick={() => handleStrategyChange('recommended')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold border text-left transition-colors flex items-center justify-between ${
                budgetStrategy === 'recommended'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              <span>{language === 'ur' ? 'محکمہ زراعت کی سفارشات' : 'Dept Recommendations'}</span>
              <CheckCircle2 className={`w-3.5 h-3.5 ${budgetStrategy === 'recommended' ? 'text-lime-300' : 'text-stone-300'}`} />
            </button>

            <button
              onClick={() => handleStrategyChange('economic')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold border text-left transition-colors flex items-center justify-between ${
                budgetStrategy === 'economic'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              <span>{language === 'ur' ? 'کم خرچ و بچت منصوبہ' : 'Economic / Low Budget'}</span>
              <CheckCircle2 className={`w-3.5 h-3.5 ${budgetStrategy === 'economic' ? 'text-lime-300' : 'text-stone-300'}`} />
            </button>

            <button
              onClick={() => handleStrategyChange('high_yield')}
              className={`py-1.5 px-3 rounded-xl text-xs font-bold border text-left transition-colors flex items-center justify-between ${
                budgetStrategy === 'high_yield'
                  ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
            >
              <span>{language === 'ur' ? 'زیادہ پیداوار (بمپر کراپ)' : 'High Yield Target'}</span>
              <CheckCircle2 className={`w-3.5 h-3.5 ${budgetStrategy === 'high_yield' ? 'text-lime-300' : 'text-stone-300'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Financial Summary KPI Cards (Primary Highlight) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Card 1: Cost per Acre */}
        <div className="bg-stone-900 text-white rounded-2xl p-4 shadow-sm border border-stone-800">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-1">
            <span>{language === 'ur' ? 'فی ایکڑ کل خرچہ' : 'Total Cost / Acre'}</span>
            <DollarSign className="w-4 h-4 text-amber-400" />
          </div>
          <div className="font-black text-xl sm:text-2xl text-white">
            Rs. {calculations.totalCostPerAcre.toLocaleString()}
          </div>
          <p className="text-[11px] text-stone-400 mt-1">
            {acres} ایکڑ کا خرچہ: Rs. {calculations.totalFieldCost.toLocaleString()}
          </p>
        </div>

        {/* Card 2: Expected Revenue */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>{language === 'ur' ? 'کل متوقع آمدن' : 'Gross Revenue'}</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="font-black text-xl sm:text-2xl text-emerald-800">
            Rs. {calculations.grossRevenue.toLocaleString()}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            {calculations.totalYieldMaunds.toLocaleString()} من @ Rs. {expectedMandiPrice.toLocaleString()}
          </p>
        </div>

        {/* Card 3: Net Profit */}
        <div className={`rounded-2xl p-4 shadow-sm border ${
          calculations.netProfit >= 0
            ? 'bg-emerald-900 text-white border-emerald-950'
            : 'bg-rose-900 text-white border-rose-950'
        }`}>
          <div className="flex items-center justify-between text-emerald-200 text-xs mb-1">
            <span>{language === 'ur' ? 'خالص منافع / بچت' : 'Net Profit (Bachat)'}</span>
            <Sparkles className="w-4 h-4 text-lime-300" />
          </div>
          <div className="font-black text-xl sm:text-2xl text-white">
            Rs. {calculations.netProfit.toLocaleString()}
          </div>
          <p className="text-[11px] text-emerald-200 mt-1">
            فی ایکڑ منافع: Rs. {calculations.netProfitPerAcre.toLocaleString()} (ROI: {calculations.returnOnInvestment}%)
          </p>
        </div>

        {/* Card 4: Break Even Price */}
        <div className="bg-white rounded-2xl p-4 shadow-xs border border-stone-200">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>{language === 'ur' ? 'نقصان سے بچاؤ ریٹ' : 'Break-Even Price'}</span>
            <Percent className="w-4 h-4 text-blue-600" />
          </div>
          <div className="font-black text-xl sm:text-2xl text-stone-900">
            Rs. {calculations.breakEvenPrice.toLocaleString()}
          </div>
          <p className="text-[11px] text-stone-500 mt-1">
            اس سے اوپر کا ہر روپیہ خالص منافع ہے
          </p>
        </div>
      </div>

      {/* Yield & Mandi Rate Target Tuning */}
      <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center font-bold">
            <Wheat className="w-5 h-5 text-amber-800" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-stone-900">
              {language === 'ur' ? 'پیداوار اور منڈی فروخت ریٹ کی ایڈجسٹمنٹ:' : 'Yield & Mandi Selling Price:'}
            </h4>
            <span className="text-xs text-stone-500">
              {language === 'ur' ? 'آپ اپنی زمین کے تجربے کے مطابق متوقع پیداوار تبدیل کر سکتے ہیں' : 'Adjust according to field history'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
          {/* Yield */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600 font-urdu">متوقع پیداوار:</span>
            <div className="flex items-center gap-1 bg-white border border-stone-300 rounded-lg px-2 py-1">
              <input
                type="number"
                value={expectedYieldMaund}
                onChange={(e) => setExpectedYieldMaund(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-14 text-center font-bold text-xs focus:outline-none"
              />
              <span className="text-xs font-semibold text-stone-500">من/ایکڑ</span>
            </div>
          </div>

          {/* Mandi Rate */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-600 font-urdu">مارکیٹ ریٹ:</span>
            <div className="flex items-center gap-1 bg-white border border-stone-300 rounded-lg px-2 py-1">
              <input
                type="number"
                step="50"
                value={expectedMandiPrice}
                onChange={(e) => setExpectedMandiPrice(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-16 text-center font-bold text-xs focus:outline-none"
              />
              <span className="text-xs font-semibold text-stone-500">روپے/من</span>
            </div>
          </div>

          {/* Jump to Mandi Board */}
          <button
            onClick={() => setActiveTab('mandi')}
            className="text-xs text-emerald-800 hover:text-emerald-950 font-bold flex items-center gap-1 underline cursor-pointer"
          >
            <span>منڈی ریٹ بورڈ دیکھیں</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Detailed Expense Breakdown Table (Interactive) */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
        <div
          onClick={() => setShowAdvancedItems(!showAdvancedItems)}
          className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between cursor-pointer hover:bg-stone-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-800" />
            <h3 className="font-extrabold text-sm text-stone-900">
              {language === 'ur' ? 'تفصیلی اخراجات کی فہرست (فی ایکڑ قیمت اور مقدار خود تبدیل کریں)' : 'Detailed Per-Acre Expense Sheet'}
            </h3>
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-stone-600">
            <span>{showAdvancedItems ? 'فہرست چھپائیں' : 'فہرست کھولیں'}</span>
            {showAdvancedItems ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>

        {showAdvancedItems && (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-right">
              <thead className="bg-stone-100 text-stone-700 font-bold border-b border-stone-200">
                <tr>
                  <th className="p-3 text-right">مد / خرچہ (Expense Item)</th>
                  <th className="p-3 text-center">مقدار فی ایکڑ</th>
                  <th className="p-3 text-center">یونٹ</th>
                  <th className="p-3 text-center">ریٹ (روپے)</th>
                  <th className="p-3 text-center">فی ایکڑ لاگت</th>
                  <th className="p-3 text-left">{acres} ایکڑ کی لاگت</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {items.map((item) => {
                  const itemCostAcre = Math.round(item.quantityPerAcre * item.unitPrice);
                  const itemCostField = Math.round(itemCostAcre * acres);

                  return (
                    <tr key={item.id} className="hover:bg-stone-50 transition-colors">
                      <td className="p-3 font-semibold text-stone-900">
                        <span>{language === 'ur' ? item.nameUrdu : item.nameEn}</span>
                      </td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          value={item.quantityPerAcre}
                          onChange={(e) => updateItem(item.id, 'quantityPerAcre', parseFloat(e.target.value) || 0)}
                          className="w-16 px-2 py-1 text-center font-bold bg-white border border-stone-300 rounded-md focus:ring-1 focus:ring-emerald-600"
                        />
                      </td>
                      <td className="p-3 text-center text-stone-500 font-urdu">{item.unitUrdu}</td>
                      <td className="p-3 text-center">
                        <input
                          type="number"
                          step="50"
                          min="0"
                          value={item.unitPrice}
                          onChange={(e) => updateItem(item.id, 'unitPrice', parseInt(e.target.value) || 0)}
                          className="w-20 px-2 py-1 text-center font-bold bg-white border border-stone-300 rounded-md focus:ring-1 focus:ring-emerald-600"
                        />
                      </td>
                      <td className="p-3 text-center font-black text-stone-800">
                        Rs. {itemCostAcre.toLocaleString()}
                      </td>
                      <td className="p-3 text-left font-black text-emerald-800">
                        Rs. {itemCostField.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}

                {/* Land Rent if Theka */}
                {landTenure === 'theka' && (
                  <tr className="bg-amber-50 font-bold">
                    <td className="p-3 text-stone-900 font-urdu">زمین کا ٹھیکہ (سالانہ کرایہ)</td>
                    <td className="p-3 text-center">1</td>
                    <td className="p-3 text-center font-urdu">ایکڑ</td>
                    <td className="p-3 text-center">Rs. {thekaPerAcre.toLocaleString()}</td>
                    <td className="p-3 text-center font-black">Rs. {thekaPerAcre.toLocaleString()}</td>
                    <td className="p-3 text-left font-black text-amber-900">
                      Rs. {(thekaPerAcre * acres).toLocaleString()}
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot className="bg-stone-900 text-white font-black text-sm">
                <tr>
                  <td colSpan={4} className="p-3 text-right">
                    کل لاگت (Grand Total):
                  </td>
                  <td className="p-3 text-center text-lime-300">
                    Rs. {calculations.totalCostPerAcre.toLocaleString()}
                  </td>
                  <td className="p-3 text-left text-lime-300">
                    Rs. {calculations.totalFieldCost.toLocaleString()}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}
      </div>

      {/* Next Steps for Farmer */}
      <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="font-black text-sm text-stone-900 flex items-center gap-2">
            <span>اس بجٹ کے مطابق اگلا قدم کیا ہے؟</span>
          </h4>
          <p className="text-xs text-stone-500 mt-0.5">
            آپ فوری طور پر قریبی تصدیق شدہ کھاد و بیج ڈیلرز سے ریٹس حاصل کر سکتے ہیں یا فیلڈ وزٹ کی درخواست دے سکتے ہیں۔
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveTab('store')}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-lime-300" />
            <span>کھاد و ادویات ڈپو دیکھیں</span>
          </button>

          <button
            onClick={() => setActiveTab('field_visit')}
            className="flex-1 md:flex-initial flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs border border-stone-300 transition-colors"
          >
            <span>فیلڈ آفیسر سے معائنہ کروائیں</span>
          </button>
        </div>
      </div>
    </div>
  );
};
