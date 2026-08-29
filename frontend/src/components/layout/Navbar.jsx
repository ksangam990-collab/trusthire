import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShieldCheck, Bell, LogOut, User, Briefcase, Menu, X } from 'lucide-react';
import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, isEmployer, isJobSeeker } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out.');
    navigate('/');
  };

  const navLinks = [
    { to: '/jobs', label: 'Browse Jobs' },
    { to: '/fraud-board', label: 'Fraud Reports' },
    { to: '/how-it-works', label: 'How It Works' },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-navy-600 rounded-lg flex items-center justify-center group-hover:bg-navy-700 transition-colors">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <span className="font-display font-bold text-navy-600 text-lg tracking-tight">
              TrustHire
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? 'bg-navy-50 text-navy-600'
                    : 'text-slate-600 hover:text-navy-600 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {isEmployer() && (
                  <Link to="/employer/dashboard" className="btn-secondary text-sm py-2">
                    <Briefcase className="w-4 h-4 inline mr-1.5" />
                    Dashboard
                  </Link>
                )}
                {isJobSeeker() && (
                  <Link to="/dashboard" className="btn-secondary text-sm py-2">
                    <User className="w-4 h-4 inline mr-1.5" />
                    Dashboard
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn-secondary text-sm py-2">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary text-sm py-2">
                  Get started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-slate-100"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-slate-100 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="block px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 flex flex-col gap-2">
              {user ? (
                <button onClick={handleLogout} className="btn-secondary text-sm">
                  Log out
                </button>
              ) : (
                <>
                  <Link to="/login" className="btn-secondary text-sm text-center">
                    Log in
                  </Link>
                  <Link to="/register" className="btn-primary text-sm text-center">
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
