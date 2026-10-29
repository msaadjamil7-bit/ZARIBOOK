import { UserProfile, UserRole } from '../types';

export const USER_PROFILES: Record<UserRole, UserProfile> = {
  farmer: {
    id: 'u-farmer-1',
    name: 'Chaudhry Bashir Ahmad',
    nameUrdu: 'چوہدری بشیر احمد (کسان)',
    role: 'farmer',
    phone: '+92 302 6543210',
    location: 'Chak 148/9-L, Sahiwal',
    locationUrdu: 'چک 148/9-L، ساہیوال',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    metadata: {
      landAcres: 25,
      crops: ['Cotton (کپاس)', 'Wheat (گندم)', 'Maize (مکئی)'],
    },
  },
  field_officer: {
    id: 'u-officer-1',
    name: 'Malik Arslan (Field Officer)',
    nameUrdu: 'ملک ارسلان (فیلڈ آفیسر)',
    role: 'field_officer',
    phone: '+92 300 9876543',
    location: 'Agriculture Extension Dept, Multan Circle',
    locationUrdu: 'محکمہ زراعت توسیع، ملتان سرکل',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    metadata: {
      department: 'Directorate of Pest Warning & Quality Control',
      license: 'PWQC-MLT-2024-88',
    },
  },
  scientist: {
    id: 'u-scientist-1',
    name: 'Dr. Tariq Mahmood (Agronomist)',
    nameUrdu: 'ڈاکٹر طارق محمود (زرعی سائنسدان)',
    role: 'scientist',
    phone: '+92 301 4455667',
    location: 'Ayub Agricultural Research Institute (AARI), Faisalabad',
    locationUrdu: 'ایوب زرعی تحقیقاتی ادارہ، فیصل آباد',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    metadata: {
      department: 'Entomology & Plant Pathology Division',
      license: 'PARC-SENIOR-FELLOW-019',
    },
  },
  dealer: {
    id: 'u-dealer-1',
    name: 'Tariq Agri Chemicals & Seed Depot',
    nameUrdu: 'طارق ایگرو کیمیکل اینڈ سیڈ ڈپو',
    role: 'dealer',
    phone: '+92 301 7861122',
    location: 'Katchery Chowk, Multan Road',
    locationUrdu: 'کچہری چوک، ملتان روڈ',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    metadata: {
      shopName: 'طارق ایگرو سروسز (رجسٹرڈ ڈیلر)',
      license: 'PEST-RETAIL-MLT-4401',
    },
  },
  aarti: {
    id: 'u-aarti-1',
    name: 'Haji Deen & Sons Commission Agents',
    nameUrdu: 'حاجی محمد دین اینڈ سنز آڑھتی',
    role: 'aarti',
    phone: '+92 300 4567890',
    location: 'Shop # 42, New Ghalla Mandi Arifwala',
    locationUrdu: 'دکان نمبر 42، نیو غلہ منڈی عارف والا',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
    isVerified: true,
    metadata: {
      mandiName: 'غلہ منڈی عارف والا / پاکپتن',
      license: 'MKT-COMM-ARF-92',
    },
  },
};

export interface SampleCropCase {
  id: string;
  cropName: string;
  cropUrdu: string;
  threatName: string;
  threatUrdu: string;
  imageUrl: string;
  notes: string;
}

export const SAMPLE_CROP_CASES: SampleCropCase[] = [
  {
    id: 'case-cotton',
    cropName: 'Cotton',
    cropUrdu: 'کپاس (Cotton)',
    threatName: 'Cotton Leaf Curl Virus (CLCuV)',
    threatUrdu: 'کپاس کا پتا مروڑ وائرس',
    imageUrl: 'https://images.unsplash.com/photo-1599818816854-46f90d4a9ef1?auto=format&fit=crop&w=600&q=80',
    notes: 'پتے الٹے ہو کر پیالے کی شکل اختیار کر رہے ہیں اور نسیں ابھری ہوئی ہیں۔',
  },
  {
    id: 'case-wheat',
    cropName: 'Wheat',
    cropUrdu: 'گندم (Wheat)',
    threatName: 'Yellow Rust / Stripe Rust',
    threatUrdu: 'گندم کی پیلی کنگی (زرد کنگی)',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    notes: 'پتوں پر ہلدی نما زرد لکیریں اور پاؤڈر کی طرح نشانات بن رہے ہیں۔',
  },
  {
    id: 'case-rice',
    cropName: 'Basmati Rice',
    cropUrdu: 'دھان / چاول (Rice)',
    threatName: 'Bacterial Leaf Blight (BLB)',
    threatUrdu: 'دھان کا بیکٹیریائی جھلساؤ',
    imageUrl: 'https://images.unsplash.com/photo-1536939459926-301728717817?auto=format&fit=crop&w=600&q=80',
    notes: 'پتوں کے کنارے نوک سے نیچے کی طرف لہراتی شکل میں سوکھ رہے ہیں۔',
  },
  {
    id: 'case-sugarcane',
    cropName: 'Sugarcane',
    cropUrdu: 'کماد / گنا (Sugarcane)',
    threatName: 'Red Rot (Fungal Attack)',
    threatUrdu: 'کماد کا کینسر (ریڈ راٹ / رتہ روگ)',
    imageUrl: 'https://images.unsplash.com/photo-1594488518002-36e2f1224d08?auto=format&fit=crop&w=600&q=80',
    notes: 'گنے کے اندرونی گودے میں سرخ دھبے اور الکحل کی بو محسوس ہو رہی ہے۔',
  },
  {
    id: 'case-mango',
    cropName: 'Mango',
    cropUrdu: 'آم (Mango Orchard)',
    threatName: 'Anthracnose & Malformation',
    threatUrdu: 'آم کا گچھا روگ و انتھراکنوز',
    imageUrl: 'https://images.unsplash.com/photo-1553279768-865429fa0078?auto=format&fit=crop&w=600&q=80',
    notes: 'بور پر کالے داغ اور بور کا جھاڑو نما گچھا بن جانا۔',
  },
  {
    id: 'case-citrus',
    cropName: 'Citrus / Kinnow',
    cropUrdu: 'کنو / مالٹا (Kinnow)',
    threatName: 'Citrus Canker & Gummosis',
    threatUrdu: 'سائٹرس کینکر و گوند بہنا',
    imageUrl: 'https://images.unsplash.com/photo-1611080626919-7cf5a9dbab5b?auto=format&fit=crop&w=600&q=80',
    notes: 'پھل اور پتوں پر ابھرے ہوئے کھردرے چھالے اور تنے سے گوند کا اخراج۔',
  },
];

export const PAKISTANI_MANDIS = [
  'نیو غلہ منڈی عارف والا (Arifwala)',
  'غلہ منڈی ملتان (Multan)',
  'غلہ منڈی فیصل آباد (Faisalabad)',
  'غلہ منڈی ساہیوال (Sahiwal)',
  'غلہ منڈی سرگودھا (Sargodha)',
  'غلہ منڈی بہاولپور (Bahawalpur)',
  'غلہ منڈی رحیم یار خان (RYK)',
  'غلہ منڈی حیدرآباد (Hyderabad)',
];
