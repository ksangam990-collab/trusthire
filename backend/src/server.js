require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// ── Route imports ─────────────────────────────────────────────────────────────
const authRoutes = require('./routes/auth');
const employerRoutes = require('./routes/employers');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const fraudRoutes = require('./routes/fraud');
const profileRoutes = require('./routes/profile');

const app = express();

// Trust proxy — required for rate limiting behind Render/Vercel
app.set("trust proxy", 1);

// ── Connect to MongoDB ────────────────────────────────────────────────────────
connectDB();

// ── Security middleware ───────────────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// ── General middleware ────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// ── Rate limiting (global) ────────────────────────────────────────────────────
app.use('/api', apiLimiter);

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// ── API Routes ────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/employers', employerRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/fraud-reports', fraudRoutes);
app.use('/api/profile', profileRoutes);

// ── 404 + Error handling ──────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start server ──────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 TrustHire API running on port ${PORT} (${process.env.NODE_ENV})`);
});

// Graceful shutdown
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Promise Rejection:', err.message);
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Server closed gracefully');
    process.exit(0);
  });
});

module.exports = app;
