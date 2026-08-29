import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, Bookmark, FileText, Bell, ShieldCheck, AlertCircle } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { applicationsAPI } from '../../api';
import { PageSpinner } from '../../components/ui';

const STATUS_STYLES = {
  applied:     'bg-blue-50 text-blue-700 border-blue-200',
  viewed:      'bg-slate-50 text-slate-600 border-slate-200',
  shortlisted: 'bg-green-50 text-trust-green border-green-200',
  rejected:    'bg-red-50 text-trust-red border-red-200',
  hired:       'bg-purple-50 text-purple-700 border-purple-200',
};

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data: appsData, isLoading } = useQuery({
    queryKey: ['my-applications'],
    queryFn: () => applicationsAPI.getMyApplications({ limit: 5 }).then((r) => r.data),
  });

  const applications = appsData?.applications || [];

  const stats = {
    total: applications.length,
    shortlisted: applications.filter((a) => a.status === 'shortlisted').length,
    viewed: applications.filter((a) => a.status === 'viewed').length,
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Greeting */}
      <div className="mb-8">
        <h1 className="font-display font-bold text-2xl text-slate-900">
          Good to see you, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-slate-500 text-sm mt-1">Here's what's happening with your job search.</p>
      </div>

      {/* Email verification banner */}
      {!user?.isEmailVerified && (
        <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
          <AlertCircle className="w-5 h-5 text-trust-amber flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-amber-800">Verify your email</p>
            <p className="text-xs text-amber-700 mt-0.5">
              Check your inbox and click the verification link to unlock all features.
            </p>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { icon: Search, label: 'Find jobs', to: '/jobs', color: 'bg-navy-50 text-navy-600' },
          { icon: Bookmark, label: 'Saved jobs', to: '/dashboard/saved', color: 'bg-blue-50 text-blue-600' },
          { icon: FileText, label: 'My applications', to: '/dashboard/applications', color: 'bg-green-50 text-trust-green' },
          { icon: Bell, label: 'Job alerts', to: '/dashboard/alerts', color: 'bg-purple-50 text-purple-600' },
        ].map(({ icon: Icon, label, to, color }) => (
          <Link key={to} to={to} className="card-hover p-4 flex flex-col items-center gap-2 text-center">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-xs font-medium text-slate-600">{label}</span>
          </Link>
        ))}
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="card p-4 text-center">
          <p className="font-display font-bold text-2xl text-slate-900">{stats.total}</p>
          <p className="text-xs text-slate-500 mt-1">Applications</p>
        </div>
        <div className="card p-4 text-center">
          <p className="font-display font-bold text-2xl text-trust-green">{stats.shortlisted}</p>
          <p className="text-xs text-slate-500 mt-1">Shortlisted</p>
        </div>
        <div className="card p-4 text-center">
          <p className="font-display font-bold text-2xl text-blue-600">{stats.viewed}</p>
          <p className="text-xs text-slate-500 mt-1">Viewed</p>
        </div>
      </div>

      {/* Recent applications */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-slate-800">Recent applications</h2>
          <Link to="/dashboard/applications" className="text-sm text-navy-600 hover:underline">
            View all
          </Link>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => (
              <div key={i} className="h-14 bg-slate-50 animate-pulse rounded-lg" />
            ))}
          </div>
        ) : applications.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm mb-4">You haven't applied to any jobs yet.</p>
            <Link to="/jobs?verifiedOnly=true" className="btn-primary text-sm">
              Browse verified jobs
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {applications.map((app) => {
              const job = app.jobId;
              const employer = job?.employerId;
              return (
                <div key={app._id} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                  <div className="flex-1 min-w-0">
                    <Link to={`/jobs/${job?._id}`} className="text-sm font-semibold text-slate-800 hover:text-navy-600 truncate block">
                      {job?.title}
                    </Link>
                    <p className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                      {employer?.verificationStatus === 'verified' && (
                        <ShieldCheck className="w-3 h-3 text-trust-green" />
                      )}
                      {employer?.companyName} · Applied {new Date(app.appliedAt).toLocaleDateString('en-IN')}
                    </p>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize flex-shrink-0 ${STATUS_STYLES[app.status]}`}>
                    {app.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
