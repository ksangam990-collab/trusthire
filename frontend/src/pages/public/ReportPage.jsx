import { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { AlertTriangle, DollarSign, Ghost, ShieldOff, Mic, FileX, HelpCircle, Upload, CheckCircle2 } from 'lucide-react';
import { fraudAPI } from '../../api';
import { Spinner, ErrorMessage } from '../../components/ui';
import toast from 'react-hot-toast';

const REPORT_TYPES = [
  { value: 'asked_for_money', label: 'Asked for fees / money', icon: DollarSign, desc: 'They asked you to pay a registration, training, or processing fee.' },
  { value: 'fake_company', label: 'Fake or non-existent company', icon: Ghost, desc: "The company doesn't actually exist or the address is fake." },
  { value: 'identity_impersonation', label: 'Impersonating a real company', icon: ShieldOff, desc: 'They pretended to be a known company (e.g. TCS, Infosys).' },
  { value: 'scam_interview', label: 'Scam interview', icon: Mic, desc: 'The interview was fake or designed to extract money or personal info.' },
  { value: 'misleading_job', label: 'Misleading job description', icon: FileX, desc: "The actual role was completely different from what was advertised." },
  { value: 'other', label: 'Other concern', icon: HelpCircle, desc: 'Something else suspicious happened.' },
];

const schema = z.object({
  employerId: z.string().min(1, 'Employer ID is required'),
  reportType: z.enum(['asked_for_money', 'fake_company', 'identity_impersonation', 'scam_interview', 'misleading_job', 'other']),
  description: z.string().min(50, 'Please describe what happened (min 50 characters)').max(2000),
  isAnonymous: z.boolean().default(false),
});

export default function ReportPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState('');
  const [files, setFiles] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      employerId: searchParams.get('employerId') || '',
      jobId: searchParams.get('jobId') || '',
      isAnonymous: false,
    },
  });

  const isAnonymous = watch('isAnonymous');

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([k, v]) => formData.append(k, v));
      if (searchParams.get('jobId')) formData.append('jobId', searchParams.get('jobId'));
      files.forEach((f) => formData.append('evidence', f));

      await fraudAPI.submitReport(formData);
      setSubmitted(true);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to submit report. Try again.');
    }
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files).slice(0, 3 - files.length);
    setFiles((prev) => [...prev, ...newFiles].slice(0, 3));
  };

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-trust-green" />
        </div>
        <h2 className="font-display font-bold text-2xl text-slate-900 mb-2">Report submitted</h2>
        <p className="text-slate-500 mb-6">
          Thank you. Your report has been logged and will be reviewed. If 3 or more people report
          the same issue, the listing is suspended automatically.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/jobs" className="btn-primary">Browse safe jobs</Link>
          <Link to="/fraud-board" className="btn-secondary">View fraud board</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 bg-red-100 rounded-lg flex items-center justify-center">
          <AlertTriangle className="w-5 h-5 text-trust-red" />
        </div>
        <div>
          <h1 className="font-display font-bold text-2xl text-slate-900">Report a fraudulent job</h1>
          <p className="text-sm text-slate-500">Your report helps protect thousands of job seekers.</p>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 mb-6 text-sm text-amber-800">
        <strong>Never pay money to get a job.</strong> Legitimate employers do not charge candidates
        any fee at any stage of hiring.
      </div>

      {serverError && <div className="mb-5"><ErrorMessage message={serverError} /></div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Employer ID */}
        <div>
          <label className="label">Employer ID</label>
          <input {...register('employerId')} className={`input font-mono text-sm ${errors.employerId ? 'border-red-300' : ''}`} placeholder="Paste employer ID from the job listing" />
          {errors.employerId && <p className="text-xs text-trust-red mt-1">{errors.employerId.message}</p>}
          <p className="text-xs text-slate-400 mt-1">
            Find this on the job detail page.{' '}
            <Link to="/jobs" className="underline">Browse jobs</Link>
          </p>
        </div>

        {/* Report type */}
        <div>
          <p className="label">What happened?</p>
          <div className="space-y-2">
            {REPORT_TYPES.map(({ value, label, icon: Icon, desc }) => (
              <label
                key={value}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedType === value
                    ? 'border-navy-400 bg-navy-50'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  value={value}
                  {...register('reportType')}
                  onChange={() => { setSelectedType(value); setValue('reportType', value); }}
                  className="mt-1 accent-navy-600 flex-shrink-0"
                />
                <div>
                  <p className="text-sm font-medium text-slate-800 flex items-center gap-1.5">
                    <Icon className="w-4 h-4 text-slate-500" /> {label}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
                </div>
              </label>
            ))}
          </div>
          {errors.reportType && <p className="text-xs text-trust-red mt-1">Please select a report type.</p>}
        </div>

        {/* Description */}
        <div>
          <label className="label">What exactly happened?</label>
          <textarea
            {...register('description')}
            rows={5}
            className={`input resize-none ${errors.description ? 'border-red-300' : ''}`}
            placeholder="Describe what happened in detail. e.g. I applied for the role on 15 Jan, received a call from 9876543210, was told I was selected and asked to pay ₹1,500 for ID card processing…"
          />
          {errors.description && <p className="text-xs text-trust-red mt-1">{errors.description.message}</p>}
        </div>

        {/* Evidence upload */}
        <div>
          <p className="label">Upload evidence (optional)</p>
          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-xl px-4 py-6 cursor-pointer hover:border-navy-300 hover:bg-navy-50 transition-colors">
            <Upload className="w-6 h-6 text-slate-400 mb-2" />
            <p className="text-sm font-medium text-slate-600">Click to upload screenshots</p>
            <p className="text-xs text-slate-400 mt-1">JPEG, PNG or PDF · Max 5MB each · Up to 3 files</p>
            <input type="file" multiple accept="image/jpeg,image/png,application/pdf" onChange={handleFileChange} className="hidden" />
          </label>
          {files.length > 0 && (
            <ul className="mt-2 space-y-1">
              {files.map((f, i) => (
                <li key={i} className="text-xs text-slate-600 flex items-center justify-between bg-slate-50 px-3 py-1.5 rounded-lg">
                  <span className="truncate">{f.name}</span>
                  <button type="button" onClick={() => setFiles((prev) => prev.filter((_, j) => j !== i))} className="text-slate-400 hover:text-trust-red ml-2 flex-shrink-0">✕</button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Anonymous toggle */}
        <label className="flex items-start gap-3 cursor-pointer">
          <input type="checkbox" {...register('isAnonymous')} className="mt-1 accent-navy-600" />
          <div>
            <p className="text-sm font-medium text-slate-700">Submit anonymously</p>
            <p className="text-xs text-slate-400">Your name and email will never appear in the public report.</p>
          </div>
        </label>

        <button type="submit" disabled={isSubmitting} className="btn-danger w-full flex items-center justify-center gap-2">
          {isSubmitting && <Spinner className="w-4 h-4" />}
          {isSubmitting ? 'Submitting…' : 'Submit fraud report'}
        </button>
      </form>
    </div>
  );
}
