import { Client } from 'pg';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || '5432', 10),
});

if (process.env.NODE_ENV !== 'test') {
  client
    .connect()
    .catch((error) => logger.error(`Database connection error: ${error}`));
}

export async function getCache(heights: string): Promise<number | null> {
  try {
    const res = await client.query(
      "SELECT volume FROM cache WHERE heights = $1 AND created_at > NOW() - INTERVAL '1 minute'",
      [heights],
    );
    if (res.rows.length > 0) {
      logger.info(`Cache hit for heights: ${heights}`);
      return res.rows[0].volume;
    } else {
      logger.info(`Cache miss for heights: ${heights}`);
      return null;
    }
  } catch (error) {
    logger.error(`Error querying cache: ${error}`);
    throw error;
  }
}

export async function setCache(heights: string, volume: number): Promise<void> {
  try {
    await client.query(
      'INSERT INTO cache (heights, volume, created_at) VALUES ($1, $2, NOW())',
      [heights, volume],
    );
    logger.info(`Cache set for heights: ${heights}, volume: ${volume}`);
  } catch (error) {
    logger.error(`Error setting cache: ${error}`);
    throw error;
  }
}
