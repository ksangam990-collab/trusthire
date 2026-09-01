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

if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'trusthire_dev_super_secret_jwt_key_2026';
  console.warn('[Security Warning] JWT_SECRET not provided. Using development fallback secret.');
}

if (!process.env.JWT_REFRESH_SECRET) {
  process.env.JWT_REFRESH_SECRET = 'trusthire_dev_refresh_secret_key_2026';
  console.warn('[Security Warning] JWT_REFRESH_SECRET not provided. Using development fallback secret.');
}

connectDB();

const app = express();

app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps, curl) or any vercel/localhost/configured origin
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      origin.endsWith('.vercel.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1') ||
      process.env.NODE_ENV !== 'production'
    ) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));

app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use('/api', apiLimiter);

app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'TrustHire Core API'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/fraud', fraudRoutes);
app.use('/api/profile', profileRoutes);

app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Endpoint ${req.originalUrl} not found on TrustHire server.`
  });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`[TrustHire API] Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error('[TrustHire API] Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

export default app;