import { Client } from 'pg';
import { connectToDatabase } from '../src/db';
import logger from '../src/logger';

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

jest.mock('../src/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
}));

const client = new Client();

describe('Database connection', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should connect to the database when not in test environment', async () => {
    process.env.NODE_ENV = 'development';
    await connectToDatabase();
    expect(client.connect).toHaveBeenCalled();
    expect(logger.info).toHaveBeenCalledWith('Connected to the database');
  });

  it('should not connect to the database when in test environment', async () => {
    process.env.NODE_ENV = 'test';
    await connectToDatabase();
    expect(client.connect).not.toHaveBeenCalled();
  });

  it('should log an error if the database connection fails', async () => {
    const error = new Error('Connection failed');
    (client.connect as jest.Mock).mockRejectedValueOnce(error);
    process.env.NODE_ENV = 'development';
    await connectToDatabase();
    expect(logger.error).toHaveBeenCalledWith(`Database connection error: ${error}`);
  });
});
