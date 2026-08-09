import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TeacherProfile } from '../types';
import { api } from '../services/api';
import { TeacherCard } from '../components/TeacherCard';
import { TeacherMap } from '../components/TeacherMap';
import { BookingModal } from '../components/BookingModal';
import { Search, MapPin, SlidersHorizontal, Grid, Map, Sparkles, AlertCircle } from 'lucide-react';

export const DiscoveryPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  // Filters state
  const [subject, setSubject] = useState(searchParams.get('subject') || '');
  const [locality, setLocality] = useState(searchParams.get('locality') || '');
  const [grade, setGrade] = useState(searchParams.get('grade') || '');
  const [mode, setMode] = useState(searchParams.get('mode') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');

  // Booking Modal
  const [selectedTeacherForBooking, setSelectedTeacherForBooking] = useState<TeacherProfile | null>(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, [searchParams]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const params: Record<string, string> = {};
      if (subject) params.subject = subject;
      if (locality) params.locality = locality;
      if (grade) params.grade = grade;
      if (mode) params.mode = mode;
      if (maxPrice) params.maxPrice = maxPrice;

      const data = await api.getTeachers(params);
      setTeachers(data);
    } catch (err) {
      console.error('Error fetching teachers:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilters = (e: React.FormEvent) => {
    e.preventDefault();
    const params: Record<string, string> = {};
    if (subject) params.subject = subject;
    if (locality) params.locality = locality;
    if (grade) params.grade = grade;
    if (mode) params.mode = mode;
    if (maxPrice) params.maxPrice = maxPrice;
    setSearchParams(params);
  };

  const handleOpenBooking = (teacher: TeacherProfile) => {
    setSelectedTeacherForBooking(teacher);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-gray-800">
        <div>
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Local Tutors Near Me</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Find Nearby Verified Tutors</h1>
          <p className="text-xs text-gray-400">Discover trusted teachers in your neighborhood matched by AI compatibility.</p>
        </div>

        {/* VIEW MODE TOGGLE */}
        <div className="flex items-center space-x-2 bg-gray-900 border border-gray-800 rounded-xl p-1 self-start">
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              viewMode === 'grid' ? 'bg-brand-600 text-white shadow-glow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            <span>List View</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              viewMode === 'map' ? 'bg-brand-600 text-white shadow-glow' : 'text-gray-400 hover:text-white'
            }`}
          >
            <Map className="w-3.5 h-3.5" />
            <span>Map View</span>
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <form onSubmit={handleApplyFilters} className="bg-gray-900/90 border border-gray-800 rounded-2xl p-4 shadow-glass grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
        <div>
          <label className="block text-[11px] font-semibold text-gray-400 mb-1">Subject</label>
          <input
            type="text"
            placeholder="e.g. Mathematics"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-400 mb-1">Locality / Area</label>
          <input
            type="text"
            placeholder="e.g. Indiranagar"
            value={locality}
            onChange={(e) => setLocality(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-400 mb-1">Class / Grade</label>
          <select
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="">All Classes</option>
            <option value="Class 8">Class 8</option>
            <option value="Class 9">Class 9</option>
            <option value="Class 10">Class 10</option>
            <option value="Class 11">Class 11</option>
            <option value="Class 12">Class 12</option>
          </select>
        </div>

        <div>
          <label className="block text-[11px] font-semibold text-gray-400 mb-1">Teaching Mode</label>
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-brand-500"
          >
            <option value="">All Modes</option>
            <option value="OFFLINE">Offline (In-Person)</option>
            <option value="ONLINE">Online</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-2 bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs rounded-xl shadow-glow transition flex items-center justify-center space-x-1.5"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Apply Filters</span>
        </button>
      </form>

      {/* RESULTS DISPLAY */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 h-64 animate-pulse"></div>
          ))}
        </div>
      ) : teachers.length === 0 ? (
        <div className="bg-gray-900/60 border border-gray-800 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto">
            <AlertCircle className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">No Tutors Found</h3>
          <p className="text-xs text-gray-400">
            We couldn't find exact matches for your filter criteria. Try clearing locality or increasing price range.
          </p>
          <button
            onClick={() => {
              setSubject('');
              setLocality('');
              setGrade('');
              setMode('');
              setMaxPrice('');
              setSearchParams({});
            }}
            className="px-4 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white"
          >
            Reset All Filters
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((t) => (
            <TeacherCard key={t.id} teacher={t} onBookClick={handleOpenBooking} />
          ))}
        </div>
      ) : (
        <TeacherMap teachers={teachers} onBookClick={handleOpenBooking} />
      )}

      {/* BOOKING MODAL */}
      <BookingModal
        teacher={selectedTeacherForBooking}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        onSuccess={() => fetchTeachers()}
      />
    </div>
  );
};
