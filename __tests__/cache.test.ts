import { Client } from 'pg';
import { getCache, setCache } from '../src/cache';

jest.mock('pg', () => {
  const mClient = {
    connect: jest.fn(),
    query: jest.fn(),
    end: jest.fn(),
  };
  return { Client: jest.fn(() => mClient) };
});

const client = new Client() as any;

describe('Cache', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get cache', async () => {
    client.query.mockResolvedValueOnce({ rows: [{ volume: 8 }] });
    const volume = await getCache('[4,1,1,0,2,3]');
    expect(volume).toBe(8);
    expect(client.query).toHaveBeenCalledWith(
      'SELECT volume FROM cache WHERE heights = $1 AND created_at > NOW() - INTERVAL \'1 minute\'',
      ['[4,1,1,0,2,3]']
    );
  });

  it('should set cache', async () => {
    client.query.mockResolvedValueOnce({ rows: [] });
    await setCache('[4,1,1,0,2,3]', 8);
    expect(client.query).toHaveBeenCalledWith(
      'INSERT INTO cache (heights, volume, created_at) VALUES ($1, $2, NOW())',
      ['[4,1,1,0,2,3]', 8]
    );
  });
});
