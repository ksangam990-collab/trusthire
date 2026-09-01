import React from 'react';

export function Skeleton({ className = '', ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-800/60 dark:bg-slate-800/60 ${className}`}
      {...props}
    />
  );
}

export function JobCardSkeleton() {
  return (
    <div className="rounded-xl border border-slate-800 bg-[#111827]/80 p-5 space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="w-11 h-11 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="w-28 h-3" />
            <Skeleton className="w-48 h-4" />
          </div>
        </div>
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="w-24 h-5 rounded" />
        <Skeleton className="w-32 h-5 rounded" />
        <Skeleton className="w-28 h-5 rounded" />
      </div>
      <div className="pt-3 border-t border-slate-800/80 flex justify-between">
        <Skeleton className="w-20 h-4" />
        <Skeleton className="w-28 h-4" />
      </div>
    </div>
  );
}

export function Spinner({ className = 'w-5 h-5', ...props }) {
  return (
    <svg
      className={`animate-spin text-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...props}
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
