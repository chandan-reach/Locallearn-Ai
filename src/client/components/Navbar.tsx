import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  GraduationCap, 
  Sparkles, 
  MapPin, 
  Bell, 
  User, 
  LogOut, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  BrainCircuit, 
  BookOpen, 
  Users, 
  CalendarCheck,
  ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, switchDemoRole } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-[#0b0f19]/90 backdrop-blur-md border-b border-gray-800">
      {/* DEMO QUICK ROLE SWITCHER TOP BAR */}
      <div className="bg-gradient-to-r from-brand-900 via-indigo-950 to-brand-950 px-4 py-1.5 text-xs text-brand-200 border-b border-brand-800/40 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
          <span className="font-semibold text-white">LocalLearn AI Platform</span>
          <span className="hidden sm:inline text-gray-400">— Instant Role Switcher for Testing:</span>
        </div>
        <div className="flex items-center space-x-1 sm:space-x-2 font-medium">
          <button
            onClick={() => switchDemoRole('STUDENT')}
            className={`px-2 py-0.5 rounded transition ${user?.role === 'STUDENT' ? 'bg-brand-500 text-white shadow-sm' : 'bg-gray-800/80 hover:bg-gray-700 text-gray-300'}`}
          >
            🎓 Student (Rahul)
          </button>
          <button
            onClick={() => switchDemoRole('TEACHER')}
            className={`px-2 py-0.5 rounded transition ${user?.role === 'TEACHER' ? 'bg-emerald-600 text-white shadow-sm' : 'bg-gray-800/80 hover:bg-gray-700 text-gray-300'}`}
          >
            👩‍🏫 Teacher (Ankit)
          </button>
          <button
            onClick={() => switchDemoRole('ADMIN')}
            className={`px-2 py-0.5 rounded transition ${user?.role === 'ADMIN' ? 'bg-purple-600 text-white shadow-sm' : 'bg-gray-800/80 hover:bg-gray-700 text-gray-300'}`}
          >
            🛡️ Admin
          </button>
        </div>
      </div>

      {/* MAIN NAV */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* LOGO */}
        <Link to="/" className="flex items-center space-x-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
              Local<span className="text-brand-400">Learn</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">AI</span>
            </span>
            <span className="text-[10px] text-gray-400 block -mt-1 tracking-wider uppercase">Local Tuition Ecosystem</span>
          </div>
        </Link>

        {/* DESKTOP NAV LINKS */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          <Link
            to="/teachers"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${isActive('/teachers') ? 'bg-gray-800 text-brand-400' : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'}`}
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Find Tutors</span>
          </Link>

          <Link
            to="/student/ai"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${isActive('/student/ai') ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40' : 'text-brand-300 hover:bg-brand-500/10'}`}
          >
            <Sparkles className="w-4 h-4 text-brand-400 animate-spin-slow" />
            <span>LearnMate AI</span>
          </Link>

          <Link
            to="/student/memory"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${isActive('/student/memory') ? 'bg-gray-800 text-purple-400' : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'}`}
          >
            <BrainCircuit className="w-4 h-4 text-purple-400" />
            <span>AI Memory</span>
          </Link>

          <Link
            to="/community"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${isActive('/community') ? 'bg-gray-800 text-amber-400' : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'}`}
          >
            <Users className="w-4 h-4 text-amber-400" />
            <span>Community</span>
          </Link>

          <Link
            to="/classrooms"
            className={`px-3 py-2 rounded-lg text-sm font-medium transition flex items-center space-x-1.5 ${isActive('/classrooms') ? 'bg-gray-800 text-blue-400' : 'text-gray-300 hover:bg-gray-800/60 hover:text-white'}`}
          >
            <BookOpen className="w-4 h-4 text-blue-400" />
            <span>Classrooms</span>
          </Link>
        </nav>

        {/* RIGHT CONTROLS */}
        <div className="flex items-center space-x-3">
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 relative transition"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500 animate-ping"></span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500"></span>
            </button>

            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-800 rounded-xl shadow-glass p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-gray-800 mb-2">
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Notifications</span>
                  <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full">2 Unread</span>
                </div>
                <div className="space-y-2">
                  <div className="p-2 rounded-lg bg-brand-950/40 border border-brand-800/30 text-xs text-gray-300">
                    <p className="font-semibold text-white">Class Confirmed! 📅</p>
                    <p className="text-gray-400 text-[11px]">Ankit Sharma confirmed your Mathematics tuition today at 5:30 PM.</p>
                  </div>
                  <div className="p-2 rounded-lg bg-gray-800/40 border border-gray-700/30 text-xs text-gray-300">
                    <p className="font-semibold text-white">AI Memory Recorded 🧠</p>
                    <p className="text-gray-400 text-[11px]">LearnMate AI remembered your target goal for Class 10 Board Exams.</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition"
            title="Toggle theme"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </button>

          {/* User Menu / Dashboard Button */}
          {user ? (
            <div className="flex items-center space-x-2">
              <Link
                to={user.role === 'TEACHER' ? '/teacher/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'}
                className="flex items-center space-x-2 bg-gray-800/90 hover:bg-gray-700 text-white px-3 py-1.5 rounded-xl border border-gray-700/80 transition"
              >
                <img
                  src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border border-brand-500"
                />
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-semibold text-white leading-tight">{user.name}</p>
                  <p className="text-[10px] text-brand-400 leading-tight font-mono">{user.role}</p>
                </div>
              </Link>

              <button
                onClick={logout}
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-gray-800 transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <Link
                to="/login"
                className="px-3 py-1.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-1.5 rounded-xl text-sm font-medium bg-brand-600 hover:bg-brand-500 text-white shadow-glow transition"
              >
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU DRAWER */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-800 bg-gray-900/95 px-4 pt-2 pb-4 space-y-2">
          <Link
            to="/teachers"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-200 hover:bg-gray-800"
          >
            📍 Find Tutors Near Me
          </Link>
          <Link
            to="/student/ai"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-brand-400 hover:bg-gray-800"
          >
            ✨ LearnMate AI Assistant
          </Link>
          <Link
            to="/student/memory"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-purple-400 hover:bg-gray-800"
          >
            🧠 AI Learning Memory
          </Link>
          <Link
            to="/community"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-amber-400 hover:bg-gray-800"
          >
            👥 Learning Community
          </Link>
          <Link
            to="/classrooms"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-blue-400 hover:bg-gray-800"
          >
            📚 Classrooms & Homework
          </Link>

          {user && (
            <Link
              to={user.role === 'TEACHER' ? '/teacher/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-emerald-400 hover:bg-gray-800 border-t border-gray-800 pt-3"
            >
              📊 Go to {user.role} Dashboard
            </Link>
          )}
        </div>
      )}
    </header>
  );
};
