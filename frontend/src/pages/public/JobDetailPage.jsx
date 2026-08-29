import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import {
  ShieldCheck, ShieldAlert, AlertTriangle, MapPin, Briefcase, Users,
  Calendar, ExternalLink, Flag, BookmarkPlus, ArrowLeft, CheckCircle2,
} from 'lucide-react';
import { jobsAPI, applicationsAPI } from '../../api';
import useAuthStore from '../../store/authStore';
import { TrustScoreRing, Spinner, ErrorMessage, PageSpinner } from '../../components/ui';
import toast from 'react-hot-toast';

const JOB_TYPE_LABELS = {
  fulltime: 'Full-time', parttime: 'Part-time', internship: 'Internship',
  contract: 'Contract', freelance: 'Freelance',
};

function VerificationBanner({ employer }) {
  if (employer.verificationStatus === 'verified') {
    return (
      <div className="flex items-start gap-3 bg-green-50 border border-green-200 rounded-xl px-4 py-3">
        <ShieldCheck className="w-5 h-5 text-trust-green flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-trust-green">Verified employer</p>
          <p className="text-xs text-green-700 mt-0.5">
            Registered as{' '}
            <strong>{employer.verificationData?.registeredName}</strong> •{' '}
            {employer.verificationData?.companyType} •{' '}
            {employer.verificationData?.registeredState}
          </p>
          {employer.verificationData?.incorporationDate && (
            <p className="text-xs text-green-600 mt-0.5">
              Incorporated:{' '}
              {new Date(employer.verificationData.incorporationDate).toLocaleDateString('en-IN', {
                month: 'long', year: 'numeric',
              })}
            </p>
          )}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
      <ShieldAlert className="w-5 h-5 text-trust-amber flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-semibold text-trust-amber">Unverified employer</p>
        <p className="text-xs text-amber-700 mt-0.5">
          This company has not been verified against MCA or GST records. Proceed carefully —
          never pay any fee to apply for a job.
        </p>
      </div>
    </div>
  );
}

export default function JobDetailPage() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const { user, isJobSeeker } = useAuthStore();
  const [applied, setApplied] = useState(false);
  const [coverNote, setCoverNote] = useState('');
  const [showApplyForm, setShowApplyForm] = useState(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsAPI.getJob(jobId).then((r) => r.data.job),
  });

  const applyMutation = useMutation({
    mutationFn: () => applicationsAPI.applyToJob ? null : jobsAPI.applyToJob(jobId, { coverNote }),
    mutationFn: () => fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/jobs/${jobId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({ coverNote }),
    }).then(async (r) => {
      const json = await r.json();
      if (!r.ok) throw new Error(json.message);
      return json;
    }),
    onSuccess: () => {
      setApplied(true);
      setShowApplyForm(false);
      toast.success('Application submitted!');
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to apply. Try again.');
    },
  });

  if (isLoading) return <PageSpinner />;
  if (isError || !data) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-500">Job not found or no longer active.</p>
        <Link to="/jobs" className="btn-primary mt-4 inline-block">Browse jobs</Link>
      </div>
    );
  }

  const job = data;
  const employer = job.employerId;
  const location = job.location?.isRemote
    ? 'Remote'
    : [job.location?.city, job.location?.state].filter(Boolean).join(', ');
  const salary =
    job.salaryRange?.isDisclosed && job.salaryRange?.min
      ? job.salaryRange.max
        ? `₹${(job.salaryRange.min / 100000).toFixed(1)}–${(job.salaryRange.max / 100000).toFixed(1)} LPA`
        : `₹${(job.salaryRange.min / 100000).toFixed(1)} LPA`
      : null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to jobs
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Main ──────────────────────────────────────────────────────── */}
        <div className="lg:col-span-2 space-y-5">
          {/* Job header */}
          <div className="card p-6">
            <div className="flex items-start justify-between gap-4 mb-4">
              <div>
                <p className="text-sm font-medium text-navy-600 mb-1">
                  {employer?.companyName}
                </p>
                <h1 className="font-display font-bold text-2xl text-slate-900 mb-3">
                  {job.title}
                </h1>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
                  {location && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> {location}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5" /> {JOB_TYPE_LABELS[job.jobType]}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5" /> {job.openings} opening{job.openings > 1 ? 's' : ''}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    Posted {new Date(job.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>
              {salary && (
                <div className="text-right flex-shrink-0">
                  <p className="text-sm text-slate-400">Salary</p>
                  <p className="font-display font-bold text-navy-600 text-lg">{salary}</p>
                </div>
              )}
            </div>

            {/* Skills */}
            {job.skills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="text-xs font-medium bg-navy-50 text-navy-600 border border-navy-100 px-2.5 py-1 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Apply / Applied */}
            <div className="mt-5 pt-5 border-t border-slate-100">
              {applied ? (
                <div className="flex items-center gap-2 text-trust-green font-semibold">
                  <CheckCircle2 className="w-5 h-5" />
                  Application submitted!
                </div>
              ) : !user ? (
                <div className="flex items-center gap-3">
                  <Link to="/login" className="btn-primary">Log in to apply</Link>
                  <Link to="/register" className="btn-secondary">Create account</Link>
                </div>
              ) : isJobSeeker() ? (
                showApplyForm ? (
                  <div className="space-y-3">
                    <div>
                      <label className="label">Cover note (optional)</label>
                      <textarea
                        value={coverNote}
                        onChange={(e) => setCoverNote(e.target.value)}
                        rows={3}
                        maxLength={1000}
                        className="input resize-none"
                        placeholder="Tell the employer why you're a good fit…"
                      />
                      <p className="text-xs text-slate-400 text-right mt-1">
                        {coverNote.length}/1000
                      </p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => applyMutation.mutate()}
                        disabled={applyMutation.isLoading}
                        className="btn-primary flex items-center gap-2"
                      >
                        {applyMutation.isLoading && <Spinner className="w-4 h-4" />}
                        Submit application
                      </button>
                      <button
                        onClick={() => setShowApplyForm(false)}
                        className="btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowApplyForm(true)}
                    className="btn-primary"
                  >
                    Apply now
                  </button>
                )
              ) : null}

              {/* Fraud warning */}
              {employer?.fraudReportCount >= 3 && (
                <div className="mt-3 flex items-start gap-2 text-xs text-trust-red bg-red-50 rounded-lg px-3 py-2">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>
                    {employer.fraudReportCount} people have reported this employer. Never pay any
                    fee to apply.{' '}
                    <Link to={`/report?employerId=${employer._id}&jobId=${job._id}`} className="underline font-medium">
                      Report this job
                    </Link>
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="card p-6">
            <h2 className="font-display font-semibold text-slate-800 mb-4">About this role</h2>
            <div className="prose prose-sm prose-slate max-w-none">
              <p className="text-slate-600 leading-relaxed whitespace-pre-line">{job.description}</p>
            </div>
            {job.responsibilities && (
              <>
                <h3 className="font-display font-semibold text-slate-800 mt-5 mb-2">
                  Responsibilities
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {job.responsibilities}
                </p>
              </>
            )}
            {job.requirements && (
              <>
                <h3 className="font-display font-semibold text-slate-800 mt-5 mb-2">
                  Requirements
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {job.requirements}
                </p>
              </>
            )}
          </div>
        </div>

        {/* ── Sidebar ───────────────────────────────────────────────────── */}
        <div className="space-y-4">
          {/* Trust profile card */}
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1">
                <p className="font-display font-semibold text-slate-800 text-sm">
                  {employer?.companyName}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {employer?.totalListings} job{employer?.totalListings !== 1 ? 's' : ''} posted
                </p>
              </div>
              {employer && <TrustScoreRing score={employer.trustScore ?? 50} size={52} />}
            </div>

            {employer && <VerificationBanner employer={employer} />}

            {employer?.fraudReportCount > 0 && (
              <div className="mt-3 flex items-center gap-2 text-xs text-trust-amber">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{employer.fraudReportCount} fraud report{employer.fraudReportCount !== 1 ? 's' : ''} on this employer</span>
              </div>
            )}

            {employer?.website && (
              <a
                href={employer.website}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex items-center gap-1.5 text-xs text-navy-600 hover:underline"
              >
                <ExternalLink className="w-3 h-3" />
                Visit website
              </a>
            )}

            <Link
              to={`/employers/${employer?._id}`}
              className="mt-3 text-xs text-navy-600 hover:underline block"
            >
              View full employer profile →
            </Link>
          </div>

          {/* Report card */}
          {user && isJobSeeker() && (
            <div className="card p-4">
              <p className="text-xs font-semibold text-slate-600 mb-2 flex items-center gap-1.5">
                <Flag className="w-3.5 h-3.5 text-slate-400" />
                Something look wrong?
              </p>
              <p className="text-xs text-slate-500 mb-3">
                Never pay to apply for a job. If this listing asked for money or seems fake, report it.
              </p>
              <Link
                to={`/report?employerId=${employer?._id}&jobId=${job._id}`}
                className="text-xs font-medium text-trust-red hover:underline"
              >
                Report this listing →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
