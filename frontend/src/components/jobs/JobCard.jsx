// frontend/src/components/jobs/JobCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  AlertTriangle,
  MapPin,
  Briefcase,
  DollarSign,
  Building,
} from "lucide-react";

export const JobCard = ({ job }) => {
  const isVerified = job?.employerId?.verifiedStatus === "Verified";
  const hasRisk = (job?.riskScore || 0) > 30;

  return (
    <div className="group relative bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-6 transition-all duration-300 hover:shadow-[0_0_30px_rgba(16,185,129,0.1)] backdrop-blur-xl flex flex-col justify-between">
      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
              {job?.employerId?.logo ? (
                <img
                  src={job.employerId.logo}
                  alt={job.employerId.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building className="w-6 h-6 text-slate-400" />
              )}
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-300">
                {job?.employerId?.companyName || "Verified Recruiter"}
              </h4>
              <p className="text-xs text-slate-500">
                {job?.createdAt
                  ? new Date(job.createdAt).toLocaleDateString()
                  : ""}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isVerified ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Employer
              </span>
            ) : hasRisk ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                <AlertTriangle className="w-3.5 h-3.5" />
                Under Audit
              </span>
            ) : null}
          </div>
        </div>

        {/* Title & Description */}
        <Link to={`/jobs/${job?._id}`}>
          <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
            {job?.title}
          </h3>
        </Link>
        <p className="text-sm text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {job?.description}
        </p>

        {/* Requirements Pills */}
        <div className="flex flex-wrap gap-2 mt-4">
          {job?.requirements?.slice(0, 3).map((req, i) => (
            <span
              key={i}
              className="text-xs font-medium bg-slate-800/80 text-slate-300 px-2.5 py-1 rounded-md border border-slate-700/50"
            >
              {req}
            </span>
          ))}
          {job?.requirements?.length > 3 && (
            <span className="text-xs text-slate-500 self-center">
              +{job.requirements.length - 3} more
            </span>
          )}
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            {job?.location || "Remote"}
          </span>
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-slate-500" />
            {job?.jobType || "Full-time"}
          </span>
        </div>

        <span className="font-semibold text-emerald-400 flex items-center gap-0.5 text-sm">
          <DollarSign className="w-4 h-4" />
          {job?.salary?.min?.toLocaleString()} -{" "}
          {job?.salary?.max?.toLocaleString()}/yr
        </span>
      </div>
    </div>
  );
};

// Default export to satisfy default imports across the app
export default JobCard;
