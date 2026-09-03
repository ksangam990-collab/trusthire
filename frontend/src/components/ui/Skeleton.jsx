import React from 'react';

export function Skeleton({ className = '', ...props }) {
  return <div className={`animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800 ${className}`} {...props} />;
}

export function JobCardSkeleton() {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <Skeleton className="w-12 h-12 rounded-xl flex-shrink-0" />
          <div className="space-y-2">
            <Skeleton className="w-28 h-3 rounded" />
            <Skeleton className="w-44 h-4 rounded" />
          </div>
        </div>
        <Skeleton className="w-20 h-6 rounded-full flex-shrink-0" />
      </div>
      <div className="flex flex-wrap gap-2">
        <Skeleton className="w-24 h-5 rounded-full" />
        <Skeleton className="w-28 h-5 rounded-full" />
        <Skeleton className="w-20 h-5 rounded-full" />
      </div>
      <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between">
        <Skeleton className="w-20 h-3 rounded" />
        <Skeleton className="w-24 h-3 rounded" />
      </div>
    </div>
  );
}

export function Spinner({ className = 'w-5 h-5', ...props }) {
  return (
    <svg className={`animate-spin text-current ${className}`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" {...props}>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
    </svg>
  );
}
