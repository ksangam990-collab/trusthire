import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

// Public Pages
import HomePage from './pages/public/HomePage';
import JobSearchPage from './pages/public/JobSearchPage';
import JobDetailPage from './pages/public/JobDetailPage';
import FraudBoardPage from './pages/public/FraudBoardPage';
import ReportPage from './pages/public/ReportPage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Employer Pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import PostJobPage from './pages/employer/PostJobPage';
import VerifyPage from './pages/employer/VerifyPage';

// Job Seeker Pages
import DashboardPage from './pages/jobseeker/DashboardPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, isInitialized, user } = useAuthStore();
  const location = useLocation();

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-[#0B0F17] flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-10 h-10 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-400 text-sm font-mono tracking-wider">INITIALIZING TRUSTHIRE SECURITY CONTEXT...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default function App() {
  const { initialize } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0B0F17] text-slate-100 antialiased selection:bg-emerald-500/20 selection:text-emerald-400">
      <Navbar />
      <main className="flex-grow">
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

          {/* Employer Protected Routes */}
          <Route
            path="/employer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['employer', 'admin']}>
                <EmployerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/post-job"
            element={
              <ProtectedRoute allowedRoles={['employer', 'admin']}>
                <PostJobPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/employer/verify"
            element={
              <ProtectedRoute allowedRoles={['employer', 'admin']}>
                <VerifyPage />
              </ProtectedRoute>
            }
          />

          {/* Job Seeker Protected Routes */}
          <Route
            path="/candidate/dashboard"
            element={
              <ProtectedRoute allowedRoles={['jobseeker', 'admin']}>
                <DashboardPage />
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