import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { ActivityItem, ActivityType, UserRole } from '../types';
import { ContactActions } from './ContactActions';
import { RoleBadge } from './RoleBadge';
import {
  Rss,
  Image as ImageIcon,
  Send,
  Heart,
  MessageCircle,
  Share2,
  MapPin,
  Sparkles,
  Tractor,
  Wheat,
  Search,
  FlaskConical,
  Package,
  Scale,
  Plus,
  Filter,
  CheckCircle2,
  Tag,
} from 'lucide-react';

export const AgriFeed: React.FC = () => {
  const { role, currentUser, language, showNotification, addNotification } = useApp();
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [showPostModal, setShowPostModal] = useState<boolean>(false);

  // New Activity Form State
  const [activityTitle, setActivityTitle] = useState<string>('');
  const [activityType, setActivityType] = useState<ActivityType>('harvest');
  const [activityDesc, setActivityDesc] = useState<string>('');
  const [activityLocation, setActivityLocation] = useState<string>(currentUser.locationUrdu);
  const [activityImage, setActivityImage] = useState<string>(
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=800&q=80'
  );
  const [customTag, setCustomTag] = useState<string>('');

  // Comment inputs
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    loadActivities();
  }, [selectedRoleFilter, selectedTypeFilter]);

  const loadActivities = () => {
    setLoading(true);
    fetch(`/api/activities?role=${selectedRoleFilter}&type=${selectedTypeFilter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.activities) {
          setActivities(data.activities);
        }
      })
      .catch((err) => console.error('Failed to load activities:', err))
      .finally(() => setLoading(false));
  };

  const handleLike = async (actId: string) => {
    try {
      const res = await fetch(`/api/activities/${actId}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setActivities((prev) =>
          prev.map((a) => (a.id === actId ? { ...a, likesCount: data.likesCount } : a))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (actId: string) => {
    const text = commentInputs[actId]?.trim();
    if (!text) return;

    try {
      const res = await fetch(`/api/activities/${actId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: currentUser.nameUrdu,
          authorRole: role,
          text,
        }),
      });
      const data = await res.json();
      if (data.success && data.comment) {
        setActivities((prev) =>
          prev.map((a) => {
            if (a.id === actId) {
              return {
                ...a,
                commentsCount: a.commentsCount + 1,
                comments: [...a.comments, data.comment],
              };
            }
            return a;
          })
        );
        setCommentInputs((prev) => ({ ...prev, [actId]: '' }));
        showNotification('تبصرہ شامل ہو گیا۔');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activityDesc.trim()) {
      showNotification('براہ کرم سرگرمی کی تفصیل درج کریں۔');
      return;
    }

    const tagsList = [
      activityType === 'harvest'
        ? 'فصل_کٹائی'
        : activityType === 'field_work'
        ? 'کاشتکاری'
        : activityType === 'inspection'
        ? 'فیلڈ_وزٹ'
        : activityType === 'research'
        ? 'زرعی_تحقیق'
        : activityType === 'stock_arrival'
        ? 'کھاد_اسٹاک'
        : 'غلہ_منڈی',
    ];
    if (customTag.trim()) {
      tagsList.push(customTag.trim().replace(/^#/, ''));
    }

    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: currentUser.nameUrdu,
          authorRole: role,
          authorPhone: currentUser.phone,
          authorLocation: activityLocation,
          authorAvatar: currentUser.avatar,
          activityType,
          activityTitle: activityTitle || 'Farm Activity',
          activityTitleUrdu: activityTitle || 'روزمرہ زرعی سرگرمی',
          description: activityDesc,
          mediaUrl: activityImage,
          tags: tagsList,
        }),
      });

      const data = await res.json();
      if (data.success && data.activity) {
        setActivities([data.activity, ...activities]);
        setShowPostModal(false);
        setActivityDesc('');
        setActivityTitle('');
        setCustomTag('');
        addNotification({
          type: 'feed',
          title: 'Your activity is live on Agri Feed',
          titleUrdu: 'آپ کی سرگرمی ایگری فیڈ پر لائیو ہو گئی',
          message: `Posted: ${activityTitle || 'Farm update'}`,
          messageUrdu: `شائع شدہ: ${activityTitle || 'زرعی سرگرمی'}`,
          linkTab: 'agri_feed',
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getActivityTypeDetails = (type: ActivityType) => {
    switch (type) {
      case 'harvest':
        return {
          labelUrdu: 'فصل کی کٹائی و پیداوار',
          labelEn: 'Harvest & Yield',
          icon: <Wheat className="w-3.5 h-3.5" />,
          color: 'bg-amber-100 text-amber-900 border-amber-300',
        };
      case 'field_work':
        return {
          labelUrdu: 'کاشت و ٹریکٹر ورک',
          labelEn: 'Field Work & Tillage',
          icon: <Tractor className="w-3.5 h-3.5" />,
          color: 'bg-emerald-100 text-emerald-900 border-emerald-300',
        };
      case 'inspection':
        return {
          labelUrdu: 'فیلڈ معائنہ و اسکاؤٹنگ',
          labelEn: 'Field Inspection',
          icon: <Search className="w-3.5 h-3.5" />,
          color: 'bg-teal-100 text-teal-900 border-teal-300',
        };
      case 'research':
        return {
          labelUrdu: 'سائنسی تحقیق و ٹرائلز',
          labelEn: 'Science & Research',
          icon: <FlaskConical className="w-3.5 h-3.5" />,
          color: 'bg-blue-100 text-blue-900 border-blue-300',
        };
      case 'stock_arrival':
        return {
          labelUrdu: 'کھاد و ادویات اسٹاک',
          labelEn: 'Input Stock Arrival',
          icon: <Package className="w-3.5 h-3.5" />,
          color: 'bg-lime-100 text-lime-900 border-lime-300',
        };
      case 'mandi_trade':
        return {
          labelUrdu: 'غلہ منڈی بولی و آمد',
          labelEn: 'Mandi Trade & Arrivals',
          icon: <Scale className="w-3.5 h-3.5" />,
          color: 'bg-orange-100 text-orange-900 border-orange-300',
        };
      default:
        return {
          labelUrdu: 'عمومی زرعی سرگرمی',
          labelEn: 'Agri Activity',
          icon: <Sparkles className="w-3.5 h-3.5" />,
          color: 'bg-stone-100 text-stone-800 border-stone-300',
        };
    }
  };

  const getRoleBadge = (authorRole: UserRole) => {
    switch (authorRole) {
      case 'farmer':
        return { label: 'کسان', color: 'bg-emerald-600 text-white' };
      case 'field_officer':
        return { label: 'فیلڈ آفیسر', color: 'bg-teal-700 text-white' };
      case 'scientist':
        return { label: 'سائنسدان', color: 'bg-blue-700 text-white' };
      case 'dealer':
        return { label: 'زرعی ڈیلر', color: 'bg-amber-700 text-white' };
      case 'aarti':
        return { label: 'آڑھتی', color: 'bg-orange-700 text-white' };
      default:
        return { label: 'ممبر', color: 'bg-stone-600 text-white' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner - Simple & Solid */}
      <div className="bg-emerald-800 rounded-2xl p-5 text-white shadow-sm border border-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-emerald-950 text-xs font-bold mb-2 shadow-xs">
            <Rss className="w-3.5 h-3.5 text-emerald-700" />
            <span>اوپن زرعی سوشل نیٹ ورک (Open Agri Social Feed)</span>
          </div>
          <h2 className="text-xl font-black">
            {language === 'ur' ? 'ایگری فیڈ - ہر ممبر کی لائیو زرعی سرگرمیاں' : 'Agri Feed - Activity Timeline for Everyone'}
          </h2>
          <p className="text-emerald-100 text-xs max-w-2xl mt-1">
            {language === 'ur'
              ? 'کسان، فیلڈ آفیسر، زرعی سائنسدان، کھاد ڈیلر اور منڈی آڑھتی—سب اپنی روزمرہ سرگرمیاں، کٹائی، بیج و فیلڈ رپورٹس یہاں براہ راست شیئر کر سکتے ہیں۔'
              : 'The public timeline where farmers, field officers, scientists, dealers, and grain market agents post daily field updates, harvests, stock arrivals, and research news.'}
          </p>
        </div>

        {/* Post Activity Button */}
        <button
          onClick={() => setShowPostModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          <span>{language === 'ur' ? 'اپنی سرگرمی پوسٹ کریں' : 'Post Your Activity'}</span>
        </button>
      </div>

      {/* Quick In-line Composer Box */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex items-center gap-3">
        <img
          src={currentUser.avatar}
          alt={currentUser.name}
          className="w-10 h-10 rounded-full object-cover border border-emerald-600/40 shrink-0"
        />
        <div
          onClick={() => setShowPostModal(true)}
          className="flex-1 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-xs text-stone-500 cursor-pointer transition-colors flex items-center justify-between font-urdu text-right"
          dir="rtl"
        >
          <span>
            {currentUser.nameUrdu.split('(')[0]} بھائی! آج اپنے کھیت، فیلڈ یا دکان پر کیا سرگرمی ہے؟ یہاں شیئر کریں...
          </span>
          <Plus className="w-4 h-4 text-emerald-700 shrink-0" />
        </div>
      </div>

      {/* Role Filter Tabs */}
      <div className="bg-white rounded-2xl p-3 border border-stone-200 shadow-sm space-y-3">
        {/* Role Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="text-xs font-bold text-stone-500 shrink-0 mr-1">
            {language === 'ur' ? 'کردار فلٹر:' : 'Filter Role:'}
          </span>
          {[
            { id: 'all', label: 'تمام ممبران' },
            { id: 'farmer', label: 'کسان (Farmers)' },
            { id: 'field_officer', label: 'فیلڈ آفیسرز (Officers)' },
            { id: 'scientist', label: 'سائنسدان (Scientists)' },
            { id: 'dealer', label: 'زرعی ڈیلرز (Dealers)' },
            { id: 'aarti', label: 'غلہ منڈی آڑھتی (Aarti)' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedRoleFilter(f.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                selectedRoleFilter === f.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Activity Type Filters */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-2 border-t border-stone-100">
          <span className="text-xs font-bold text-stone-500 shrink-0 mr-1">
            {language === 'ur' ? 'سرگرمی کی قسم:' : 'Activity Type:'}
          </span>
          {[
            { id: 'all', label: 'سب اقسام' },
            { id: 'harvest', label: '🌾 کٹائی و پیداوار' },
            { id: 'field_work', label: '🚜 کاشت و فارم ورک' },
            { id: 'inspection', label: '🔍 فیلڈ معائنہ' },
            { id: 'research', label: '🧪 سائنسی ریسرچ' },
            { id: 'stock_arrival', label: '📦 کھاد اسٹاک' },
            { id: 'mandi_trade', label: '⚖️ منڈی ترسیل' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedTypeFilter(t.id)}
              className={`px-3 py-1 text-[11px] font-semibold rounded-lg transition-all whitespace-nowrap ${
                selectedTypeFilter === t.id
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Feed Stream */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 text-xs text-stone-500">
            ایگری فیڈ سرگرمیاں لوڈ ہو رہی ہیں...
          </div>
        ) : activities.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 text-xs text-stone-500">
            اس زمرے میں کوئی سرگرمی نہیں ملی۔ آپ پہلی سرگرمی پوسٹ کریں!
          </div>
        ) : (
          activities.map((item) => {
            const typeInfo = getActivityTypeDetails(item.activityType);
            const roleBadge = getRoleBadge(item.authorRole);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:border-emerald-300 transition-all space-y-3"
              >
                {/* Activity Author Header */}
                <div className="p-4 flex items-center justify-between gap-3 pb-0">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.authorAvatar}
                      alt={item.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-sm text-stone-900">
                          {item.authorName}
                        </span>
                        <RoleBadge role={item.authorRole} size="sm" language={language} />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {item.authorLocation}
                        </span>
                        <span>·</span>
                        <span>{item.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  {/* Activity Type Badge */}
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold border ${typeInfo.color}`}
                  >
                    {typeInfo.icon}
                    <span>{language === 'ur' ? typeInfo.labelUrdu : typeInfo.labelEn}</span>
                  </span>
                </div>

                {/* Activity Content */}
                <div className="px-4 space-y-2.5">
                  <h4 className="font-extrabold text-stone-900 text-sm">
                    {item.activityTitleUrdu || item.activityTitle}
                  </h4>
                  <p className="text-stone-800 text-xs sm:text-sm leading-relaxed font-urdu text-right" dir="rtl">
                    {item.description}
                  </p>

                  {/* Tags */}
                  {item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.tags.map((tg, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md"
                        >
                          #{tg}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Media Image */}
                  {item.mediaUrl && (
                    <div className="rounded-xl overflow-hidden aspect-16/9 bg-stone-100 border border-stone-200">
                      <img
                        src={item.mediaUrl}
                        alt={item.activityTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Direct Contact: Call, SMS, WhatsApp */}
                  <div className="pt-2">
                    <ContactActions
                      phone={item.authorPhone || '+92 302 6543210'}
                      name={item.authorName}
                      roleLabel={roleBadge.label}
                      contextText={item.activityTitleUrdu || item.activityTitle}
                      variant="inline"
                    />
                  </div>
                </div>

                {/* Interaction Bar */}
                <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(item.id)}
                      className="flex items-center gap-1.5 hover:text-rose-600 transition-colors font-medium"
                    >
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                      <span>{item.likesCount}</span>
                    </button>
                    <div className="flex items-center gap-1.5 font-medium">
                      <MessageCircle className="w-4 h-4 text-stone-400" />
                      <span>{item.commentsCount} تبصرے</span>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification('سرگرمی کا لنک کاپی ہو گیا۔')}
                    className="flex items-center gap-1 hover:text-stone-900 transition-colors font-medium"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>شیئر کریں</span>
                  </button>
                </div>

                {/* Comments List & Input */}
                <div className="p-4 bg-stone-50/50 border-t border-stone-100 space-y-2.5">
                  {item.comments.length > 0 && (
                    <div className="space-y-1.5">
                      {item.comments.map((c) => (
                        <div
                          key={c.id}
                          className="p-2 rounded-xl bg-white border border-stone-200 text-xs space-y-0.5"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-stone-900">{c.authorName}</span>
                              <RoleBadge role={c.authorRole} size="sm" language={language} />
                            </div>
                            <span className="text-[10px] text-stone-400">{c.createdAt}</span>
                          </div>
                          <p className="text-stone-700 font-urdu text-right" dir="rtl">
                            {c.text}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Comment Input */}
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="text"
                      placeholder="اس سرگرمی پر تبصرہ یا مبارکباد لکھیں..."
                      value={commentInputs[item.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [item.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(item.id);
                      }}
                      className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-urdu text-right"
                      dir="rtl"
                    />
                    <button
                      onClick={() => handleAddComment(item.id)}
                      className="p-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white transition-colors"
                      title="Send Comment"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Post Activity Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  اپنی زرعی سرگرمی ایگری فیڈ پر شائع کریں
                </h3>
                <span className="text-xs text-stone-500">
                  بطور: {currentUser.nameUrdu}
                </span>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateActivity} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  سرگرمی کی قسم منتخب کریں:
                </label>
                <select
                  value={activityType}
                  onChange={(e) => setActivityType(e.target.value as ActivityType)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                >
                  <option value="harvest">🌾 فصل کی کٹائی و پیداوار (Harvest & Yield)</option>
                  <option value="field_work">🚜 کاشتکاری و زمین کی تیاری (Sowing / Field Work)</option>
                  <option value="inspection">🔍 فیلڈ معائنہ و دورہ (Field Inspection)</option>
                  <option value="research">🧪 زرعی تحقیق و ٹرائلز (Research & Science)</option>
                  <option value="stock_arrival">📦 کھاد / ادویات اسٹاک آمد (Stock Arrival)</option>
                  <option value="mandi_trade">⚖️ غلہ منڈی ترسیل و تجارت (Mandi Trade)</option>
                  <option value="general">🌾 عمومی زرعی خبر (General Activity)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  سرگرمی کا عنوان / ہیڈ لائن:
                </label>
                <input
                  type="text"
                  value={activityTitle}
                  onChange={(e) => setActivityTitle(e.target.value)}
                  placeholder="مثال: ماشاءاللہ گندم کی کٹائی شروع، اوسط پیداوار 55 من"
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-urdu text-right"
                  dir="rtl"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  تفصیل (آج آپ نے کیا کام کیا؟):
                </label>
                <textarea
                  rows={3}
                  value={activityDesc}
                  onChange={(e) => setActivityDesc(e.target.value)}
                  placeholder="تفصیل لکھیں، مثلاً: رقبہ، کھاد، بیج، ٹریکٹر ورک یا مارکیٹ میں ریٹس..."
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-stone-900 font-urdu text-right"
                  dir="rtl"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">لوکیشن / ضلع:</label>
                  <input
                    type="text"
                    value={activityLocation}
                    onChange={(e) => setActivityLocation(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 mb-1">ٹیگ (اختیاری):</label>
                  <input
                    type="text"
                    value={customTag}
                    onChange={(e) => setCustomTag(e.target.value)}
                    placeholder="گندم_کٹائی"
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">تصویر کا لنک / کیمرہ:</label>
                <input
                  type="text"
                  value={activityImage}
                  onChange={(e) => setActivityImage(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono text-[11px]"
                />
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
                  className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold shadow-sm"
                >
                  ایگری فیڈ پر شائع کریں
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
