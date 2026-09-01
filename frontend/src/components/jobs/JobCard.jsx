import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Briefcase, IndianRupee, CheckCircle2, Clock, Building2, ArrowUpRight } from 'lucide-react';
import TrustScoreBadge from '../ui/TrustScoreBadge';

export default function JobCard({ job }) {
  const {
    _id,
    title,
    employer,
    location,
    salary,
    jobType,
    workplaceType,
    experienceLevel,
    skills,
    isFromVerifiedEmployer,
    employerTrustScore,
    createdAt
  } = job;

  const score = employerTrustScore || employer?.trustScore || 40;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3, transition: { duration: 0.2 } }}
      className="rounded-2xl p-5 sm:p-6 border border-slate-200/90 dark:border-slate-800 bg-white/90 dark:bg-[#0f172a]/75 backdrop-blur-md hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-200 shadow-sm hover:shadow-lg dark:hover:shadow-[0_4px_25px_rgba(16,185,129,0.1)] flex flex-col justify-between space-y-4 group"
    >
      <div className="space-y-3.5">
        {/* Top Header: Logo + Title + Trust Badge */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start space-x-3.5">
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-800 dark:text-slate-200 font-bold text-base flex-shrink-0 group-hover:scale-105 transition-transform">
              {employer?.logo ? (
                <img src={employer.logo} alt={employer.companyName} className="w-full h-full object-cover rounded-xl" />
              ) : (
                employer?.companyName?.charAt(0) || <Building2 className="w-6 h-6 text-slate-400" />
              )}
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center space-x-1.5 flex-wrap">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  {employer?.companyName || 'Verified Corporate'}
                </span>
                {isFromVerifiedEmployer && (
                  <span className="inline-flex items-center space-x-0.5 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-1.5 py-0.2 rounded-md border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>MCA Verified</span>
                  </span>
                )}
              </div>

              <Link to={`/jobs/${_id}`}>
                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <span>{title}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
              </Link>
            </div>
          </div>

          <TrustScoreBadge score={score} size="sm" />
        </div>

        {/* Tags Row */}
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium">
            <MapPin className="w-3 h-3 text-slate-400" />
            <span>{location?.city || 'India'} ({workplaceType})</span>
          </span>

          <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 font-medium">
            <Briefcase className="w-3 h-3 text-slate-400" />
            <span>{jobType}</span>
          </span>

          {salary?.min > 0 && (
            <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-500/20">
              <IndianRupee className="w-3 h-3 text-emerald-500" />
              <span>₹{(salary.min / 100000).toFixed(1)}L - ₹{(salary.max / 100000).toFixed(1)}L</span>
            </span>
          )}
        </div>

        {/* Skills preview */}
        {skills?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400"
              >
                {skill}
              </span>
            ))}
            {skills.length > 4 && (
              <span className="text-[11px] font-mono text-slate-400 px-1 py-0.5">
                +{skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Strip */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <span className="inline-flex items-center space-x-1 font-mono text-[11px]">
          <Clock className="w-3 h-3" />
          <span>{createdAt ? new Date(createdAt).toLocaleDateString() : 'Active'}</span>
        </span>

        <Link
          to={`/jobs/${_id}`}
          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 transition"
        >
          View & Apply →
        </Link>
      </div>
    </motion.div>
  );
}
