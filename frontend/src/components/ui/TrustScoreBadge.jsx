import React from 'react';
import { ShieldCheck, ShieldAlert, AlertOctagon } from 'lucide-react';

export default function TrustScoreBadge({ score = 40, size = 'md', showLabel = true }) {
  const numericScore = Math.max(0, Math.min(100, Number(score) || 0));
  
  let colorClass = 'text-rose-700 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-300 dark:border-rose-500/30';
  let badgeLabel = 'High Risk';
  let Icon = AlertOctagon;

  if (numericScore >= 80) {
    colorClass = 'text-emerald-800 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 border-emerald-300 dark:border-emerald-500/30 shadow-sm';
    badgeLabel = 'Verified Trust';
    Icon = ShieldCheck;
  } else if (numericScore >= 60) {
    colorClass = 'text-blue-800 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/15 border-blue-300 dark:border-blue-500/30';
    badgeLabel = 'Moderate Trust';
    Icon = ShieldCheck;
  } else if (numericScore >= 40) {
    colorClass = 'text-amber-800 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500/30';
    badgeLabel = 'Unverified / New';
    Icon = ShieldAlert;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-xs',
    lg: 'px-3.5 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses[size] || sizeClasses.md} ${colorClass}`}
      title={`Trust Score: ${numericScore}/100`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="font-mono font-bold">{numericScore}</span>
      {showLabel && <span className="font-sans opacity-90 font-semibold">/100 • {badgeLabel}</span>}
    </span>
  );
}
