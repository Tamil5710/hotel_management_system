import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { initializeDatabase, pool } from './db.js';
import { seedDatabase } from './seed.js';
import hotelsRouter from './routes/hotels.js';
import uploadsRouter from './routes/uploads.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const port = Number(process.env.PORT) || 5001;
const uploadsDir = path.resolve(__dirname, '../uploads');

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: (process.env.CLIENT_ORIGIN || 'http://localhost:5173').split(',').map(v => v.trim()) }));
app.use(express.json({ limit: '10mb' }));
app.use(morgan('dev'));
app.use('/uploads', express.static(uploadsDir));

app.get('/api/health', async (req, res, next) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok', database: 'connected' });
  } catch (err) {
    next(err);
  }
});

// Seed/Reset database with dummy hotel records
app.post('/api/hotels/reset', async (req, res, next) => {
  try {
    await seedDatabase(true);
    res.json({ message: 'Hotels reset to default sample records in PostgreSQL.' });
  } catch (err) {
    next(err);
  }
});

app.use('/api/hotels', hotelsRouter);
app.use('/api/uploads', uploadsRouter);
app.use(notFound);
app.use(errorHandler);

initializeDatabase()
  .then(() => seedDatabase(false))
  .then(() => app.listen(port, () => console.log(`StayFinder API running at http://localhost:${port}`)))
  .catch((err) => {
    console.error('Database initialization failed:', err.message);
    process.exit(1);
  });

process.on('SIGINT', async () => { await pool.end(); process.exit(0); });
process.on('SIGTERM', async () => { await pool.end(); process.exit(0); });
