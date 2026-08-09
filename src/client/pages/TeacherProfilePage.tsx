import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { TeacherProfile } from '../types';
import { api } from '../services/api';
import { BookingModal } from '../components/BookingModal';
import { Star, MapPin, CheckCircle, Calendar, Clock, Award, BookOpen, MessageSquare, Sparkles, ShieldCheck } from 'lucide-react';

export const TeacherProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [teacher, setTeacher] = useState<TeacherProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (id) {
      api.getTeacherById(id)
        .then((data) => setTeacher(data))
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading teacher profile...</div>;
  }

  if (!teacher) {
    return <div className="p-8 text-center text-red-400">Teacher not found.</div>;
  }

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto space-y-8">
      {/* HEADER CARD */}
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 shadow-glass relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center space-x-5">
            <div className="relative">
              <img
                src={teacher.avatar || teacher.user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=250'}
                alt={teacher.name || teacher.user?.name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover border-2 border-brand-500 shadow-glow"
              />
              {teacher.verificationStatus === 'VERIFIED' && (
                <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow">
                  <CheckCircle className="w-5 h-5 fill-emerald-500 text-white" />
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center space-x-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{teacher.name || teacher.user?.name}</h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {teacher.verificationStatus} TUTOR
                </span>
              </div>
              <p className="text-sm text-gray-300 font-medium">{teacher.education}</p>

              <div className="flex flex-wrap items-center gap-4 text-xs text-gray-400 pt-1">
                <span className="flex items-center text-amber-400 font-extrabold text-sm">
                  <Star className="w-4 h-4 fill-amber-400 mr-1" />
                  {teacher.rating.toFixed(1)} ({teacher.reviewsCount || 12} reviews)
                </span>
                <span>•</span>
                <span className="flex items-center text-emerald-400 font-medium">
                  <MapPin className="w-4 h-4 mr-1" />
                  {teacher.locality}, {teacher.city}
                </span>
                <span>•</span>
                <span>{teacher.experienceYears}+ Years Teaching Exp</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:items-end space-y-3 w-full sm:w-auto border-t sm:border-t-0 border-gray-800 pt-4 sm:pt-0">
            <div>
              <span className="text-xs text-gray-400 block">Tuition Fee</span>
              <span className="text-2xl font-extrabold text-white">₹{teacher.hourlyRate}<span className="text-xs font-normal text-gray-400">/hr</span></span>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={() => setIsBookingOpen(true)}
                className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-glow transition flex items-center justify-center space-x-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Class</span>
              </button>

              <Link
                to={`/student/messages?partner=${teacher.userId}`}
                className="p-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 transition"
                title="Message Tutor"
              >
                <MessageSquare className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: ABOUT, SUBJECTS, REVIEWS */}
        <div className="lg:col-span-2 space-y-8">
          {/* Biography */}
          <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-brand-400" /> Biography & Teaching Philosophy
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed font-normal">
              {teacher.bio}
            </p>
          </div>

          {/* Subjects & Grades */}
          <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-400" /> Subjects & Classes Taught
            </h3>

            <div>
              <span className="text-xs text-gray-400 block mb-2 font-semibold">Subjects</span>
              <div className="flex flex-wrap gap-2">
                {teacher.subjects?.map((sub, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl text-xs font-semibold bg-brand-500/20 text-brand-300 border border-brand-500/30">
                    {sub}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-xs text-gray-400 block mb-2 font-semibold">Target Classes</span>
              <div className="flex flex-wrap gap-2">
                {teacher.gradesTaught?.map((grade, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-xl text-xs font-semibold bg-gray-800 text-gray-200 border border-gray-700">
                    {grade}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Student Reviews */}
          <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" /> Student Reviews ({teacher.reviewsCount || 2})
            </h3>

            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-gray-800/50 border border-gray-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80" alt="Rahul" className="w-7 h-7 rounded-full" />
                    <span className="text-xs font-bold text-white">Rahul Verma (Class 10)</span>
                  </div>
                  <span className="text-amber-400 text-xs font-bold flex items-center"><Star className="w-3 h-3 fill-amber-400 mr-1" /> 5.0</span>
                </div>
                <p className="text-xs text-gray-300">"Ankit sir makes Maths so intuitive! My test scores improved from 72% to 94% in just two months. Highly recommended for Indiranagar students."</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AVAILABILITY & QUICK BOOKING */}
        <div className="space-y-6">
          <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" /> Weekly Availability Schedule
            </h3>

            <div className="space-y-2 text-xs">
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((day) => (
                <div key={day} className="flex items-center justify-between p-2 rounded-xl bg-gray-800/40 border border-gray-800 text-gray-300">
                  <span className="font-semibold text-white">{day}</span>
                  <span className="text-emerald-400 font-mono">04:00 PM - 08:00 PM</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setIsBookingOpen(true)}
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-glow transition flex items-center justify-center space-x-2"
            >
              <Calendar className="w-4 h-4" />
              <span>Select Date & Book Slot</span>
            </button>
          </div>
        </div>
      </div>

      <BookingModal
        teacher={teacher}
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />
    </div>
  );
};
