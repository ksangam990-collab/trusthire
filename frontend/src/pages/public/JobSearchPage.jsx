import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, MapPin, RotateCcw, Building2 } from 'lucide-react';
import { jobsApi } from '../../api';
import JobCard from '../../components/jobs/JobCard';

export default function JobSearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);

  // Filter State — initialise from URL params so bookmarked searches work
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [jobType, setJobType] = useState(searchParams.get('jobType') || '');
  const [workplaceType, setWorkplaceType] = useState(searchParams.get('workplaceType') || '');
  const [experienceLevel, setExperienceLevel] = useState(searchParams.get('experienceLevel') || '');
  const [verifiedOnly, setVerifiedOnly] = useState(searchParams.get('verifiedOnly') === 'true');
  const [sortBy, setSortBy] = useState(searchParams.get('sortBy') || 'createdAt');
  const [currentPage, setCurrentPage] = useState(1);

  const fetchJobs = useCallback(async (page = 1, filters = {}) => {
    setLoading(true);
    try {
      const params = {
        keyword: filters.keyword || undefined,
        city: filters.city || undefined,
        jobType: filters.jobType || undefined,
        workplaceType: filters.workplaceType || undefined,
        experienceLevel: filters.experienceLevel || undefined,
        verifiedOnly: filters.verifiedOnly ? 'true' : undefined,
        sortBy: filters.sortBy || 'createdAt',
        page,
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
  }, []);

  // One-time mount: if URL has keyword/city, run search immediately
  useEffect(() => {
    const urlKeyword = searchParams.get('keyword') || '';
    const urlCity = searchParams.get('city') || '';
    if (urlKeyword || urlCity) {
      fetchJobs(1, { keyword: urlKeyword, city: urlCity, jobType, workplaceType, experienceLevel, verifiedOnly, sortBy });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // intentionally runs once on mount only

  // Fetch on mount and when dropdowns / page changes
  useEffect(() => {
    fetchJobs(currentPage, { keyword, city, jobType, workplaceType, experienceLevel, verifiedOnly, sortBy });
  }, [currentPage, jobType, workplaceType, experienceLevel, verifiedOnly, sortBy]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchJobs(1, { keyword, city, jobType, workplaceType, experienceLevel, verifiedOnly, sortBy });
  };

  const handleResetFilters = () => {
    const defaults = { keyword: '', city: '', jobType: '', workplaceType: '', experienceLevel: '', verifiedOnly: false, sortBy: 'createdAt' };
    setKeyword('');
    setCity('');
    setJobType('');
    setWorkplaceType('');
    setExperienceLevel('');
    setVerifiedOnly(false);
    setSortBy('createdAt');
    setCurrentPage(1);
    fetchJobs(1, defaults);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Explore Verified Opportunities
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Search job postings verified against corporate registration databases and screened for scam patterns.
        </p>
      </div>

      {/* Main Search Input */}
      <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 bg-slate-900/80 p-4 rounded-xl border border-slate-800">
        <div className="sm:col-span-5 relative">
          <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Role, skill, or employer name..."
            className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="sm:col-span-4 relative">
          <MapPin className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="City (e.g. Bengaluru, Mumbai)..."
            className="w-full pl-10 pr-3 py-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500"
          />
        </div>
        <div className="sm:col-span-3 flex gap-2">
          <button
            type="submit"
            className="flex-grow py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-semibold rounded-lg text-sm transition"
          >
            Apply Search
          </button>
          <button
            type="button"
            onClick={handleResetFilters}
            title="Reset Filters"
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </form>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => { setVerifiedOnly((v) => !v); setCurrentPage(1); }}
            className={`px-3 py-1.5 rounded-lg font-medium border transition ${
              verifiedOnly
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            ✓ Verified Employers Only
          </button>

          <select
            value={workplaceType}
            onChange={(e) => { setWorkplaceType(e.target.value); setCurrentPage(1); }}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="">All Workplace Types</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
            <option value="On-site">On-site</option>
          </select>

          <select
            value={jobType}
            onChange={(e) => { setJobType(e.target.value); setCurrentPage(1); }}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            <option value="">All Job Types</option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>

          <select
            value={experienceLevel}
            onChange={(e) => { setExperienceLevel(e.target.value); setCurrentPage(1); }}
            className="bg-slate-900 border border-slate-800 text-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none"
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
            onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
            className="bg-slate-900 border border-slate-800 text-slate-200 rounded-lg px-2 py-1 focus:outline-none"
          >
            <option value="createdAt">Latest</option>
            <option value="employerTrustScore">Highest TrustScore</option>
            <option value="salary.max">Highest Salary</option>
          </select>
        </div>
      </div>

      <div className="text-xs font-mono text-slate-400">
        Showing {jobs.length} of {pagination.total} verified positions
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-44 rounded-xl bg-slate-900/50 border border-slate-800 animate-pulse" />
          ))}
        </div>
      ) : jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-slate-900/40 rounded-xl border border-slate-800 space-y-3">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-white">No job openings match your criteria</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search query, removing workplace filters, or checking back later.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-4 py-2 rounded-lg bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700"
          >
            Reset Filters
          </button>
        </div>
      )}

      {pagination.pages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-6">
          <button
            disabled={currentPage <= 1}
            onClick={() => setCurrentPage((p) => p - 1)}
            className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300 disabled:opacity-40"
          >
            Previous
          </button>
          <span className="text-xs text-slate-400 font-mono px-2">
            Page {currentPage} of {pagination.pages}
          </span>
          <button
            disabled={currentPage >= pagination.pages}
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-xs text-slate-300 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}