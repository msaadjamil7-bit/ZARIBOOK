import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { FieldVisitItem } from '../types';
import { ContactActions } from './ContactActions';
import { RoleBadge } from './RoleBadge';
import {
  Navigation,
  MapPin,
  Clock,
  Phone,
  CheckCircle,
  AlertCircle,
  FileText,
  UserCheck,
  Shield,
  ArrowRight,
  Send,
  Radio,
  Compass,
} from 'lucide-react';

export const FieldOfficerRadar: React.FC = () => {
  const { role, currentUser, language, visitPreFillIssue, showNotification, addNotification } = useApp();
  const [visits, setVisits] = useState<FieldVisitItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedVisit, setSelectedVisit] = useState<FieldVisitItem | null>(null);

  // Farmer Request Form State
  const [farmerName, setFarmerName] = useState<string>(currentUser.nameUrdu);
  const [farmerPhone, setFarmerPhone] = useState<string>(currentUser.phone);
  const [farmerVillage, setFarmerVillage] = useState<string>('چک 148/9-L، نزد نہر، ساہیوال');
  const [cropType, setCropType] = useState<string>('Cotton (کپاس - 20 ایکڑ)');
  const [cropIssue, setCropIssue] = useState<string>(visitPreFillIssue || 'فیلڈ میں بیماری کا معائنہ درکار ہے۔');
  const [urgency, setUrgency] = useState<'high' | 'medium' | 'normal'>('high');

  // Officer Report Logger State
  const [reportDiagnosis, setReportDiagnosis] = useState<string>('سفید مکھی اور پتا مروڑ وائرس کی تصدیق ہوئی۔');
  const [reportPrescription, setReportPrescription] = useState<string>(
    'پائیری پراکسی فن 500 ملی لیٹر + ایسیٹامپرڈ کا فوری سپرے صبح ٹھنڈے وقت کریں۔'
  );
  const [showReportModal, setShowReportModal] = useState<boolean>(false);

  useEffect(() => {
    loadVisits();
  }, []);

  useEffect(() => {
    if (visitPreFillIssue) {
      setCropIssue(visitPreFillIssue);
    }
  }, [visitPreFillIssue]);

  const loadVisits = () => {
    setLoading(true);
    fetch('/api/field-visits')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.visits) {
          setVisits(data.visits);
          if (data.visits.length > 0) {
            setSelectedVisit(data.visits[0]);
          }
        }
      })
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  };

  const handleRequestVisit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/field-visits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farmerName,
          farmerPhone,
          farmerVillage,
          cropType,
          cropIssueDescription: cropIssue,
          urgency,
          latitude: 30.1575,
          longitude: 71.5249,
        }),
      });

      const data = await res.json();
      if (data.success && data.visit) {
        setVisits([data.visit, ...visits]);
        setSelectedVisit(data.visit);
        addNotification({
          type: 'field_visit',
          title: 'Field Visit Request Dispatched',
          titleUrdu: 'فیلڈ وزٹ درخواست روانہ ہو گئی',
          message: `Location: ${farmerVillage} (${cropType})`,
          messageUrdu: `مقام: ${farmerVillage} - 25 کلومیٹر کے فیلڈ آفیسرز کو الرٹ بھیج دیا گیا۔`,
          linkTab: 'field_visit',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptVisit = async (visitId: string) => {
    try {
      const res = await fetch(`/api/field-visits/${visitId}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerName: currentUser.nameUrdu }),
      });
      const data = await res.json();
      if (data.success && data.visit) {
        setVisits((prev) => prev.map((v) => (v.id === visitId ? data.visit : v)));
        setSelectedVisit(data.visit);
        addNotification({
          type: 'field_visit',
          title: 'Field Visit Accepted',
          titleUrdu: 'فیلڈ وزٹ شیڈول ہو گیا',
          message: `Officer ${currentUser.name} accepted visit for ${data.visit.farmerName}`,
          messageUrdu: `فیلڈ آفیسر ${currentUser.nameUrdu} نے وزٹ قبول کر لیا۔ نیویگیشن شروع کریں۔`,
          linkTab: 'field_visit',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCompleteVisit = async () => {
    if (!selectedVisit) return;

    try {
      const res = await fetch(`/api/field-visits/${selectedVisit.id}/complete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosis: reportDiagnosis,
          treatmentPrescribed: reportPrescription,
          recommendedActives: ['Pyriproxyfen', 'Acetamiprid'],
        }),
      });
      const data = await res.json();
      if (data.success && data.visit) {
        setVisits((prev) => prev.map((v) => (v.id === selectedVisit.id ? data.visit : v)));
        setSelectedVisit(data.visit);
        setShowReportModal(false);
        showNotification('ڈیجیٹل وزٹ رپورٹ کامیابی سے محفوظ ہو گئی۔');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Radar Status Banner - Simple & Solid */}
      <div className="bg-teal-900 rounded-2xl p-5 text-white shadow-sm border border-teal-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-teal-950 text-xs font-bold mb-2 shadow-xs">
            <Radio className="w-3.5 h-3.5 text-teal-700" />
            <span>Geo-Location Bounding Dispatch (25km Operational Radius)</span>
          </div>
          <h2 className="text-xl font-black">
            {language === 'ur' ? 'فیلڈ وزٹ ریڈار و لائیو ڈسپیچ' : 'Field Officer Dispatch Radar'}
          </h2>
          <p className="text-teal-100 text-xs max-w-2xl mt-1">
            {language === 'ur'
              ? 'کسان اپنے فارم کی لوکیشن پن کر کے قریبی فیلڈ آفیسر کا موقع پر وزٹ کروا سکتے ہیں، اور آفیسرز 25 کلومیٹر کے اندر فوری الرٹس وصول کرتے ہیں۔'
              : 'Automated proximity matching for agricultural extension officers and farmers within 25 km geohash zones.'}
          </p>
        </div>

        <div className="flex items-center gap-2 bg-teal-950 border border-teal-800 px-3.5 py-2 rounded-xl text-xs">
          <Compass className="w-4 h-4 text-emerald-400" />
          <div>
            <span className="text-teal-300 block text-[10px]">Active Zone</span>
            <span className="font-bold text-white">Multan & Sahiwal Circle</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: List of Visit Requests (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <span>{language === 'ur' ? 'فیلڈ وزٹ درخواستیں' : 'Field Visit Requests'}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 font-extrabold">
                  {visits.length}
                </span>
              </h3>
              <button
                onClick={loadVisits}
                className="text-xs text-teal-700 font-semibold hover:underline"
              >
                ریفریش
              </button>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-stone-400">لوڈ ہو رہا ہے...</div>
            ) : visits.length === 0 ? (
              <div className="py-8 text-center text-xs text-stone-400">کوئی درخواست نہیں ملی۔</div>
            ) : (
              <div className="space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
                {visits.map((item) => {
                  const isSelected = selectedVisit?.id === item.id;
                  const isPending = item.status === 'pending';
                  const isAccepted = item.status === 'accepted';
                  const isCompleted = item.status === 'completed';

                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedVisit(item)}
                      className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${
                        isSelected
                          ? 'border-teal-700 bg-teal-50/60 ring-2 ring-teal-600/20 shadow-xs'
                          : 'border-stone-200 bg-white hover:border-stone-300'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-xs text-stone-900">{item.farmerName}</span>
                          <RoleBadge role="farmer" size="sm" language={language} />
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-extrabold ${
                            isCompleted
                              ? 'bg-emerald-100 text-emerald-800'
                              : isAccepted
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-rose-100 text-rose-800 animate-pulse'
                          }`}
                        >
                          {isCompleted ? 'وزٹ مکمل' : isAccepted ? 'قبول شدہ' : 'زیرِ التواء (Pending)'}
                        </span>
                      </div>

                      <p className="text-xs font-semibold text-emerald-900 mb-1">{item.cropType}</p>
                      <p className="text-xs text-stone-600 font-urdu line-clamp-1 text-right" dir="rtl">
                        {item.cropIssueDescription}
                      </p>

                      <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2 pt-2 border-t border-stone-100">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-teal-600" />
                          {item.distanceKm || 6.2} km فاصلہ
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-stone-400" />
                          {item.createdAt}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* New Field Visit Request Form (Accessible by Farmers) */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Navigation className="w-4 h-4 text-emerald-700" />
              <span>{language === 'ur' ? 'نئی فیلڈ وزٹ درخواست بھیجیں' : 'Request On-Site Officer Visit'}</span>
            </h3>
            <p className="text-xs text-stone-500">
              اپنے کھیت کی لوکیشن اور مسئلہ درج کریں، قریبی فیلڈ آفیسر آپ کے فارم کا دورہ کرے گا۔
            </p>

            <form onSubmit={handleRequestVisit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">کسان کا نام و فون:</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={farmerName}
                    onChange={(e) => setFarmerName(e.target.value)}
                    className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    placeholder="نام"
                    required
                  />
                  <input
                    type="text"
                    value={farmerPhone}
                    onChange={(e) => setFarmerPhone(e.target.value)}
                    className="bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono"
                    placeholder="0300-1234567"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">کھیت کا پتہ / چک و نشان دہی:</label>
                <input
                  type="text"
                  value={farmerVillage}
                  onChange={(e) => setFarmerVillage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">فصل و رقبہ:</label>
                  <input
                    type="text"
                    value={cropType}
                    onChange={(e) => setCropType(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">ضرورت / ارجنسی:</label>
                  <select
                    value={urgency}
                    onChange={(e) => setUrgency(e.target.value as any)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                  >
                    <option value="high">فوری دورہ درکار (High)</option>
                    <option value="medium">24 گھنٹے میں (Medium)</option>
                    <option value="normal">معمول کا چکر (Normal)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">مسئلے کی تفصیل:</label>
                <textarea
                  rows={2}
                  value={cropIssue}
                  onChange={(e) => setCropIssue(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-2.5 text-stone-900 font-urdu text-right"
                  dir="rtl"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 px-4 rounded-xl bg-teal-800 hover:bg-teal-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <Send className="w-3.5 h-3.5 text-lime-400" />
                <span>{language === 'ur' ? 'درخواست قریبی آفیسرز کو براڈکاسٹ کریں' : 'Broadcast to Nearby Officers'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Interactive Map Simulation & Field Inspection Desk (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedVisit ? (
            <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
              {/* Simulated Map Viewport */}
              <div className="relative h-64 sm:h-72 bg-emerald-950 overflow-hidden flex items-center justify-center border-b border-stone-200">
                {/* Stylized Agriculture Land Topography Grid */}
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    backgroundImage: `radial-gradient(#84cc16 1.5px, transparent 1.5px), radial-gradient(#10b981 1.5px, #064e3b 1.5px)`,
                    backgroundSize: '40px 40px',
                    backgroundPosition: '0 0, 20px 20px',
                  }}
                />

                {/* Radar Sweep Animation */}
                <div className="absolute w-72 h-72 rounded-full border border-teal-500/40 animate-ping pointer-events-none" />
                <div className="absolute w-96 h-96 rounded-full border border-emerald-500/20 pointer-events-none" />

                {/* Center Officer Pin */}
                <div className="absolute flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-teal-500 text-emerald-950 flex items-center justify-center shadow-lg font-bold border-2 border-white">
                    <Shield className="w-4 h-4 text-emerald-950" />
                  </div>
                  <span className="text-[10px] font-bold text-teal-200 bg-emerald-950/80 px-2 py-0.5 rounded-full mt-1 border border-teal-700/60">
                    Field Officer HQ
                  </span>
                </div>

                {/* Farmer Field Pin */}
                <div className="absolute top-12 right-20 flex flex-col items-center animate-bounce">
                  <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-xl border-2 border-white">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold text-white bg-rose-950/90 px-2 py-0.5 rounded-full mt-1 border border-rose-500/50 shadow-md">
                    {selectedVisit.farmerName.split(' ')[0]} ({selectedVisit.distanceKm || 6.2} km)
                  </span>
                </div>

                {/* Turn-by-Turn GPS HUD Banner */}
                <div className="absolute bottom-3 left-3 right-3 bg-stone-900/90 backdrop-blur-md rounded-xl p-3 text-white flex items-center justify-between text-xs border border-stone-700/60 shadow-lg">
                  <div className="flex items-center gap-2.5">
                    <Navigation className="w-5 h-5 text-lime-400" />
                    <div>
                      <span className="font-bold text-white block">
                        Google Maps Navigation Route
                      </span>
                      <span className="text-[11px] text-stone-300">
                        {selectedVisit.farmerVillage}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-lime-400 text-sm">
                      ~{Math.round((selectedVisit.distanceKm || 8) * 1.8)} منٹ
                    </span>
                    <span className="text-[10px] text-stone-400 block">
                      {selectedVisit.distanceKm || 8} km فاصلہ
                    </span>
                  </div>
                </div>
              </div>

              {/* Visit Details & Officer Actions */}
              <div className="p-5 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold text-teal-700 uppercase">
                      فیلڈ وزٹ معائنہ شیٹ
                    </span>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-black text-stone-900">
                        {selectedVisit.farmerName}
                      </h3>
                      <RoleBadge role="farmer" size="sm" language={language} />
                      <span className="text-stone-400">·</span>
                      <span className="text-sm font-bold text-emerald-900">{selectedVisit.cropType}</span>
                    </div>
                    <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-400" />
                      {selectedVisit.farmerVillage}
                    </p>
                  </div>

                </div>

                {/* Direct Contact: Call, SMS, WhatsApp */}
                <ContactActions
                  phone={selectedVisit.farmerPhone}
                  name={selectedVisit.farmerName}
                  roleLabel="کسان موبائل رابطہ (Farmer Mobile)"
                  contextText={`فیلڈ وزٹ: ${selectedVisit.cropType} - ${selectedVisit.cropIssueDescription}`}
                  variant="inline"
                />

                {/* Problem Description */}
                <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-[11px] font-bold text-stone-500 block mb-1">
                    کسان کی درج کردہ شکایت / علامات:
                  </span>
                  <p className="text-stone-800 text-xs font-urdu leading-relaxed text-right" dir="rtl">
                    {selectedVisit.cropIssueDescription}
                  </p>
                </div>

                {/* If already completed, show digital report */}
                {selectedVisit.status === 'completed' && selectedVisit.officerReport && (
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                      <CheckCircle className="w-4 h-4 text-emerald-700" />
                      <span>
                        آفیشل فیلڈ رپورٹ (مکمل شدہ از: {selectedVisit.assignedOfficerName || 'فیلڈ آفیسر'})
                      </span>
                    </div>
                    <p className="text-xs text-emerald-950 font-urdu text-right" dir="rtl">
                      <strong>تشخیص: </strong>
                      {selectedVisit.officerReport.diagnosis}
                    </p>
                    <p className="text-xs text-emerald-950 font-urdu text-right" dir="rtl">
                      <strong>تجویز کردہ سپرے: </strong>
                      {selectedVisit.officerReport.treatmentPrescribed}
                    </p>
                    <span className="text-[10px] text-stone-500 block">
                      معائنہ کا وقت: {selectedVisit.officerReport.visitedAt}
                    </span>
                  </div>
                )}

                {/* Action Buttons for Officer */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100">
                  {selectedVisit.status === 'pending' && (
                    <button
                      onClick={() => handleAcceptVisit(selectedVisit.id)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>وزٹ قبول کریں (Accept & Start Route)</span>
                    </button>
                  )}

                  {selectedVisit.status === 'accepted' && (
                    <button
                      onClick={() => setShowReportModal(true)}
                      className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <FileText className="w-4 h-4 text-lime-400" />
                      <span>موقع پر ڈیجیٹل رپورٹ درج کریں (Log Field Report)</span>
                    </button>
                  )}

                  <a
                    href={`https://maps.google.com/?q=${selectedVisit.latitude},${selectedVisit.longitude}`}
                    target="_blank"
                    rel="noreferrer"
                    className="py-2.5 px-4 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-3.5 h-3.5 text-stone-600" />
                    <span>گوگل میپس میں کھولیں</span>
                  </a>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 text-center border border-stone-200 text-stone-400 text-xs">
              درخواست منتخب کریں
            </div>
          )}
        </div>
      </div>

      {/* Field Inspection Report Modal */}
      {showReportModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">
                ڈیجیٹل فیلڈ معائنہ رپورٹ درج کریں
              </h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  موقع پر تصدیق شدہ مرض / کیڑا:
                </label>
                <input
                  type="text"
                  value={reportDiagnosis}
                  onChange={(e) => setReportDiagnosis(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-urdu text-right"
                  dir="rtl"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  تجویز کردہ کیمیائی فارمولا و ڈوز:
                </label>
                <textarea
                  rows={3}
                  value={reportPrescription}
                  onChange={(e) => setReportPrescription(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-900 font-urdu text-right"
                  dir="rtl"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                onClick={() => setShowReportModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
              >
                منسوخ کریں
              </button>
              <button
                onClick={handleCompleteVisit}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm"
              >
                رپورٹ جمع کریں و وزٹ مکمل کریں
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
