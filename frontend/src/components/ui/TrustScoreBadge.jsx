import React from 'react';
import { ShieldCheck, ShieldAlert, AlertCircle } from 'lucide-react';

export default function TrustScoreBadge({ score = 40, size = 'md' }) {
  const s = Math.max(0, Math.min(100, Number(score) || 0));
  let cls = 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900';
  let label = 'High Risk'; let Icon = AlertCircle;
  if (s >= 80) { cls = 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800'; label = 'Verified'; Icon = ShieldCheck; }
  else if (s >= 60) { cls = 'text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900'; label = 'Partial'; Icon = ShieldCheck; }
  else if (s >= 40) { cls = 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900'; label = 'Unverified'; Icon = ShieldAlert; }
  const sz = size === 'lg' ? 'px-3 py-1.5 text-xs' : size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-lg border font-semibold ${sz} ${cls}`} title={`Trust Score: ${s}/100`}>
      <Icon className="w-3.5 h-3.5 flex-shrink-0" strokeWidth={2} />
      <span className="font-mono font-bold">{s}</span>
      <span className="opacity-80">· {label}</span>
    </span>
  );
}
