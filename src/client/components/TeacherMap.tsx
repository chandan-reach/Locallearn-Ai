import React, { useState } from 'react';
import { TeacherProfile } from '../types';
import { MapPin, Star, Sparkles, Navigation } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TeacherMapProps {
  teachers: TeacherProfile[];
  onBookClick?: (teacher: TeacherProfile) => void;
}

export const TeacherMap: React.FC<TeacherMapProps> = ({ teachers, onBookClick }) => {
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherProfile | null>(teachers[0] || null);

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-2xl p-4 relative overflow-hidden h-[520px] flex flex-col justify-between">
      {/* MAP CONTROLS OVERLAY */}
      <div className="absolute top-6 left-6 z-10 bg-gray-900/90 backdrop-blur-md border border-gray-800 rounded-xl p-3 shadow-glass flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
          <Navigation className="w-4 h-4" />
        </div>
        <div>
          <h4 className="text-xs font-bold text-white">Local Neighborhood Map</h4>
          <p className="text-[10px] text-gray-400">Bengaluru (Indiranagar, Koramangala, HSR Layout)</p>
        </div>
      </div>

      {/* MAP BACKGROUND GRAPHIC */}
      <div className="absolute inset-0 bg-[#0c1222] opacity-90 overflow-hidden">
        {/* Decorative Grid Lines */}
        <svg className="w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#4f46e5" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Locality Overlay Circles */}
        <div className="absolute top-1/4 left-1/3 w-64 h-64 bg-brand-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none"></div>
      </div>

      {/* MARKERS ON MAP */}
      <div className="relative z-10 w-full h-full pt-16 pb-20 flex items-center justify-center">
        <div className="relative w-full max-w-2xl h-full">
          {teachers.map((t, idx) => {
            // Calculate pseudo coordinates on map grid
            const offsets = [
              { top: '30%', left: '40%' },
              { top: '60%', left: '25%' },
              { top: '45%', left: '70%' },
              { top: '75%', left: '60%' },
              { top: '20%', left: '75%' },
            ];
            const pos = offsets[idx % offsets.length];
            const isSelected = selectedTeacher?.id === t.id;

            return (
              <div
                key={t.id}
                style={{ top: pos.top, left: pos.left }}
                onClick={() => setSelectedTeacher(t)}
                className={`absolute cursor-pointer transition-all duration-300 transform -translate-x-1/2 -translate-y-1/2 group ${
                  isSelected ? 'z-30 scale-110' : 'z-20 hover:scale-105'
                }`}
              >
                {/* Pulsing Radius Ring */}
                <div className={`absolute -inset-3 rounded-full opacity-75 animate-ping ${isSelected ? 'bg-brand-500/40' : 'bg-emerald-500/20'}`}></div>

                {/* Marker Pill */}
                <div
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-full border shadow-glass transition ${
                    isSelected
                      ? 'bg-brand-600 text-white border-brand-400 shadow-glow'
                      : 'bg-gray-900/90 text-gray-200 border-gray-700 hover:border-emerald-400'
                  }`}
                >
                  <MapPin className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-emerald-400'}`} />
                  <span className="text-xs font-bold whitespace-nowrap">{t.name || t.user?.name}</span>
                  <span className="text-[10px] opacity-80">₹{t.hourlyRate}/h</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SELECTED TEACHER TOOLTIP CARD */}
      {selectedTeacher && (
        <div className="relative z-20 bg-gray-900/95 border border-brand-500/40 rounded-xl p-3.5 shadow-glass flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={selectedTeacher.avatar || selectedTeacher.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
              alt={selectedTeacher.name || selectedTeacher.user?.name}
              className="w-11 h-11 rounded-xl object-cover border border-brand-500"
            />
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                {selectedTeacher.name || selectedTeacher.user?.name}
                <span className="text-amber-400 text-xs font-semibold flex items-center">
                  <Star className="w-3 h-3 fill-amber-400 mr-0.5" />
                  {selectedTeacher.rating}
                </span>
              </h4>
              <p className="text-xs text-gray-400">
                {selectedTeacher.locality}, {selectedTeacher.city} • <span className="text-brand-300 font-semibold">{selectedTeacher.matchScore || 95}% AI Match</span>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to={`/teachers/${selectedTeacher.id}`}
              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gray-800 hover:bg-gray-700 text-white"
            >
              Profile
            </Link>
            <button
              onClick={() => onBookClick && onBookClick(selectedTeacher)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-glow"
            >
              Book Class
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
