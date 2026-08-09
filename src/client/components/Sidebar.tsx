import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  MessageSquare,
  BookOpen,
  BrainCircuit,
  Sparkles,
  Award,
  Settings,
  ShieldAlert,
  Clock,
  IndianRupee,
  FileSpreadsheet
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const role = user?.role || 'STUDENT';

  const isActive = (path: string) => location.pathname === path;

  const studentLinks = [
    { label: 'Overview', path: '/student/dashboard', icon: LayoutDashboard },
    { label: 'Find Tutors', path: '/teachers', icon: Users },
    { label: 'My Bookings', path: '/student/bookings', icon: CalendarCheck },
    { label: 'LearnMate AI', path: '/student/ai', icon: Sparkles, highlight: true },
    { label: 'AI Memory', path: '/student/memory', icon: BrainCircuit },
    { label: 'Classrooms', path: '/classrooms', icon: BookOpen },
    { label: 'Messages', path: '/student/messages', icon: MessageSquare },
    { label: 'Learning Progress', path: '/student/progress', icon: Award },
  ];

  const teacherLinks = [
    { label: 'Overview', path: '/teacher/dashboard', icon: LayoutDashboard },
    { label: 'My Students', path: '/teacher/students', icon: Users },
    { label: 'Bookings & Requests', path: '/teacher/bookings', icon: CalendarCheck },
    { label: 'Availability Schedule', path: '/teacher/availability', icon: Clock },
    { label: 'Classrooms & Homework', path: '/classrooms', icon: BookOpen },
    { label: 'Messages', path: '/student/messages', icon: MessageSquare },
    { label: 'Earnings & Analytics', path: '/teacher/earnings', icon: IndianRupee },
    { label: 'Edit Profile', path: '/teacher/profile', icon: Settings },
  ];

  const adminLinks = [
    { label: 'Overview', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'Teacher Verification', path: '/admin/teachers', icon: ShieldAlert },
    { label: 'System Reports', path: '/admin/reports', icon: FileSpreadsheet },
  ];

  const links = role === 'TEACHER' ? teacherLinks : role === 'ADMIN' ? adminLinks : studentLinks;

  return (
    <aside className="w-64 bg-gray-900/80 backdrop-blur-md border-r border-gray-800 min-h-[calc(100vh-64px)] hidden md:block p-4">
      <div className="mb-6 px-3 py-2 rounded-xl bg-gray-800/60 border border-gray-800 flex items-center space-x-3">
        <img
          src={user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'}
          alt={user?.name}
          className="w-10 h-10 rounded-full object-cover border border-brand-500"
        />
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/30 uppercase font-mono font-bold">
            {role}
          </span>
        </div>
      </div>

      <nav className="space-y-1">
        {links.map((link) => {
          const Icon = link.icon;
          const active = isActive(link.path);
          return (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                active
                  ? 'bg-brand-600 text-white shadow-glow font-semibold'
                  : link.highlight
                  ? 'text-brand-300 hover:bg-brand-500/10 border border-brand-500/30'
                  : 'text-gray-300 hover:bg-gray-800/80 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${active ? 'text-white' : link.highlight ? 'text-brand-400' : 'text-gray-400'}`} />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
