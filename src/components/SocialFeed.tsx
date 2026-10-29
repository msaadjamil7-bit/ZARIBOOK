import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PostItem, UserRole } from '../types';
import { ContactActions } from './ContactActions';
import {
  Mic,
  Image as ImageIcon,
  Send,
  Heart,
  MessageCircle,
  ShieldCheck,
  Award,
  Sparkles,
  MapPin,
  Play,
  Pause,
  Filter,
  CheckCircle2,
  Share2,
  User,
  Plus,
  AlertCircle,
} from 'lucide-react';

export const SocialFeed: React.FC = () => {
  const { role, currentUser, language, showNotification, addNotification } = useApp();
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedCropFilter, setSelectedCropFilter] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Post Form State
  const [postText, setPostText] = useState<string>('');
  const [postCrop, setPostCrop] = useState<string>('Cotton (کپاس)');
  const [postLocation, setPostLocation] = useState<string>('ضلع ملتان، پنجاب');
  const [postImage, setPostImage] = useState<string>(
    'https://images.unsplash.com/photo-1599818816854-46f90d4a9ef1?auto=format&fit=crop&w=800&q=80'
  );
  const [isRecordingVoice, setIsRecordingVoice] = useState<boolean>(false);
  const [voiceDuration, setVoiceDuration] = useState<number>(0);
  const [recordedVoice, setRecordedVoice] = useState<boolean>(false);

  // Comment input per post
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Audio Playback
  const [activeVoicePostId, setActiveVoicePostId] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, [selectedCropFilter]);

  const loadPosts = () => {
    setLoading(true);
    fetch(`/api/posts?crop=${selectedCropFilter}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.posts) {
          setPosts(data.posts);
        }
      })
      .catch((err) => console.error('Failed to load posts:', err))
      .finally(() => setLoading(false));
  };

  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/posts/${postId}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPosts((current) =>
          current.map((p) => (p.id === postId ? { ...p, likesCount: data.likesCount } : p))
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddComment = async (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    try {
      const res = await fetch(`/api/posts/${postId}/comments`, {
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
        setPosts((current) =>
          current.map((p) => {
            if (p.id === postId) {
              return {
                ...p,
                commentsCount: p.commentsCount + 1,
                comments: [...p.comments, data.comment],
                hasExpertValidation: role === 'scientist' ? true : p.hasExpertValidation,
                validatedByScientist: role === 'scientist' ? currentUser.nameUrdu : p.validatedByScientist,
                scientistNote: role === 'scientist' ? `ماہرانہ رائے: ${text}` : p.scientistNote,
              };
            }
            return p;
          })
        );
        setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
        showNotification(
          role === 'scientist' || role === 'field_officer'
            ? 'تصدیق شدہ ماہرانہ جواب شامل کر دیا گیا۔'
            : 'آپ کا تبصرہ شائع ہو گیا۔'
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreatePost = async () => {
    if (!postText.trim() && !recordedVoice) {
      showNotification('براہ کرم تحریر یا وائس میسج درج کریں۔');
      return;
    }

    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: currentUser.nameUrdu,
          authorRole: role,
          authorPhone: currentUser.phone,
          authorLocation: postLocation,
          cropCategory: postCrop,
          textDescription: postText,
          mediaUrls: postImage ? [postImage] : [],
          voiceDurationSeconds: recordedVoice ? voiceDuration || 15 : undefined,
        }),
      });

      const data = await res.json();
      if (data.success && data.post) {
        setPosts([data.post, ...posts]);
        setShowCreateModal(false);
        setPostText('');
        setRecordedVoice(false);
        setVoiceDuration(0);
        addNotification({
          type: 'feed',
          title: 'Your question was posted',
          titleUrdu: 'آپ کا سوال شائع ہو گیا',
          message: `Crop issue on ${postCrop}: waiting for expert advice`,
          messageUrdu: `${postCrop} کے مسئلے پر زرعی ماہرین و فیلڈ آفیسرز جلد جواب دیں گے۔`,
          linkTab: 'agri_feed',
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const startVoiceRecording = () => {
    setIsRecordingVoice(true);
    setVoiceDuration(0);
    const interval = setInterval(() => {
      setVoiceDuration((prev) => {
        if (prev >= 30) {
          clearInterval(interval);
          setIsRecordingVoice(false);
          setRecordedVoice(true);
          return 30;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopVoiceRecording = () => {
    setIsRecordingVoice(false);
    setRecordedVoice(true);
  };

  return (
    <div className="space-y-6">
      {/* Kissan Baithak Banner - Simple & Solid */}
      <div className="bg-emerald-800 rounded-2xl p-5 text-white shadow-sm border border-emerald-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-white text-emerald-900 text-xs font-bold mb-2 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>کسان مشاورتی بیٹھک (Farmer Advisory Salon)</span>
          </div>
          <h2 className="text-xl font-black">
            {language === 'ur' ? 'کسان بیٹھک - وائس سوالات و ماہرانہ مشورہ' : 'Kissan Baithak - Voice Questions & Verified Advice'}
          </h2>
          <p className="text-emerald-100 text-xs max-w-2xl mt-1">
            {language === 'ur'
              ? 'کسان بھائی آواز یا تصویر میں اپنے کھیت کا مسئلہ پوچھیں، زرعی سائنسدان اور فیلڈ آفیسرز موقع پر تصدیق شدہ سرکاری رہنمائی فراہم کرتے ہیں۔'
              : 'Post crop issues via voice notes or field photos. Get verified phytosanitary solutions signed off by research scientists.'}
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-900 font-bold text-xs shadow-xs transition-colors shrink-0"
        >
          <Plus className="w-4 h-4 text-emerald-700" />
          <span>{language === 'ur' ? 'وائس سوال پوچھیں' : 'Ask Voice Question'}</span>
        </button>
      </div>

      {/* Feed Controls Header */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Filter by Crop Segment */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-stone-400 shrink-0 mr-1" />
          <button
            onClick={() => setSelectedCropFilter('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
              selectedCropFilter === 'all'
                ? 'bg-emerald-800 text-white shadow-xs'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            {language === 'ur' ? 'تمام فصلیں' : 'All Crops'}
          </button>
          {['Cotton', 'Wheat', 'Rice', 'Sugarcane', 'Maize'].map((c) => (
            <button
              key={c}
              onClick={() => setSelectedCropFilter(c)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl transition-all whitespace-nowrap ${
                selectedCropFilter === c
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Create Post Action Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-sm transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>{language === 'ur' ? 'نئی پوسٹ / وائس سوال پوچھیں' : 'Ask Question / Voice Note'}</span>
        </button>
      </div>

      {/* Role Banner Insight */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700 shrink-0" />
          <span>
            {role === 'scientist'
              ? (language === 'ur' ? 'آپ زرعی سائنسدان کے طور پر لاگ ان ہیں۔ آپ کے جوابات پر "آفیشل تصدیق شدہ بیج" لگے گا۔' : 'Logged in as Agri Scientist. Your answers receive official Scientific Endorsement.')
              : role === 'field_officer'
              ? (language === 'ur' ? 'آپ فیلڈ آفیسر ہیں۔ کسانوں کے مسائل پر فیلڈ کا تجربہ اور مشورہ شیئر کریں۔' : 'Logged in as Field Officer. Provide verified field-tested recommendations.')
              : (language === 'ur' ? 'کسان بیٹھک: تصاویر اور وائس نوٹس کے ذریعے پورے پاکستان کے کسانوں اور سائنسدانوں سے رہنمائی لیں۔' : 'Visual & Voice Community: Ask questions via voice notes and photo clips.')}
          </span>
        </div>
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {loading ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 text-xs text-stone-500">
            {language === 'ur' ? 'پوسٹس لوڈ ہو رہی ہیں...' : 'Loading community feed...'}
          </div>
        ) : posts.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-stone-200 text-xs text-stone-500">
            {language === 'ur' ? 'کوئی پوسٹ نہیں ملی۔' : 'No posts found in this category.'}
          </div>
        ) : (
          posts.map((post) => {
            const isVoicePlaying = activeVoicePostId === post.id;

            return (
              <div
                key={post.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden hover:border-stone-300 transition-all"
              >
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-extrabold text-sm text-stone-900">
                          {post.authorName}
                        </span>
                        {post.authorRole === 'scientist' && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                            <Award className="w-3 h-3 text-blue-700" />
                            سائنسدان
                          </span>
                        )}
                        {post.authorRole === 'field_officer' && (
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-teal-100 text-teal-800 text-[10px] font-bold">
                            <ShieldCheck className="w-3 h-3 text-teal-700" />
                            فیلڈ آفیسر
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-stone-500">
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          {post.authorLocation}
                        </span>
                        <span>·</span>
                        <span>{post.createdAt}</span>
                      </div>
                    </div>
                  </div>

                  <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {post.cropCategory}
                  </span>
                </div>

                {/* Post Content */}
                <div className="px-4 pb-3 space-y-3">
                  <p className="text-stone-800 text-sm leading-relaxed font-urdu text-right" dir="rtl">
                    {post.textDescription}
                  </p>

                  {/* Voice Note Bar if available */}
                  {post.voiceDurationSeconds && (
                    <div className="bg-emerald-900 text-white rounded-xl p-3 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => {
                            if (isVoicePlaying) {
                              setActiveVoicePostId(null);
                            } else {
                              setActiveVoicePostId(post.id);
                              // Simulated speech or voice play
                              if ('speechSynthesis' in window) {
                                window.speechSynthesis.cancel();
                                const u = new SpeechSynthesisUtterance(post.textDescription);
                                u.lang = 'ur-PK';
                                u.onend = () => setActiveVoicePostId(null);
                                window.speechSynthesis.speak(u);
                              }
                            }
                          }}
                          className="w-9 h-9 rounded-full bg-lime-400 text-emerald-950 flex items-center justify-center font-bold hover:scale-105 active:scale-95 transition-all"
                        >
                          {isVoicePlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                        </button>
                        <div>
                          <span className="text-xs font-bold text-lime-300 block">
                            {language === 'ur' ? 'کسان کا ریکارڈ شدہ وائس نوٹ' : 'Farmer Voice Note'}
                          </span>
                          <span className="text-[11px] text-emerald-200">
                            {post.voiceDurationSeconds} {language === 'ur' ? 'سیکنڈ' : 'seconds'}
                          </span>
                        </div>
                      </div>

                      {/* Sound Wave Graphic */}
                      <div className="flex items-center gap-1 h-5 px-3">
                        {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30, 85, 60].map((h, idx) => (
                          <span
                            key={idx}
                            style={{ height: `${h}%` }}
                            className={`w-1 rounded-full transition-all ${
                              isVoicePlaying ? 'bg-lime-400 animate-pulse' : 'bg-emerald-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Media Image Attachment */}
                  {post.mediaUrls.length > 0 && (
                    <div className="rounded-xl overflow-hidden aspect-16/9 bg-stone-100 border border-stone-200">
                      <img
                        src={post.mediaUrls[0]}
                        alt={post.cropCategory}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  {/* Scientific Endorsement Banner if validated */}
                  {post.hasExpertValidation && (
                    <div className="rounded-xl p-3.5 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 space-y-1">
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-blue-900">
                        <Award className="w-4 h-4 text-blue-700" />
                        <span>
                          {language === 'ur'
                            ? `زرعی سائنسدان سے تصدیق شدہ مشورہ (${post.validatedByScientist})`
                            : `Validated by Agri Scientist (${post.validatedByScientist})`}
                        </span>
                      </div>
                      {post.scientistNote && (
                        <p className="text-xs text-blue-950 font-urdu text-right" dir="rtl">
                          {post.scientistNote}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Direct Contact: Call, SMS, WhatsApp */}
                  <div className="pt-1">
                    <ContactActions
                      phone={post.authorPhone || '+92 302 6543210'}
                      name={post.authorName}
                      roleLabel={language === 'ur' ? 'کسان کا رابطہ' : 'Direct Contact'}
                      contextText={post.textDescription}
                      variant="inline"
                    />
                  </div>
                </div>

                {/* Engagement Bar */}
                <div className="px-4 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleLike(post.id)}
                      className="flex items-center gap-1.5 hover:text-rose-600 transition-colors font-medium"
                    >
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500/20" />
                      <span>{post.likesCount}</span>
                    </button>
                    <div className="flex items-center gap-1.5 font-medium">
                      <MessageCircle className="w-4 h-4 text-stone-400" />
                      <span>{post.commentsCount} تبصرے</span>
                    </div>
                  </div>

                  <button
                    onClick={() => showNotification('پوسٹ کا لنک کاپی ہو گیا۔')}
                    className="flex items-center gap-1 hover:text-stone-900 transition-colors font-medium"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>شیئر کریں</span>
                  </button>
                </div>

                {/* Comments Section */}
                <div className="p-4 bg-stone-50/50 border-t border-stone-100 space-y-3">
                  {post.comments.length > 0 && (
                    <div className="space-y-2">
                      {post.comments.map((c) => (
                        <div
                          key={c.id}
                          className={`p-2.5 rounded-xl text-xs space-y-1 ${
                            c.isVerified
                              ? 'bg-emerald-50 border border-emerald-200'
                              : 'bg-white border border-stone-200'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5 font-bold text-stone-900">
                              <span>{c.authorName}</span>
                              {c.isVerified && (
                                <span className="inline-flex items-center gap-0.5 text-[10px] text-emerald-800 bg-emerald-200/60 px-1.5 py-0.2 rounded font-bold">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                                  تصدیق شدہ مشورہ
                                </span>
                              )}
                            </div>
                            <span className="text-[10px] text-stone-400">{c.createdAt}</span>
                          </div>
                          <p className="text-stone-800 font-urdu text-right" dir="rtl">
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
                      placeholder={
                        role === 'scientist' || role === 'field_officer'
                          ? 'بطور ماہر / آفیسر تصدیق شدہ رہنمائی لکھیں...'
                          : 'اپنا تبصرہ یا مشورہ لکھیں...'
                      }
                      value={commentInputs[post.id] || ''}
                      onChange={(e) =>
                        setCommentInputs({ ...commentInputs, [post.id]: e.target.value })
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(post.id);
                      }}
                      className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-urdu text-right"
                      dir="rtl"
                    />
                    <button
                      onClick={() => handleAddComment(post.id)}
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

      {/* Create Post Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="font-bold text-base text-stone-900">
                {language === 'ur' ? 'کسان بیٹھک میں نیا سوال / پوسٹ' : 'Create Community Post'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            {/* Crop & Location Select */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">فصل کی قسم:</label>
                <select
                  value={postCrop}
                  onChange={(e) => setPostCrop(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                >
                  <option value="Cotton (کپاس)">Cotton / کپاس</option>
                  <option value="Wheat (گندم)">Wheat / گندم</option>
                  <option value="Basmati Rice (دھان)">Basmati Rice / دھان</option>
                  <option value="Sugarcane (کماد)">Sugarcane / کماد</option>
                  <option value="Maize (مکئی)">Maize / مکئی</option>
                  <option value="Mango (آم)">Mango / آم</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">مقام / تحصیل:</label>
                <input
                  type="text"
                  value={postLocation}
                  onChange={(e) => setPostLocation(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900"
                />
              </div>
            </div>

            {/* Description Text */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                مسئلے کی تفصیل (یا نیچے وائس میسج ریکارڈ کریں):
              </label>
              <textarea
                rows={3}
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
                placeholder="مثال: کپاس کے پتوں پر سفید مکھی اور سست تیلے کا حملہ ہے..."
                className="w-full bg-stone-50 border border-stone-300 rounded-xl p-3 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-600 font-urdu text-right"
                dir="rtl"
              />
            </div>

            {/* Voice Recorder Block */}
            <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={isRecordingVoice ? stopVoiceRecording : startVoiceRecording}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    isRecordingVoice
                      ? 'bg-rose-600 text-white animate-pulse'
                      : recordedVoice
                      ? 'bg-emerald-600 text-white'
                      : 'bg-emerald-700 text-white'
                  }`}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <div>
                  <span className="text-xs font-bold text-stone-900 block">
                    {isRecordingVoice
                      ? `ریکارڈنگ جاری ہے... (${voiceDuration}s)`
                      : recordedVoice
                      ? `وائس ریکارڈ ہو گئی (${voiceDuration || 15} سیکنڈ)`
                      : 'وائس میسج بول کر ریکارڈ کریں'}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    کم پڑھے لکھے کسان بھائیوں کے لیے آواز میں سوال
                  </span>
                </div>
              </div>

              {recordedVoice && (
                <button
                  type="button"
                  onClick={() => {
                    setRecordedVoice(false);
                    setVoiceDuration(0);
                  }}
                  className="text-xs text-rose-600 font-bold hover:underline"
                >
                  دوبارہ ریکارڈ
                </button>
              )}
            </div>

            {/* Photo Selection Preview */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">تصویر کا لنک / کیمرہ:</label>
              <input
                type="text"
                value={postImage}
                onChange={(e) => setPostImage(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 font-mono text-[11px]"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-100"
              >
                منسوخ کریں
              </button>
              <button
                type="button"
                onClick={handleCreatePost}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm"
              >
                شائع کریں
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
