import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  FileText
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
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#0B0F17]/90 dark:bg-[#0B0F17]/90 border-b border-slate-800/80 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 group-hover:shadow-glow-sm transition-all duration-200">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-base font-extrabold text-white tracking-tight flex items-center gap-1.5">
                TrustHire
                <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Verified
                </span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2 text-xs font-medium">
            <Link
              to="/jobs"
              className={`px-3 py-2 rounded-lg transition ${
                isActive('/jobs')
                  ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              Browse Jobs
            </Link>

            <Link
              to="/fraud-board"
              className={`px-3 py-2 rounded-lg flex items-center space-x-1.5 transition ${
                isActive('/fraud-board')
                  ? 'text-amber-400 bg-amber-500/10 font-semibold'
                  : 'text-slate-300 hover:text-amber-300 hover:bg-slate-800/50'
              }`}
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
              <span>Fraud Radar</span>
            </Link>

            <Link
              to="/report-fraud"
              className={`px-3 py-2 rounded-lg transition ${
                isActive('/report-fraud')
                  ? 'text-rose-400 bg-rose-500/10 font-semibold'
                  : 'text-slate-300 hover:text-rose-400 hover:bg-slate-800/50'
              }`}
            >
              Report Scam
            </Link>

            {user?.role === 'employer' && (
              <Link
                to="/employer/dashboard"
                className={`px-3 py-2 rounded-lg flex items-center space-x-1 transition ${
                  isActive('/employer/dashboard')
                    ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>Employer Portal</span>
              </Link>
            )}

            {user?.role === 'jobseeker' && (
              <Link
                to="/candidate/dashboard"
                className={`px-3 py-2 rounded-lg flex items-center space-x-1 transition ${
                  isActive('/candidate/dashboard')
                    ? 'text-emerald-400 bg-emerald-500/10 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span>My Applications</span>
              </Link>
            )}
          </nav>

          {/* Desktop Right Controls (Theme toggle, Post Job, Auth) */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 transition"
                >
                  <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-bold">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-200 max-w-[120px] truncate">
                    {user?.name}
                  </span>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                    {user?.role}
                  </span>
                </button>

                {/* Dropdown Menu */}
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-xl bg-[#111827] border border-slate-800 shadow-2xl py-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                    <div className="px-3.5 py-2 border-b border-slate-800/80">
                      <p className="font-semibold text-white truncate">{user?.name}</p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{user?.email}</p>
                    </div>

                    {user?.role === 'employer' ? (
                      <>
                        <Link
                          to="/employer/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-400" />
                          <span>Dashboard & Pipeline</span>
                        </Link>
                        <Link
                          to="/employer/post-job"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60"
                        >
                          <PlusCircle className="w-4 h-4 text-emerald-400" />
                          <span>Post New Opening</span>
                        </Link>
                        <Link
                          to="/employer/verify"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60"
                        >
                          <ShieldCheck className="w-4 h-4 text-blue-400" />
                          <span>MCA / GST Verification</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/candidate/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60"
                        >
                          <FileText className="w-4 h-4 text-emerald-400" />
                          <span>Application Tracker</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3.5 py-2 text-slate-300 hover:text-white hover:bg-slate-800/60"
                        >
                          <User className="w-4 h-4 text-blue-400" />
                          <span>Candidate Profile</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-800/80 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3.5 py-2 text-rose-400 hover:bg-rose-500/10 text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-lg text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-lg text-xs font-bold bg-emerald-400 hover:bg-emerald-300 text-slate-900 transition shadow-glow-sm"
                >
                  Create Account
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu trigger */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-slate-400 hover:text-slate-200"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-blue-400" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-[#0B0F17] px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
          >
            Browse Verified Jobs
          </Link>
          <Link
            to="/fraud-board"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-amber-400 hover:bg-slate-800"
          >
            Fraud Radar Feed
          </Link>
          <Link
            to="/report-fraud"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-slate-800"
          >
            Report Fraud Incident
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <div className="px-3 py-1 text-xs text-slate-400 font-mono">
                Logged in as <strong className="text-white">{user?.name}</strong> ({user?.role})
              </div>
              {user?.role === 'employer' ? (
                <>
                  <Link
                    to="/employer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Employer Dashboard
                  </Link>
                  <Link
                    to="/employer/post-job"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-emerald-400 hover:bg-slate-800"
                  >
                    Post an Opening
                  </Link>
                  <Link
                    to="/employer/verify"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-blue-400 hover:bg-slate-800"
                  >
                    Verify Company (CIN / GST)
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/candidate/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-sm text-slate-200 hover:bg-slate-800"
                  >
                    Profile & Resume
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 font-semibold"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-white"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2.5 text-center rounded-lg bg-emerald-400 text-slate-900 text-xs font-bold"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
