import React from 'react';
import { ShieldCheck, ShieldAlert, AlertOctagon } from 'lucide-react';

export default function TrustScoreBadge({ score = 40, size = 'md', showLabel = true }) {
  const numericScore = Math.max(0, Math.min(100, Number(score) || 0));
  let colorClass = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  let badgeLabel = 'High Risk';
  let Icon = AlertOctagon;

  if (numericScore >= 80) {
    colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    badgeLabel = 'Verified Trust';
    Icon = ShieldCheck;
  } else if (numericScore >= 60) {
    colorClass = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    badgeLabel = 'Moderate Trust';
    Icon = ShieldCheck;
  } else if (numericScore >= 40) {
    colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    badgeLabel = 'Unverified / New';
    Icon = ShieldAlert;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm font-semibold',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${sizeClasses[size] || sizeClasses.md} ${colorClass}`}
      title={`Trust Score: ${numericScore}/100`}
    >
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      <span className="font-mono font-bold">{numericScore}</span>
      {showLabel && <span className="font-sans opacity-80">/100 • {badgeLabel}</span>}
    </span>
  );
}
