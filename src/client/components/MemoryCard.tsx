import React from 'react';
import { AIMemoryItem } from '../types';
import { BrainCircuit, Trash2, Tag, ShieldCheck, Flame, Target, Lightbulb, UserCheck } from 'lucide-react';

interface MemoryCardProps {
  memory: AIMemoryItem;
  onDelete: (id: string) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onDelete }) => {
  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'weakness':
        return { label: 'Weak Topic', color: 'bg-red-500/20 text-red-300 border-red-500/40', icon: Flame };
      case 'strength':
        return { label: 'Strong Area', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40', icon: ShieldCheck };
      case 'goal':
        return { label: 'Learning Goal', color: 'bg-amber-500/20 text-amber-300 border-amber-500/40', icon: Target };
      case 'preference':
        return { label: 'Study Preference', color: 'bg-brand-500/20 text-brand-300 border-brand-500/40', icon: Lightbulb };
      case 'context':
        return { label: 'Tuition Context', color: 'bg-purple-500/20 text-purple-300 border-purple-500/40', icon: UserCheck };
      default:
        return { label: type, color: 'bg-gray-800 text-gray-300 border-gray-700', icon: Tag };
    }
  };

  const badge = getTypeBadge(memory.memoryType);
  const Icon = badge.icon;

  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 hover:border-gray-700 transition flex items-start justify-between group">
      <div className="space-y-2 flex-1 pr-3">
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badge.color}`}>
            <Icon className="w-3 h-3 mr-1" />
            <span>{badge.label}</span>
          </span>

          <span className="text-[10px] text-gray-400 font-mono">
            {memory.importance.toUpperCase()} PRIORITY
          </span>
        </div>

        <p className="text-sm font-medium text-white leading-relaxed">
          {memory.content}
        </p>

        <div className="flex items-center space-x-3 text-[11px] text-gray-400">
          <span>Source: {memory.source || 'LearnMate AI'}</span>
          <span>•</span>
          <span>Stored {new Date(memory.createdAt).toLocaleDateString()}</span>
        </div>
      </div>

      <button
        onClick={() => onDelete(memory.id)}
        className="p-1.5 rounded-xl text-gray-400 hover:text-red-400 hover:bg-gray-800 transition opacity-80 group-hover:opacity-100"
        title="Delete Memory"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
};
