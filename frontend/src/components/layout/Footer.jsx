import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-navy-600 rounded-lg flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-navy-600">TrustHire</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed">
              India's verified job board. Every employer verified against MCA &amp; GST records.
            </p>
          </div>

          {/* Job Seekers */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">For Job Seekers</p>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/jobs" className="hover:text-navy-600 transition-colors">Browse jobs</Link></li>
              <li><Link to="/jobs?verifiedOnly=true" className="hover:text-navy-600 transition-colors">Verified jobs only</Link></li>
              <li><Link to="/fraud-board" className="hover:text-navy-600 transition-colors">Fraud board</Link></li>
              <li><Link to="/register" className="hover:text-navy-600 transition-colors">Create account</Link></li>
            </ul>
          </div>

          {/* Employers */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">For Employers</p>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/register?role=employer" className="hover:text-navy-600 transition-colors">Post a job</Link></li>
              <li><Link to="/how-it-works" className="hover:text-navy-600 transition-colors">Get verified</Link></li>
              <li><Link to="/employer/dashboard" className="hover:text-navy-600 transition-colors">Employer dashboard</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Company</p>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-navy-600 transition-colors">About</Link></li>
              <li><Link to="/how-it-works" className="hover:text-navy-600 transition-colors">How it works</Link></li>
              <li><Link to="/contact" className="hover:text-navy-600 transition-colors">Contact</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} TrustHire. Built to protect job seekers.</p>
          <p>
            Employer verification via{' '}
            <a href="https://www.mca.gov.in" target="_blank" rel="noreferrer" className="underline hover:text-slate-600">
              MCA21
            </a>{' '}
            &amp;{' '}
            <a href="https://www.gst.gov.in" target="_blank" rel="noreferrer" className="underline hover:text-slate-600">
              GST Portal
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
