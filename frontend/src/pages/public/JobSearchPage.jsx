import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, RotateCcw, Building2, CheckCircle2, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react';
import { jobsApi } from '../../api';
import JobCard from '../../components/jobs/JobCard';
import { JobCardSkeleton } from '../../components/ui/Skeleton';

export default function JobSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [jobType, setJobType] = useState('');
  const [workplaceType, setWorkplaceType] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState('createdAt');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchJobs = async (page = currentPage, kw = keyword, ct = city) => {
    setLoading(true);
    try {
      const res = await jobsApi.getJobs({
        keyword: kw || undefined, city: ct || undefined,
        jobType: jobType || undefined, workplaceType: workplaceType || undefined,
        experienceLevel: experienceLevel || undefined,
        verifiedOnly: verifiedOnly ? 'true' : undefined,
        sortBy, page, limit: 12
      });
      setJobs(res?.data?.jobs || []);
      setPagination(res?.data?.pagination || { page: 1, pages: 1, total: 0 });
      setCurrentPage(page);
    } catch (err) { console.error('Job fetch error:', err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchJobs(1); }, [jobType, workplaceType, experienceLevel, verifiedOnly, sortBy]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs(1, keyword, city);
  };

  const handleReset = () => {
    setKeyword(''); setCity(''); setJobType(''); setWorkplaceType('');
    setExperienceLevel(''); setVerifiedOnly(false); setSortBy('createdAt');
    setCurrentPage(1);
    setTimeout(() => fetchJobs(1, '', ''), 0);
  };

  const selectCls = "text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer";

  const hasActiveFilters = jobType || workplaceType || experienceLevel || verifiedOnly;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 theme-transition">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">Verified Job Openings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Every company is checked against official corporate registries.</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-2 shadow-sm transition-all focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/20">
        <div className="flex items-center gap-2 flex-1 px-3 py-1.5 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-700">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input type="text" value={keyword} onChange={e => setKeyword(e.target.value)} placeholder="Job title, skill, or company..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none" />
        </div>
        <div className="flex items-center gap-2 flex-1 px-3 py-1.5">
          <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input type="text" value={city} onChange={e => setCity(e.target.value)} placeholder="City or Remote..."
            className="w-full bg-transparent text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none" />
        </div>
        <div className="flex gap-2 flex-shrink-0 px-1">
          <button type="submit" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-sm">
            Search
          </button>
          <button type="button" onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 px-3 py-2 text-sm font-semibold rounded-xl border transition cursor-pointer ${showFilters || hasActiveFilters ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800' : 'bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'}`}>
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:block">Filters</span>
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
          </button>
        </div>
      </form>

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1.5">Job Type</label>
            <select value={jobType} onChange={e => setJobType(e.target.value)} className={selectCls}>
              <option value="">Any</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1.5">Workplace</label>
            <select value={workplaceType} onChange={e => setWorkplaceType(e.target.value)} className={selectCls}>
              <option value="">Any</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="On-site">On-site</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1.5">Experience</label>
            <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} className={selectCls}>
              <option value="">Any</option>
              <option value="Entry Level">Entry Level</option>
              <option value="Mid Level">Mid Level</option>
              <option value="Senior Level">Senior Level</option>
              <option value="Lead / Manager">Lead / Manager</option>
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1.5">Sort By</label>
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} className={selectCls}>
              <option value="createdAt">Newest First</option>
              <option value="salary.max">Highest Salary</option>
              <option value="employerTrustScore">Trust Score</option>
            </select>
          </div>
          <div className="col-span-2 sm:col-span-4 flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 dark:text-slate-300 select-none">
              <input type="checkbox" checked={verifiedOnly} onChange={e => setVerifiedOnly(e.target.checked)} className="w-4 h-4 rounded accent-emerald-600" />
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Show verified companies only
            </label>
            {hasActiveFilters && (
              <button type="button" onClick={handleReset}
                className="inline-flex items-center gap-1.5 text-xs text-rose-600 hover:text-rose-700 font-semibold cursor-pointer">
                <X className="w-3.5 h-3.5" /> Clear all filters
              </button>
            )}
          </div>
        </div>
      )}

      {/* Results Count */}
      {!loading && (
        <p className="text-xs text-slate-500">
          <span className="font-bold text-slate-800 dark:text-slate-200">{pagination.total}</span> verified jobs found
          {(keyword || city) && <> for <span className="font-semibold text-emerald-600">"{keyword || city}"</span></>}
        </p>
      )}

      {/* Job Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4,5,6].map(i => <JobCardSkeleton key={i} />)}
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
          <Building2 className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto" />
          <h3 className="font-bold text-slate-900 dark:text-white">No jobs found</h3>
          <p className="text-sm text-slate-500">Try adjusting your search or clearing filters.</p>
          <button onClick={handleReset} className="px-4 py-2 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition cursor-pointer">Clear Filters</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map(job => <JobCard key={job._id} job={job} />)}
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => fetchJobs(currentPage - 1)} disabled={currentPage <= 1}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer">
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>
          <span className="text-xs text-slate-500">Page {currentPage} of {pagination.pages}</span>
          <button onClick={() => fetchJobs(currentPage + 1)} disabled={currentPage >= pagination.pages}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer">
            Next <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
