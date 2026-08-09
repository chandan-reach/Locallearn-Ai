import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api, setAuthToken, getAuthToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  switchDemoRole: (role: UserRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(getAuthToken());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.me();
        setUser(res.user);
      } catch (err) {
        console.warn('Failed to verify token:', err);
        setAuthToken(null);
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.login({ email, password });
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: any) => {
    setLoading(true);
    try {
      const res = await api.register(data);
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  // Instant Single-Click Demo Role Switcher
  const switchDemoRole = async (targetRole: UserRole) => {
    setLoading(true);
    try {
      let email = 'rahul.student@locallearn.ai'; // STUDENT
      if (targetRole === 'TEACHER') {
        email = 'ankit.sharma@locallearn.ai';
      } else if (targetRole === 'ADMIN') {
        email = 'admin@locallearn.ai';
      }

      const res = await api.login({ email, password: 'password123' });
      setAuthToken(res.token);
      setToken(res.token);
      setUser(res.user);
    } catch (e) {
      console.error('Demo role switch error:', e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, switchDemoRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
