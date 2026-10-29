import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Database,
  Cpu,
  MapPin,
  Layers,
  Code2,
  Lock,
  Copy,
  Check,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

export const ArchitectureDocs: React.FC = () => {
  const { language } = useApp();
  const [activeDocSection, setActiveDocSection] = useState<string>('schema');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const sections = [
    { id: 'schema', label: '1. Database Schema', icon: <Database className="w-4 h-4" /> },
    { id: 'prompt', label: '2. Gemini Crop Doctor & Prompt', icon: <Cpu className="w-4 h-4" /> },
    { id: 'dispatch', label: '3. Geo-Dispatch Engine', icon: <MapPin className="w-4 h-4" /> },
    { id: 'flutter', label: '4. Flutter Multi-Role App', icon: <Smartphone className="w-4 h-4" /> },
    { id: 'security', label: '5. Security Rules & Indexes', icon: <Lock className="w-4 h-4" /> },
  ];

  const FIRESTORE_SCHEMA_CODE = `// Cloud Firestore Database Schema (ZARIBOOK / AgriConnect)

// 1. users Collection
interface UserDocument {
  uid: string;                         // Primary Key (Auth UID)
  phoneNumber: string;                 // +923001234567
  fullName: string;                    // "Muhammad Aslam"
  role: 'farmer' | 'field_officer' | 'scientist' | 'dealer' | 'aarti';
  avatarUrl: string;
  isVerified: boolean;
  preferredLanguage: 'ur' | 'pa' | 'skr' | 'en';
  location: {
    geohash: string;                   // 7-character Geohash e.g., "ttne7v2"
    geopoint: FirebaseFirestore.GeoPoint; // Lat: 30.1575, Lng: 71.5249
    tehsil: string;                    // "Multan Sadar"
    district: string;                  // "Multan"
    province: string;                  // "Punjab"
  };
  metadata: {
    landSizeAcres?: number;
    primaryCrops?: string[];           // ["Cotton", "Wheat", "Mango"]
    organization?: string;             // "Pest Warning & Quality Control"
    licenseNumber?: string;            // "PEST-RET-8821"
    shopName?: string;                 // "Tariq Agri Depot"
    mandiLocation?: string;            // "New Ghalla Mandi Arifwala"
  };
  fcmToken: string;
  createdAt: FirebaseFirestore.Timestamp;
}

// 2. posts Collection (Social & Voice Feed)
interface PostDocument {
  postId: string;
  authorId: string;
  authorRole: string;
  authorName: string;
  cropCategory: string;                // "Wheat", "Cotton", "Rice"
  textDescription: string;
  mediaUrls: string[];
  voiceNoteUrl?: string;               // Audio file URL
  voiceDurationSeconds?: number;
  location: {
    geohash: string;
    geopoint: FirebaseFirestore.GeoPoint;
    district: string;
  };
  likesCount: number;
  commentsCount: number;
  hasExpertValidation: boolean;
  validatedByScientistId?: string;
  createdAt: FirebaseFirestore.Timestamp;
}

// 3. mandi_rates Collection (Real-Time Grain Board)
interface MandiRateDocument {
  rateId: string;
  aartiId: string;
  aartiName: string;
  mandiName: string;                   // "Arifwala Grain Market"
  crop: string;                        // "Wheat (گندم)"
  variety: string;                     // "Dilkash-20"
  unit: 'Maund' | 'Kg';                // 40 Kg Maund
  minPrice: number;                    // 3850 PKR
  maxPrice: number;                    // 4100 PKR
  avgPrice: number;                    // 3975 PKR
  date: string;                        // YYYY-MM-DD
  geohash: string;
  createdAt: FirebaseFirestore.Timestamp;
}

// 4. products Collection (Digital Agri Depot)
interface ProductDocument {
  productId: string;
  dealerId: string;
  dealerName: string;
  title: string;                       // "Confidor 200 SL"
  brand: string;                       // "Bayer CropScience"
  category: 'Pesticide' | 'Fertilizer' | 'Seed' | 'Biostimulant';
  price: number;                       // 2450 PKR
  packSize: string;                    // "250 ml"
  registrationNumber: string;          // Official Govt Agri Reg
  inStock: boolean;
  updatedAt: FirebaseFirestore.Timestamp;
}

// 5. field_visits Collection (Geo-Dispatch & On-Site Care)
interface FieldVisitDocument {
  visitId: string;
  farmerId: string;
  farmerName: string;
  farmerPhone: string;
  fieldOfficerId?: string;
  status: 'pending' | 'accepted' | 'en_route' | 'completed';
  cropIssueDescription: string;
  cropType: string;
  farmerLocation: {
    geopoint: FirebaseFirestore.GeoPoint;
    addressDescription: string;
  };
  officerReport?: {
    diagnosis: string;
    treatmentPrescribed: string;
    recommendedProducts: string[];
    visitedAt: FirebaseFirestore.Timestamp;
  };
  createdAt: FirebaseFirestore.Timestamp;
}

// 6. ai_logs Collection (Diagnostics Telemetry & Voice Cache)
interface AILogDocument {
  logId: string;
  farmerId: string;
  cropHint: string;
  structuredResult: {
    diseasePestName: string;
    confidenceScore: number;
    severity: 'Mild' | 'Moderate' | 'Severe';
    cureUrdu: string;
    recommendedChemicalActives: string[];
  };
  ttsAudioUrl: string;
  createdAt: FirebaseFirestore.Timestamp;
}`;

  const SYSTEM_PROMPT_CODE = `// High-Impact Production System Prompt for ZARIBOOK AI Crop Doctor (زرعی معالج)

You are ZARIBOOK AI Crop Doctor (زرعی معالج), an authority in South Asian Agronomy,
Phytopathology, and Entomology, trained specifically on the crop profiles of
Punjab, Sindh, Khyber Pakhtunkhwa, and Balochistan.

YOUR CAPABILITIES & DOMAIN SCOPE:
- Target Crops: Wheat (گندم), Cotton (کپاس), Basmati Rice (دھان), Sugarcane (کماد),
  Maize (مکئی), Mango (آم), Citrus/Kinnow (کنو), Tomato, Potato, and Chili.
- Target Threats: Cotton Leaf Curl Virus (CLCuV), Pink/Spotted Bollworm (گلابی سنڈی),
  Whitefly (سفید مکھی), Yellow/Brown Rusts (کنگی), Bacterial Leaf Blight, Red Rot,
  Aphids (سست تیلا), Fall Armyworm (لشکری سنڈی), Termites.

DIAGNOSTIC & REASONING RULES:
1. Examine image evidence (chlorosis, lesions, defoliation, fungal sporulation,
   vascular discoloration, feeding punctures).
2. Cross-verify if visual symptoms could be abiotic stress (e.g., Nitrogen/Zinc
   deficiency, canal water salinity, heat scorch, frost damage) versus pathogen attack.
3. Formulate your remedy in 3 actionable tiers:
   - IMMEDIATE: Chemical active ingredient (with standardized dosage per 100L water
     or per acre). Do not favor proprietary brands; provide generic active formulas
     (e.g., "Chlorantraniliprole 20% SC @ 50ml/acre", "Pyriproxyfen @ 500ml/acre").
   - CULTURAL/BIOLOGICAL: Water management, field sanitation, light traps, neem extract,
     yellow sticky cards, Trichogramma cards.
   - PREVENTIVE: Soil solarization, seed treatment with fungicides, crop rotation.

COMMUNICATION CONSTRAINTS (CRITICAL FOR ILLITERATE/SEMI-LITERATE FARMERS):
- Output JSON ONLY matching the provided system schema.
- 'vernacularExplanation' and 'immediateActionUrdu' MUST be written in idiomatic,
  empathetic, simple Pakistani Urdu (عوامی کسان زبان).
- Avoid high-flown literary terms; use regional farming vocabulary (e.g., use 'پھپھوندی'
  for fungus, 'رس چوسنے والے کیڑے' for sucking pests, 'وتر حالت' for optimum field moisture).
- Include personal safety advice for spray application (e.g., "ماسک کا استعمال کریں
  اور ہوا کے رخ سپرے نہ کریں").`;

  const GEO_DISPATCH_CODE = `// Geo-Location Dispatch System (Nearby Field Officer Radius Matching)
import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

/**
 * Computes geohash query bounds for a given coordinate & radius (25 km)
 */
function getGeohashRange(lat: number, lon: number, radiusKm: number = 25) {
  const latDelta = radiusKm / 110.574;
  const lonDelta = radiusKm / (111.320 * Math.cos((lat * Math.PI) / 180));

  return {
    minLat: lat - latDelta,
    maxLat: lat + latDelta,
    minLon: lon - lonDelta,
    maxLon: lon + lonDelta,
  };
}

export const requestFieldVisit = functions.https.onCall(async (data, context) => {
  const { latitude, longitude, cropType, cropIssueDescription, addressDescription } = data;
  const farmerId = context.auth?.uid;

  // 1. Save Visit Record to Firestore
  const visitRef = await admin.firestore().collection("field_visits").add({
    farmerId,
    cropType,
    cropIssueDescription,
    status: "pending",
    farmerLocation: {
      geopoint: new admin.firestore.GeoPoint(latitude, longitude),
      addressDescription,
    },
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });

  // 2. Query Field Officers within 25 km bounding radius
  const bounds = getGeohashRange(latitude, longitude, 25);
  const officersSnapshot = await admin.firestore()
    .collection("users")
    .where("role", "==", "field_officer")
    .where("location.geopoint", ">=", new admin.firestore.GeoPoint(bounds.minLat, bounds.minLon))
    .where("location.geopoint", "<=", new admin.firestore.GeoPoint(bounds.maxLat, bounds.maxLon))
    .get();

  const registrationTokens: string[] = [];
  officersSnapshot.forEach((doc) => {
    const fcm = doc.data().fcmToken;
    if (fcm) registrationTokens.push(fcm);
  });

  // 3. Dispatch FCM High-Priority Emergency Broadcast
  if (registrationTokens.length > 0) {
    await admin.messaging().sendEachForMulticast({
      tokens: registrationTokens,
      notification: {
        title: "🚨 نئی فیلڈ وزٹ درخواست",
        body: \`فصل: \${cropType} - پتہ: \${addressDescription} (25km کے اندر)\`,
      },
      data: { visitId: visitRef.id, type: "NEW_FIELD_REQUEST" },
    });
  }

  return { success: true, visitId: visitRef.id, notifiedOfficers: registrationTokens.length };
});`;

  const FLUTTER_ROUTER_CODE = `// Flutter Role-Based Dynamic Navigation & Audio Player
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

class RoleBasedRouter extends StatelessWidget {
  const RoleBasedRouter({super.key});

  @override
  Widget build(BuildContext context) {
    final user = FirebaseAuth.instance.currentUser;
    if (user == null) return const LoginScreen();

    return FutureBuilder<DocumentSnapshot>(
      future: FirebaseFirestore.instance.collection('users').doc(user.uid).get(),
      builder: (context, snapshot) {
        if (!snapshot.hasData || !snapshot.data!.exists) {
          return const Scaffold(body: Center(child: CircularProgressIndicator()));
        }

        final role = snapshot.data!.get('role') as String;
        switch (role) {
          case 'farmer':
            return const FarmerDashboard();
          case 'field_officer':
            return const OfficerRadarDashboard();
          case 'scientist':
            return const ScientistDeskScreen();
          case 'dealer':
            return const DealerStoreScreen();
          case 'aarti':
            return const MandiRateBoard();
          default:
            return const FarmerDashboard();
        }
      },
    );
  }
}`;

  const SECURITY_RULES_CODE = `// Firestore Security Rules (firestore.rules)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    function isAuthenticated() { return request.auth != null; }
    function isOwner(userId) { return isAuthenticated() && request.auth.uid == userId; }
    function hasRole(role) { return isAuthenticated() && request.auth.token.role == role; }

    match /users/{userId} {
      allow read: if isAuthenticated();
      allow write: if isOwner(userId);
    }

    match /mandi_rates/{rateId} {
      allow read: if isAuthenticated();
      allow create, update: if isAuthenticated() && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'aarti';
    }

    match /field_visits/{visitId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isAuthenticated() && (
        resource.data.farmerId == request.auth.uid || 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'field_officer'
      );
    }

    match /ai_logs/{logId} {
      allow read: if isAuthenticated();
      allow write: if false; // Only Cloud Functions can write to AI logs
    }
  }
}`;

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 rounded-2xl p-5 text-white shadow-lg border border-stone-700 flex items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-extrabold mb-2 shadow-xs">
            <Code2 className="w-3.5 h-3.5" />
            <span>Technical Architecture & Production Blueprints</span>
          </div>
          <h2 className="text-xl font-black">
            {language === 'ur' ? 'زرعی بک / ایگری کنیکٹ کا مکمل تکنیکی خاکہ' : 'ZARIBOOK / AgriConnect Architecture & Specs'}
          </h2>
          <p className="text-stone-300 text-xs max-w-2xl mt-1">
            {language === 'ur'
              ? 'ڈیٹابیس سکیما، جیو ڈسپیچ لاجک، جیمینائی سسٹم پرامپٹ، فلٹر نیویگیشن، اور فائر سٹور سیکیورٹی رولز۔'
              : 'Interactive repository of full system blueprints, database schemas, Gemini prompts, and cloud dispatch functions.'}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl p-2 border border-stone-200 shadow-sm flex items-center gap-2 overflow-x-auto scrollbar-none">
        {sections.map((s) => (
          <button
            key={s.id}
            onClick={() => setActiveDocSection(s.id)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              activeDocSection === s.id
                ? 'bg-stone-900 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
            }`}
          >
            {s.icon}
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* Code Display Card */}
      <div className="bg-stone-900 rounded-2xl border border-stone-800 overflow-hidden shadow-lg">
        <div className="bg-stone-950 px-4 py-2.5 border-b border-stone-800 flex items-center justify-between text-xs text-stone-400 font-mono">
          <span className="flex items-center gap-2 text-stone-200">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
            {activeDocSection === 'schema' && 'firestore-blueprint.ts'}
            {activeDocSection === 'prompt' && 'ai-crop-doctor-system-prompt.txt'}
            {activeDocSection === 'dispatch' && 'functions/geoDispatch.ts'}
            {activeDocSection === 'flutter' && 'lib/core/role_router.dart'}
            {activeDocSection === 'security' && 'firestore.rules'}
          </span>

          <button
            onClick={() => {
              const codeMap: Record<string, string> = {
                schema: FIRESTORE_SCHEMA_CODE,
                prompt: SYSTEM_PROMPT_CODE,
                dispatch: GEO_DISPATCH_CODE,
                flutter: FLUTTER_ROUTER_CODE,
                security: SECURITY_RULES_CODE,
              };
              copyToClipboard(activeDocSection, codeMap[activeDocSection] || '');
            }}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-sans font-semibold transition-colors"
          >
            {copiedKey === activeDocSection ? (
              <>
                <Check className="w-3.5 h-3.5 text-lime-400" />
                <span className="text-lime-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        <div className="p-4 overflow-x-auto max-h-[580px] overflow-y-auto">
          <pre className="text-xs font-mono text-emerald-300 leading-relaxed">
            {activeDocSection === 'schema' && FIRESTORE_SCHEMA_CODE}
            {activeDocSection === 'prompt' && SYSTEM_PROMPT_CODE}
            {activeDocSection === 'dispatch' && GEO_DISPATCH_CODE}
            {activeDocSection === 'flutter' && FLUTTER_ROUTER_CODE}
            {activeDocSection === 'security' && SECURITY_RULES_CODE}
          </pre>
        </div>
      </div>
    </div>
  );
};
