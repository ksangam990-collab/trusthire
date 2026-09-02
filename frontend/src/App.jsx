import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useThemeStore } from './store/themeStore';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';
import InteractiveMeshBackground from './components/canvas/InteractiveMeshBackground';

// Public Pages
import HomePage from './pages/public/HomePage';
import JobSearchPage from './pages/public/JobSearchPage';
import JobDetailPage from './pages/public/JobDetailPage';
import FraudBoardPage from './pages/public/FraudBoardPage';
import ReportPage from './pages/public/ReportPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import PostJobPage from './pages/employer/PostJobPage';
import VerifyPage from './pages/employer/VerifyPage';

// Job Seeker Pages
import DashboardPage from './pages/jobseeker/DashboardPage';
import ProfilePage from './pages/jobseeker/ProfilePage';

// Admin Pages
import AdminDashboardPage from './pages/admin/AdminDashboardPage';

export default function App() {
  const { initialize } = useAuthStore();
  const { initTheme } = useThemeStore();
  const location = useLocation();

  useEffect(() => {
    initTheme();
    initialize();
  }, [initialize, initTheme]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-[#080c14] text-slate-900 dark:text-slate-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-500 theme-transition relative">
      <InteractiveMeshBackground />
      <Navbar />
      <main className="flex-grow relative z-10">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/jobs" element={<JobSearchPage />} />
          <Route path="/jobs/:id" element={<JobDetailPage />} />
          <Route path="/fraud-board" element={<FraudBoardPage />} />
          <Route path="/report-fraud" element={<ReportPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Employer Protected Routes */}
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/post-job"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <PostJobPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/verify"
            element={
              <ProtectedRoute allowedRoles={['employer']}>
                <VerifyPage />
              </ProtectedRoute>
            }
          />

          {/* Job Seeker Protected Routes */}
          <Route
            path="/candidate/dashboard"
            element={
              <ProtectedRoute allowedRoles={['jobseeker']}>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute allowedRoles={['jobseeker']}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* Admin Dedicated Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
