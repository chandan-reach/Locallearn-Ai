import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  GraduationCap, 
  MapPin, 
  Sparkles, 
  Search, 
  Star, 
  CheckCircle, 
  Calendar, 
  BrainCircuit, 
  Users, 
  BookOpen, 
  ArrowRight,
  ShieldCheck,
  Zap,
  Award
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchSubject, setSearchSubject] = useState('');
  const [searchLocality, setSearchLocality] = useState('');

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchSubject) params.set('subject', searchSubject);
    if (searchLocality) params.set('locality', searchLocality);
    navigate(`/teachers?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 selection:bg-brand-500 selection:text-white">
      {/* HERO SECTION */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-gray-800/60">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-brand-600/15 blur-[120px] rounded-full pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-[400px] h-[250px] bg-emerald-600/10 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT COLUMN: HEADLINE & SEARCH */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-brand-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>Next-Gen Local Education & AI Tutor Platform</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">
                Find the Right Teacher. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-indigo-300 to-emerald-400">
                  Learn Better. Grow Faster.
                </span>
              </h1>

              <p className="text-lg text-gray-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Connect with trusted teachers and students in your local area — powered by persistent AI memory and personalized tuition booking.
              </p>

              {/* QUICK HERO SEARCH BAR */}
              <form onSubmit={handleHeroSearch} className="bg-gray-900/90 border border-gray-800 rounded-2xl p-2 shadow-glass max-w-xl mx-auto lg:mx-0 flex flex-col sm:flex-row items-center gap-2">
                <div className="flex-1 flex items-center space-x-2 px-3 py-2 w-full">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Subject (e.g. Maths, Physics)"
                    value={searchSubject}
                    onChange={(e) => setSearchSubject(e.target.value)}
                    className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>

                <div className="h-6 w-[1px] bg-gray-800 hidden sm:block"></div>

                <div className="flex-1 flex items-center space-x-2 px-3 py-2 w-full">
                  <MapPin className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Locality (e.g. Indiranagar)"
                    value={searchLocality}
                    onChange={(e) => setSearchLocality(e.target.value)}
                    className="w-full bg-transparent text-sm text-white placeholder-gray-500 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm shadow-glow transition flex items-center justify-center space-x-2 flex-shrink-0"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Tutors</span>
                </button>
              </form>

              {/* ACTION BUTTONS & TAGS */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/teachers"
                  className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-glow transition flex items-center space-x-2"
                >
                  <span>Find a Teacher</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/register?role=TEACHER"
                  className="px-6 py-3 rounded-xl bg-gray-800/90 hover:bg-gray-700 text-gray-200 font-bold text-sm border border-gray-700 transition"
                >
                  Become a Teacher
                </Link>
              </div>

              {/* QUICK METRICS */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-800/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div>
                  <p className="text-xl font-extrabold text-white">500+</p>
                  <p className="text-xs text-gray-400">Verified Local Tutors</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-emerald-400">98%</p>
                  <p className="text-xs text-gray-400">Student Satisfaction</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-amber-400">24/7</p>
                  <p className="text-xs text-gray-400">AI Study Assistant</p>
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN: INTERACTIVE ANIMATED DASHBOARD CARDS */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md">
                {/* Main Card Graphic */}
                <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 shadow-glass relative z-10 backdrop-blur-md">
                  <div className="flex items-center justify-between pb-4 border-b border-gray-800 mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-2xl bg-brand-500/20 border border-brand-500/40 flex items-center justify-center">
                        <GraduationCap className="w-6 h-6 text-brand-400" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-white">Local Tuition Hub</h4>
                        <p className="text-xs text-gray-400">Indiranagar & Nearby</p>
                      </div>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      LIVE
                    </span>
                  </div>

                  {/* Flow Diagram */}
                  <div className="space-y-3">
                    <div className="p-3 rounded-2xl bg-gray-800/60 border border-gray-700/60 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">
                          1
                        </div>
                        <span className="text-xs font-semibold text-gray-200">Local Student Query</span>
                      </div>
                      <span className="text-[11px] text-gray-400">"Class 10 Maths"</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-brand-950/60 border border-brand-800/60 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-brand-500/20 text-brand-300 flex items-center justify-center">
                          <Sparkles className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-brand-200">AI Recommendation Engine</span>
                      </div>
                      <span className="text-[11px] text-emerald-400 font-bold">98% Match</span>
                    </div>

                    <div className="p-3 rounded-2xl bg-gray-800/60 border border-gray-700/60 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                          <BrainCircuit className="w-4 h-4" />
                        </div>
                        <span className="text-xs font-semibold text-gray-200">Persistent AI Memory</span>
                      </div>
                      <span className="text-[11px] text-purple-300">Context Saved</span>
                    </div>
                  </div>
                </div>

                {/* Floating Card 1 */}
                <div className="absolute -top-6 -right-6 z-20 bg-gray-900/95 border border-brand-500/40 rounded-2xl p-3 shadow-glow animate-bounce duration-1000">
                  <div className="flex items-center space-x-2 text-xs font-bold text-white">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Math Tutor Found (2.4 km)</span>
                  </div>
                </div>

                {/* Floating Card 2 */}
                <div className="absolute -bottom-6 -left-6 z-20 bg-gray-900/95 border border-amber-500/40 rounded-2xl p-3 shadow-glass">
                  <div className="flex items-center space-x-2 text-xs font-bold text-amber-300">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>AI Learning Plan Ready</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Built for Local Education Excellence
          </h2>
          <p className="text-gray-400 mt-3 text-base">
            Everything students and local tutors need for seamless tuition booking, progress tracking, and AI assistance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-6 hover:border-brand-500/50 transition group">
            <div className="w-12 h-12 rounded-2xl bg-brand-500/20 text-brand-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Location-Based Tutor Search</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Find verified tutors right in your locality, pincode, or distance radius. Filter by subjects, class, fees, and teaching mode.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-6 hover:border-brand-500/50 transition group">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BrainCircuit className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Persistent AI Memory Architecture</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              LearnMate AI remembers your learning preferences, weak topics, and goals across sessions for tailored doubt resolution.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-6 hover:border-brand-500/50 transition group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Calendar className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Tuition Booking & Schedules</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Check real-time tutor calendar availability, pick preferred time slots, send requests, and get instant status confirmations.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-6 hover:border-brand-500/50 transition group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">AI 7-Day Study Plans</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Generate personalized 7-day revision roadmaps structured around your board exam syllabus and weak topic areas.
            </p>
          </div>

          {/* Feature 5 */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-6 hover:border-brand-500/50 transition group">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Virtual Classrooms & Assignments</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Teachers can create batch classrooms, post homework, accept student submissions, and provide scores and feedback.
            </p>
          </div>

          {/* Feature 6 */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-3xl p-6 hover:border-brand-500/50 transition group">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Local Community Board</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Students ask academic doubts, teachers share study formula sheets, and local study groups collaborate safely.
            </p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 bg-gradient-to-r from-brand-950 via-gray-900 to-indigo-950 border-t border-gray-800 text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Accelerate Your Learning Journey?
          </h2>
          <p className="text-gray-300 text-sm max-w-xl mx-auto">
            Join hundreds of local students and teachers in your city today.
          </p>
          <div className="flex justify-center space-x-4">
            <Link
              to="/teachers"
              className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm shadow-glow transition"
            >
              Explore Tutors Near Me
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
