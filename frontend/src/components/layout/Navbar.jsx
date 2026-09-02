import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  ShieldCheck, 
  Sun, 
  Moon, 
  LogOut, 
  User, 
  Plus, 
  Briefcase, 
  Menu, 
  X, 
  ChevronDown,
  LayoutDashboard,
  FileText,
  ShieldAlert
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';

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
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#0B0F17]/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" strokeWidth={2} />
            </div>
            <div className="flex items-baseline space-x-2">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                TrustHire
              </span>
              <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-medium px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                Verified Hiring
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 text-xs font-medium">
            <Link
              to="/jobs"
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                isActive('/jobs')
                  ? 'text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Browse Jobs
            </Link>

            <Link
              to="/fraud-board"
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                isActive('/fraud-board')
                  ? 'text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Fraud Board
            </Link>

            <Link
              to="/report-fraud"
              className={`px-3.5 py-2 rounded-xl transition-colors ${
                isActive('/report-fraud')
                  ? 'text-slate-900 dark:text-white font-bold bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Report Scam
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className={`px-3.5 py-2 rounded-xl transition-colors font-bold ${
                  isActive('/admin') || isActive('/admin/dashboard')
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Admin Center
              </Link>
            )}

            {user?.role === 'employer' && (
              <Link
                to="/employer/dashboard"
                className={`px-3.5 py-2 rounded-xl transition-colors font-bold ${
                  isActive('/employer/dashboard')
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Recruiter Portal
              </Link>
            )}

            {user?.role === 'jobseeker' && (
              <Link
                to="/candidate/dashboard"
                className={`px-3.5 py-2 rounded-xl transition-colors font-bold ${
                  isActive('/candidate/dashboard')
                    ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                My Applications
              </Link>
            )}
          </nav>

          {/* Right Controls */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" strokeWidth={2} /> : <Moon className="w-4 h-4 text-slate-700" strokeWidth={2} />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-200 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-xs">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold text-slate-900 dark:text-white truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
                    </div>

                    {user?.role === 'admin' ? (
                      <Link
                        to="/admin/dashboard"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold"
                      >
                        <ShieldAlert className="w-4 h-4 text-emerald-600" />
                        <span>Admin Control Center</span>
                      </Link>
                    ) : user?.role === 'employer' ? (
                      <>
                        <Link
                          to="/employer/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" />
                          <span>Dashboard & Pipeline</span>
                        </Link>
                        <Link
                          to="/employer/post-job"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                        >
                          <Plus className="w-4 h-4 text-emerald-600" />
                          <span>Post New Job</span>
                        </Link>
                        <Link
                          to="/employer/verify"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                        >
                          <ShieldCheck className="w-4 h-4 text-emerald-600" />
                          <span>MCA Verification</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/candidate/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                        >
                          <FileText className="w-4 h-4 text-slate-400" />
                          <span>My Applications</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium"
                        >
                          <User className="w-4 h-4 text-slate-400" />
                          <span>Profile & Resume</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1.5" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-left font-semibold"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B0F17] px-4 pt-3 pb-5 space-y-2 text-xs">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
          >
            Browse Verified Jobs
          </Link>
          <Link
            to="/fraud-board"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
          >
            Public Fraud Board
          </Link>
          <Link
            to="/report-fraud"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-xl text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-medium"
          >
            Report Scam Incident
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="px-3 text-slate-500 text-[11px]">
                Signed in as <strong>{user?.name}</strong>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 font-semibold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-semibold"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center rounded-xl bg-emerald-600 text-white font-bold"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
