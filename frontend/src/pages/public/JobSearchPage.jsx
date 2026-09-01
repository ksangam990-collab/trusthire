import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, RotateCcw, Building2, CheckCircle2 } from 'lucide-react';
import { jobsApi } from '../../api';
import JobCard from '../../components/jobs/JobCard';
import { JobCardSkeleton } from '../../components/ui/Skeleton';

export default function JobSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filters
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [workplaceType, setWorkplaceType] = useState(searchParams.get('workplaceType') || '');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verifiedOnly') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const params = {
        keyword: keyword || undefined,
        city: city || undefined,
        jobType: jobType || undefined,
        workplaceType: workplaceType || undefined,
        experienceLevel: experienceLevel || undefined,
        verifiedOnly: verifiedOnly ? 'true' : undefined,
        sortBy,
        page: pagination.page,
        limit: 10
      };

      const res = await jobsApi.getJobs(params);
      setJobs(res?.data?.jobs || []);
      setPagination(res?.data?.pagination || { page: 1, pages: 1, total: 0 });
    } catch (err) {
      console.error('Failed to load jobs:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [pagination.page, jobType, workplaceType, experienceLevel, verifiedOnly, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchJobs();
  };

  const handleResetFilters = () => {
    setKeyword('');
    setCity('');
    setJobType('');
    setWorkplaceType('');
    setExperienceLevel('');
    setVerifiedOnly(false);
    setSortBy('createdAt');
    setPagination({ page: 1, pages: 1, total: 0 });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 theme-transition">
      {/* Page Heading */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Browse Verified Openings
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
          Opportunities screened for official MCA21 company registrations and zero candidate deposits.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-white dark:bg-[#0F172A] p-3 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="sm:col-span-5 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" strokeWidth={1.5} />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search role, skills, or company..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
          />
        </div>
        <div className="sm:col-span-4 relative">
          <MapPin className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" strokeWidth={1.5} />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City (e.g. Bengaluru, Pune, Remote)..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 text-xs sm:text-sm focus:outline-none focus:border-slate-900 dark:focus:border-emerald-500"
          />
        </div>
        <div className="sm:col-span-3 flex gap-2">
          <button
            type="submit"
            className="flex-grow py-2 bg-slate-900 hover:bg-slate-800 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-semibold rounded-lg text-xs sm:text-sm transition"
          >
            Filter
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            title="Reset Filters"
            className="px-3 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg border border-slate-200 dark:border-slate-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </div>
      </form>

      {/* Filter Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`px-2.5 py-1 rounded-md text-xs font-medium border transition flex items-center space-x-1 ${
              verifiedOnly
                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-300 dark:border-emerald-800 font-semibold'
                : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" strokeWidth={2} />
            <span>MCA Verified Only</span>
          </button>

          <select
            value={workplaceType}
            onChange={(e) => setWorkplaceType(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-md px-2.5 py-1 focus:outline-none"
          >
            <option value="">All Workplace Types</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-md px-2.5 py-1 focus:outline-none"
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>

          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-md px-2.5 py-1 focus:outline-none"
          >
            <option value="">All Experience Levels</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
            <option value="Lead / Manager">Lead / Manager</option>
          </select>
        </div>

        <div className="flex items-center space-x-1.5 text-slate-500 dark:text-slate-400">
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-md px-2 py-1 focus:outline-none font-medium"
          >
            <option value="createdAt">Latest</option>
            <option value="employerTrustScore">Highest TrustScore</option>
            <option value="salary.max">Highest Compensation</option>
          </select>
        </div>
      </div>

      {/* Grid of Job Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
          <Building2 className="w-8 h-8 text-slate-400 mx-auto" strokeWidth={1.5} />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">No openings matched your filters</h3>
          <p className="text-xs text-slate-500">
            Try broadening your location or search terms to see all verified openings.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-3.5 py-1.5 rounded-lg bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-medium text-xs mt-2"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-4">
          <button
            disabled={pagination.page <= 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-slate-500 font-mono px-2">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            className="px-3 py-1.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
