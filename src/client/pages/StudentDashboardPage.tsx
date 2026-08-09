import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Booking } from '../types';
import { Sparkles, Calendar, BookOpen, Clock, BrainCircuit, ArrowRight, CheckCircle, Flame, Target } from 'lucide-react';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBookings()
      .then((data) => setBookings(data))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED');

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* WELCOME BANNER WITH AI SUMMARY */}
      <div className="bg-gradient-to-r from-brand-950 via-gray-900 to-indigo-950 border border-brand-800/60 rounded-3xl p-6 sm:p-8 shadow-glass relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <span className="text-xs font-semibold px-3 py-1 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30">
              Class 10 Student Profile
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Good evening, {user?.name} 👋</h1>
            <p className="text-xs sm:text-sm text-gray-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>AI Summary: You've completed <strong>72%</strong> of your weekly learning target!</span>
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <Link
              to="/student/ai"
              className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-glow transition flex items-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ask LearnMate AI</span>
            </Link>

            <Link
              to="/teachers"
              className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs border border-gray-700 transition"
            >
              Find Tutors
            </Link>
          </div>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-gray-400 block font-medium">Active Bookings</span>
          <p className="text-2xl font-extrabold text-white">{confirmedBookings.length}</p>
          <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Confirmed Tuition Slots
          </span>
        </div>

        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-gray-400 block font-medium">Weekly Study Hours</span>
          <p className="text-2xl font-extrabold text-brand-400">14.5 hrs</p>
          <span className="text-[11px] text-brand-300 font-semibold">Target: 20 hrs</span>
        </div>

        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-gray-400 block font-medium">Weak Topic Priority</span>
          <p className="text-xl font-extrabold text-amber-400">Quadratic Equations</p>
          <span className="text-[11px] text-amber-300 font-semibold flex items-center gap-1">
            <Flame className="w-3 h-3" /> Practice recommended today
          </span>
        </div>

        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-gray-400 block font-medium">Board Exam Readiness</span>
          <p className="text-2xl font-extrabold text-emerald-400">88%</p>
          <span className="text-[11px] text-gray-400">Class 10 CBSE</span>
        </div>
      </div>

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: UPCOMING CLASSES & CONTINUE LEARNING */}
        <div className="lg:col-span-2 space-y-8">
          {/* Upcoming Classes */}
          <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" /> Upcoming Tuition Schedule
              </h3>
              <Link to="/student/bookings" className="text-xs text-brand-400 hover:underline font-semibold">
                View All Bookings
              </Link>
            </div>

            {loading ? (
              <div className="p-4 text-xs text-gray-400">Loading bookings...</div>
            ) : confirmedBookings.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 bg-gray-800/40 rounded-2xl">
                No upcoming classes confirmed yet. Browse tutors to book a slot!
              </div>
            ) : (
              <div className="space-y-3">
                {confirmedBookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-gray-800/50 border border-gray-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={b.teacher?.user.avatar || 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=80'}
                        alt={b.teacher?.user.name}
                        className="w-10 h-10 rounded-xl object-cover border border-brand-500"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{b.subject} Tuition</h4>
                        <p className="text-xs text-gray-400">With {b.teacher?.user.name} • {b.date} at {b.timeSlot}</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {b.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Continue Learning Cards */}
          <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand-400" /> Continue Learning
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-gray-800/60 border border-gray-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">Mathematics</span>
                  <span className="text-brand-300 font-bold">85% Complete</span>
                </div>
                <p className="text-xs text-gray-400">Quadratic Equations & Discriminant Method</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-brand-500 h-2 rounded-full w-[85%]"></div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-gray-800/60 border border-gray-800 space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-bold text-white">Physics</span>
                  <span className="text-amber-300 font-bold">65% Complete</span>
                </div>
                <p className="text-xs text-gray-400">Electricity & Resistance Problems</p>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full w-[65%]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: AI RECOMMENDATIONS */}
        <div className="space-y-6">
          <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" /> AI Personal Recommendations
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-brand-950/60 border border-brand-800/60 text-xs space-y-1">
                <span className="font-bold text-brand-200 block">📈 Revise Algebra Discriminant</span>
                <p className="text-gray-300">You scored 78% on yesterday's quiz. LearnMate AI suggests reviewing discriminant word problems.</p>
                <Link to="/student/ai" className="text-brand-400 font-bold hover:underline inline-block pt-1">
                  Ask AI Tutor →
                </Link>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-xs space-y-1">
                <span className="font-bold text-emerald-200 block">👩‍🏫 Top Local Tutor Recommended</span>
                <p className="text-gray-300">Ankit Sharma (98% Match) is 2.4 km away in Indiranagar and fits your evening schedule.</p>
                <Link to="/teachers" className="text-emerald-400 font-bold hover:underline inline-block pt-1">
                  View Tutor Profile →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
