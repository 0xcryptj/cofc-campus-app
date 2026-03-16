import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

import postsRouter from './routes/posts';
import reportsRouter from './routes/reports';
import adminRouter from './routes/admin';

const app = express();
const PORT = parseInt(process.env.PORT || '4000', 10);

// ── Security / parsing middleware ────────────────────────────
app.use(helmet({ contentSecurityPolicy: false })); // CSP off so admin SPA assets load
app.use(cors({
  origin: process.env.NODE_ENV === 'production'
    ? false  // same-origin in prod (admin served from express)
    : ['http://localhost:5173', 'http://localhost:8081'],
  credentials: true,
}));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// ── API Routes ───────────────────────────────────────────────
app.use('/api/posts', postsRouter);
app.use('/api/reports', reportsRouter);
app.use('/api/admin', adminRouter);

// ── Health check ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

// ── Serve admin SPA in production ───────────────────────────
const adminDist = path.resolve(__dirname, '../../admin/dist');
app.use(express.static(adminDist));
app.get(/^\/(?!api).*/, (_req, res) => {
  res.sendFile(path.join(adminDist, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`CofC backend running on http://localhost:${PORT}`);
});

export default app;
