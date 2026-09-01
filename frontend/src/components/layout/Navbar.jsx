import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Briefcase, 
  PlusCircle, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  LogOut, 
  User, 
  Building2, 
  LayoutDashboard,
  FileText,
  Sparkles,
  ChevronDown
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import TrustScoreBadge from '../ui/TrustScoreBadge';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const { isAuthenticated, user, logout } = useAuthStore();
  const { theme, toggleTheme } = useThemeStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
    await logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-white/80 dark:bg-[#080c14]/85 border-b border-slate-200/90 dark:border-slate-800/80 theme-transition shadow-sm dark:shadow-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo with Glow */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <motion.div 
              whileHover={{ scale: 1.05, rotate: 2 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.2)] transition-all"
            >
              <ShieldCheck className="w-5 h-5" />
            </motion.div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                TrustHire
                <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
                  Verified
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links with Active Indicator */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-semibold">
            <Link
              to="/jobs"
              className={`px-3 py-2 rounded-xl transition ${
                isActive('/jobs')
                  ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              Browse Jobs
            </Link>

            <Link
              to="/fraud-board"
              className={`px-3 py-2 rounded-xl flex items-center space-x-1.5 transition ${
                isActive('/fraud-board')
                  ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-500" />
              <span>Fraud Radar</span>
            </Link>

            <Link
              to="/report-fraud"
              className={`px-3 py-2 rounded-xl transition ${
                isActive('/report-fraud')
                  ? 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800/50'
              }`}
            >
              Report Scam
            </Link>

            {user?.role === 'employer' && (
              <Link
                to="/employer/dashboard"
                className={`px-3 py-2 rounded-xl flex items-center space-x-1 transition ${
                  isActive('/employer/dashboard')
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5 text-emerald-500" />
                <span>Employer Portal</span>
              </Link>
            )}

            {user?.role === 'jobseeker' && (
              <Link
                to="/candidate/dashboard"
                className={`px-3 py-2 rounded-xl flex items-center space-x-1 transition ${
                  isActive('/candidate/dashboard')
                    ? 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-emerald-500" />
                <span>My Applications</span>
              </Link>
            )}
          </nav>

          {/* Desktop Right Controls (Theme toggle, Profile / Auth) */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Animated Theme Toggle Button */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-emerald-500/40 transition-colors shadow-sm"
              aria-label="Toggle theme"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={theme}
                  initial={{ y: -8, opacity: 0, rotate: -30 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: 8, opacity: 0, rotate: 30 }}
                  transition={{ duration: 0.15 }}
                >
                  {theme === 'dark' ? (
                    <Sun className="w-4 h-4 text-amber-400" />
                  ) : (
                    <Moon className="w-4 h-4 text-blue-600" />
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.button>

            {isAuthenticated ? (
              <div className="relative">
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 font-bold flex items-center justify-center text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                    {user?.role}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </motion.button>

                {/* Dropdown Menu with AnimatePresence */}
                <AnimatePresence>
                  {profileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-[#111827] border border-slate-200 dark:border-slate-800 shadow-2xl py-2 z-50 text-xs"
                    >
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800/80">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 font-mono truncate">{user?.email}</p>
                      </div>

                      {user?.role === 'employer' ? (
                        <>
                          <Link
                            to="/employer/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center space-x-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                          >
                            <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                            <span>Recruiter Dashboard</span>
                          </Link>
                          <Link
                            to="/employer/post-job"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center space-x-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                          >
                            <PlusCircle className="w-4 h-4 text-emerald-500" />
                            <span>Post Verified Job</span>
                          </Link>
                          <Link
                            to="/employer/verify"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center space-x-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                          >
                            <ShieldCheck className="w-4 h-4 text-blue-500" />
                            <span>MCA & GST Verification</span>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/candidate/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center space-x-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                          >
                            <FileText className="w-4 h-4 text-emerald-500" />
                            <span>Application Tracker</span>
                          </Link>
                          <Link
                            to="/profile"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center space-x-2.5 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                          >
                            <User className="w-4 h-4 text-blue-500" />
                            <span>Candidate Profile</span>
                          </Link>
                        </>
                      )}

                      <div className="border-t border-slate-100 dark:border-slate-800/80 my-1" />

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-left font-semibold"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 transition"
                >
                  Sign In
                </Link>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Link
                    to="/register"
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-500 hover:bg-emerald-400 dark:bg-emerald-400 dark:hover:bg-emerald-300 text-white dark:text-slate-900 transition shadow-sm dark:shadow-[0_0_15px_rgba(16,185,129,0.3)] block"
                  >
                    Get Started
                  </Link>
                </motion.div>
              </div>
            )}
          </div>

          {/* Mobile menu triggers */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-600" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer with AnimatePresence */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-[#080c14]/95 px-4 pt-3 pb-6 space-y-2 text-xs"
          >
            <Link
              to="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Browse Verified Jobs
            </Link>
            <Link
              to="/fraud-board"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-medium text-amber-600 dark:text-amber-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Fraud Radar Feed
            </Link>
            <Link
              to="/report-fraud"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-xl font-medium text-rose-600 dark:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Report Scam Incident
            </Link>

            {isAuthenticated ? (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
                <div className="px-3 py-1 text-slate-500 dark:text-slate-400 font-mono">
                  Signed in as <strong className="text-slate-900 dark:text-white">{user?.name}</strong> ({user?.role})
                </div>
                {user?.role === 'employer' ? (
                  <>
                    <Link
                      to="/employer/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Employer Dashboard
                    </Link>
                    <Link
                      to="/employer/post-job"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl font-semibold text-emerald-600 dark:text-emerald-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Post an Opening
                    </Link>
                    <Link
                      to="/employer/verify"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl font-semibold text-blue-600 dark:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Verify Company (CIN / GST)
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/candidate/dashboard"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      My Applications
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 rounded-xl font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      Profile & Resume
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-semibold text-slate-800 dark:text-white"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 text-center rounded-xl bg-emerald-500 dark:bg-emerald-400 text-white dark:text-slate-900 font-bold"
                >
                  Register
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
