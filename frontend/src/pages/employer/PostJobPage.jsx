import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Briefcase, CheckCircle2, ArrowLeft } from 'lucide-react';
import { jobsApi } from '../../api';

export default function PostJobPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    responsibilities: '',
    requirements: '',
    skills: '',
    jobType: 'Full-time',
    workplaceType: 'On-site',
    experienceLevel: 'Mid Level',
    city: '',
    state: '',
    salaryMin: '',
    salaryMax: '',
    openings: 1
  });

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.description || !formData.city) {
      setErrorMessage('Title, description, and job city are required.');
      return;
    }

    setLoading(true);
    setErrorMessage('');

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        responsibilities: formData.responsibilities.split('\n').map(s => s.trim()).filter(Boolean),
        requirements: formData.requirements.split('\n').map(s => s.trim()).filter(Boolean),
        skills: formData.skills.split(',').map(s => s.trim().toLowerCase()).filter(Boolean),
        jobType: formData.jobType,
        workplaceType: formData.workplaceType,
        experienceLevel: formData.experienceLevel,
        location: {
          city: formData.city.trim(),
          state: formData.state.trim(),
          country: 'India'
        },
        salary: {
          min: Number(formData.salaryMin) || 0,
          max: Number(formData.salaryMax) || 0,
          currency: 'INR'
        },
        openings: Number(formData.openings) || 1
      };

      await jobsApi.createJob(payload);
      navigate('/employer/dashboard');
    } catch (err) {
      setErrorMessage(err.message || 'Failed to post opening. Ensure your profile is active.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
      <button
        onClick={() => navigate('/employer/dashboard')}
        className="inline-flex items-center space-x-1 text-xs text-slate-400 hover:text-white"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Dashboard</span>
      </button>

      <div className="p-6 sm:p-8 rounded-2xl bg-[#111827] border border-slate-800 shadow-xl space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">Create Verified Job Listing</h1>
            <p className="text-xs text-slate-400">Postings inherit your verified TrustScore and are automatically indexed on the marketplace.</p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-lg">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Job Title *</label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Senior Backend Engineer (Node.js/Go)"
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Job Type</label>
              <select
                name="jobType"
                value={formData.jobType}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Workplace Type</label>
              <select
                name="workplaceType"
                value={formData.workplaceType}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="On-site">On-site</option>
                <option value="Remote">Remote</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Experience Level</label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="Entry Level">Entry Level</option>
                <option value="Mid Level">Mid Level</option>
                <option value="Senior Level">Senior Level</option>
                <option value="Lead / Manager">Lead / Manager</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">City Location *</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Bengaluru"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">State</label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="e.g. Karnataka"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-medium mb-1">Min Salary (INR / Year)</label>
              <input
                type="number"
                name="salaryMin"
                value={formData.salaryMin}
                onChange={handleChange}
                placeholder="e.g. 1200000"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-medium mb-1">Max Salary (INR / Year)</label>
              <input
                type="number"
                name="salaryMax"
                value={formData.salaryMax}
                onChange={handleChange}
                placeholder="e.g. 1800000"
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Skills (Comma-separated)</label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, TypeScript, Docker, Node.js"
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Job Description *</label>
            <textarea
              name="description"
              rows={4}
              required
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed overview of the team, role, and mission..."
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Responsibilities (One per line)</label>
            <textarea
              name="responsibilities"
              rows={3}
              value={formData.responsibilities}
              onChange={handleChange}
              placeholder="Design scalable distributed APIs&#10;Lead architectural design reviews&#10;Mentor junior software engineers"
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Requirements (One per line)</label>
            <textarea
              name="requirements"
              rows={3}
              value={formData.requirements}
              onChange={handleChange}
              placeholder="4+ years of production experience with Node.js&#10;Experience with high-throughput MongoDB clusters"
              className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono"
            />
          </div>

          <div className="pt-3 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/employer/dashboard')}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 bg-emerald-400 hover:bg-emerald-300 text-slate-900 font-bold rounded-lg disabled:opacity-50"
            >
              {loading ? 'Publishing Listing...' : 'Publish Opening'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}