import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import useAuthStore from '../../store/authStore';
import { ErrorMessage, Spinner } from '../../components/ui';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});

export default function LoginPage() {
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      const { user } = await login(data);
      toast.success(`Welcome back, ${user.name.split(' ')[0]}!`);
      // Redirect based on role
      if (user.role === 'employer') navigate('/employer/dashboard', { replace: true });
      else if (user.role === 'admin') navigate('/admin', { replace: true });
      else navigate(from !== '/login' ? from : '/dashboard', { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-9 h-9 bg-navy-600 rounded-lg flex items-center justify-center">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-navy-600 text-xl">TrustHire</span>
        </Link>

        <div className="card p-8">
          <h1 className="font-display font-bold text-2xl text-slate-900 mb-1 text-center">
            Log in
          </h1>
          <p className="text-sm text-slate-500 text-center mb-7">
            Don't have an account?{' '}
            <Link to="/register" className="text-navy-600 font-medium hover:underline">
              Get started free
            </Link>
          </p>

          {serverError && (
            <div className="mb-5">
              <ErrorMessage message={serverError} />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <div>
              <label className="label">Email address</label>
              <input
                {...register('email')}
                type="email"
                className={`input ${errors.email ? 'border-red-300 focus:ring-red-300' : ''}`}
                placeholder="you@example.com"
                autoComplete="email"
              />
              {errors.email && (
                <p className="text-xs text-trust-red mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="label mb-0">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-navy-600 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPass ? 'text' : 'password'}
                  className={`input pr-10 ${errors.password ? 'border-red-300 focus:ring-red-300' : ''}`}
                  placeholder="••••••••"
                  autoComplete="current-password"
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
              {isSubmitting ? <Spinner className="w-4 h-4" /> : null}
              {isSubmitting ? 'Logging in…' : 'Log in'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
