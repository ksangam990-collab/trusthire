import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ShieldOff, DollarSign, Ghost, Mic, FileX, HelpCircle, Flag } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { fraudAPI } from '../../api';
import useAuthStore from '../../store/authStore';
import { PageSpinner } from '../../components/ui';

const REPORT_TYPE_META = {
  asked_for_money:      { label: 'Asked for money',        icon: DollarSign,  color: 'text-red-600 bg-red-50 border-red-200' },
  fake_company:         { label: 'Fake company',           icon: Ghost,        color: 'text-orange-600 bg-orange-50 border-orange-200' },
  identity_impersonation:{ label: 'Company impersonation', icon: ShieldOff,   color: 'text-purple-600 bg-purple-50 border-purple-200' },
  scam_interview:       { label: 'Scam interview',         icon: Mic,          color: 'text-amber-600 bg-amber-50 border-amber-200' },
  misleading_job:       { label: 'Misleading job',         icon: FileX,        color: 'text-blue-600 bg-blue-50 border-blue-200' },
  other:                { label: 'Other',                  icon: HelpCircle,   color: 'text-slate-600 bg-slate-50 border-slate-200' },
};

// Static curated examples — in a real deployment these come from the admin-verified reports API
const EXAMPLE_REPORTS = [
  { company: 'QuickHire Solutions', type: 'asked_for_money', count: 7, city: 'Delhi', lastReport: '2 days ago' },
  { company: 'TalentBridge India', type: 'fake_company', count: 5, city: 'Mumbai', lastReport: '4 days ago' },
  { company: 'Infosys Technologies Ltd', type: 'identity_impersonation', count: 4, city: 'Bengaluru', lastReport: '1 week ago' },
  { company: 'HR Connect Services', type: 'scam_interview', count: 3, city: 'Hyderabad', lastReport: '1 week ago' },
  { company: 'Global Placement Hub', type: 'asked_for_money', count: 6, city: 'Kolkata', lastReport: '3 days ago' },
  { company: 'ProTech Staffing', type: 'misleading_job', count: 4, city: 'Pune', lastReport: '5 days ago' },
];

function ReportRow({ company, type, count, city, lastReport }) {
  const meta = REPORT_TYPE_META[type] || REPORT_TYPE_META.other;
  const Icon = meta.icon;
  return (
    <div className="flex items-center gap-4 py-3 border-b border-slate-50 last:border-0">
      <div className={`p-2 rounded-lg border flex-shrink-0 ${meta.color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 truncate">{company}</p>
        <p className="text-xs text-slate-400">{meta.label} · {city} · {lastReport}</p>
      </div>
      <span className={`flex-shrink-0 text-xs font-bold px-2.5 py-1 rounded-full border ${meta.color}`}>
        {count} reports
      </span>
    </div>
  );
}

export default function FraudBoardPage() {
  const { user, isJobSeeker } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredReports = EXAMPLE_REPORTS.filter((r) =>
    r.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-trust-red" />
          </div>
          <span className="text-xs font-bold uppercase tracking-widest text-trust-red">
            Public Fraud Board
          </span>
        </div>
        <h1 className="font-display font-bold text-3xl text-slate-900 mb-3">
          Employer fraud reports
        </h1>
        <p className="text-slate-500 max-w-2xl">
          Every fraud report submitted on TrustHire is logged here publicly. When 3 or more people
          report the same employer for the same issue, the listing is suspended automatically.
          Reports are anonymized — your identity is never disclosed.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {Object.entries(REPORT_TYPE_META).slice(0, 4).map(([type, meta]) => {
          const Icon = meta.icon;
          const count = EXAMPLE_REPORTS.filter((r) => r.type === type).reduce((a, r) => a + r.count, 0);
          return (
            <div key={type} className={`rounded-xl border p-4 ${meta.color}`}>
              <Icon className="w-5 h-5 mb-2" />
              <p className="text-xl font-bold">{count}</p>
              <p className="text-xs font-medium mt-0.5">{meta.label}</p>
            </div>
          );
        })}
      </div>

      {/* Search + list */}
      <div className="card p-5">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="font-display font-semibold text-slate-800">
            Recent reports
          </h2>
          <input
            type="text"
            placeholder="Search by company name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input max-w-xs text-sm py-2"
          />
        </div>

        {filteredReports.length === 0 ? (
          <p className="text-center text-sm text-slate-400 py-8">No reports match your search.</p>
        ) : (
          filteredReports.map((r, i) => <ReportRow key={i} {...r} />)
        )}

        <p className="mt-4 text-xs text-slate-400 text-center">
          Showing curated recent reports. All reports are reviewed by TrustHire before being listed.
        </p>
      </div>

      {/* Important notice */}
      <div className="mt-6 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm font-semibold text-amber-800 mb-1">Important</p>
        <p className="text-sm text-amber-700">
          A report does not prove that an employer is fraudulent. Reports reflect user submissions.
          Employers can dispute reports. Always do your own research. Never pay any fee to apply for
          a job — legitimate employers do not charge candidates.
        </p>
      </div>

      {/* CTA */}
      {(!user || isJobSeeker()) && (
        <div className="mt-6 card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-800 flex items-center gap-2">
              <Flag className="w-4 h-4 text-trust-red" />
              Encountered a suspicious job?
            </p>
            <p className="text-sm text-slate-500 mt-0.5">
              Your report helps protect thousands of other job seekers.
            </p>
          </div>
          {user ? (
            <Link to="/report" className="btn-danger text-sm flex-shrink-0">
              Submit a report
            </Link>
          ) : (
            <Link to="/register" className="btn-primary text-sm flex-shrink-0">
              Create account to report
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
