import client from './db';
import logger from './logger';

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
