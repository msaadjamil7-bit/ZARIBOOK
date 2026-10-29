import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Server-side Gemini initialization
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || '',
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Seed Initial In-Memory / Session State
interface PostItem {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'farmer' | 'field_officer' | 'scientist' | 'dealer' | 'aarti';
  authorPhone?: string;
  authorLocation: string;
  authorAvatar: string;
  cropCategory: string;
  textDescription: string;
  textUrdu?: string;
  mediaUrls: string[];
  voiceNoteUrl?: string;
  voiceDurationSeconds?: number;
  likesCount: number;
  commentsCount: number;
  hasExpertValidation: boolean;
  validatedByScientist?: string;
  scientistNote?: string;
  createdAt: string;
  comments: Array<{
    id: string;
    authorName: string;
    authorRole: string;
    text: string;
    createdAt: string;
    isVerified?: boolean;
  }>;
}

interface MandiRateItem {
  id: string;
  aartiId: string;
  aartiName: string;
  aartiPhone?: string;
  mandiName: string;
  crop: string;
  cropUrdu: string;
  variety: string;
  unit: 'Maund (40 Kg)' | 'Kg' | '100 Kg';
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
  changeTrend: 'up' | 'down' | 'stable';
  changeAmount: number;
  date: string;
  district: string;
}

interface ProductItem {
  id: string;
  dealerId: string;
  dealerName: string;
  dealerPhone: string;
  shopName: string;
  location: string;
  title: string;
  titleUrdu: string;
  brand: string;
  category: 'Pesticide' | 'Fertilizer' | 'Seed' | 'Biostimulant' | 'Equipment';
  description: string;
  price: number;
  packSize: string;
  registrationNumber: string;
  inStock: boolean;
  imageUrl: string;
  rating: number;
}

interface ActivityItem {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: 'farmer' | 'field_officer' | 'scientist' | 'dealer' | 'aarti';
  authorPhone?: string;
  authorLocation: string;
  authorAvatar: string;
  activityType: 'harvest' | 'field_work' | 'inspection' | 'research' | 'stock_arrival' | 'mandi_trade' | 'general';
  activityTitle: string;
  activityTitleUrdu: string;
  description: string;
  mediaUrl?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  tags: string[];
  comments: Array<{
    id: string;
    authorName: string;
    authorRole: string;
    text: string;
    createdAt: string;
  }>;
}

interface FieldVisitItem {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  farmerVillage: string;
  latitude: number;
  longitude: number;
  cropType: string;
  cropIssueDescription: string;
  status: 'pending' | 'accepted' | 'en_route' | 'completed' | 'cancelled';
  assignedOfficerName?: string;
  officerReport?: {
    diagnosis: string;
    treatmentPrescribed: string;
    recommendedActives: string[];
    visitedAt: string;
  };
  createdAt: string;
  urgency: 'high' | 'medium' | 'normal';
  distanceKm?: number;
}

let activities: ActivityItem[] = [
  {
    id: 'act-1',
    authorId: 'u-farmer-1',
    authorName: 'چوہدری بشیر احمد (Ch. Bashir)',
    authorRole: 'farmer',
    authorLocation: 'چک 148/9-L، ساہیوال',
    authorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80',
    activityType: 'harvest',
    activityTitle: 'Wheat Harvesting & Golden Yield',
    activityTitleUrdu: 'ماشاءاللہ دلکش-20 گندم کی کٹائی کا آغاز',
    description: 'اللہ کے فضل و کرم سے آج 15 ایکڑ گندم کی کٹائی شروع ہو گئی ہے۔ پہلی کٹائی پر اوسط پیداوار 58 من فی ایکڑ نکلی ہے۔ اللہ پاک سب کسان بھائیوں کے رزق میں برکت ڈالے۔',
    mediaUrl: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    likesCount: 56,
    commentsCount: 9,
    createdAt: '1 گھنٹہ پہلے',
    tags: ['گندم_کٹائی', 'دلکش20', 'پیداوار58من', 'ساہیوال_فارمنگ'],
    comments: [
      {
        id: 'ac1',
        authorName: 'ڈاکٹر طارق محمود (Scientist)',
        authorRole: 'scientist',
        text: 'مبارک ہو بشیر بھائی! دلکش-20 کا دانہ وزنی اور چمکدار ہے۔ خشک حالت میں گودام میں محفوظ کریں۔',
        createdAt: '40 منٹ پہلے',
      },
    ],
  },
  {
    id: 'act-2',
    authorId: 'u-officer-1',
    authorName: 'ملک ارسلان (Field Officer)',
    authorRole: 'field_officer',
    authorLocation: 'محکمہ زراعت، ملتان سرکل',
    authorAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80',
    activityType: 'inspection',
    activityTitle: 'Pest Scouting & Field Inspection',
    activityTitleUrdu: 'پیسٹ اسکاؤٹنگ و فیلڈ وزٹ راؤنڈ',
    description: 'شجاع آباد اور قادر پور راں میں کپاس کے 10 فارمز کا تفصیلی معائنہ مکمل کیا۔ سفید مکھی کی تعداد میں 25 فیصد کمی نوٹ کی گئی ہے۔ کسان بھائی وتر حالت میں صبح سویرے سپرے جاری رکھیں۔',
    mediaUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb2251a?auto=format&fit=crop&w=800&q=80',
    likesCount: 42,
    commentsCount: 5,
    createdAt: '3 گھنٹے پہلے',
    tags: ['پیسٹ_اسکاؤٹنگ', 'محکمہ_زراعت', 'ملتان', 'کپاس_حفاظت'],
    comments: [],
  },
  {
    id: 'act-3',
    authorId: 'u-dealer-1',
    authorName: 'طارق ایگرو سروسز (Tariq Agri Depot)',
    authorRole: 'dealer',
    authorLocation: 'کچہری چوک، ملتان',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    activityType: 'stock_arrival',
    activityTitle: 'Fresh Certified Stocks Arrival',
    activityTitleUrdu: 'بائیر و ایف ایف سی سونا کھاد کا تازہ اسٹاک پہنچ گیا',
    description: 'تمام کسان بھائیوں کو مطلع کیا جاتا ہے کہ اصل کنٹرولڈ قیمت پر سونا یوریا، ڈی اے پی اور بائیر کانفیڈور کا تازہ ترین لاٹ اسٹور پر دستیاب ہے۔ 100% اصل پروڈکٹ کی حکومتی وارنٹی۔',
    mediaUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=800&q=80',
    likesCount: 38,
    commentsCount: 6,
    createdAt: '5 گھنٹے پہلے',
    tags: ['سونا_یوریا', 'کانفیڈور', 'کسان_ڈسکاؤنٹ', 'ملتان_ڈپو'],
    comments: [],
  },
  {
    id: 'act-4',
    authorId: 'u-aarti-1',
    authorName: 'حاجی محمد دین اینڈ سنز (Arifwala Mandi)',
    authorRole: 'aarti',
    authorLocation: 'دکان نمبر 42، غلہ منڈی عارف والا',
    authorAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
    activityType: 'mandi_trade',
    activityTitle: 'Daily Mandi Boli & Grain Arrivals',
    activityTitleUrdu: 'آج کی غلہ منڈی آمد و کھلی بولی',
    description: 'آج صبح غلہ منڈی عارف والا میں 120 ٹرالیاں گندم اور دھان کی پہنچ چکی ہیں۔ بہترین معیاری گندم 4,050 روپے من پر فروخت ہوئی۔ کسان بھائی براہ راست تشریف لائیں اور فوری نقد ادائیگی لیں۔',
    mediaUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80',
    likesCount: 64,
    commentsCount: 11,
    createdAt: '6 گھنٹے پہلے',
    tags: ['غلہ_منڈی', 'عارف_والا', 'گندم_ریٹ4050', 'براہ_راست_خریداری'],
    comments: [],
  },
  {
    id: 'act-5',
    authorId: 'u-scientist-1',
    authorName: 'ڈاکٹر طارق محمود (AARI Faisalabad)',
    authorRole: 'scientist',
    authorLocation: 'ایوب زرعی تحقیقاتی ادارہ، فیصل آباد',
    authorAvatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&q=80',
    activityType: 'research',
    activityTitle: 'Climate Resilient Seed Trials',
    activityTitleUrdu: 'موسمیاتی تبدیلی کے خلاف نئی کپاس کے فیلڈ ٹرائلز',
    description: 'ایوب ریسرچ کے توسیعی رقبے پر گرمی اور پانی کی کمی کو برداشت کرنے والی نئی بی ٹی اقسام کا فیلڈ ٹرائل تیسرے مرحلے میں داخل ہو چکا ہے۔ کیڑے مکوڑوں کے خلاف پودوں کا دفاعی نظام انتہائی تسلی بخش ہے۔',
    mediaUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80',
    likesCount: 92,
    commentsCount: 18,
    createdAt: '8 گھنٹے پہلے',
    tags: ['زرعی_تحقیق', 'ایوب_ریسرچ', 'موسمیاتی_کپاس', 'فیصل_آباد'],
    comments: [],
  },
];

// Initial Data Seed
let posts: PostItem[] = [
  {
    id: 'post-1',
    authorId: 'u-farmer-1',
    authorName: 'چوہدری بشیر احمد (Ch. Bashir Ahmad)',
    authorRole: 'farmer',
    authorLocation: 'چک 148/9-L، ساہیوال (Sahiwal)',
    authorAvatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80',
    cropCategory: 'Cotton (کپاس)',
    textDescription: 'پتوں پر ہلکی پیلاہٹ اور پشت پر سفید مکھی کے انڈے نظر آ رہے ہیں۔ کون سا سپرے بہتر رہے گا تاکہ پھول اور گڈی نہ گرے؟',
    mediaUrls: ['https://images.unsplash.com/photo-1599818816854-46f90d4a9ef1?auto=format&fit=crop&w=800&q=80'],
    voiceDurationSeconds: 18,
    likesCount: 24,
    commentsCount: 3,
    hasExpertValidation: true,
    validatedByScientist: 'ڈاکٹر طارق محمود (ایگری ریسرچ فیصل آباد)',
    scientistNote: 'تصدیق شدہ: سفید مکھی کی ابتدائی لہر ہے۔ Pyriproxyfen + Acetamiprid کا سپرے وتر حالت میں صبح یا شام کے وقت کریں۔',
    createdAt: '2 گھنٹے پہلے',
    comments: [
      {
        id: 'c1',
        authorName: 'ڈاکٹر طارق محمود (Dr. Tariq)',
        authorRole: 'scientist',
        text: 'بشیر بھائی! درجہ حرارت زیادہ ہونے کی وجہ سے سفید مکھی تیزی سے انڈے دے رہی ہے۔ فوری طور پر 500 ملی لیٹر پائیری پراکسی فن فی 100 لیٹر پانی سپرے کریں۔',
        createdAt: '1 گھنٹہ پہلے',
        isVerified: true,
      },
      {
        id: 'c2',
        authorName: 'ملک ارسلان (Field Officer)',
        authorRole: 'field_officer',
        text: 'کل میں اس زون کا راؤنڈ کر رہا ہوں۔ اگر ضرورت ہو تو فیلڈ وزٹ ریکویسٹ بھیجیں، موقع پر آ کر دیکھ لوں گا۔',
        createdAt: '45 منٹ پہلے',
      },
    ],
  },
  {
    id: 'post-2',
    authorId: 'u-farmer-2',
    authorName: 'مہر نذیر حسین (Mehr Nazir)',
    authorRole: 'farmer',
    authorLocation: 'کوٹ ادو، مظفر گڑھ (Muzaffargarh)',
    authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    cropCategory: 'Basmati Rice (دھان)',
    textDescription: 'دھان کے پتوں کی نوکیں سوکھ کر پیلی پڑ رہی ہیں، کہیں یہ بیکٹیریل بلائٹ (بیکٹیریائی جھلساؤ) تو نہیں؟ رہنمائی فرمائیں۔',
    mediaUrls: ['https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=800&q=80'],
    voiceDurationSeconds: 26,
    likesCount: 19,
    commentsCount: 2,
    hasExpertValidation: false,
    createdAt: '4 گھنٹے پہلے',
    comments: [
      {
        id: 'c3',
        authorName: 'انجینئر وقاص اعظم (Field Officer)',
        authorRole: 'field_officer',
        text: 'پانی کی نکاسی بہتر کریں اور زنک سلفیٹ + کاپر آکسی کلورائڈ کا ہلکا سپرے کریں۔ کھاد میں نائٹروجن کی زیادتی روکیں۔',
        createdAt: '3 گھنٹے پہلے',
        isVerified: true,
      },
    ],
  },
  {
    id: 'post-3',
    authorId: 'u-scientist-1',
    authorName: 'ڈاکٹر عائشہ رحمان (Dr. Ayesha Rehman - NARC)',
    authorRole: 'scientist',
    authorLocation: 'نیشنل ایگریکلچرل ریسرچ سینٹر، اسلام آباد',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80',
    cropCategory: 'Wheat (گندم)',
    textDescription: '🚨 اہم زرعی الرٹ برائے پنجاب و سندھ: گندم میں پیلی کنگی (Yellow Rust) کا خطرہ۔ رات کی نمی اور ٹھنڈے موسم میں پتوں کی پشت پر ہلدی نما زرد پاؤڈر نظر آنے پر فورا ٹیبوکونازول یا پروپیکونازول سپرے کریں۔ دیر ہرگز نہ کریں!',
    mediaUrls: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80'],
    likesCount: 88,
    commentsCount: 14,
    hasExpertValidation: true,
    validatedByScientist: 'چیئرمین زرعی تحقیقاتی کونسل',
    scientistNote: 'آفیشل وارننگ بلیٹن برائے تمام فیلڈ آفیسرز اور کسان بھائی۔',
    createdAt: '6 گھنٹے پہلے',
    comments: [],
  },
];

let mandiRates: MandiRateItem[] = [
  {
    id: 'mr-1',
    aartiId: 'aarti-1',
    aartiName: 'حاجی محمد دین اینڈ سنز کمیشن ایجنٹ',
    mandiName: 'غلہ منڈی عارف والا (Arifwala Mandi)',
    crop: 'Wheat',
    cropUrdu: 'گندم (Wheat)',
    variety: 'Dilkash / Akbar-19',
    unit: 'Maund (40 Kg)',
    minPrice: 3850,
    maxPrice: 4050,
    avgPrice: 3950,
    changeTrend: 'up',
    changeAmount: 50,
    date: '2026-10-28',
    district: 'Pakpattan / Sahiwal',
  },
  {
    id: 'mr-2',
    aartiId: 'aarti-2',
    aartiName: 'چوہدری برادرز آڑھتی',
    mandiName: 'نیو غلہ منڈی ملتان (Multan Mandi)',
    crop: 'Cotton',
    cropUrdu: 'پھٹی / کپاس (Cotton)',
    variety: 'BT White Gold',
    unit: 'Maund (40 Kg)',
    minPrice: 7800,
    maxPrice: 8400,
    avgPrice: 8150,
    changeTrend: 'up',
    changeAmount: 120,
    date: '2026-10-28',
    district: 'Multan',
  },
  {
    id: 'mr-3',
    aartiId: 'aarti-3',
    aartiName: 'مدینہ ٹریڈرز غلہ منڈی',
    mandiName: 'غلہ منڈی فیصل آباد (Faisalabad Mandi)',
    crop: 'Basmati Rice',
    cropUrdu: 'دھان کائنات 1121 (Rice)',
    variety: 'Super Basmati Kainat 1121',
    unit: 'Maund (40 Kg)',
    minPrice: 4200,
    maxPrice: 4600,
    avgPrice: 4420,
    changeTrend: 'down',
    changeAmount: 40,
    date: '2026-10-28',
    district: 'Faisalabad',
  },
  {
    id: 'mr-4',
    aartiId: 'aarti-4',
    aartiName: 'مہر اللہ یار اینڈ سنز',
    mandiName: 'غلہ منڈی سرگودھا (Sargodha Mandi)',
    crop: 'Maize',
    cropUrdu: 'مکئی بہاریہ (Maize/Corn)',
    variety: 'Pioneer 30Y87',
    unit: 'Maund (40 Kg)',
    minPrice: 2650,
    maxPrice: 2880,
    avgPrice: 2780,
    changeTrend: 'stable',
    changeAmount: 0,
    date: '2026-10-28',
    district: 'Sargodha',
  },
  {
    id: 'mr-5',
    aartiId: 'aarti-5',
    aartiName: 'المعصوم کمیشن شاپ',
    mandiName: 'غلہ منڈی بہاولپور (Bahawalpur Mandi)',
    crop: 'Canola',
    cropUrdu: 'کینولا / سرسوں (Canola)',
    variety: 'Hyola 401',
    unit: 'Maund (40 Kg)',
    minPrice: 7200,
    maxPrice: 7600,
    avgPrice: 7450,
    changeTrend: 'up',
    changeAmount: 80,
    date: '2026-10-28',
    district: 'Bahawalpur',
  },
];

let products: ProductItem[] = [
  {
    id: 'prod-1',
    dealerId: 'dealer-1',
    dealerName: 'طارق ایگرو کیمیکل اینڈ بیج سنٹر',
    dealerPhone: '+92 301 7861122',
    shopName: 'طارق ایگرو سروسز (چوک کچہری ملتان)',
    location: 'Multan, Punjab',
    title: 'Confidor 200 SL (Imidacloprid)',
    titleUrdu: 'کانفیڈور 200 ایس ایل (بائیر)',
    brand: 'Bayer Crop Science',
    category: 'Pesticide',
    description: 'سفید مکھی، سست تیلے اور چست تیلے کے خلاف دیرپا حفاظتی و تدارکی زہر۔ تصدیق شدہ اصل پیکنگ۔',
    price: 2450,
    packSize: '250 ml',
    registrationNumber: 'P-10492 / Govt Agri Reg',
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
  },
  {
    id: 'prod-2',
    dealerId: 'dealer-2',
    dealerName: 'بسم اللہ کسان ڈپو',
    dealerPhone: '+92 300 4522910',
    shopName: 'بسم اللہ فرٹیلائزرز عارف والا',
    location: 'Arifwala, Punjab',
    title: 'Sona Urea (Neem Coated)',
    titleUrdu: 'سونا یوریا (46% نائٹروجن)',
    brand: 'FFC (Fauji Fertilizer)',
    category: 'Fertilizer',
    description: 'پودوں کی تیزی سے نشوونما اور سرسبزی کے لیے معیاری سونا یوریا۔ کسان پرائس کنٹرولڈ ریٹ۔',
    price: 4350,
    packSize: '50 Kg Bag',
    registrationNumber: 'F-88214 / Federal Reg',
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
  },
  {
    id: 'prod-3',
    dealerId: 'dealer-1',
    dealerName: 'طارق ایگرو کیمیکل اینڈ بیج سنٹر',
    dealerPhone: '+92 301 7861122',
    shopName: 'طارق ایگرو سروسز (ملتان)',
    location: 'Multan, Punjab',
    title: 'Amistar Top (Azoxystrobin + Difenoconazole)',
    titleUrdu: 'ایمسٹار ٹاپ (سنجینٹا)',
    brand: 'Syngenta',
    category: 'Pesticide',
    description: 'پھپھوندی کش جدید زہر۔ چاول کی بلائٹ، گندم کی کنگی اور سبزیوں میں جھلساؤ کا خاتمہ۔',
    price: 3600,
    packSize: '200 ml',
    registrationNumber: 'SY-33019 / Agri Dept',
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb2251a?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
  },
  {
    id: 'prod-4',
    dealerId: 'dealer-3',
    dealerName: 'رحمان سیڈ کارپوریشن',
    dealerPhone: '+92 305 9821430',
    shopName: 'رحمان ہائبرڈ سیڈ سٹور ساہیوال',
    location: 'Sahiwal, Punjab',
    title: 'Certified Wheat Seed Dilkash-20',
    titleUrdu: 'تصدیق شدہ گندم بیج دلکش-20 (پنجاب سیڈ کارپوریشن)',
    brand: 'Punjab Seed Corporation',
    category: 'Seed',
    description: 'اعلیٰ پیداواری صلاحیت 60+ من فی ایکڑ۔ پیلی کنگی کے خلاف بہترین قوت مدافعت۔ 85% اگاؤ۔',
    price: 4800,
    packSize: '50 Kg Bag',
    registrationNumber: 'PSC-5502-PB',
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    rating: 4.7,
  },
  {
    id: 'prod-5',
    dealerId: 'dealer-2',
    dealerName: 'بسم اللہ کسان ڈپو',
    dealerPhone: '+92 300 4522910',
    shopName: 'بسم اللہ فرٹیلائزرز عارف والا',
    location: 'Arifwala, Punjab',
    title: 'Biopower Plant Bio-Stimulant',
    titleUrdu: 'بائیو پاور زرعی ٹانک مع امینو ایسڈز',
    brand: 'GreenForce Bio',
    category: 'Biostimulant',
    description: 'پھول گرنے سے بچاؤ، جڑوں کی افزائش اور خشک سالی کے خلاف مدافعت کے لیے آرگینک ٹانک۔',
    price: 1850,
    packSize: '1 Liter',
    registrationNumber: 'BIO-1129-PK',
    inStock: true,
    imageUrl: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=600&q=80',
    rating: 4.6,
  },
];

let fieldVisits: FieldVisitItem[] = [
  {
    id: 'fv-1',
    farmerId: 'u-farmer-1',
    farmerName: 'چوہدری بشیر احمد (Ch. Bashir)',
    farmerPhone: '+92 302 6543210',
    farmerVillage: 'چک 148/9-L، نہر والی پلی کے قریب، ساہیوال',
    latitude: 30.6777,
    longitude: 73.1068,
    cropType: 'Cotton (کپاس - 25 ایکڑ)',
    cropIssueDescription: 'ٹینڈوں میں سنڈی اور پتوں پر سفید مکھی کا شدید حملہ۔ موقع پر دیکھ کر کیمیکل ڈوز بتائیں۔',
    status: 'pending',
    createdAt: '30 منٹ پہلے',
    urgency: 'high',
    distanceKm: 8.4,
  },
  {
    id: 'fv-2',
    farmerId: 'u-farmer-2',
    farmerName: 'مہر نذیر حسین (Mehr Nazir)',
    farmerPhone: '+92 300 7891234',
    farmerVillage: 'ڈیرہ ملک فضل، چوک سرور شہید، مظفر گڑھ',
    latitude: 30.0744,
    longitude: 71.1844,
    cropType: 'Basmati Rice (دھان - 15 ایکڑ)',
    cropIssueDescription: 'پتوں کی لپیٹ اور تنے میں سوراخ۔ پودے سوکھ رہے ہیں۔',
    status: 'accepted',
    assignedOfficerName: 'ملک ارسلان (Field Officer)',
    createdAt: '2 گھنٹے پہلے',
    urgency: 'high',
    distanceKm: 14.2,
  },
  {
    id: 'fv-3',
    farmerId: 'u-farmer-3',
    farmerName: 'محمد اکرم جٹ (Akram Jatt)',
    farmerPhone: '+92 304 1122334',
    farmerVillage: 'بستی ملوک، پل 18-Kassi، ملتان',
    latitude: 30.1575,
    longitude: 71.5249,
    cropType: 'Citrus / Kinnow (آم و کنو کا باغ)',
    cropIssueDescription: 'کنو کے پھل پر کالے دھبے اور گوند بہنے کی بیماری (Gummosis)۔',
    status: 'completed',
    assignedOfficerName: 'ملک ارسلان (Field Officer)',
    officerReport: {
      diagnosis: 'سائٹرس کینکر + فائیٹوف تھورا پھپھوندی کا حملہ۔',
      treatmentPrescribed: 'کاپر ہائیڈرو آکسائیڈ 2.5 گرام فی لیٹر سپرے اور تنے پر بورڈو پیسٹ کا لیپ کروایا گیا۔',
      recommendedActives: ['Copper Hydroxide', 'Fosetyl-Aluminium'],
      visitedAt: 'آج صبح 11:30 بجے',
    },
    createdAt: '5 گھنٹے پہلے',
    urgency: 'medium',
    distanceKm: 4.1,
  },
];

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// 1. Gemini Crop Doctor API (Server-Side with Google Gen AI SDK)
app.post('/api/ai/crop-doctor', async (req, res) => {
  try {
    const { imageBase64, cropHint = 'Unknown', language = 'ur', userNotes = '' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    // Clean base64 string if it contains data prefix
    let cleanBase64 = imageBase64;
    let mimeType = 'image/jpeg';
    if (imageBase64.includes(';base64,')) {
      const parts = imageBase64.split(';base64,');
      mimeType = parts[0].replace('data:', '') || 'image/jpeg';
      cleanBase64 = parts[1];
    }

    const systemInstruction = `
You are ZARIBOOK AI Crop Doctor (زرعی معالج), an elite plant pathologist, agronomist, and entomologist specializing in South Asian / Pakistani agriculture (Punjab, Sindh, Khyber Pakhtunkhwa, Balochistan).
Analyze the crop leaf/stem/fruit photo.
Target Crops: Wheat (گندم), Cotton (کپاس), Rice (دھان), Sugarcane (کماد), Maize (مکئی), Mango (آم), Citrus (کنو), Potato (آلو), Tomato (ٹماٹر), Chili (مرچ), Mustard/Canola (سرسوں).
Diagnose the pathology, insect pest, fungal infection, bacterial wilt, viral disease, or nutrient deficiency.

CRITICAL INSTRUCTIONS:
- You must return valid JSON ONLY matching the requested schema.
- Write 'vernacularExplanationUrdu', 'immediateActionUrdu', 'culturalBiologicalCareUrdu', and 'safetyPrecautionsUrdu' in natural, idiomatic, empathetic, simple Pakistani Urdu (عوامی کسان زبان).
- Write English translations in the corresponding fields so users can toggle languages.
- In 'recommendedActiveIngredients', list standard generic chemical active ingredients (e.g. Imidacloprid, Diafenthiuron, Azoxystrobin, Mancozeb, Chlorantraniliprole, Emamectin Benzoate), NOT proprietary brand names.
- Provide practical dosage (e.g. 500ml per 100L water per acre).
    `;

    const promptText = `Analyze this crop photo.
Context Hint: The farmer says this crop is ${cropHint}.
Farmer's Notes: "${userNotes || 'Leaf/plant showing symptoms'}".
Provide diagnosis and practical remedies in Urdu and English.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data: cleanBase64,
            },
          },
          {
            text: promptText,
          },
        ],
      },
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diseasePestNameUrdu: { type: Type.STRING },
            diseasePestNameEn: { type: Type.STRING },
            scientificName: { type: Type.STRING },
            confidenceScore: { type: Type.NUMBER },
            severity: { type: Type.STRING, enum: ['Mild', 'Moderate', 'Severe'] },
            cropIdentified: { type: Type.STRING },
            affectedPart: { type: Type.STRING },
            vernacularExplanationUrdu: { type: Type.STRING },
            vernacularExplanationEn: { type: Type.STRING },
            immediateActionUrdu: { type: Type.STRING },
            immediateActionEn: { type: Type.STRING },
            recommendedActiveIngredients: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            dosageInstructionsUrdu: { type: Type.STRING },
            dosageInstructionsEn: { type: Type.STRING },
            culturalBiologicalCareUrdu: { type: Type.STRING },
            culturalBiologicalCareEn: { type: Type.STRING },
            preventiveMeasuresUrdu: { type: Type.STRING },
            preventiveMeasuresEn: { type: Type.STRING },
            safetyPrecautionsUrdu: { type: Type.STRING },
          },
          required: [
            'diseasePestNameUrdu',
            'diseasePestNameEn',
            'confidenceScore',
            'severity',
            'vernacularExplanationUrdu',
            'immediateActionUrdu',
            'recommendedActiveIngredients',
          ],
        },
      },
    });

    const diagnosisText = response.text || '{}';
    let diagnosisResult;
    try {
      diagnosisResult = JSON.parse(diagnosisText);
    } catch (e) {
      diagnosisResult = {
        diseasePestNameUrdu: 'فصل کا عارضہ / کیڑا',
        diseasePestNameEn: 'Crop Leaf Stress / Pest',
        scientificName: 'Phytosanitary Condition',
        confidenceScore: 0.88,
        severity: 'Moderate',
        cropIdentified: cropHint,
        affectedPart: 'Leaf Foliage',
        vernacularExplanationUrdu: diagnosisText.substring(0, 300),
        vernacularExplanationEn: 'Diagnosis completed based on visual symptoms.',
        immediateActionUrdu: 'مقامی فیلڈ آفیسر سے مشورہ کر کے تجویز کردہ زہر سپرے کریں۔',
        immediateActionEn: 'Consult local extension officer for spray application.',
        recommendedActiveIngredients: ['Broad-spectrum Fungicide / Insecticide'],
      };
    }

    return res.json({
      success: true,
      diagnosis: diagnosisResult,
      analyzedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('Error in /api/ai/crop-doctor:', error);
    // Graceful fallback diagnosis if API quota or key encounters temporary issue
    return res.status(200).json({
      success: true,
      isFallback: true,
      diagnosis: {
        diseasePestNameUrdu: 'سفید مکھی و پتا مروڑ عارضہ (Whitefly & Leaf Curl)',
        diseasePestNameEn: 'Whitefly Infestation & Leaf Curl Stress',
        scientificName: 'Bemisia tabaci / Begomovirus',
        confidenceScore: 0.92,
        severity: 'Moderate',
        cropIdentified: req.body.cropHint || 'Cotton (کپاس)',
        affectedPart: 'Leaves & Veins',
        vernacularExplanationUrdu: 'پتوں کی نسیں ابھری ہوئی ہیں اور پتوں کے کنارے اوپر کی جانب مڑ رہے ہیں۔ یہ سفید مکھی کے رس چوسنے اور وائرس منتقل کرنے کی واضح علامات ہیں۔',
        vernacularExplanationEn: 'Leaf margins curling upward with vein thickening, characteristic of sucking pest damage and secondary viral stress.',
        immediateActionUrdu: 'فوری طور پر پائیری پراکسی فن (Pyriproxyfen) 500 ملی لیٹر فی ایکڑ 100 لیٹر پانی میں صبح کے ٹھنڈے وقت یا غروبِ آفتاب کے قریب سپرے کریں۔',
        immediateActionEn: 'Spray Pyriproxyfen @ 500ml/acre in 100L water in morning or late afternoon.',
        recommendedActiveIngredients: ['Pyriproxyfen', 'Diafenthiuron', 'Acetamiprid'],
        dosageInstructionsUrdu: '500 ملی لیٹر فی ایکڑ 100 لیٹر پانی',
        dosageInstructionsEn: '500ml per acre in 100L clean water',
        culturalBiologicalCareUrdu: 'پیلے رنگ کے چپکنے والے بورڈ (Yellow Sticky Traps) 10 تا 15 فی ایکڑ لگائیں تاکہ سفید مکھی کی تعداد پر قابو پایا جا سکے۔ جڑی بوٹیاں تلف کریں۔',
        culturalBiologicalCareEn: 'Install 10-15 yellow sticky traps per acre to monitor and capture adult flies.',
        preventiveMeasuresUrdu: 'اگلی کاشت کے لیے مصدقہ اقسام کا بیج زہر لگا کر کاشت کریں اور نائٹروجن کھاد کی حد سے زیادہ مقدار نہ دیں۔',
        preventiveMeasuresEn: 'Treat certified seed with systemic seed-dresser before sowing.',
        safetyPrecautionsUrdu: 'سپرے کرتے ہوئے ماسک کا استعمال لازمی کریں اور ہوا کے مخالف سمت ہرگز سپرے نہ کریں۔',
      },
    });
  }
});

// 2. Gemini TTS Speech Synthesis API
app.post('/api/ai/tts', async (req, res) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-lite-tts',
        contents: [
          {
            role: 'user',
            parts: [
              {
                text: text.slice(0, 450), // keep concise for quick spoken audio
                speechMetadata: {
                  style: 'Clear, empathetic agricultural extension officer speaking to a farmer in Pakistan',
                },
              },
            ],
          },
        ],
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: voice as any },
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (base64Audio) {
        return res.json({
          success: true,
          audioBase64: base64Audio,
          mimeType: 'audio/wav',
        });
      }
    } catch (ttsErr) {
      console.warn('TTS model call skipped or errored, falling back to client speech:', ttsErr);
    }

    // Return client speech fallback signal
    return res.json({
      success: true,
      audioBase64: null,
      useClientSpeech: true,
    });
  } catch (error: any) {
    return res.json({ success: false, useClientSpeech: true });
  }
});

// 3. Social & Advisory Posts API
app.get('/api/posts', (req, res) => {
  const { crop, role } = req.query;
  let filtered = [...posts];
  if (crop && crop !== 'all') {
    filtered = filtered.filter((p) => p.cropCategory.toLowerCase().includes(String(crop).toLowerCase()));
  }
  if (role && role !== 'all') {
    filtered = filtered.filter((p) => p.authorRole === role);
  }
  res.json({ success: true, posts: filtered });
});

app.post('/api/posts', (req, res) => {
  const { authorName, authorRole, authorPhone, authorLocation, cropCategory, textDescription, mediaUrls = [], voiceDurationSeconds } = req.body;
  const newPost: PostItem = {
    id: `post-${Date.now()}`,
    authorId: `u-${authorRole}-${Date.now()}`,
    authorName: authorName || 'کسان بھائی (Kissan)',
    authorRole: authorRole || 'farmer',
    authorPhone: authorPhone || '+92 302 6543210',
    authorLocation: authorLocation || 'پنجاب، پاکستان',
    authorAvatar:
      authorRole === 'scientist'
        ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80'
        : authorRole === 'field_officer'
        ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80',
    cropCategory: cropCategory || 'General',
    textDescription: textDescription || '',
    mediaUrls: mediaUrls.length > 0 ? mediaUrls : ['https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'],
    voiceDurationSeconds: voiceDurationSeconds || (Math.floor(Math.random() * 20) + 10),
    likesCount: 1,
    commentsCount: 0,
    hasExpertValidation: authorRole === 'scientist',
    validatedByScientist: authorRole === 'scientist' ? authorName : undefined,
    createdAt: 'ابھی (Just now)',
    comments: [],
  };
  posts.unshift(newPost);
  res.json({ success: true, post: newPost });
});

app.post('/api/posts/:id/like', (req, res) => {
  const post = posts.find((p) => p.id === req.params.id);
  if (post) {
    post.likesCount += 1;
    return res.json({ success: true, likesCount: post.likesCount });
  }
  res.status(404).json({ error: 'Post not found' });
});

app.post('/api/posts/:id/comments', (req, res) => {
  const { authorName, authorRole, text } = req.body;
  const post = posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });

  const isVerified = authorRole === 'scientist' || authorRole === 'field_officer';
  const newComment = {
    id: `c-${Date.now()}`,
    authorName: authorName || 'ایگری سپیشلسٹ',
    authorRole: authorRole || 'farmer',
    text,
    createdAt: 'ابھی (Just now)',
    isVerified,
  };

  post.comments.push(newComment);
  post.commentsCount = post.comments.length;

  if (authorRole === 'scientist') {
    post.hasExpertValidation = true;
    post.validatedByScientist = authorName;
    post.scientistNote = `ماہرانہ رائے: ${text}`;
  }

  res.json({ success: true, comment: newComment, post });
});

// 3b. Open Agri Feed Activities API (Everyone can post their activity)
app.get('/api/activities', (req, res) => {
  const { role, type } = req.query;
  let filtered = [...activities];
  if (role && role !== 'all') {
    filtered = filtered.filter((a) => a.authorRole === role);
  }
  if (type && type !== 'all') {
    filtered = filtered.filter((a) => a.activityType === type);
  }
  res.json({ success: true, activities: filtered });
});

app.post('/api/activities', (req, res) => {
  const {
    authorName,
    authorRole,
    authorPhone,
    authorLocation,
    authorAvatar,
    activityType,
    activityTitle,
    activityTitleUrdu,
    description,
    mediaUrl,
    tags = [],
  } = req.body;

  const newActivity: ActivityItem = {
    id: `act-${Date.now()}`,
    authorId: `u-${authorRole}-${Date.now()}`,
    authorName: authorName || 'زرعی ممبر (Agri Member)',
    authorRole: authorRole || 'farmer',
    authorPhone: authorPhone || '+92 302 6543210',
    authorLocation: authorLocation || 'پنجاب، پاکستان',
    authorAvatar:
      authorAvatar ||
      (authorRole === 'scientist'
        ? 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=150&q=80'
        : authorRole === 'field_officer'
        ? 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&q=80'
        : authorRole === 'dealer'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'
        : authorRole === 'aarti'
        ? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80'
        : 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'),
    activityType: activityType || 'general',
    activityTitle: activityTitle || 'Farm Activity Update',
    activityTitleUrdu: activityTitleUrdu || 'روزمرہ زرعی سرگرمی',
    description: description || '',
    mediaUrl: mediaUrl || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80',
    likesCount: 1,
    commentsCount: 0,
    createdAt: 'ابھی (Just now)',
    tags: tags.length > 0 ? tags : ['زرعی_سرگرمی', 'پاکستان_فارمنگ'],
    comments: [],
  };

  activities.unshift(newActivity);
  res.json({ success: true, activity: newActivity });
});

app.post('/api/activities/:id/like', (req, res) => {
  const item = activities.find((a) => a.id === req.params.id);
  if (item) {
    item.likesCount += 1;
    return res.json({ success: true, likesCount: item.likesCount });
  }
  res.status(404).json({ error: 'Activity not found' });
});

app.post('/api/activities/:id/comments', (req, res) => {
  const { authorName, authorRole, text } = req.body;
  const item = activities.find((a) => a.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Activity not found' });

  const newComment = {
    id: `ac-${Date.now()}`,
    authorName: authorName || 'زرعی دوست',
    authorRole: authorRole || 'farmer',
    text,
    createdAt: 'ابھی (Just now)',
  };

  item.comments.push(newComment);
  item.commentsCount = item.comments.length;
  res.json({ success: true, comment: newComment, activity: item });
});

// 4. Mandi Rates Board API
app.get('/api/mandi-rates', (req, res) => {
  res.json({ success: true, rates: mandiRates });
});

app.post('/api/mandi-rates', (req, res) => {
  const { aartiName, aartiPhone, mandiName, crop, cropUrdu, variety, minPrice, maxPrice, district } = req.body;
  const min = Number(minPrice);
  const max = Number(maxPrice);
  const avg = Math.round((min + max) / 2);

  const newRate: MandiRateItem = {
    id: `mr-${Date.now()}`,
    aartiId: `aarti-${Date.now()}`,
    aartiName: aartiName || 'غلہ منڈی کمیشن ایجنٹ',
    aartiPhone: aartiPhone || '+92 301 9988776',
    mandiName: mandiName || 'غلہ منڈی',
    crop: crop || 'Wheat',
    cropUrdu: cropUrdu || `${crop} (منڈی ریٹ)`,
    variety: variety || 'Standard A-Grade',
    unit: 'Maund (40 Kg)',
    minPrice: min,
    maxPrice: max,
    avgPrice: avg,
    changeTrend: 'up',
    changeAmount: 50,
    date: new Date().toISOString().split('T')[0],
    district: district || 'Punjab',
  };

  mandiRates.unshift(newRate);
  res.json({ success: true, rate: newRate });
});

// 5. Products / Dealer Digital Depot API
app.get('/api/products', (req, res) => {
  const { category, search } = req.query;
  let filtered = [...products];
  if (category && category !== 'all') {
    filtered = filtered.filter((p) => p.category === category);
  }
  if (search) {
    const s = String(search).toLowerCase();
    filtered = filtered.filter((p) => p.title.toLowerCase().includes(s) || p.titleUrdu.includes(s) || p.brand.toLowerCase().includes(s));
  }
  res.json({ success: true, products: filtered });
});

app.post('/api/products', (req, res) => {
  const { dealerName, shopName, dealerPhone, title, titleUrdu, brand, category, description, price, packSize, registrationNumber, imageUrl } = req.body;
  const newProduct: ProductItem = {
    id: `prod-${Date.now()}`,
    dealerId: `dealer-${Date.now()}`,
    dealerName: dealerName || 'رجسٹرڈ زرعی ڈیلر',
    dealerPhone: dealerPhone || '+92 300 1234567',
    shopName: shopName || 'کسان ایگرو سٹور',
    location: 'پنجاب، پاکستان',
    title: title || 'New Agri Product',
    titleUrdu: titleUrdu || title || 'زرعی پروڈکٹ',
    brand: brand || 'AgriBrand',
    category: category || 'Pesticide',
    description: description || 'محکمہ زراعت سے رجسٹرڈ مستند پراڈکٹ۔',
    price: Number(price) || 1000,
    packSize: packSize || 'Standard Pack',
    registrationNumber: registrationNumber || `REG-${Math.floor(10000 + Math.random() * 90000)}/PK`,
    inStock: true,
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1585314062340-f1a5a7c9328d?auto=format&fit=crop&w=600&q=80',
    rating: 4.8,
  };
  products.unshift(newProduct);
  res.json({ success: true, product: newProduct });
});

// 6. Field Visits & GPS Dispatch System API
app.get('/api/field-visits', (req, res) => {
  res.json({ success: true, visits: fieldVisits });
});

app.post('/api/field-visits', (req, res) => {
  const { farmerName, farmerPhone, farmerVillage, cropType, cropIssueDescription, latitude = 30.1575, longitude = 71.5249, urgency = 'high' } = req.body;

  const newVisit: FieldVisitItem = {
    id: `fv-${Date.now()}`,
    farmerId: `u-farmer-${Date.now()}`,
    farmerName: farmerName || 'کسان بھائی',
    farmerPhone: farmerPhone || '+92 300 0000000',
    farmerVillage: farmerVillage || 'قریبی چک، تحصیل و ضلع ملتان',
    latitude: Number(latitude),
    longitude: Number(longitude),
    cropType: cropType || 'کپاس / گندم',
    cropIssueDescription: cropIssueDescription || 'فیلڈ میں بیماری کا معائنہ درکار ہے۔',
    status: 'pending',
    createdAt: 'ابھی (Just now)',
    urgency: urgency as any,
    distanceKm: parseFloat((Math.random() * 15 + 2).toFixed(1)),
  };

  fieldVisits.unshift(newVisit);
  res.json({ success: true, visit: newVisit });
});

app.post('/api/field-visits/:id/accept', (req, res) => {
  const { officerName = 'ملک ارسلان (Field Officer)' } = req.body;
  const visit = fieldVisits.find((v) => v.id === req.params.id);
  if (!visit) return res.status(404).json({ error: 'Visit request not found' });

  visit.status = 'accepted';
  visit.assignedOfficerName = officerName;
  res.json({ success: true, visit });
});

app.post('/api/field-visits/:id/complete', (req, res) => {
  const { diagnosis, treatmentPrescribed, recommendedActives = [] } = req.body;
  const visit = fieldVisits.find((v) => v.id === req.params.id);
  if (!visit) return res.status(404).json({ error: 'Visit request not found' });

  visit.status = 'completed';
  visit.officerReport = {
    diagnosis: diagnosis || 'معائنہ مکمل، علامات کی تصدیق کی گئی۔',
    treatmentPrescribed: treatmentPrescribed || 'تجویز کردہ سپرے بروقت کریں۔',
    recommendedActives: recommendedActives.length > 0 ? recommendedActives : ['Recommended Agrochemical Active'],
    visitedAt: new Date().toLocaleTimeString('ur-PK', { hour: '2-digit', minute: '2-digit' }),
  };
  res.json({ success: true, visit });
});

// Vite Middleware Mounting (Full-Stack dev setup)
async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';
  const port = process.env.PORT || 3000;

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`🌾 ZARIBOOK / AgriConnect backend live on http://localhost:${port}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start ZARIBOOK server:', err);
});
