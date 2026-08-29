import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, Eye, EyeOff, User, Briefcase } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { ErrorMessage, Spinner } from '../../components/ui';
import toast from 'react-hot-toast';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain an uppercase letter')
    .regex(/[0-9]/, 'Must contain a number'),
  role: z.enum(['jobseeker', 'employer']),
  companyName: z.string().optional(),
}).refine(
  (d) => d.role !== 'employer' || (d.companyName && d.companyName.length >= 2),
  { message: 'Company name is required', path: ['companyName'] }
);

export default function RegisterPage() {
  const [searchParams] = useSearchParams();
  const defaultRole = searchParams.get('role') === 'employer' ? 'employer' : 'jobseeker';
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState('');
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: defaultRole },
  });

  const role = watch('role');

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const { user } = await registerUser(data);
      toast.success('Account created! Check your email to verify.');
      if (user.role === 'employer') navigate('/employer/dashboard');
      else navigate('/dashboard');
    } catch (err) {
      setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-navy-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-navy-600 text-xl">TrustHire</span>
        </Link>

        <div className="card p-8">
          <h1 className="font-display font-bold text-2xl text-slate-900 mb-1 text-center">
            Create your account
          </h1>
          <p className="text-sm text-slate-500 text-center mb-6">
            Already have an account?{' '}
            <Link to="/login" className="text-navy-600 font-medium hover:underline">
              Log in
            </Link>
          </p>

          {/* Role toggle */}
          <div className="flex rounded-lg border border-slate-200 p-1 mb-6">
            <button
              type="button"
              onClick={() => setValue('role', 'jobseeker')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                role === 'jobseeker'
                  ? 'bg-navy-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="w-4 h-4" />
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setValue('role', 'employer')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium transition-colors ${
                role === 'employer'
                  ? 'bg-navy-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              Employer
            </button>
          </div>

          {serverError && (
            <div className="mb-5">
              <ErrorMessage message={serverError} />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="label">Full name</label>
              <input
                {...register('name')}
                type="text"
                className={`input ${errors.name ? 'border-red-300' : ''}`}
                placeholder="Sangam Kumar"
                autoComplete="name"
              />
              {errors.name && <p className="text-xs text-trust-red mt-1">{errors.name.message}</p>}
            </div>

            {role === 'employer' && (
              <div>
                <label className="label">Company name</label>
                <input
                  {...register('companyName')}
                  type="text"
                  className={`input ${errors.companyName ? 'border-red-300' : ''}`}
                  placeholder="Your Company Pvt Ltd"
                />
                {errors.companyName && (
                  <p className="text-xs text-trust-red mt-1">{errors.companyName.message}</p>
                )}
              </div>
            )}

            <div>
              <label className="label">Email address</label>
              <input
                {...register('email')}
                type="email"
                className={`input ${errors.email ? 'border-red-300' : ''}`}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && <p className="text-xs text-trust-red mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  className={`input pr-10 ${errors.password ? 'border-red-300' : ''}`}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-trust-red mt-1">{errors.password.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-2"
            >
              {isSubmitting && <Spinner className="w-4 h-4" />}
              {isSubmitting ? 'Creating account…' : 'Create account'}
            </button>

            <p className="text-xs text-slate-400 text-center">
              By creating an account, you agree that TrustHire is free for job seekers and that
              employers never ask for payment from candidates.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
