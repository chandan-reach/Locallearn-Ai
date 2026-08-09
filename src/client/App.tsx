import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';

// Pages
import { LandingPage } from './pages/LandingPage';
import { DiscoveryPage } from './pages/DiscoveryPage';
import { TeacherProfilePage } from './pages/TeacherProfilePage';
import { StudentOnboardingPage } from './pages/StudentOnboardingPage';
import { TeacherOnboardingPage } from './pages/TeacherOnboardingPage';
import { AIChatPage } from './pages/AIChatPage';
import { AIMemoryPage } from './pages/AIMemoryPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { TeacherAvailabilityPage } from './pages/TeacherAvailabilityPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { ClassroomsPage } from './pages/ClassroomsPage';
import { CommunityPage } from './pages/CommunityPage';
import { MessagesPage } from './pages/MessagesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

const AppLayout: React.FC<{ children: React.ReactNode; showSidebar?: boolean }> = ({ children, showSidebar }) => {
  return (
    <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex flex-col font-sans">
      <Navbar />
      <div className="flex flex-1">
        {showSidebar && <Sidebar />}
        <main className="flex-1 w-full">{children}</main>
      </div>
    </div>
  );
};

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Verifying session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export const AppContent: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<AppLayout><LandingPage /></AppLayout>} />
      <Route path="/teachers" element={<AppLayout><DiscoveryPage /></AppLayout>} />
      <Route path="/teachers/:id" element={<AppLayout><TeacherProfilePage /></AppLayout>} />
      <Route path="/community" element={<AppLayout><CommunityPage /></AppLayout>} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Onboarding */}
      <Route path="/onboarding/student" element={<StudentOnboardingPage />} />
      <Route path="/onboarding/teacher" element={<TeacherOnboardingPage />} />

      {/* Student Protected Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <AppLayout showSidebar><StudentDashboardPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/bookings"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <AppLayout showSidebar><StudentDashboardPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/progress"
        element={
          <ProtectedRoute allowedRoles={['STUDENT']}>
            <AppLayout showSidebar><StudentDashboardPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/ai"
        element={
          <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}>
            <AppLayout showSidebar><AIChatPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/memory"
        element={
          <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}>
            <AppLayout showSidebar><AIMemoryPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/messages"
        element={
          <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}>
            <AppLayout showSidebar><MessagesPage /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Teacher Protected Routes */}
      <Route
        path="/teacher/dashboard"
        element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <AppLayout showSidebar><TeacherDashboardPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/bookings"
        element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <AppLayout showSidebar><TeacherDashboardPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/students"
        element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <AppLayout showSidebar><TeacherDashboardPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/earnings"
        element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <AppLayout showSidebar><TeacherDashboardPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/profile"
        element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <AppLayout showSidebar><TeacherDashboardPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher/availability"
        element={
          <ProtectedRoute allowedRoles={['TEACHER']}>
            <AppLayout showSidebar><TeacherAvailabilityPage /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Classrooms */}
      <Route
        path="/classrooms"
        element={
          <ProtectedRoute allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}>
            <AppLayout showSidebar><ClassroomsPage /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Admin Protected Routes */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppLayout showSidebar><AdminDashboardPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/users"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppLayout showSidebar><AdminDashboardPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/teachers"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppLayout showSidebar><AdminDashboardPage /></AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/reports"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AppLayout showSidebar><AdminDashboardPage /></AppLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
