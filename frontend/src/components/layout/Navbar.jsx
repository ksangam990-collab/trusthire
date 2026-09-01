import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Menu,
  X,
  ShieldCheck,
  Search,
  BriefcaseBusiness,
  LayoutDashboard,
  LogOut,
  UserRound,
  Building2,
  FileWarning,
  PlusCircle,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

const navLinkClass = ({ isActive }) =>
  `relative inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-emerald-500/10 text-emerald-300'
      : 'text-slate-400 hover:bg-white/5 hover:text-white'
  }`;

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuthStore();

  const dashboardPath = user?.role === 'employer' || user?.role === 'admin'
    ? '/employer/dashboard'
    : '/candidate/dashboard';

  const closeMenu = () => setOpen(false);

  const handleLogout = async () => {
    closeMenu();
    await logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-[#0B0F17]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" onClick={closeMenu} className="group flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-400/25 bg-emerald-400/10 text-emerald-300 shadow-[0_0_24px_rgba(16,185,129,0.08)] transition-transform group-hover:scale-105">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight text-white">Trust<span className="text-emerald-400">Hire</span></span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          <NavLink to="/jobs" className={navLinkClass}>
            <Search className="h-4 w-4" /> Jobs
          </NavLink>
          <NavLink to="/fraud-board" className={navLinkClass}>
            <FileWarning className="h-4 w-4" /> Fraud Board
          </NavLink>
          {isAuthenticated && user?.role === 'employer' && (
            <NavLink to="/employer/post-job" className={navLinkClass}>
              <PlusCircle className="h-4 w-4" /> Post Job
            </NavLink>
          )}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAuthenticated ? (
            <>
              <NavLink to={dashboardPath} className={navLinkClass}>
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </NavLink>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:bg-rose-500/10 hover:text-rose-300"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-300 transition hover:text-white">
                Sign in
              </Link>
              <Link to="/register" className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-4 py-2 text-sm font-bold text-slate-950 transition hover:bg-emerald-300 hover:shadow-[0_8px_30px_rgba(16,185,129,0.18)]">
                Get started <BriefcaseBusiness className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg p-2 text-slate-300 transition hover:bg-white/5 hover:text-white md:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-800/80 bg-[#0B0F17] px-4 py-4 md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1">
            <NavLink onClick={closeMenu} to="/jobs" className={navLinkClass}>
              <Search className="h-4 w-4" /> Jobs
            </NavLink>
            <NavLink onClick={closeMenu} to="/fraud-board" className={navLinkClass}>
              <FileWarning className="h-4 w-4" /> Fraud Board
            </NavLink>
            {isAuthenticated ? (
              <>
                <NavLink onClick={closeMenu} to={dashboardPath} className={navLinkClass}>
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </NavLink>
                {user?.role === 'employer' && (
                  <NavLink onClick={closeMenu} to="/employer/post-job" className={navLinkClass}>
                    <PlusCircle className="h-4 w-4" /> Post Job
                  </NavLink>
                )}
                <button type="button" onClick={handleLogout} className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium text-rose-300 hover:bg-rose-500/10">
                  <LogOut className="h-4 w-4" /> Sign out
                </button>
              </>
            ) : (
              <>
                <NavLink onClick={closeMenu} to="/login" className={navLinkClass}>
                  <UserRound className="h-4 w-4" /> Sign in
                </NavLink>
                <NavLink onClick={closeMenu} to="/register" className={navLinkClass}>
                  <Building2 className="h-4 w-4" /> Create account
                </NavLink>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
