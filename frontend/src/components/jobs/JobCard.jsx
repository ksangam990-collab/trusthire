import { Link } from 'react-router-dom';
import {
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Clock,
  Briefcase,
  Users,
  AlertTriangle,
  BookmarkPlus,
  BookmarkCheck,
} from 'lucide-react';
import { useState } from 'react';
import { jobsAPI } from '../../api';
import useAuthStore from '../../store/authStore';
import toast from 'react-hot-toast';

const JOB_TYPE_LABELS = {
  fulltime: 'Full-time',
  parttime: 'Part-time',
  internship: 'Internship',
  contract: 'Contract',
  freelance: 'Freelance',
};

const EXP_LABELS = {
  fresher: 'Fresher',
  '1-2': '1–2 yrs',
  '2-5': '2–5 yrs',
  '5-10': '5–10 yrs',
  '10+': '10+ yrs',
};

function TrustBadge({ verificationStatus, trustScore, fraudReportCount }) {
  if (verificationStatus === 'verified') {
    return (
      <span className="badge-verified">
        <ShieldCheck className="w-3 h-3" />
        Verified · {trustScore}/100
      </span>
    );
  }
  if (fraudReportCount >= 3) {
    return (
      <span className="badge-warning">
        <AlertTriangle className="w-3 h-3" />
        {fraudReportCount} fraud reports
      </span>
    );
  }
  return (
    <span className="badge-unverified">
      <ShieldAlert className="w-3 h-3" />
      Unverified
    </span>
  );
}

export default function JobCard({ job, savedIds = [], onSaveToggle }) {
  const { user, isJobSeeker } = useAuthStore();
  const [saving, setSaving] = useState(false);
  const isSaved = savedIds.includes(job._id);

  const employer = job.employerId;
  const location = job.location?.isRemote
    ? 'Remote'
    : [job.location?.city, job.location?.state].filter(Boolean).join(', ') || 'Location not specified';

  const salary =
    job.salaryRange?.isDisclosed && job.salaryRange?.min
      ? job.salaryRange.max
        ? `₹${(job.salaryRange.min / 100000).toFixed(1)}–${(job.salaryRange.max / 100000).toFixed(1)} LPA`
        : `₹${(job.salaryRange.min / 100000).toFixed(1)} LPA`
      : 'Salary not disclosed';

  const postedDaysAgo = Math.floor(
    (Date.now() - new Date(job.createdAt)) / (1000 * 60 * 60 * 24)
  );
  const postedLabel =
    postedDaysAgo === 0
      ? 'Today'
      : postedDaysAgo === 1
      ? 'Yesterday'
      : `${postedDaysAgo} days ago`;

  const handleSave = async (e) => {
    e.preventDefault();
    if (!user || !isJobSeeker()) {
      toast.error('Log in as a job seeker to save jobs.');
      return;
    }
    setSaving(true);
    try {
      await jobsAPI.toggleSave(job._id);
      onSaveToggle?.(job._id, !isSaved);
      toast.success(isSaved ? 'Job removed from saved.' : 'Job saved!');
    } catch {
      toast.error('Could not save job. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Link
      to={`/jobs/${job._id}`}
      className={`card-hover block p-5 relative ${
        employer?.fraudReportCount >= 3 ? 'border-red-100' : ''
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {/* Employer name + trust */}
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="text-sm font-medium text-slate-500 truncate">
              {employer?.companyName || 'Unknown Company'}
            </span>
            {employer && (
              <TrustBadge
                verificationStatus={employer.verificationStatus}
                trustScore={employer.trustScore}
                fraudReportCount={employer.fraudReportCount}
              />
            )}
          </div>

          {/* Job title */}
          <h3 className="font-display font-semibold text-slate-900 text-base leading-snug mb-2 line-clamp-2">
            {job.title}
          </h3>

          {/* Meta row */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-slate-500">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              {location}
            </span>
            <span className="flex items-center gap-1">
              <Briefcase className="w-3.5 h-3.5 flex-shrink-0" />
              {JOB_TYPE_LABELS[job.jobType]}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5 flex-shrink-0" />
              {EXP_LABELS[job.experienceLevel]}
            </span>
          </div>
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex-shrink-0 p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-navy-600 transition-colors"
          title={isSaved ? 'Remove from saved' : 'Save job'}
        >
          {isSaved ? (
            <BookmarkCheck className="w-5 h-5 text-navy-600" />
          ) : (
            <BookmarkPlus className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Footer */}
      <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between flex-wrap gap-2">
        <span className="text-sm font-semibold text-navy-600">{salary}</span>
        <div className="flex items-center gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {postedLabel}
          </span>
          {job.applicationCount > 0 && (
            <span>{job.applicationCount} applied</span>
          )}
        </div>
      </div>

      {/* Fraud warning banner */}
      {employer?.fraudReportCount >= 3 && (
        <div className="mt-3 flex items-center gap-2 text-xs text-trust-red bg-red-50 rounded-lg px-3 py-2">
          <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
          <span>
            {employer.fraudReportCount} people have reported this employer. Proceed with caution.
          </span>
        </div>
      )}
    </Link>
  );
}
