const express   = require('express');
const cors      = require('cors');
const helmet    = require('helmet');
const morgan    = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const { initDatabase } = require('./config/database');
const routes           = require('./routes/index');

const app  = express();
const PORT = process.env.PORT || 5000;

/* ─────────────── Security Headers ─────────────── */
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));

/* ─────────────── CORS ─────────────── */
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001'
).split(',').map(o => o.trim());

app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
    return cb(new Error(`CORS: origin '${origin}' not allowed`));
  },
  credentials: true,
}));

/* ─────────────── Body Parsing ─────────────── */
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

/* ─────────────── HTTP Logging ─────────────── */
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
}

/* ─────────────── Rate Limiters ─────────────── */
// Global: 300 req / 15 min
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
}));

// Auth: 20 attempts / 15 min
app.use('/api/auth/login', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many login attempts. Try again in 15 minutes.' },
}));

// Contact form: 5 submissions / hour
app.use('/api/contact', rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { success: false, message: 'Too many messages sent. Try again in an hour.' },
}));

/* ─────────────── Health Check ─────────────── */
app.get('/health', (_req, res) => res.json({
  status : 'ok',
  message: 'Alona Web API is running 🚀',
  env    : process.env.NODE_ENV || 'development',
  uptime : `${Math.floor(process.uptime())}s`,
  time   : new Date().toISOString(),
}));

/* ─────────────── API Routes ─────────────── */
app.use('/api', routes);

/* ─────────────── 404 ─────────────── */
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.path} not found.` });
});

/* ─────────────── Global Error Handler ─────────────── */
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err.stack || err.message);
  const status  = err.status || err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Internal server error.'
    : (err.message || 'Internal server error.');
  res.status(status).json({ success: false, message });
});

/* ─────────────── Start ─────────────── */
const start = async () => {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`\n🚀  Backend  →  http://localhost:${PORT}`);
    console.log(`📡  API      →  http://localhost:${PORT}/api`);
    console.log(`💚  Health   →  http://localhost:${PORT}/health`);
    console.log(`🌍  Env      →  ${process.env.NODE_ENV || 'development'}\n`);
  });
};

start();
