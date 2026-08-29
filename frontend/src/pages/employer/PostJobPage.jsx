import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CheckCircle2 } from 'lucide-react';
import { jobsAPI } from '../../api';
import { Spinner, ErrorMessage } from '../../components/ui';
import toast from 'react-hot-toast';

const SKILLS_SUGGESTIONS = ['React', 'Node.js', 'Python', 'Java', 'SQL', 'Excel', 'Communication', 'Sales', 'Tally', 'AutoCAD'];

const schema = z.object({
  title: z.string().min(3, 'Title required').max(150),
  description: z.string().min(50, 'Describe the role (min 50 chars)').max(5000),
  responsibilities: z.string().max(3000).optional(),
  requirements: z.string().max(3000).optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  isRemote: z.boolean().default(false),
  salaryMin: z.coerce.number().min(0).optional(),
  salaryMax: z.coerce.number().min(0).optional(),
  isDisclosed: z.boolean().default(true),
  jobType: z.enum(['fulltime', 'parttime', 'internship', 'contract', 'freelance']),
  experienceLevel: z.enum(['fresher', '1-2', '2-5', '5-10', '10+']).default('fresher'),
  openings: z.coerce.number().int().min(1).max(100).default(1),
  education: z.string().optional(),
  applyMethod: z.enum(['platform', 'email', 'external']).default('platform'),
  applyEmail: z.string().email().optional().or(z.literal('')),
  applyLink: z.string().url().optional().or(z.literal('')),
});

export default function PostJobPage() {
  const navigate = useNavigate();
  const [skills, setSkills] = useState([]);
  const [skillInput, setSkillInput] = useState('');
  const [serverError, setServerError] = useState('');

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { jobType: 'fulltime', experienceLevel: 'fresher', openings: 1, applyMethod: 'platform', isDisclosed: true, isRemote: false },
  });

  const applyMethod = watch('applyMethod');
  const isDisclosed = watch('isDisclosed');

  const addSkill = (skill) => {
    const s = skill.trim();
    if (s && !skills.includes(s) && skills.length < 15) {
      setSkills((p) => [...p, s]);
    }
    setSkillInput('');
  };

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const payload = {
        title: data.title,
        description: data.description,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        location: { city: data.city, state: data.state, isRemote: data.isRemote },
        salaryRange: {
          min: data.salaryMin,
          max: data.salaryMax,
          isDisclosed: data.isDisclosed,
        },
        jobType: data.jobType,
        experienceLevel: data.experienceLevel,
        openings: data.openings,
        education: data.education,
        skills,
        applyMethod: data.applyMethod,
        applyEmail: data.applyEmail || undefined,
        applyLink: data.applyLink || undefined,
      };
      const res = await jobsAPI.createJob(payload);
      toast.success('Job posted successfully!');
      navigate(`/jobs/${res.data.job._id}`);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to post job. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
      <h1 className="font-display font-bold text-2xl text-slate-900 mb-1">Post a job</h1>
      <p className="text-slate-500 text-sm mb-8">Fill in the details below. Verified employers get a trust badge on every listing.</p>

      {serverError && <div className="mb-6"><ErrorMessage message={serverError} /></div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8" noValidate>
        {/* Basic info */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-slate-800">Basic information</h2>
          <div>
            <label className="label">Job title *</label>
            <input {...register('title')} className={`input ${errors.title ? 'border-red-300' : ''}`} placeholder="e.g. React Developer, Sales Executive, Accountant" />
            {errors.title && <p className="text-xs text-trust-red mt-1">{errors.title.message}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Job type *</label>
              <select {...register('jobType')} className="input">
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
                <option value="internship">Internship</option>
                <option value="contract">Contract</option>
                <option value="freelance">Freelance</option>
              </select>
            </div>
            <div>
              <label className="label">Experience required</label>
              <select {...register('experienceLevel')} className="input">
                <option value="fresher">Fresher</option>
                <option value="1-2">1–2 years</option>
                <option value="2-5">2–5 years</option>
                <option value="5-10">5–10 years</option>
                <option value="10+">10+ years</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">Number of openings</label>
              <input {...register('openings')} type="number" min="1" max="100" className="input" />
            </div>
            <div>
              <label className="label">Education requirement</label>
              <input {...register('education')} className="input" placeholder="e.g. B.Tech / Any Graduate" />
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-slate-800">Location</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('isRemote')} className="accent-navy-600" />
            <span className="text-sm font-medium text-slate-700">This is a remote role</span>
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label">City</label>
              <input {...register('city')} className="input" placeholder="Jamshedpur" />
            </div>
            <div>
              <label className="label">State</label>
              <input {...register('state')} className="input" placeholder="Jharkhand" />
            </div>
          </div>
        </div>

        {/* Salary */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-slate-800">Salary</h2>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" {...register('isDisclosed')} className="accent-navy-600" />
            <span className="text-sm font-medium text-slate-700">Show salary in listing</span>
          </label>
          {isDisclosed && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Minimum (₹/year)</label>
                <input {...register('salaryMin')} type="number" min="0" className="input" placeholder="300000" />
              </div>
              <div>
                <label className="label">Maximum (₹/year)</label>
                <input {...register('salaryMax')} type="number" min="0" className="input" placeholder="600000" />
              </div>
            </div>
          )}
        </div>

        {/* Description */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-slate-800">Job details</h2>
          <div>
            <label className="label">Job description *</label>
            <textarea {...register('description')} rows={5} className={`input resize-none ${errors.description ? 'border-red-300' : ''}`} placeholder="Describe the role, team, and what a typical day looks like…" />
            {errors.description && <p className="text-xs text-trust-red mt-1">{errors.description.message}</p>}
          </div>
          <div>
            <label className="label">Responsibilities</label>
            <textarea {...register('responsibilities')} rows={4} className="input resize-none" placeholder="Key responsibilities (one per line)…" />
          </div>
          <div>
            <label className="label">Requirements</label>
            <textarea {...register('requirements')} rows={4} className="input resize-none" placeholder="Must-have qualifications and skills…" />
          </div>
        </div>

        {/* Skills */}
        <div className="card p-6">
          <h2 className="font-display font-semibold text-slate-800 mb-4">Required skills</h2>
          <div className="flex flex-wrap gap-2 mb-3">
            {skills.map((s) => (
              <span key={s} className="inline-flex items-center gap-1.5 text-xs font-medium bg-navy-50 text-navy-600 border border-navy-100 px-2.5 py-1 rounded-full">
                {s}
                <button type="button" onClick={() => setSkills(skills.filter((x) => x !== s))} className="hover:text-trust-red">✕</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill(skillInput); } }}
              className="input text-sm"
              placeholder="Type a skill and press Enter"
            />
            <button type="button" onClick={() => addSkill(skillInput)} className="btn-secondary text-sm">Add</button>
          </div>
          <div className="flex flex-wrap gap-2 mt-3">
            {SKILLS_SUGGESTIONS.filter((s) => !skills.includes(s)).map((s) => (
              <button key={s} type="button" onClick={() => addSkill(s)} className="text-xs px-2.5 py-1 rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors">
                + {s}
              </button>
            ))}
          </div>
        </div>

        {/* Apply method */}
        <div className="card p-6 space-y-4">
          <h2 className="font-display font-semibold text-slate-800">How to apply</h2>
          <div className="flex rounded-lg border border-slate-200 p-1">
            {[['platform', 'Via TrustHire'], ['email', 'Email'], ['external', 'External link']].map(([v, l]) => (
              <label key={v} className={`flex-1 text-center py-2 rounded-md text-sm font-medium cursor-pointer transition-colors ${applyMethod === v ? 'bg-navy-600 text-white' : 'text-slate-500 hover:text-slate-700'}`}>
                <input type="radio" value={v} {...register('applyMethod')} className="sr-only" />
                {l}
              </label>
            ))}
          </div>
          {applyMethod === 'email' && (
            <div>
              <label className="label">Application email</label>
              <input {...register('applyEmail')} type="email" className="input" placeholder="hr@yourcompany.com" />
            </div>
          )}
          {applyMethod === 'external' && (
            <div>
              <label className="label">Application URL</label>
              <input {...register('applyLink')} type="url" className="input" placeholder="https://careers.yourcompany.com/apply/..." />
            </div>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
          {isSubmitting ? <><Spinner className="w-4 h-4" /> Posting…</> : <><CheckCircle2 className="w-4 h-4" /> Post job</>}
        </button>
      </form>
    </div>
  );
}
