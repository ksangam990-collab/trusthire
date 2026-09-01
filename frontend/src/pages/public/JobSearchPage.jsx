import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, Filter, RotateCcw, Building2, CheckCircle2 } from 'lucide-react';
import { jobsApi } from '../../api';
import JobCard from '../../components/jobs/JobCard';
import { JobCardSkeleton } from '../../components/ui/Skeleton';

export default function JobSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filter State
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Page Heading Banner */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Verified Opportunities Marketplace
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Explore openings screened for authentic employer registrations and zero fee demands.
        </p>
      </div>

      {/* Main Search Bar Form */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-[#111827] p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div className="sm:col-span-5 relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Search by title, role, skill, or employer..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="sm:col-span-4 relative">
          <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City (e.g. Bengaluru, Mumbai, Pune)..."
            className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white placeholder-slate-500 text-xs sm:text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="sm:col-span-3 flex gap-2">
          <button
            type="submit"
            className="flex-grow py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold rounded-xl text-xs sm:text-sm transition shadow-glow-sm"
          >
            Apply Filters
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            title="Reset Filters"
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Filter Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-slate-800/80 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setVerifiedOnly(!verifiedOnly)}
            className={`px-3 py-1.5 rounded-lg font-medium border transition flex items-center space-x-1.5 ${
              verifiedOnly
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Employers Only</span>
          </button>

          <select
            value={workplaceType}
            onChange={(e) => setWorkplaceType(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="">All Workplace Types</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none"
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
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-3 py-1.5 focus:outline-none"
          >
            <option value="">All Experience Levels</option>
            <option value="Entry Level">Entry Level</option>
            <option value="Mid Level">Mid Level</option>
            <option value="Senior Level">Senior Level</option>
            <option value="Lead / Manager">Lead / Manager</option>
          </select>
        </div>

        <div className="flex items-center space-x-2 text-slate-400">
          <span>Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none font-medium"
          >
            <option value="createdAt">Latest Added</option>
            <option value="employerTrustScore">Highest TrustScore</option>
            <option value="salary.max">Highest Compensation</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="text-xs font-mono text-slate-400 flex items-center justify-between">
        <span>Showing {jobs.length} of {pagination.total} verified positions</span>
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
        <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-slate-800 space-y-3">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No openings matched your filters</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try resetting your workplace location or search keyword to see all active listings.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-lg bg-emerald-400 text-xs font-bold text-slate-900 hover:bg-emerald-300 transition"
          >
            Reset All Filters
          </button>
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-6">
          <button
            disabled={pagination.page <= 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 disabled:opacity-40 hover:bg-slate-800"
          >
            Previous
          </button>
          <span className="text-xs text-slate-400 font-mono px-3">
            Page {pagination.page} of {pagination.pages}
          </span>
          <button
            disabled={pagination.page >= pagination.pages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-300 disabled:opacity-40 hover:bg-slate-800"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
