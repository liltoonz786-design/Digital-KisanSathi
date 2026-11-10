import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  ThumbsUp,
  Share2,
  Send,
  Image,
  Sparkles,
  User,
  Plus,
  X,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../i18n/translations';
import { PUNJAB_DISTRICTS } from '../data/mockData';

interface CommunityPageProps {
  language: Language;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // New Post Modal
  const [showNewPostModal, setShowNewPostModal] = useState<boolean>(false);
  const [postForm, setPostForm] = useState({
    author: '',
    village: '',
    district: 'Ludhiana',
    crop: 'Wheat (ਕਣਕ)',
    title: '',
    content: '',
    imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
  });

  // Active commenting
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [commentText, setCommentText] = useState<string>('');
  const [commenterName, setCommenterName] = useState<string>('');

  const fetchPosts = () => {
    setLoading(true);
    fetch('/api/community')
      .then((res) => res.json())
      .then((data) => {
        if (data.posts) setPosts(data.posts);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (id: string) => {
    try {
      const res = await fetch(`/api/community/${id}/like`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, likes: data.likes } : p))
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (postId: string) => {
    if (!commentText.trim()) return;
    try {
      const res = await fetch(`/api/community/${postId}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: commenterName.trim() || 'ਕਿਸਾਨ ਵੀਰ',
          text: commentText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? { ...p, comments: data.comments, commentsCount: data.comments.length }
              : p
          )
        );
        setCommentText('');
        setActiveCommentPostId(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postForm),
      });
      const data = await res.json();
      if (data.success) {
        fetchPosts();
        setShowNewPostModal(false);
        setPostForm({
          author: '',
          village: '',
          district: 'Ludhiana',
          crop: 'Wheat (ਕਣਕ)',
          title: '',
          content: '',
          imageUrl: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#14532D] via-[#1d7240] to-emerald-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-[#EABF48]/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-[#EABF48] text-[#14532D]">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Punjab Farmers Discussion Forum</span>
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              ਕਿਸਾਨ ਚਰਚਾ ਮੰਚ (Farmer Community)
            </h1>
            <p className="text-xs sm:text-sm text-[#EDEDD6]">
              ਆਪਣਾ ਤਜਰਬਾ ਸਾਂਝਾ ਕਰੋ, ਸਵਾਲ ਪੁੱਛੋ ਅਤੇ ਦੂਜੇ ਕਿਸਾਨ ਵੀਰਾਂ ਨਾਲ ਵਿਚਾਰ-ਵਟਾਂਦਰਾ ਕਰੋ।
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowNewPostModal(true)}
            className="px-5 py-3 rounded-2xl bg-[#EABF48] hover:bg-[#d4a732] text-[#14532D] font-extrabold text-xs sm:text-sm shadow-xl transition-all shrink-0 cursor-pointer flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>ਨਵੀਂ ਚਰਚਾ ਸ਼ੁਰੂ ਕਰੋ</span>
          </button>
        </div>
      </div>

      {/* Posts Stream */}
      <div className="space-y-6">
        {posts.map((post) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl p-6 shadow-md border border-gray-200/80 space-y-4"
          >
            {/* Post Author Info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#14532D] text-[#EABF48] font-black flex items-center justify-center text-sm shadow-sm">
                  {post.author.slice(0, 1)}
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-[#14532D]">{post.author}</h4>
                  <p className="text-[11px] text-gray-500">
                    ਪਿੰਡ {post.village}, {post.district} • {post.createdAt}
                  </p>
                </div>
              </div>

              <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                {post.crop}
              </span>
            </div>

            {/* Post Content */}
            <div className="space-y-2">
              <h3 className="font-bold text-base text-gray-900">{post.title}</h3>
              <p className="text-xs sm:text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
            </div>

            {/* Post Image */}
            {post.imageUrl && (
              <div className="rounded-2xl overflow-hidden max-h-80 border border-gray-100 bg-gray-50">
                <img src={post.imageUrl} alt={post.title} className="w-full h-full object-cover" />
              </div>
            )}

            {/* Like and Comment counts */}
            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-600">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleLike(post.id)}
                  className="flex items-center gap-1.5 font-bold hover:text-[#4D9B55] transition-colors cursor-pointer text-[#14532D]"
                >
                  <ThumbsUp className="w-4 h-4 text-[#4D9B55]" />
                  <span>{post.likes} ਸਹਿਮਤ (Likes)</span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveCommentPostId(activeCommentPostId === post.id ? null : post.id)
                  }
                  className="flex items-center gap-1.5 font-bold hover:text-[#4D9B55] transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>{post.commentsCount || 0} ਟਿੱਪਣੀਆਂ (Comments)</span>
                </button>
              </div>

              <span className="text-[11px] text-gray-400">ਪੰਜਾਬ ਕਿਸਾਨ ਨੈੱਟਵਰਕ</span>
            </div>

            {/* Comments List */}
            {post.comments && post.comments.length > 0 && (
              <div className="bg-[#F7F7E9] rounded-2xl p-4 space-y-2.5 text-xs">
                {post.comments.map((c: any, idx: number) => (
                  <div key={idx} className="pb-2 border-b border-gray-200/60 last:border-0 last:pb-0">
                    <div className="flex justify-between items-center mb-0.5">
                      <strong className="text-[#14532D] font-bold">{c.author}</strong>
                      <span className="text-[10px] text-gray-400">{c.time}</span>
                    </div>
                    <p className="text-gray-700">{c.text}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Inline Add Comment Input */}
            {activeCommentPostId === post.id && (
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2 animate-fadeIn text-xs">
                <input
                  type="text"
                  placeholder="ਆਪਣਾ ਨਾਂ"
                  value={commenterName}
                  onChange={(e) => setCommenterName(e.target.value)}
                  className="w-full sm:w-36 bg-gray-50 border rounded-xl px-3 py-2 text-xs"
                />
                <input
                  type="text"
                  placeholder="ਆਪਣੀ ਰਾਇ ਜਾਂ ਜਵਾਬ ਲਿਖੋ..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  className="flex-1 bg-gray-50 border rounded-xl px-3 py-2 text-xs"
                />
                <button
                  type="button"
                  onClick={() => handleAddComment(post.id)}
                  className="w-full sm:w-auto px-4 py-2 rounded-xl bg-[#14532D] text-[#EABF48] font-bold hover:bg-[#0a2f18] transition-colors cursor-pointer"
                >
                  ਭੇਜੋ (Reply)
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Create New Post Modal */}
      <AnimatePresence>
        {showNewPostModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-gray-200 space-y-5"
            >
              <div className="flex items-center justify-between border-b pb-3">
                <h3 className="font-extrabold text-base text-[#14532D]">
                  ਨਵੀਂ ਖੇਤੀਬਾੜੀ ਪੋਸਟ / ਸਵਾਲ ਸ਼ੇਅਰ ਕਰੋ
                </h3>
                <button
                  type="button"
                  onClick={() => setShowNewPostModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ਤੁਹਾਡਾ ਨਾਂ (Name)</label>
                    <input
                      type="text"
                      required
                      value={postForm.author}
                      onChange={(e) => setPostForm({ ...postForm, author: e.target.value })}
                      placeholder="ਜਿਵੇਂ: ਮਨਪ੍ਰੀਤ ਸਿੰਘ"
                      className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ਜ਼ਿਲ੍ਹਾ (District)</label>
                    <select
                      value={postForm.district}
                      onChange={(e) => setPostForm({ ...postForm, district: e.target.value })}
                      className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                    >
                      {PUNJAB_DISTRICTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ਪਿੰਡ (Village)</label>
                    <input
                      type="text"
                      required
                      value={postForm.village}
                      onChange={(e) => setPostForm({ ...postForm, village: e.target.value })}
                      placeholder="ਜਿਵੇਂ: ਸਮਰਾਲਾ"
                      className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">ਫਸਲ (Crop)</label>
                    <input
                      type="text"
                      value={postForm.crop}
                      onChange={(e) => setPostForm({ ...postForm, crop: e.target.value })}
                      placeholder="ਕਣਕ (Wheat)"
                      className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">ਵਿਸ਼ਾ (Title)</label>
                  <input
                    type="text"
                    required
                    value={postForm.title}
                    onChange={(e) => setPostForm({ ...postForm, title: e.target.value })}
                    placeholder="ਕਣਕ ਦੀ ਬਿਜਾਈ ਦੇ ਤਜਰਬੇ ਜਾਂ ਪੀਲੀ ਕੁੰਗੀ ਬਾਰੇ..."
                    className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm font-bold text-[#14532D]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">ਵਿਸਥਾਰ (Description)</label>
                  <textarea
                    rows={4}
                    required
                    value={postForm.content}
                    onChange={(e) => setPostForm({ ...postForm, content: e.target.value })}
                    placeholder="ਆਪਣਾ ਪੂਰਾ ਸੁਨੇਹਾ ਜਾਂ ਸਵਾਲ ਲਿਖੋ..."
                    className="w-full bg-gray-50 border rounded-xl p-2.5 text-sm"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-2xl bg-[#14532D] text-[#EABF48] font-bold text-sm shadow hover:bg-[#0a2f18] transition-colors cursor-pointer"
                >
                  ਪੋਸਟ ਸ਼ੇਅਰ ਕਰੋ
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
