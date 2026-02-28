require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const authRouter = require('./routes/auth');
const optimizeRouter = require('./routes/optimize');
const historyRouter = require('./routes/history');
const mongoose = require('mongoose');

const app = express();

// ─── Database ─────────────────────────────────────────────────────────────────
if (process.env.MONGODB_URI) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB'))
    .catch(err => console.error('❌ MongoDB connection error:', err.message));
} else {
  console.warn('⚠️ MONGODB_URI not set. Please add it to .env');
}


// ─── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, 'http://localhost:5173']
  : ['http://localhost:5173'];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));

// ─── Security Headers ─────────────────────────────────────────────────────────
app.use(helmet());

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10kb' })); // Restrict payload body size to prevent DOS
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// ─── Data Sanitization ────────────────────────────────────────────────────────
// Data sanitization against NoSQL query injection
// Removed express-mongo-sanitize middleware due to Express 5 compatibility issue

// Data sanitization against XSS
// Removed xss-clean middleware due to Express 5 compatibility issue

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// Global rate limiting
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { error: 'Too many requests from this IP, please try again in an hour.' },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use('/api/', globalLimiter);

// Stricter limiter for sensitive auth routes
const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10, // Limit each IP to 10 auth requests per hour
  message: { error: 'Too many login attempts from this IP, please try again in an hour.' },
});
app.use('/api/auth', authLimiter);

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRouter);
app.use('/api/optimize', optimizeRouter);
app.use('/api/history', historyRouter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// ─── Global Error Handler ────────────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('[Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅ ResumeMatch AI Backend running on port ${PORT}`));
// Ready
