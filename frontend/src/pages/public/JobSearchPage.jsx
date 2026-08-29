import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, X, ShieldCheck } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { jobsAPI } from '../../api';
import JobCard from '../../components/jobs/JobCard';
import { SkeletonJobCard, EmptyState, Pagination } from '../../components/ui';

const JOB_TYPES = ['fulltime', 'parttime', 'internship', 'contract', 'freelance'];
const EXP_LEVELS = ['fresher', '1-2', '2-5', '5-10', '10+'];
const EXP_LABELS = { fresher: 'Fresher', '1-2': '1–2 yrs', '2-5': '2–5 yrs', '5-10': '5–10 yrs', '10+': '10+' };

export default function JobSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [savedIds, setSavedIds] = useState([]);

  const [filters, setFilters] = useState({
    q: searchParams.get('q') || '',
    city: searchParams.get('city') || '',
    jobType: searchParams.get('jobType') || '',
    experienceLevel: searchParams.get('experienceLevel') || '',
    verifiedOnly: searchParams.get('verifiedOnly') !== 'false',
    page: parseInt(searchParams.get('page') || '1'),
  });

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['jobs', filters],
    queryFn: () => jobsAPI.getJobs(filters).then((r) => r.data),
    keepPreviousData: true,
  });

  useEffect(() => {
    const params = {};
    if (filters.q) params.q = filters.q;
    if (filters.city) params.city = filters.city;
    if (filters.jobType) params.jobType = filters.jobType;
    if (filters.experienceLevel) params.experienceLevel = filters.experienceLevel;
    params.verifiedOnly = filters.verifiedOnly ? 'true' : 'false';
    if (filters.page > 1) params.page = filters.page;
    setSearchParams(params, { replace: true });
  }, [filters]);

  const updateFilter = (key, value) => {
    setFilters((f) => ({ ...f, [key]: value, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({ q: '', city: '', jobType: '', experienceLevel: '', verifiedOnly: true, page: 1 });
  };

  const activeFilterCount = [
    filters.jobType,
    filters.experienceLevel,
    filters.city,
  ].filter(Boolean).length;

  const handleSaveToggle = (jobId, nowSaved) => {
    setSavedIds((prev) =>
      nowSaved ? [...prev, jobId] : prev.filter((id) => id !== jobId)
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      <div className="flex flex-col lg:flex-row gap-6">

        {/* ── Sidebar Filters (desktop) ──────────────────────────────────── */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="card p-5 sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-semibold text-slate-800">Filters</h2>
              {activeFilterCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-navy-600 hover:underline">
                  Clear all
                </button>
              )}
            </div>

            {/* Verified Only toggle */}
            <div className="mb-5 pb-5 border-b border-slate-100">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div
                  onClick={() => updateFilter('verifiedOnly', !filters.verifiedOnly)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${
                    filters.verifiedOnly ? 'bg-trust-green' : 'bg-slate-200'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      filters.verifiedOnly ? 'translate-x-5' : 'translate-x-1'
                    }`}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-trust-green" />
                    Verified employers only
                  </p>
                  <p className="text-xs text-slate-400">MCA/GST confirmed</p>
                </div>
              </label>
            </div>

            {/* Job Type */}
            <div className="mb-5">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Job type</p>
              <div className="space-y-2">
                {JOB_TYPES.map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="jobType"
                      checked={filters.jobType === type}
                      onChange={() =>
                        updateFilter('jobType', filters.jobType === type ? '' : type)
                      }
                      className="accent-navy-600"
                    />
                    <span className="text-sm text-slate-600 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Experience */}
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Experience</p>
              <div className="space-y-2">
                {EXP_LEVELS.map((level) => (
                  <label key={level} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="exp"
                      checked={filters.experienceLevel === level}
                      onChange={() =>
                        updateFilter('experienceLevel', filters.experienceLevel === level ? '' : level)
                      }
                      className="accent-navy-600"
                    />
                    <span className="text-sm text-slate-600">{EXP_LABELS[level]}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Main Content ───────────────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Search bar */}
          <div className="flex gap-2 mb-4">
            <div className="flex-1 flex items-center gap-2 input py-0">
              <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <input
                type="text"
                value={filters.q}
                onChange={(e) => updateFilter('q', e.target.value)}
                placeholder="Job title, skill, or company"
                className="flex-1 py-2.5 focus:outline-none text-sm bg-transparent placeholder:text-slate-400"
              />
              {filters.q && (
                <button onClick={() => updateFilter('q', '')} className="text-slate-400 hover:text-slate-600">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center gap-2 input w-44 py-0">
              <span className="text-slate-400 text-xs">📍</span>
              <input
                type="text"
                value={filters.city}
                onChange={(e) => updateFilter('city', e.target.value)}
                placeholder="City"
                className="flex-1 py-2.5 focus:outline-none text-sm bg-transparent placeholder:text-slate-400"
              />
            </div>
            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden btn-secondary py-2 px-3 relative"
            >
              <SlidersHorizontal className="w-4 h-4" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-navy-600 text-white text-xs rounded-full flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          {/* Mobile filters */}
          {showFilters && (
            <div className="lg:hidden card p-4 mb-4">
              <div className="flex flex-wrap gap-2">
                {JOB_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => updateFilter('jobType', filters.jobType === type ? '' : type)}
                    className={`px-3 py-1 text-sm rounded-full border transition-colors ${
                      filters.jobType === type
                        ? 'bg-navy-600 text-white border-navy-600'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <p className="text-sm text-slate-500">
                {isLoading ? (
                  'Loading…'
                ) : (
                  <>
                    <span className="font-semibold text-slate-800">{data?.pagination?.total ?? 0}</span>
                    {' '}jobs found
                    {filters.verifiedOnly && (
                      <span className="ml-2 badge-verified">
                        <ShieldCheck className="w-3 h-3" /> Verified only
                      </span>
                    )}
                  </>
                )}
              </p>
            </div>
            {!filters.verifiedOnly && (
              <button
                onClick={() => updateFilter('verifiedOnly', true)}
                className="text-xs text-trust-green font-medium hover:underline flex items-center gap-1"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Show verified only
              </button>
            )}
          </div>

          {/* Job list */}
          <div className="space-y-3">
            {isLoading || isFetching
              ? Array.from({ length: 6 }).map((_, i) => <SkeletonJobCard key={i} />)
              : data?.jobs?.length > 0
              ? data.jobs.map((job) => (
                  <JobCard
                    key={job._id}
                    job={job}
                    savedIds={savedIds}
                    onSaveToggle={handleSaveToggle}
                  />
                ))
              : (
                <EmptyState
                  icon="search"
                  title="No jobs match your search"
                  description="Try removing filters or turning off 'Verified Only' to see all listings."
                  action={
                    <button onClick={clearFilters} className="btn-secondary text-sm">
                      Clear filters
                    </button>
                  }
                />
              )}
          </div>

          {/* Pagination */}
          {data?.pagination && (
            <Pagination
              page={data.pagination.page}
              pages={data.pagination.pages}
              onPage={(p) => setFilters((f) => ({ ...f, page: p }))}
            />
          )}
        </div>
      </div>
    </div>
  );
}
