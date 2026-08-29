import { AlertTriangle, SearchX, FileX, Inbox } from 'lucide-react';

// ── Spinner ───────────────────────────────────────────────────────────────────
export function Spinner({ className = 'w-6 h-6' }) {
  return (
    <div
      className={`${className} border-4 border-navy-100 border-t-navy-600 rounded-full animate-spin`}
    />
  );
}

export function PageSpinner() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <Spinner className="w-8 h-8" />
    </div>
  );
}

// ── Empty State ───────────────────────────────────────────────────────────────
const emptyIcons = {
  search: SearchX,
  jobs: Inbox,
  docs: FileX,
  default: Inbox,
};

export function EmptyState({ icon = 'default', title, description, action }) {
  const Icon = emptyIcons[icon] || emptyIcons.default;
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-slate-400" />
      </div>
      <h3 className="font-display font-semibold text-slate-800 mb-1">{title}</h3>
      {description && <p className="text-sm text-slate-500 max-w-xs">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// ── Error Message ─────────────────────────────────────────────────────────────
export function ErrorMessage({ message }) {
  return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-100 rounded-lg px-4 py-3">
      <AlertTriangle className="w-4 h-4 text-trust-red flex-shrink-0 mt-0.5" />
      <p className="text-sm text-red-700">{message}</p>
    </div>
  );
}

// ── Skeleton Card ─────────────────────────────────────────────────────────────
export function SkeletonJobCard() {
  return (
    <div className="card p-5 animate-pulse">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex-1">
          <div className="h-3 bg-slate-200 rounded w-1/3 mb-2" />
          <div className="h-5 bg-slate-200 rounded w-3/4 mb-3" />
          <div className="flex gap-4">
            <div className="h-3 bg-slate-100 rounded w-24" />
            <div className="h-3 bg-slate-100 rounded w-20" />
          </div>
        </div>
        <div className="w-6 h-6 bg-slate-100 rounded" />
      </div>
      <div className="border-t border-slate-50 pt-3 flex justify-between">
        <div className="h-4 bg-slate-200 rounded w-20" />
        <div className="h-3 bg-slate-100 rounded w-16" />
      </div>
    </div>
  );
}

// ── Trust Score Ring ──────────────────────────────────────────────────────────
export function TrustScoreRing({ score, size = 64 }) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 70 ? '#16a34a' : score >= 40 ? '#d97706' : '#dc2626';

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={size} height={size} viewBox="0 0 48 48">
        <circle cx="24" cy="24" r={radius} fill="none" stroke="#f1f5f9" strokeWidth="5" />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 24 24)"
        />
        <text x="24" y="28" textAnchor="middle" fontSize="10" fontWeight="700" fill={color}>
          {score}
        </text>
      </svg>
      <span className="text-xs text-slate-500 font-medium">Trust</span>
    </div>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
export function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 py-6">
      <button
        onClick={() => onPage(page - 1)}
        disabled={page <= 1}
        className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Previous
      </button>
      {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
        const p = i + 1;
        return (
          <button
            key={p}
            onClick={() => onPage(p)}
            className={`w-8 h-8 text-sm rounded-lg font-medium transition-colors ${
              p === page
                ? 'bg-navy-600 text-white'
                : 'hover:bg-slate-100 text-slate-600'
            }`}
          >
            {p}
          </button>
        );
      })}
      <button
        onClick={() => onPage(page + 1)}
        disabled={page >= pages}
        className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
}
