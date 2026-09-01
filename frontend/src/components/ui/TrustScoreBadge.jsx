import React from 'react';
import { ShieldCheck, ShieldAlert, AlertCircle } from 'lucide-react';

export default function TrustScoreBadge({ score = 40, size = 'md', showLabel = true }) {
  const numericScore = Math.max(0, Math.min(100, Number(score) || 0));
  
  let colorClass = 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/60';
  let badgeLabel = 'High Risk';
  let Icon = AlertCircle;

  if (numericScore >= 80) {
    colorClass = 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60';
    badgeLabel = 'MCA Verified';
    Icon = ShieldCheck;
  } else if (numericScore >= 60) {
    colorClass = 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60';
    badgeLabel = 'Verified GST';
    Icon = ShieldCheck;
  } else if (numericScore >= 40) {
    colorClass = 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60';
    badgeLabel = 'Unverified';
    Icon = ShieldAlert;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-xs sm:text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border font-medium ${sizeClasses[size] || sizeClasses.md} ${colorClass}`}
      title={`Corporate Trust Score: ${numericScore}/100`}
    >
      <Icon className="h-3.5 w-3.5 flex-shrink-0" strokeWidth={1.75} />
      <span className="font-mono font-bold">{numericScore}</span>
      {showLabel && <span className="opacity-90 font-sans">• {badgeLabel}</span>}
    </span>
  );
}
