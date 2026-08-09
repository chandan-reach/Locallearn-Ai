import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { CommunityPostItem } from '../types';
import { Users, ThumbsUp, MessageSquare, Plus, Tag, Sparkles } from 'lucide-react';

export const CommunityPage: React.FC = () => {
  const [posts, setPosts] = useState<CommunityPostItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Post State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Doubt');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getCommunityPosts();
      setPosts(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    try {
      const newPost = await api.createCommunityPost({ title, content, category });
      setPosts((prev) => [newPost, ...prev]);
      setShowCreateModal(false);
      setTitle('');
      setContent('');
    } catch (e) {
      console.error(e);
    }
  };

  const handleLike = async (id: string) => {
    try {
      await api.likeCommunityPost(id);
      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, likes: p.likes + 1 } : p))
      );
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 flex items-center justify-between shadow-glass">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">Local Learning Community</h1>
            <p className="text-xs text-gray-400">Ask academic doubts, share revision notes, and connect with local study groups.</p>
          </div>
        </div>

        <button
          onClick={() => setShowCreateModal(!showCreateModal)}
          className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-glow transition flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>New Discussion Post</span>
        </button>
      </div>

      {/* CREATE POST FORM MODAL */}
      {showCreateModal && (
        <form onSubmit={handleCreatePost} className="bg-gray-900 border border-amber-500/40 rounded-3xl p-6 space-y-4 shadow-glow max-w-xl mx-auto">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" /> Start Discussion or Share Resource
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Post Title</label>
            <input
              type="text"
              placeholder="e.g. Tips for memorizing Physics Optics ray diagrams?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="Doubt">Academic Doubt</option>
              <option value="Resource">Study Resource / Cheat Sheet</option>
              <option value="Study Group">Local Study Group</option>
              <option value="Announcement">Tutor Announcement</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Content</label>
            <textarea
              rows={4}
              placeholder="Write your explanation or doubt details here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-xs text-white"
              required
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowCreateModal(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-800 text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-extrabold bg-amber-600 hover:bg-amber-500 text-white shadow-glow"
            >
              Publish Post
            </button>
          </div>
        </form>
      )}

      {/* POSTS LIST */}
      {loading ? (
        <div className="p-8 text-center text-gray-400">Loading community discussions...</div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 space-y-3 hover:border-gray-700 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <img
                    src={post.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80'}
                    alt={post.user.name}
                    className="w-9 h-9 rounded-full object-cover border border-brand-500"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-white flex items-center gap-2">
                      {post.user.name}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        post.user.role === 'TEACHER' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-brand-500/20 text-brand-300'
                      }`}>
                        {post.user.role}
                      </span>
                    </h4>
                    <span className="text-[10px] text-gray-400">{post.user.locality} • {new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-xl text-xs font-bold bg-gray-800 text-amber-300 border border-gray-700">
                  {post.category}
                </span>
              </div>

              <h3 className="text-base font-bold text-white leading-tight">{post.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed">{post.content}</p>

              <div className="flex items-center space-x-4 border-t border-gray-800 pt-3 text-xs text-gray-400">
                <button
                  onClick={() => handleLike(post.id)}
                  className="flex items-center space-x-1.5 text-gray-300 hover:text-amber-400 transition font-semibold"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>{post.likes} Helpful</span>
                </button>
                <span className="flex items-center space-x-1.5">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{post.repliesCount} Replies</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
