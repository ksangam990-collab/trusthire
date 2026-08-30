import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import useAuthStore from './store/authStore';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/layout/ProtectedRoute';

// Public pages
import HomePage from './pages/public/HomePage';
import JobSearchPage from './pages/public/JobSearchPage';
import JobDetailPage from './pages/public/JobDetailPage';
import FraudBoardPage from './pages/public/FraudBoardPage';
import ReportPage from './pages/public/ReportPage';

// Auth pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';

// Job seeker pages
import DashboardPage from './pages/jobseeker/DashboardPage';

// Employer pages
import EmployerDashboard from './pages/employer/EmployerDashboard';
import VerifyPage from './pages/employer/VerifyPage';
import PostJobPage from './pages/employer/PostJobPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 2, // 2 minutes
    },
  },
});

function AppLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

// Auth pages don't get the full layout (no navbar/footer)
function AuthLayout({ children }) {
  return <>{children}</>;
}

export default function App() {
  const { initialize } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: { fontFamily: 'Inter, sans-serif', fontSize: '14px' },
          }}
        />
        <Routes>
          {/* ── Public ─────────────────────────────────────────────────── */}
          <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
          <Route path="/jobs" element={<AppLayout><JobSearchPage /></AppLayout>} />
          <Route path="/jobs/:jobId" element={<AppLayout><JobDetailPage /></AppLayout>} />
          <Route path="/fraud-board" element={<AppLayout><FraudBoardPage /></AppLayout>} />
          <Route path="/report" element={
            <ProtectedRoute allowedRoles={['jobseeker']}>
              <AppLayout><ReportPage /></AppLayout>
            </ProtectedRoute>
          } />

          {/* ── Auth ───────────────────────────────────────────────────── */}
          <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
          <Route path="/register" element={<AuthLayout><RegisterPage /></AuthLayout>} />
          <Route path="/forgot-password" element={<AuthLayout><ForgotPasswordPage /></AuthLayout>} />

          {/* ── Job Seeker ─────────────────────────────────────────────── */}
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['jobseeker']}>
              <AppLayout><DashboardPage /></AppLayout>
            </ProtectedRoute>
          } />

          {/* ── Employer ───────────────────────────────────────────────── */}
          <Route path="/employer/dashboard" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <AppLayout><EmployerDashboard /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/employer/verify" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <AppLayout><VerifyPage /></AppLayout>
            </ProtectedRoute>
          } />
          <Route path="/employer/post-job" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <AppLayout><PostJobPage /></AppLayout>
            </ProtectedRoute>
          } />

          {/* ── Fallback ───────────────────────────────────────────────── */}
          <Route path="*" element={
            <AppLayout>
              <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
                <p className="text-6xl font-bold text-slate-200 mb-4">404</p>
                <p className="text-slate-600 mb-6">Page not found.</p>
                <a href="/" className="btn-primary">Go home</a>
              </div>
            </AppLayout>
          } />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
