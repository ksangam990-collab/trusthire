import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin, Briefcase, IndianRupee, CheckCircle2,
  Building2, Clock, ArrowRight, ShieldAlert, Wifi
} from 'lucide-react';
import TrustScoreBadge from '../ui/TrustScoreBadge';

const timeAgo = (d) => {
  if (!d) return 'Recently';
  const diff = Math.floor((Date.now() - new Date(d)) / 86400000);
  if (diff <= 0) return 'Today';
  if (diff === 1) return '1 day ago';
  if (diff < 30) return `${diff} days ago`;
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const fmtSalary = (min, max) => {
  const fmt = (n) => {
    if (n >= 100000) return `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L`;
    return `${(n / 1000).toFixed(0)}K`;
  };
  if (!min || min === 0) return null;
  if (!max || max === 0 || max === min) return `₹${fmt(min)} / yr`;
  return `₹${fmt(min)} – ${fmt(max)} / yr`;
};

export default function JobCard({ job }) {
  const {
    _id, title, employer, location, salary, jobType,
    workplaceType, experienceLevel, skills,
    isFromVerifiedEmployer, employerTrustScore, createdAt,
    applicationCount
  } = job || {};

  const score        = employerTrustScore ?? employer?.trustScore ?? 40;
  const companyName  = employer?.companyName || 'Company';
  const companyLetter = companyName.charAt(0).toUpperCase();
  const salaryText   = fmtSalary(salary?.min, salary?.max);
  const isVerified   = isFromVerifiedEmployer || employer?.verificationStatus === 'verified';
  const isRemote     = workplaceType === 'Remote';

  return (
    <article className="relative bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400/70 dark:hover:border-emerald-700/70 rounded-2xl overflow-hidden flex flex-col transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/[0.06] group">

      {/* Verified accent line */}
      {isVerified && (
        <div className="h-0.5 w-full bg-gradient-to-r from-emerald-500/0 via-emerald-500 to-emerald-500/0" />
      )}

      <div className="p-5 flex flex-col gap-3.5 flex-1">

        {/* ── Header row ── */}
        <div className="flex items-start justify-between gap-3">
          {/* Logo + company + title */}
          <div className="flex items-start gap-3 min-w-0">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-black text-slate-600 dark:text-slate-300 text-sm flex-shrink-0 overflow-hidden shadow-xs">
              {employer?.logo
                ? <img src={employer.logo} alt={companyName} className="w-full h-full object-cover" />
                : companyLetter}
            </div>

            <div className="min-w-0">
              {/* Company name + verified badge */}
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 truncate max-w-[140px]">
                  {companyName}
                </span>
                {isVerified ? (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-1.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 flex-shrink-0">
                    <CheckCircle2 className="w-2.5 h-2.5" /> Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded-md border border-amber-200 dark:border-amber-800 flex-shrink-0">
                    <ShieldAlert className="w-2.5 h-2.5" /> Unverified
                  </span>
                )}
              </div>

              {/* Job title */}
              <Link to={`/jobs/${_id}`}>
                <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition line-clamp-2">
                  {title || 'Job Title'}
                </h3>
              </Link>
            </div>
          </div>

          {/* Trust badge — right-aligned, never overlaps */}
          <div className="flex-shrink-0">
            <TrustScoreBadge score={score} size="sm" />
          </div>
        </div>

        {/* ── Meta chips ── */}
        <div className="flex flex-wrap gap-1.5">
          {/* Location + workplace */}
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
            {isRemote
              ? <Wifi className="w-3 h-3 text-emerald-500" />
              : <MapPin className="w-3 h-3 text-slate-400" />}
            {isRemote ? 'Remote' : (location?.city || 'India')}
            {!isRemote && workplaceType && workplaceType !== 'On-site' && (
              <span className="text-slate-400"> · {workplaceType}</span>
            )}
          </span>

          {/* Job type + level */}
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[11px] font-medium">
            <Briefcase className="w-3 h-3 text-slate-400" />
            {jobType || 'Full-time'}
            {experienceLevel && (
              <span className="text-slate-400"> · {
                experienceLevel === 'Entry Level' ? 'Fresher' :
                experienceLevel === 'Mid Level'   ? 'Mid'     :
                experienceLevel === 'Senior Level' ? 'Senior'  :
                experienceLevel
              }</span>
            )}
          </span>

          {/* Salary — shown prominently when available */}
          {salaryText && (
            <span className="inline-flex items-center gap-0.5 px-2 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-bold border border-emerald-200/70 dark:border-emerald-900">
              <IndianRupee className="w-3 h-3" />
              {salaryText}
            </span>
          )}

          {!salaryText && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-400 text-[11px] font-medium">
              Salary negotiable
            </span>
          )}
        </div>

        {/* ── Skills ── */}
        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {skills.slice(0, 5).map((sk) => (
              <span
                key={sk}
                className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium capitalize"
              >
                {sk}
              </span>
            ))}
            {skills.length > 5 && (
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-400 font-medium">
                +{skills.length - 5}
              </span>
            )}
          </div>
        )}

        {/* ── Footer row ── */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px]">
          <div className="flex items-center gap-3 text-slate-400">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo(createdAt)}
            </span>
            {applicationCount > 0 && (
              <span className="text-slate-300 dark:text-slate-600">·</span>
            )}
            {applicationCount > 0 && (
              <span>{applicationCount} applied</span>
            )}
          </div>
          <Link
            to={`/jobs/${_id}`}
            className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition group/link"
          >
            View Job
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>

      </div>
    </article>
  );
}
