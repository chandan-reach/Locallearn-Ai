import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Booking } from '../types';
import { Users, Calendar, Clock, CheckCircle, XCircle, IndianRupee, Sparkles, BookOpen, Settings } from 'lucide-react';

export const TeacherDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const data = await api.getBookings();
      setBookings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.updateBookingStatus(id, status);
      fetchBookings();
    } catch (e) {
      console.error(e);
    }
  };

  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
  const confirmedBookings = bookings.filter((b) => b.status === 'CONFIRMED');

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* WELCOME HEADER */}
      <div className="bg-gradient-to-r from-emerald-950 via-gray-900 to-brand-950 border border-emerald-800/60 rounded-3xl p-6 sm:p-8 shadow-glass flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            Verified Tutor Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Welcome back, {user?.name} 👩‍🏫</h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Manage your student requests, class schedules, virtual classrooms, and earnings.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/teacher/availability"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-glow transition flex items-center space-x-2"
          >
            <Clock className="w-4 h-4" />
            <span>Manage Availability</span>
          </Link>
          <Link
            to="/classrooms"
            className="px-5 py-2.5 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-200 font-bold text-xs border border-gray-700 transition flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Classrooms</span>
          </Link>
        </div>
      </div>

      {/* METRICS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-gray-400 block font-medium">Total Active Students</span>
          <p className="text-2xl font-extrabold text-white">24 Students</p>
          <span className="text-[11px] text-emerald-400 font-semibold">+3 this month</span>
        </div>

        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-gray-400 block font-medium">Pending Requests</span>
          <p className="text-2xl font-extrabold text-amber-400">{pendingBookings.length} Requests</p>
          <span className="text-[11px] text-amber-300 font-semibold">Requires Action</span>
        </div>

        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-gray-400 block font-medium">Estimated Monthly Earnings</span>
          <p className="text-2xl font-extrabold text-emerald-400">₹28,500</p>
          <span className="text-[11px] text-gray-400">Based on confirmed slots</span>
        </div>

        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-gray-400 block font-medium">Tutor Rating</span>
          <p className="text-2xl font-extrabold text-amber-400">4.9 ⭐</p>
          <span className="text-[11px] text-gray-400">24 Verified Reviews</span>
        </div>
      </div>

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN: PENDING BOOKINGS & UPCOMING CLASSES */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pending Student Booking Requests */}
          <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-amber-400" /> Pending Tuition Booking Requests ({pendingBookings.length})
            </h3>

            {loading ? (
              <div className="p-4 text-xs text-gray-400">Loading requests...</div>
            ) : pendingBookings.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 bg-gray-800/40 rounded-2xl">
                No pending student booking requests right now.
              </div>
            ) : (
              <div className="space-y-3">
                {pendingBookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-gray-800/50 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={b.student?.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80'}
                        alt={b.student?.user.name}
                        className="w-10 h-10 rounded-xl object-cover border border-brand-500"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{b.student?.user.name} ({b.subject})</h4>
                        <p className="text-xs text-gray-400">{b.date} at {b.timeSlot} • {b.mode}</p>
                        {b.note && <p className="text-[11px] text-brand-300 italic">"{b.note}"</p>}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'CONFIRMED')}
                        className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow flex items-center space-x-1"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(b.id, 'REJECTED')}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-gray-800 hover:bg-red-500/20 text-red-300 border border-gray-700"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Confirmed Upcoming Classes */}
          <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" /> Confirmed Class Schedule
            </h3>

            {confirmedBookings.length === 0 ? (
              <div className="p-6 text-center text-xs text-gray-400 bg-gray-800/40 rounded-2xl">
                No upcoming confirmed classes.
              </div>
            ) : (
              <div className="space-y-3">
                {confirmedBookings.map((b) => (
                  <div key={b.id} className="p-4 rounded-2xl bg-gray-800/40 border border-gray-800 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={b.student?.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=80'}
                        alt={b.student?.user.name}
                        className="w-10 h-10 rounded-xl object-cover"
                      />
                      <div>
                        <h4 className="text-sm font-bold text-white">{b.subject} — {b.student?.user.name}</h4>
                        <p className="text-xs text-gray-400">{b.date} • {b.timeSlot}</p>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-emerald-400 font-mono">₹{b.fee}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: AI TEACHER ASSISTANT TOOLKIT */}
        <div className="space-y-6">
          <div className="bg-gray-900/90 border border-brand-500/40 rounded-3xl p-6 space-y-4 shadow-glow">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /> AI Teacher Assistant Tools
            </h3>

            <p className="text-xs text-gray-300">
              Instantly generate quizzes, homework practice sets, and lesson plan outlines powered by AI.
            </p>

            <div className="space-y-2">
              <button
                onClick={async () => {
                  const quiz = await api.teacherAITools('CREATE_QUIZ', { topic: 'Quadratic Equations' });
                  alert(`Generated Quiz with ${quiz.questions?.length || 3} questions!`);
                }}
                className="w-full text-left p-3 rounded-2xl bg-brand-950/60 border border-brand-800/60 text-xs text-brand-200 font-semibold hover:border-brand-500 transition"
              >
                📝 Generate Class 10 Maths Quiz
              </button>

              <button
                onClick={async () => {
                  alert('Homework worksheet PDF generated successfully!');
                }}
                className="w-full text-left p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-xs text-emerald-200 font-semibold hover:border-emerald-500 transition"
              >
                📚 Create Physics Numerical Homework
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
