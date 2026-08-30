// frontend/src/pages/public/JobSearchPage.jsx
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import apiClient from '../../api/client';
import { JobCard } from '../../components/jobs/JobCard';

export const JobSearchPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (location) params.append('location', location);
      if (verifiedOnly) params.append('verifiedOnly', 'true');

      const res = await apiClient.get(`/jobs?${params.toString()}`);
      setJobs(res.data || []);
    } catch (err) {
      console.error('Failed to fetch jobs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [verifiedOnly]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Search Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <h1 className="text-3xl font-extrabold text-white">Find Verified Tech Jobs</h1>
          <p className="text-sm text-slate-400">
            Browse legit opportunities scanned for scams and backed by verified employers.
          </p>
        </div>

        {/* Search Bar & Filters */}
        <form onSubmit={handleSearch} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col md:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Job title, keywords, or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <div className="relative flex-1 w-full">
            <MapPin className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="City, country, or remote..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500/50"
            />
          </div>

          <label className="flex items-center gap-2 text-xs font-medium text-slate-300 cursor-pointer px-2">
            <input
              type="checkbox"
              checked={verifiedOnly}
              onChange={(e) => setVerifiedOnly(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-emerald-500 focus:ring-0"
            />
            Verified Only
          </label>

          <button
            type="submit"
            className="w-full md:w-auto px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-semibold rounded-xl text-sm transition-all"
          >
            Search
          </button>
        </form>

        {/* Job Listings Grid */}
        {loading ? (
          <div className="py-20 text-center text-slate-500 animate-pulse">Loading opportunities...</div>
        ) : jobs.length === 0 ? (
          <div className="py-20 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800/60">
            No matching jobs found. Try adjusting your filters.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};