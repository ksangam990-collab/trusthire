import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Briefcase, IndianRupee, CheckCircle2, Building2, Clock, ArrowRight } from 'lucide-react';
import TrustScoreBadge from '../ui/TrustScoreBadge';

export default function JobCard({ job }) {
  const { _id, title, employer, location, salary, jobType, workplaceType, experienceLevel, skills, isFromVerifiedEmployer, employerTrustScore, createdAt } = job || {};
  const score = employerTrustScore || employer?.trustScore || 40;

  const timeAgo = (d) => {
    if (!d) return 'Recently';
    const diff = Math.floor((Date.now() - new Date(d)) / 86400000);
    if (diff <= 0) return 'Today';
    if (diff === 1) return '1 day ago';
    if (diff < 30) return `${diff} days ago`;
    return new Date(d).toLocaleDateString('en-IN');
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-400 dark:hover:border-emerald-700 rounded-2xl p-5 flex flex-col gap-4 transition-all hover:shadow-lg hover:shadow-emerald-500/5 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center font-bold text-slate-600 dark:text-slate-300 text-base flex-shrink-0 overflow-hidden">
            {employer?.logo ? <img src={employer.logo} alt={employer.companyName} className="w-full h-full object-cover" /> : (employer?.companyName?.charAt(0)?.toUpperCase() || <Building2 className="w-5 h-5 text-slate-400" />)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">{employer?.companyName || 'Company'}</span>
              {isFromVerifiedEmployer && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800 flex-shrink-0">
                  <CheckCircle2 className="w-3 h-3" /> Verified
                </span>
              )}
            </div>
            <Link to={`/jobs/${_id}`}>
              <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition line-clamp-2">{title}</h3>
            </Link>
          </div>
        </div>
        <TrustScoreBadge score={score} size="sm" />
      </div>

      {/* Meta Chips */}
      <div className="flex flex-wrap gap-1.5 text-xs">
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
          <MapPin className="w-3.5 h-3.5 text-slate-400" /> {location?.city || 'India'} · {workplaceType || 'On-site'}
        </span>
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium">
          <Briefcase className="w-3.5 h-3.5 text-slate-400" /> {jobType || 'Full-time'} · {experienceLevel || 'Any'}
        </span>
        {(salary?.min > 0) && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold border border-emerald-200 dark:border-emerald-900">
            <IndianRupee className="w-3.5 h-3.5" /> {(salary.min / 100000).toFixed(1)}L – {((salary.max || salary.min) / 100000).toFixed(1)}L / yr
          </span>
        )}
      </div>

      {/* Skills */}
      {skills?.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {skills.slice(0, 5).map((sk, i) => (
            <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 font-medium">{sk}</span>
          ))}
          {skills.length > 5 && <span className="text-[11px] text-slate-400">+{skills.length - 5} more</span>}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800 mt-auto text-xs">
        <span className="flex items-center gap-1 text-slate-400">
          <Clock className="w-3.5 h-3.5" /> {timeAgo(createdAt)}
        </span>
        <Link to={`/jobs/${_id}`} className="flex items-center gap-1 font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition group">
          View Job <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
