import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap, Lock, Mail, User, MapPin, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialRole = searchParams.get('role') === 'TEACHER' ? 'TEACHER' : 'STUDENT';

  const [role, setRole] = useState<'STUDENT' | 'TEACHER'>(initialRole);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [locality, setLocality] = useState('Indiranagar');
  const [city, setCity] = useState('Bengaluru');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await register({
        name,
        email,
        password,
        role,
        locality,
        city,
      });

      if (role === 'TEACHER') {
        navigate('/onboarding/teacher');
      } else {
        navigate('/onboarding/student');
      }
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
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
          <h1 className="text-2xl font-extrabold text-white">Create Account</h1>
          <p className="text-xs text-gray-400">Join LocalLearn AI as a Student or Teacher.</p>
        </div>

        {/* ROLE SELECTOR */}
        <div className="grid grid-cols-2 gap-2 bg-gray-800 p-1 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('STUDENT')}
            className={`py-2 rounded-xl text-xs font-extrabold transition ${
              role === 'STUDENT' ? 'bg-brand-600 text-white shadow-glow' : 'text-gray-400 hover:text-white'
            }`}
          >
            🎓 I am a Student
          </button>
          <button
            type="button"
            onClick={() => setRole('TEACHER')}
            className={`py-2 rounded-xl text-xs font-extrabold transition ${
              role === 'TEACHER' ? 'bg-emerald-600 text-white shadow-glow' : 'text-gray-400 hover:text-white'
            }`}
          >
            👩‍🏫 I am a Teacher
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
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
                placeholder="Minimum 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Locality</label>
              <input
                type="text"
                value={locality}
                onChange={(e) => setLocality(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-xl text-white font-extrabold text-xs shadow-glow transition flex items-center justify-center space-x-1 ${
              role === 'TEACHER' ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-brand-600 hover:bg-brand-500'
            }`}
          >
            <span>{loading ? 'Creating account...' : `Continue as ${role}`}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-400">
          Already registered?{' '}
          <Link to="/login" className="text-brand-400 font-bold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
};
