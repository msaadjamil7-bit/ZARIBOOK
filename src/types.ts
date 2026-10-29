export type UserRole = 'farmer' | 'field_officer' | 'scientist' | 'dealer' | 'aarti';

export type Language = 'ur' | 'en';

export interface UserProfile {
  id: string;
  name: string;
  nameUrdu: string;
  role: UserRole;
  phone: string;
  location: string;
  locationUrdu: string;
  avatar: string;
  isVerified: boolean;
  metadata?: {
    landAcres?: number;
    crops?: string[];
    department?: string;
    license?: string;
    shopName?: string;
    mandiName?: string;
  };
}

export interface DiagnosisResult {
  diseasePestNameUrdu: string;
  diseasePestNameEn: string;
  scientificName: string;
  confidenceScore: number;
  severity: 'Mild' | 'Moderate' | 'Severe';
  cropIdentified: string;
  affectedPart: string;
  vernacularExplanationUrdu: string;
  vernacularExplanationEn: string;
  immediateActionUrdu: string;
  immediateActionEn: string;
  recommendedActiveIngredients: string[];
  dosageInstructionsUrdu?: string;
  dosageInstructionsEn?: string;
  culturalBiologicalCareUrdu?: string;
  culturalBiologicalCareEn?: string;
  preventiveMeasuresUrdu?: string;
  preventiveMeasuresEn?: string;
  safetyPrecautionsUrdu?: string;
}

export interface PostItem {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
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

export type ActivityType =
  | 'harvest'
  | 'field_work'
  | 'inspection'
  | 'research'
  | 'stock_arrival'
  | 'mandi_trade'
  | 'general';

export interface ActivityItem {
  id: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  authorPhone?: string;
  authorLocation: string;
  authorAvatar: string;
  activityType: ActivityType;
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

export interface MandiRateItem {
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

export interface ProductItem {
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

export interface FieldVisitItem {
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
  assignedOfficerPhone?: string;
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

export type NotificationCategory = 'doctor' | 'feed' | 'calculator' | 'field_visit' | 'mandi' | 'store' | 'system';

export interface AppNotification {
  id: string;
  type: NotificationCategory;
  title: string;
  titleUrdu: string;
  message: string;
  messageUrdu: string;
  timestamp: string;
  read: boolean;
  linkTab?: 'ai' | 'calculator' | 'field_visit' | 'agri_feed' | 'mandi' | 'store';
  actionData?: any;
}
