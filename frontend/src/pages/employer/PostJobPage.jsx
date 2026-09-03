import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Briefcase, AlertCircle, CheckCircle2, PlusCircle, X } from 'lucide-react';
import { jobsApi } from '../../api';
import { Spinner } from '../../components/ui/Skeleton';

const inputCls = "w-full px-3.5 py-2.5 text-sm bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition";
const labelCls = "block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5";

function FieldSection({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider pb-2 border-b border-slate-100 dark:border-slate-800">{title}</h3>
      {children}
    </div>
  );
}

export default function PostJobPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('India');
  const [jobType, setJobType] = useState('Full-time');
  const [workplaceType, setWorkplaceType] = useState('On-site');
  const [experienceLevel, setExperienceLevel] = useState('Mid Level');
  const [openings, setOpenings] = useState(1);
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [description, setDescription] = useState('');
  const [skillsInput, setSkillsInput] = useState('');
  const [responsibilities, setResponsibilities] = useState(['']);
  const [requirements, setRequirements] = useState(['']);

  const addItem = (setter) => setter(prev => [...prev, '']);
  const updateItem = (setter, index, value) => setter(prev => prev.map((v, i) => i === index ? value : v));
  const removeItem = (setter, index) => setter(prev => prev.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const minSal = Number(salaryMin) || 0;
    const maxSal = Number(salaryMax) || 0;
    if (minSal > 0 && maxSal > 0 && minSal > maxSal) {
      setError('Minimum salary cannot be more than maximum salary.');
      return;
    }

    const skills = skillsInput.split(',').map(s => s.trim()).filter(Boolean);

    const payload = {
      title: title.trim(),
      location: { city: city.trim(), country: country.trim() },
      jobType, workplaceType, experienceLevel,
      openings: Number(openings) || 1,
      salary: { min: minSal, max: maxSal || minSal },
      description: description.trim(),
      skills,
      responsibilities: responsibilities.filter(r => r.trim()),
      requirements: requirements.filter(r => r.trim()),
    };

    setSubmitting(true);
    try {
      await jobsApi.createJob(payload);
      setDone(true);
    } catch (err) {
      setError(err.message || 'Failed to post job. Please try again.');
    } finally { setSubmitting(false); }
  };

  if (done) return (
    <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border-2 border-emerald-400 flex items-center justify-center mx-auto">
        <CheckCircle2 className="w-9 h-9 text-emerald-600 dark:text-emerald-400" />
      </div>
      <h2 className="text-xl font-black text-slate-900 dark:text-white">Job Posted!</h2>
      <p className="text-sm text-slate-500">Your job listing is now live and visible to candidates. You can manage it from your dashboard.</p>
      <div className="flex items-center justify-center gap-3">
        <Link to="/employer/dashboard" className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl transition">Go to Dashboard</Link>
        <button onClick={() => { setDone(false); setTitle(''); setDescription(''); setSkillsInput(''); setResponsibilities(['']); setRequirements(['']); setSalaryMin(''); setSalaryMax(''); }}
          className="px-5 py-2.5 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition cursor-pointer">
          Post Another Job
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6 theme-transition">
      <Link to="/employer/dashboard" className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 dark:hover:text-white transition">
        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
      </Link>

      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 sm:p-8">
        <div className="flex items-center gap-3 mb-6 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Post a New Job</h1>
            <p className="text-xs text-slate-500">Fill in the details below. Honest, accurate descriptions attract better candidates.</p>
          </div>
        </div>

        {error && (
          <div className="mb-5 flex items-start gap-2 p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 text-xs rounded-xl">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-7">
          <FieldSection title="Basic Info">
            <div>
              <label className={labelCls}>Job Title *</label>
              <input type="text" required value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g. Senior React Developer" className={inputCls} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>City *</label>
                <input type="text" required value={city} onChange={e => setCity(e.target.value)} placeholder="Bengaluru, Mumbai, Remote..." className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Country</label>
                <input type="text" value={country} onChange={e => setCountry(e.target.value)} className={inputCls} />
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className={labelCls}>Job Type</label>
                <select value={jobType} onChange={e => setJobType(e.target.value)} className={inputCls}>
                  {['Full-time','Part-time','Contract','Internship','Freelance'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Workplace</label>
                <select value={workplaceType} onChange={e => setWorkplaceType(e.target.value)} className={inputCls}>
                  {['On-site','Remote','Hybrid'].map(t => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Openings</label>
                <input type="number" min="1" max="999" value={openings} onChange={e => setOpenings(e.target.value)} className={inputCls} />
              </div>
            </div>
            <div>
              <label className={labelCls}>Experience Level</label>
              <select value={experienceLevel} onChange={e => setExperienceLevel(e.target.value)} className={inputCls}>
                {['Entry Level','Mid Level','Senior Level','Lead / Manager','Executive'].map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
          </FieldSection>

          <FieldSection title="Compensation (Annual CTC in INR)">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Minimum (e.g. 500000)</label>
                <input type="number" min="0" value={salaryMin} onChange={e => setSalaryMin(e.target.value)} placeholder="500000" className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Maximum (e.g. 900000)</label>
                <input type="number" min="0" value={salaryMax} onChange={e => setSalaryMax(e.target.value)} placeholder="900000" className={inputCls} />
              </div>
            </div>
            <p className="text-[11px] text-slate-400">Publishing honest salary ranges builds trust and attracts more qualified candidates.</p>
          </FieldSection>

          <FieldSection title="Job Description">
            <div>
              <label className={labelCls}>Role overview *</label>
              <textarea rows={5} required value={description} onChange={e => setDescription(e.target.value)}
                placeholder="Describe what this role is about, the team, and what a typical day looks like..."
                className={inputCls + ' resize-none'} />
            </div>
            <div>
              <label className={labelCls}>Skills required (comma-separated)</label>
              <input type="text" value={skillsInput} onChange={e => setSkillsInput(e.target.value)} placeholder="React, Node.js, TypeScript, MongoDB" className={inputCls} />
            </div>
          </FieldSection>

          <FieldSection title="Responsibilities">
            <div className="space-y-2">
              {responsibilities.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={r} onChange={e => updateItem(setResponsibilities, i, e.target.value)} placeholder={`Responsibility ${i+1}`} className={inputCls} />
                  {responsibilities.length > 1 && (
                    <button type="button" onClick={() => removeItem(setResponsibilities, i)} className="text-slate-400 hover:text-rose-500 cursor-pointer p-2">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addItem(setResponsibilities)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 cursor-pointer transition">
                <PlusCircle className="w-4 h-4" /> Add more
              </button>
            </div>
          </FieldSection>

          <FieldSection title="Requirements">
            <div className="space-y-2">
              {requirements.map((r, i) => (
                <div key={i} className="flex gap-2">
                  <input type="text" value={r} onChange={e => updateItem(setRequirements, i, e.target.value)} placeholder={`Requirement ${i+1}`} className={inputCls} />
                  {requirements.length > 1 && (
                    <button type="button" onClick={() => removeItem(setRequirements, i)} className="text-slate-400 hover:text-rose-500 cursor-pointer p-2">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addItem(setRequirements)}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 cursor-pointer transition">
                <PlusCircle className="w-4 h-4" /> Add more
              </button>
            </div>
          </FieldSection>

          <div className="pt-2 flex justify-end">
            <button type="submit" disabled={submitting}
              className="flex items-center gap-2 px-7 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold text-sm rounded-xl transition cursor-pointer shadow-sm">
              {submitting ? <Spinner className="w-4 h-4 text-white" /> : <Briefcase className="w-4 h-4" />}
              <span>{submitting ? 'Publishing...' : 'Publish Job'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
