import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, switchDemoRole } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login(email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoClick = async (role: 'STUDENT' | 'TEACHER' | 'ADMIN') => {
    setLoading(true);
    try {
      await switchDemoRole(role);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 p-4 flex items-center justify-center">
      <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-glass space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center mx-auto shadow-glow">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-xs text-gray-400">Sign in to your LocalLearn AI account.</p>
        </div>

        {/* DEMO ONE-CLICK LOGIN BOX */}
        <div className="p-3.5 rounded-2xl bg-brand-950/60 border border-brand-800/60 space-y-2">
          <span className="text-[11px] font-semibold text-brand-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Demo Quick Login Preset:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => handleDemoClick('STUDENT')}
              className="py-1.5 px-2 rounded-xl text-xs font-bold bg-brand-600 hover:bg-brand-500 text-white shadow-glow transition"
            >
              🎓 Student
            </button>
            <button
              onClick={() => handleDemoClick('TEACHER')}
              className="py-1.5 px-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-glow transition"
            >
              👩‍🏫 Teacher
            </button>
            <button
              onClick={() => handleDemoClick('ADMIN')}
              className="py-1.5 px-2 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-500 text-white shadow-glow transition"
            >
              🛡️ Admin
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-500"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs shadow-glow transition flex items-center justify-center space-x-1"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand-400 font-bold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
