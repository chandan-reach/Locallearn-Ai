import React from 'react';
import { Link } from 'react-router-dom';
import { TeacherProfile } from '../types';
import { Star, MapPin, CheckCircle, Sparkles, BookOpen, Clock, Calendar, MessageSquare } from 'lucide-react';

interface TeacherCardProps {
  teacher: TeacherProfile;
  onBookClick?: (teacher: TeacherProfile) => void;
}

export const TeacherCard: React.FC<TeacherCardProps> = ({ teacher, onBookClick }) => {
  return (
    <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 hover:border-brand-500/50 hover:shadow-glow transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* TOP HEADER */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3.5">
            <div className="relative">
              <img
                src={teacher.avatar || teacher.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                alt={teacher.name || teacher.user?.name}
                className="w-14 h-14 rounded-2xl object-cover border-2 border-brand-500/40 group-hover:border-brand-400 transition"
              />
              {teacher.verificationStatus === 'VERIFIED' && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5" title="Verified Tutor">
                  <CheckCircle className="w-4 h-4 fill-emerald-500 text-white" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-bold text-white group-hover:text-brand-300 transition">
                  {teacher.name || teacher.user?.name}
                </h3>
              </div>
              <p className="text-xs text-gray-400 font-medium">{teacher.education}</p>

              <div className="flex items-center space-x-3 text-xs text-gray-400 mt-1">
                <span className="flex items-center text-amber-400 font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 mr-1" />
                  {teacher.rating.toFixed(1)} ({teacher.reviewsCount || 12} reviews)
                </span>
                <span>•</span>
                <span>{teacher.experienceYears}+ Yrs Exp</span>
              </div>
            </div>
          </div>

          {/* AI MATCH SCORE BADGE */}
          {teacher.matchScore !== undefined && (
            <div className="text-right bg-brand-950/80 border border-brand-500/40 rounded-xl px-2.5 py-1">
              <div className="flex items-center space-x-1 text-brand-300 font-extrabold text-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>{teacher.matchScore}% Match</span>
              </div>
              <span className="text-[10px] text-gray-400 block font-mono">AI Recommended</span>
            </div>
          )}
        </div>

        {/* BIO SNIPPET */}
        <p className="text-xs text-gray-300 line-clamp-2 mb-3.5 leading-relaxed">
          {teacher.bio}
        </p>

        {/* WHY WE RECOMMEND (AI HIGHLIGHT) */}
        {teacher.matchReasons && teacher.matchReasons.length > 0 && (
          <div className="mb-3.5 p-2 rounded-xl bg-brand-500/10 border border-brand-500/20 text-[11px] text-brand-200">
            <span className="font-semibold text-brand-300 flex items-center gap-1 mb-1">
              <Sparkles className="w-3 h-3 text-amber-400" /> Why this tutor matches:
            </span>
            <ul className="list-disc list-inside space-y-0.5 text-gray-300">
              {teacher.matchReasons.slice(0, 2).map((reason, idx) => (
                <li key={idx} className="truncate">{reason}</li>
              ))}
            </ul>
          </div>
        )}

        {/* SUBJECT CHIPS */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {teacher.subjects?.map((sub, idx) => (
            <span
              key={idx}
              className="px-2 py-0.5 rounded-lg text-xs font-medium bg-gray-800 text-gray-200 border border-gray-700"
            >
              {sub}
            </span>
          ))}
        </div>

        {/* LOCATION & MODE INFO */}
        <div className="flex items-center justify-between text-xs text-gray-400 border-t border-gray-800/80 pt-3 mb-4">
          <div className="flex items-center space-x-1 text-emerald-400 font-medium">
            <MapPin className="w-3.5 h-3.5" />
            <span>{teacher.locality}, {teacher.city}</span>
          </div>

          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-800 text-brand-300 border border-gray-700">
            {teacher.teachingMode}
          </span>
        </div>
      </div>

      {/* FOOTER & ACTIONS */}
      <div className="border-t border-gray-800/80 pt-3 flex items-center justify-between">
        <div>
          <span className="text-xs text-gray-400 block">Tuition Fee</span>
          <span className="text-lg font-extrabold text-white">₹{teacher.hourlyRate}<span className="text-xs text-gray-400 font-normal">/hr</span></span>
        </div>

        <div className="flex items-center space-x-2">
          <Link
            to={`/teachers/${teacher.id}`}
            className="px-3 py-1.5 rounded-xl text-xs font-medium bg-gray-800 hover:bg-gray-700 text-gray-200 transition"
          >
            View Profile
          </Link>

          <button
            onClick={() => onBookClick && onBookClick(teacher)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-glow transition flex items-center space-x-1"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Book Class</span>
          </button>
        </div>
      </div>
    </div>
  );
};
