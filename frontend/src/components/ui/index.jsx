import React from 'react';
import { ShieldCheck, ShieldAlert, AlertOctagon } from 'lucide-react';

export default function TrustScoreBadge({ score = 40, size = 'md', showLabel = true }) {
  let colorClass = 'text-rose-400 bg-rose-500/10 border-rose-500/30';
  let badgeLabel = 'High Risk';
  let Icon = AlertOctagon;

  if (score >= 80) {
    colorClass = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30';
    badgeLabel = 'Verified Trust';
    Icon = ShieldCheck;
  } else if (score >= 60) {
    colorClass = 'text-blue-400 bg-blue-500/10 border-blue-500/30';
    badgeLabel = 'Moderate Trust';
    Icon = ShieldCheck;
  } else if (score >= 40) {
    colorClass = 'text-amber-400 bg-amber-500/10 border-amber-500/30';
    badgeLabel = 'Unverified / New';
    Icon = ShieldAlert;
  }

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-sm font-semibold'
  };

  return (
    <div
      className={`inline-flex items-center space-x-1.5 rounded-full border font-medium ${sizeClasses[size]} ${colorClass}`}
      title={`Trust Score: ${score}/100`}
    >
      <Icon className="w-3.5 h-3.5" />
      <span className="font-mono font-bold">{score}</span>
      {showLabel && <span className="opacity-80 font-sans">/100 • {badgeLabel}</span>}
    </div>
  );
}