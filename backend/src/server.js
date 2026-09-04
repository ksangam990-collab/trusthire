import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import errorHandler from './middleware/errorHandler.js';

import authRoutes from './routes/auth.js';
import jobRoutes from './routes/jobs.js';
import employerRoutes from './routes/employers.js';
import applicationRoutes from './routes/applications.js';
import fraudRoutes from './routes/fraud.js';
import profileRoutes from './routes/profile.js';

dotenv.config();

// ─── Mandatory secret validation ──────────────────────────────────────────────
// In production both secrets MUST be real, long, random values.
// We refuse to start in production without them — a known fallback secret
// would let any attacker forge arbitrary JWTs.
if (!process.env.JWT_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('[FATAL] JWT_SECRET environment variable is not set. Cannot start in production without it.');
    process.exit(1);
  }
  process.env.JWT_SECRET = 'trusthire_dev_fallback_jwt_NOT_FOR_PRODUCTION';
  console.warn('[Security] JWT_SECRET not set — using dev fallback. Set a real secret in .env before deploying.');
}

if (!process.env.JWT_REFRESH_SECRET) {
  if (process.env.NODE_ENV === 'production') {
    console.error('[FATAL] JWT_REFRESH_SECRET environment variable is not set. Cannot start in production without it.');
    process.exit(1);
  }
  process.env.JWT_REFRESH_SECRET = 'trusthire_dev_fallback_refresh_NOT_FOR_PRODUCTION';
  console.warn('[Security] JWT_REFRESH_SECRET not set — using dev fallback. Set a real secret in .env before deploying.');
}

connectDB();

const app = express();

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

// ─── CORS ─────────────────────────────────────────────────────────────────────
// FIX (HIGH): Removed origin.endsWith('.vercel.app') wildcard.
// Any attacker can host on *.vercel.app and make credentialed cross-origin
// requests with the victim's cookies. Now only explicitly listed origins are
// allowed in production.
const buildAllowedOrigins = () => {
  const set = new Set([
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
  ]);
  if (process.env.FRONTEND_URL) set.add(process.env.FRONTEND_URL.replace(/\/$/, ''));
  if (process.env.CLIENT_URL)   set.add(process.env.CLIENT_URL.replace(/\/$/, ''));
  // Support comma-separated preview / staging URLs in one env var
  if (process.env.EXTRA_ALLOWED_ORIGINS) {
    process.env.EXTRA_ALLOWED_ORIGINS.split(',').forEach(o => {
      const t = o.trim().replace(/\/$/, '');
      if (t) set.add(t);
    });
  }
  return set;
};

const allowedOrigins = buildAllowedOrigins();

app.set('trust proxy', 1);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // same-origin / server-to-server
    if (allowedOrigins.has(origin)) return callback(null, true);
    // In non-production allow localhost variants for convenience
    if (process.env.NODE_ENV !== 'production' &&
        (origin.includes('localhost') || origin.includes('127.0.0.1'))) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
}));

app.use(cookieParser());
// FIX (LOW): Reduced body limit from 10 MB to 2 MB.
// A 10 MB JSON limit is an easy low-cost DoS vector — a single request can
// allocate ~10 MB of memory before any route handler runs.
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

app.use('/api', apiLimiter);

app.get('/', (_req, res) => res.status(200).json({ success: true, message: 'TrustHire API is healthy.', version: '1.0.0' }));
app.get('/health', (_req, res) => res.status(200).json({ success: true, status: 'healthy', timestamp: new Date().toISOString() }));

app.use('/api/auth',         authRoutes);
app.use('/api/jobs',         jobRoutes);
app.use('/api/employers',    employerRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/fraud',        fraudRoutes);
app.use('/api/profile',      profileRoutes);

// FIX (LOW): Removed req.originalUrl from 404 body — leaks internal path structure
// and could be used to probe the API surface or smuggle information via URL.
app.use('*', (_req, res) => {
  res.status(404).json({ success: false, message: 'The requested endpoint was not found.' });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[TrustHire API] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('[TrustHire API] Unhandled Rejection:', err.message || err);
  server.close(() => process.exit(1));
});

export default app;
