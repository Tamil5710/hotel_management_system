import pg from 'pg';
import dotenv from 'dotenv';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const { Pool } = pg;
const connectionString = process.env.DATABASE_URL || 'postgresql://bbrex@localhost:5432/stayfinder';

export const pool = new Pool({
  connectionString,
  ssl: process.env.DATABASE_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

export async function initializeDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS hotels (
      id BIGSERIAL PRIMARY KEY,
      title VARCHAR(180) NOT NULL,
      description TEXT NOT NULL,
      city VARCHAR(180) NOT NULL DEFAULT '',
      image_url TEXT NOT NULL DEFAULT '',
      alt_text VARCHAR(250) NOT NULL DEFAULT '',
      latitude DOUBLE PRECISION NOT NULL CHECK (latitude BETWEEN -90 AND 90),
      longitude DOUBLE PRECISION NOT NULL CHECK (longitude BETWEEN -180 AND 180),
      price NUMERIC(12,2) NOT NULL CHECK (price > 0),
      rating NUMERIC(2,1) NOT NULL DEFAULT 4.5 CHECK (rating BETWEEN 0 AND 5),
      reviews_count INTEGER NOT NULL DEFAULT 1 CHECK (reviews_count >= 0),
      original_price NUMERIC(12,2),
      amenities JSONB NOT NULL DEFAULT '[]'::jsonb,
      featured BOOLEAN NOT NULL DEFAULT false,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
    CREATE INDEX IF NOT EXISTS hotels_title_idx ON hotels (LOWER(title));
    CREATE INDEX IF NOT EXISTS hotels_city_idx ON hotels (LOWER(city));
    CREATE INDEX IF NOT EXISTS hotels_price_idx ON hotels (price);
  `);
}
