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

export const connectToDatabase = async () => {
  if (process.env.NODE_ENV !== 'test') {
    try {
      await client.connect();
      logger.info('Connected to the database');
    } catch (error) {
      logger.error(`Database connection error: ${error}`);
    }
  }
};

export default client;
