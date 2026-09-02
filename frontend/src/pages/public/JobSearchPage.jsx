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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 theme-transition">
      {/* Page Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          Explore Verified Opportunities
        </h1>
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Search genuine job postings verified against corporate MCA21 registration databases.
        </p>
      </div>

      {/* High-Contrast Search Bar */}
      <form onSubmit={handleSearchSubmit} className="bg-white dark:bg-slate-900 p-3 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center space-x-3 px-3 py-2 w-full sm:w-1/2 border-b sm:border-b-0 sm:border-r border-slate-200 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Role, skill, or employer name..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-3 px-3 py-2 w-full sm:w-1/2">
          <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City (e.g. Bengaluru, Mumbai) or 'Remote'..."
            className="w-full bg-transparent text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto flex-shrink-0">
          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition shadow-sm"
          >
            Apply Search
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            title="Reset Filters"
            className="px-3.5 py-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-xl transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Filter Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center space-x-1.5 ${
              verifiedOnly
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800 shadow-sm'
                : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Verified Employers Only</span>
          </button>

          <select
            value={workplaceType}
            onChange={(e) => setWorkplaceType(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 focus:outline-none font-medium"
          >
            <option value="">All Workplace Types</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 focus:outline-none font-medium"
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
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 rounded-xl px-3 py-2 focus:outline-none font-medium"
          >
            <option value="">All Experience Levels</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
            <option value="Lead / Manager">Lead / Manager</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 text-slate-500">
          <span className="text-xs">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-xl px-3 py-2 focus:outline-none font-bold text-xs"
          >
            <option value="createdAt">Latest</option>
            <option value="employerTrustScore">Highest TrustScore</option>
            <option value="salary.max">Highest Compensation</option>
          </select>
        </div>
      </div>

      {/* Results Count */}
      <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
        Showing <span className="font-bold text-slate-900 dark:text-white">{jobs.length}</span> of <span className="font-bold text-slate-900 dark:text-white">{pagination.total || jobs.length}</span> verified positions
      </div>

      {/* Grid of Job Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
          <Building2 className="w-10 h-10 text-slate-400 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">No openings matched your filters</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Try resetting your location or workplace filters to see all available verified openings.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold text-xs mt-2"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-6">
          <button
            disabled={pagination.page <= 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 disabled:opacity-40 font-semibold"
          >
            Previous
          </button>
          <span className="text-xs text-slate-500 px-3 font-medium">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            className="px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 disabled:opacity-40 font-semibold"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
