import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { AdminStats } from '../types';
import { ShieldCheck, Users, CalendarCheck, BookOpen, CheckCircle, XCircle, AlertCircle, IndianRupee } from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [sData, uData] = await Promise.all([api.getAdminStats(), api.getAdminUsers()]);
      setStats(sData);
      setUsers(uData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTeacher = async (teacherId: string, status: string) => {
    try {
      await api.verifyTeacher(teacherId, status);
      loadAdminData();
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-400">Loading admin metrics...</div>;

  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-purple-950 via-gray-900 to-indigo-950 border border-purple-800/60 rounded-3xl p-6 sm:p-8 shadow-glass">
        <div className="space-y-2">
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            Platform Control Panel
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">LocalLearn AI Admin Console</h1>
          <p className="text-xs sm:text-sm text-gray-300">
            Monitor platform metrics, approve teacher verifications, and audit user activity.
          </p>
        </div>
      </div>

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-gray-400 block font-medium">Total Registered Users</span>
          <p className="text-2xl font-extrabold text-white">{stats?.totalUsers || 8}</p>
          <span className="text-[11px] text-gray-400">Students, Tutors & Admins</span>
        </div>

        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-gray-400 block font-medium">Total Bookings Executed</span>
          <p className="text-2xl font-extrabold text-emerald-400">{stats?.totalBookings || 12}</p>
          <span className="text-[11px] text-emerald-400 font-semibold">Active Local Tuitions</span>
        </div>

        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-gray-400 block font-medium">Active Virtual Classrooms</span>
          <p className="text-2xl font-extrabold text-brand-400">{stats?.activeClassrooms || 4}</p>
          <span className="text-[11px] text-brand-300 font-semibold">Batches Running</span>
        </div>

        <div className="bg-gray-900/90 border border-gray-800 rounded-2xl p-5 space-y-1">
          <span className="text-xs text-gray-400 block font-medium">Platform GMV Revenue</span>
          <p className="text-2xl font-extrabold text-amber-400">₹{stats?.totalRevenue || 14500}</p>
          <span className="text-[11px] text-amber-300 font-semibold">Tuition Transactions</span>
        </div>
      </div>

      {/* USER MANAGEMENT TABLE */}
      <div className="bg-gray-900/90 border border-gray-800 rounded-3xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Users className="w-4 h-4 text-brand-400" /> Platform User Directory
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-800/80 text-gray-400 font-semibold uppercase border-b border-gray-700">
              <tr>
                <th className="p-3">User Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Locality</th>
                <th className="p-3">Joined Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-800/40">
                  <td className="p-3 font-bold text-white flex items-center space-x-2">
                    <img src={u.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=60'} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                    <span>{u.name}</span>
                  </td>
                  <td className="p-3 text-gray-300">{u.email}</td>
                  <td className="p-3">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      u.role === 'TEACHER' ? 'bg-emerald-500/20 text-emerald-300' : u.role === 'ADMIN' ? 'bg-purple-500/20 text-purple-300' : 'bg-brand-500/20 text-brand-300'
                    }`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="p-3 text-gray-300">{u.locality || 'Indiranagar'}, {u.city || 'Bengaluru'}</td>
                  <td className="p-3 text-gray-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
