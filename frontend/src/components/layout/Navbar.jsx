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
    <header className="sticky top-0 z-40 w-full bg-white/95 dark:bg-[#090D16]/95 backdrop-blur border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-5 h-5" strokeWidth={1.75} />
            </div>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-bold tracking-tight text-slate-900 dark:text-white">
                TrustHire
              </span>
              <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-500/20">
                MCA Verified
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 text-xs font-medium">
            <Link
              to="/jobs"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/jobs')
                  ? 'text-slate-900 dark:text-white font-semibold bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Browse Jobs
            </Link>

            <Link
              to="/fraud-board"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/fraud-board')
                  ? 'text-slate-900 dark:text-white font-semibold bg-slate-100 dark:bg-slate-800'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Fraud Board
            </Link>

            <Link
              to="/report-fraud"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                isActive('/report-fraud')
                  ? 'text-rose-600 dark:text-rose-400 font-semibold bg-rose-50 dark:bg-rose-500/10'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
              }`}
            >
              Report Scam
            </Link>

            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors font-semibold ${
                  isActive('/admin') || isActive('/admin/dashboard')
                    ? 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10'
                    : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10'
                }`}
              >
                Admin Center
              </Link>
            )}

            {user?.role === 'employer' && (
              <Link
                to="/employer/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/employer/dashboard')
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Recruiter Portal
              </Link>
            )}

            {user?.role === 'jobseeker' && (
              <Link
                to="/candidate/dashboard"
                className={`px-3 py-1.5 rounded-lg transition-colors ${
                  isActive('/candidate/dashboard')
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-500/10'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                My Applications
              </Link>
            )}
          </nav>

          {/* Right Controls */}
          <div className="hidden md:flex items-center space-x-2.5">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" strokeWidth={1.75} /> : <Moon className="w-4 h-4 text-slate-700" strokeWidth={1.75} />}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors"
                >
                  <div className="w-5 h-5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <span className="text-xs font-medium text-slate-900 dark:text-slate-200 max-w-[110px] truncate">
                    {user?.name}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-1.5 w-52 rounded-xl bg-white dark:bg-[#0F172A] border border-slate-200 dark:border-slate-800 shadow-lg py-1.5 z-50 text-xs">
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-slate-900 dark:text-white truncate">{user?.name}</p>
                        <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded uppercase ${
                          user?.role === 'admin' ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                        }`}>
                          {user?.role || 'jobseeker'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-mono truncate">{user?.email}</p>
                    </div>

                    {user?.role === 'admin' ? (
                      <>
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 font-bold"
                        >
                          <ShieldAlert className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span>Admin Control Center</span>
                        </Link>
                        <Link
                          to="/employer/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                          <span>Employer & Job Manager</span>
                        </Link>
                        <Link
                          to="/employer/verify"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.5} />
                          <span>MCA / GST Statutory Audit</span>
                        </Link>
                        <Link
                          to="/employer/post-job"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        >
                          <Plus className="w-3.5 h-3.5 text-blue-600" strokeWidth={1.5} />
                          <span>Publish Verified Listing</span>
                        </Link>
                      </>
                    ) : user?.role === 'employer' ? (
                      <>
                        <Link
                          to="/employer/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                          <span>Dashboard & Applicants</span>
                        </Link>
                        <Link
                          to="/employer/post-job"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        >
                          <Plus className="w-3.5 h-3.5 text-emerald-600" strokeWidth={1.5} />
                          <span>Post New Job</span>
                        </Link>
                        <Link
                          to="/employer/verify"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        >
                          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" strokeWidth={1.5} />
                          <span>MCA / GST Verification</span>
                        </Link>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/candidate/dashboard"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                          <span>My Applications</span>
                        </Link>
                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center space-x-2 px-3.5 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                        >
                          <User className="w-3.5 h-3.5 text-slate-400" strokeWidth={1.5} />
                          <span>Profile & Resume</span>
                        </Link>
                      </>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-left font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 transition-colors shadow-sm"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-lg text-slate-700 dark:text-slate-300"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-[#090D16] px-4 pt-3 pb-5 space-y-2 text-xs">
          <Link
            to="/jobs"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Browse Verified Jobs
          </Link>
          <Link
            to="/fraud-board"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Public Fraud Board
          </Link>
          <Link
            to="/report-fraud"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10"
          >
            Report Scam Incident
          </Link>

          {isAuthenticated ? (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
              <div className="px-3 text-slate-500 font-mono text-[11px]">
                Signed in as <strong>{user?.name}</strong>
              </div>
              {user?.role === 'employer' ? (
                <>
                  <Link
                    to="/employer/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300"
                  >
                    Recruiter Dashboard
                  </Link>
                  <Link
                    to="/employer/post-job"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-emerald-600 dark:text-emerald-400"
                  >
                    Post an Opening
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/candidate/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300"
                  >
                    My Applications
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300"
                  >
                    Profile & Resume
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-rose-600 dark:text-rose-400 font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-center rounded-lg border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white font-medium"
              >
                Sign in
              </Link>
              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-center rounded-lg bg-emerald-600 dark:bg-emerald-500 text-white font-medium"
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
