import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AIMemoryItem } from '../types';
import { MemoryCard } from '../components/MemoryCard';
import { BrainCircuit, Plus, Trash2, ShieldCheck, Flame, Target, Lightbulb, RefreshCw, AlertCircle } from 'lucide-react';

export const AIMemoryPage: React.FC = () => {
  const [memories, setMemories] = useState<AIMemoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');

  // Add Custom Memory Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContent, setNewContent] = useState('');
  const [newType, setNewType] = useState('preference');
  const [newImportance, setNewImportance] = useState('medium');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchMemories();
  }, []);

  const fetchMemories = async () => {
    setLoading(true);
    try {
      const data = await api.getMemories();
      setMemories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMemory = async (id: string) => {
    try {
      await api.deleteMemory(id);
      setMemories((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAll = async () => {
    if (!window.confirm('Are you sure you want to clear all persistent learning memories?')) return;
    try {
      await api.clearAllMemories();
      setMemories([]);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddMemory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.trim()) return;
    setSubmitting(true);

    try {
      const item = await api.addMemory({
        memoryType: newType,
        content: newContent,
        importance: newImportance,
      });

      setMemories((prev) => [item, ...prev]);
      setNewContent('');
      setShowAddForm(false);
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredMemories = memories.filter((m) => filterType === 'all' || m.memoryType === filterType);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-6">
      {/* PAGE HEADER */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-glass">
        <div className="flex items-center space-x-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 border border-purple-500/40 flex items-center justify-center">
            <BrainCircuit className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">My Learning Memory</h1>
            <p className="text-xs text-gray-400">View and control what LearnMate AI remembers about your learning profile.</p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-glow transition flex items-center space-x-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Memory</span>
          </button>

          {memories.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-red-500/20 text-red-300 font-semibold text-xs border border-gray-700 transition flex items-center space-x-1.5"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </button>
          )}
        </div>
      </div>

      {/* ADD CUSTOM MEMORY FORM MODAL / COLLAPSIBLE */}
      {showAddForm && (
        <form onSubmit={handleAddMemory} className="bg-gray-900 border border-purple-500/40 rounded-3xl p-5 space-y-4 shadow-glow">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-purple-400" /> Add Custom Memory Item
          </h3>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Memory Content</label>
            <input
              type="text"
              placeholder="e.g. Prefer explanations with real-life physical analogies in Hindi..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="preference">Study Preference</option>
                <option value="weakness">Weak Topic</option>
                <option value="strength">Strong Area</option>
                <option value="goal">Learning Goal</option>
                <option value="context">Tuition Context</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Importance Level</label>
              <select
                value={newImportance}
                onChange={(e) => setNewImportance(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-800 text-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-extrabold bg-purple-600 hover:bg-purple-500 text-white shadow-glow"
            >
              {submitting ? 'Saving...' : 'Save Memory'}
            </button>
          </div>
        </form>
      )}

      {/* FILTER TABS */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1">
        {[
          { id: 'all', label: 'All Memories' },
          { id: 'weakness', label: 'Weak Topics' },
          { id: 'preference', label: 'Preferences' },
          { id: 'strength', label: 'Strengths' },
          { id: 'goal', label: 'Goals' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition ${
              filterType === tab.id
                ? 'bg-purple-600 border-purple-400 text-white'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MEMORY CARDS LIST */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl h-24 animate-pulse"></div>
          ))}
        </div>
      ) : filteredMemories.length === 0 ? (
        <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-10 text-center space-y-3 max-w-md mx-auto">
          <BrainCircuit className="w-10 h-10 text-gray-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No Memories Stored</h3>
          <p className="text-xs text-gray-400">
            LearnMate AI hasn't recorded memories in this category yet. Chat with the AI or click "Add Memory" above.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMemories.map((mem) => (
            <MemoryCard key={mem.id} memory={mem} onDelete={handleDeleteMemory} />
          ))}
        </div>
      )}
    </div>
  );
};
