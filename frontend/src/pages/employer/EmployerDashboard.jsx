import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShieldCheck, ShieldAlert, Plus, Briefcase, Users, AlertTriangle, TrendingUp } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { employersAPI, jobsAPI } from '../../api';
import { TrustScoreRing, PageSpinner } from '../../components/ui';

const STATUS_COLORS = {
  active:    'bg-green-50 text-trust-green border-green-200',
  closed:    'bg-slate-50 text-slate-500 border-slate-200',
  suspended: 'bg-red-50 text-trust-red border-red-200',
  draft:     'bg-amber-50 text-trust-amber border-amber-200',
};

export default function EmployerDashboard() {
  const { user } = useAuthStore();

  const { data: employerData, isLoading: empLoading } = useQuery({
    queryKey: ['employer-profile'],
    queryFn: () => employersAPI.getMyProfile().then((r) => r.data.employer),
  });

  const { data: listingsData, isLoading: listLoading } = useQuery({
    queryKey: ['my-listings'],
    queryFn: () => jobsAPI.getMyListings({ limit: 5, status: 'all' }).then((r) => r.data),
    enabled: !!employerData,
  });

  if (empLoading) return <PageSpinner />;

  const employer = employerData;
  const listings = listingsData?.jobs || [];
  const isVerified = employer?.verificationStatus === 'verified';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">
            {employer?.companyName}
          </h1>
          <p className="text-sm text-slate-500 mt-1">Employer dashboard</p>
        </div>
        <Link to="/employer/post-job" className="btn-primary flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Post a job
        </Link>
      </div>

      {/* Verification banner */}
      {!isVerified && (
        <div className="mb-6 flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-5 py-4">
          <ShieldAlert className="w-5 h-5 text-trust-amber flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-amber-800">
              Your company is not verified
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Verified employers get 3× more applications. Verification is free and takes under 2 minutes.
            </p>
          </div>
          <Link to="/employer/verify" className="btn-primary text-sm flex-shrink-0">
            Get verified
          </Link>
        </div>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <div className="card p-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-slate-400">Trust score</span>
            <TrustScoreRing score={employer?.trustScore ?? 50} size={44} />
          </div>
        </div>
        <div className="card p-4">
          <p className="font-display font-bold text-2xl text-slate-900">{employer?.totalListings ?? 0}</p>
          <p className="text-xs text-slate-500 mt-1">Jobs posted</p>
        </div>
        <div className="card p-4">
          <p className="font-display font-bold text-2xl text-trust-green">{employer?.activeListings ?? 0}</p>
          <p className="text-xs text-slate-500 mt-1">Active listings</p>
        </div>
        <div className="card p-4">
          <p className={`font-display font-bold text-2xl ${employer?.fraudReportCount > 0 ? 'text-trust-red' : 'text-slate-900'}`}>
            {employer?.fraudReportCount ?? 0}
          </p>
          <p className="text-xs text-slate-500 mt-1">Fraud reports</p>
        </div>
      </div>

      {/* Verification status card */}
      <div className={`card p-5 mb-6 flex items-start gap-4 ${isVerified ? 'border-green-200 bg-green-50' : ''}`}>
        {isVerified ? (
          <>
            <ShieldCheck className="w-6 h-6 text-trust-green flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-trust-green">Company verified</p>
              <p className="text-sm text-green-700 mt-0.5">
                Registered as <strong>{employer?.verificationData?.registeredName}</strong> ·{' '}
                {employer?.verificationData?.companyType} ·{' '}
                {employer?.verificationData?.registeredState}
              </p>
              <p className="text-xs text-green-600 mt-1">
                Verified via {employer?.verificationData?.verifiedVia?.toUpperCase()} on{' '}
                {new Date(employer?.verificationData?.verifiedAt).toLocaleDateString('en-IN')}
              </p>
            </div>
          </>
        ) : (
          <>
            <ShieldAlert className="w-6 h-6 text-trust-amber flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-trust-amber">Not yet verified</p>
              <p className="text-sm text-amber-700 mt-0.5">
                Submit your CIN or GSTIN to get the verified badge on all your listings.
              </p>
            </div>
          </>
        )}
      </div>

      {/* Recent listings */}
      <div className="card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display font-semibold text-slate-800">Your job listings</h2>
          <Link to="/employer/listings" className="text-sm text-navy-600 hover:underline">
            Manage all
          </Link>
        </div>

        {listLoading ? (
          <div className="space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-14 bg-slate-50 animate-pulse rounded-lg" />)}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-500 text-sm mb-4">You haven't posted any jobs yet.</p>
            <Link to="/employer/post-job" className="btn-primary text-sm">
              Post your first job
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {listings.map((job) => (
              <div key={job._id} className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
                <div className="flex-1 min-w-0">
                  <Link to={`/employer/listings/${job._id}`} className="text-sm font-semibold text-slate-800 hover:text-navy-600 truncate block">
                    {job.title}
                  </Link>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {job.applicationCount} applicants · Posted {new Date(job.createdAt).toLocaleDateString('en-IN')}
                  </p>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize flex-shrink-0 ${STATUS_COLORS[job.status]}`}>
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
        <Link to="/employer/verify" className="card p-4 hover:shadow-card-hover transition-shadow flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-trust-green" />
          <span className="text-sm font-medium text-slate-700">{isVerified ? 'View verification' : 'Verify company'}</span>
        </Link>
        <Link to="/employer/post-job" className="card p-4 hover:shadow-card-hover transition-shadow flex items-center gap-3">
          <Plus className="w-5 h-5 text-navy-600" />
          <span className="text-sm font-medium text-slate-700">Post a new job</span>
        </Link>
        <Link to="/employer/profile" className="card p-4 hover:shadow-card-hover transition-shadow flex items-center gap-3">
          <Briefcase className="w-5 h-5 text-slate-500" />
          <span className="text-sm font-medium text-slate-700">Edit company profile</span>
        </Link>
      </div>
    </div>
  );
}
