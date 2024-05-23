import { Client } from 'pg';
import { getCache, setCache } from '../src/cache';
import logger from '../src/logger';

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

jest.mock('../src/logger', () => {
  return {
    error: jest.fn(),
    info: jest.fn(),
  };
});

const client = new Client() as any;

describe('Cache logging', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should log cache hit', async () => {
    client.query.mockResolvedValueOnce({ rows: [{ volume: 8 }] });
    const volume = await getCache('[4,1,1,0,2,3]');
    expect(volume).toBe(8);
    expect(client.query).toHaveBeenCalledWith(
      "SELECT volume FROM cache WHERE heights = $1 AND created_at > NOW() - INTERVAL '1 minute'",
      ['[4,1,1,0,2,3]']
    );
    expect(logger.info).toHaveBeenCalledWith('Cache hit for heights: [4,1,1,0,2,3]');
  });

  it('should log cache miss', async () => {
    client.query.mockResolvedValueOnce({ rows: [] });
    const volume = await getCache('[4,1,1,0,2,3]');
    expect(volume).toBeNull();
    expect(client.query).toHaveBeenCalledWith(
      "SELECT volume FROM cache WHERE heights = $1 AND created_at > NOW() - INTERVAL '1 minute'",
      ['[4,1,1,0,2,3]']
    );
    expect(logger.info).toHaveBeenCalledWith('Cache miss for heights: [4,1,1,0,2,3]');
  });

  it('should log error when querying cache', async () => {
    const error = new Error('Query failed');
    client.query.mockRejectedValueOnce(error);
    await expect(getCache('[4,1,1,0,2,3]')).rejects.toThrow('Query failed');
    expect(logger.error).toHaveBeenCalledWith(`Error querying cache: ${error}`);
  });

  it('should log when setting cache', async () => {
    client.query.mockResolvedValueOnce({ rows: [] });
    await setCache('[4,1,1,0,2,3]', 8);
    expect(client.query).toHaveBeenCalledWith(
      'INSERT INTO cache (heights, volume, created_at) VALUES ($1, $2, NOW())',
      ['[4,1,1,0,2,3]', 8]
    );
    expect(logger.info).toHaveBeenCalledWith('Cache set for heights: [4,1,1,0,2,3], volume: 8');
  });

  it('should log error when setting cache', async () => {
    const error = new Error('Insert failed');
    client.query.mockRejectedValueOnce(error);
    await expect(setCache('[4,1,1,0,2,3]', 8)).rejects.toThrow('Insert failed');
    expect(logger.error).toHaveBeenCalledWith(`Error setting cache: ${error}`);
  });
});
