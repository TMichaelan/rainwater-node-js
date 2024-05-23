import express from 'express';
import { trapRainWater } from './algorithm';
import logger from './logger';
import { getCache, setCache } from './cache';
import errorHandler from './middleware/errorHandler';
import { connectToDatabase } from './db';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/calculate-water', async (req, res, next) => {
  const { heights } = req.body;

  if (!Array.isArray(heights)) {
    return res
      .status(400)
      .json({ error: 'Invalid input, heights must be an array of numbers.' });
  }

  const heightsStr = JSON.stringify(heights);

  logger.info(`Request received: ${heightsStr}`);

  try {
    const cachedVolume = await getCache(heightsStr);

    if (cachedVolume !== null) {
      logger.info(`Cache hit: ${heightsStr}`);
      return res.json({ volume: cachedVolume });
    }

    const volume = trapRainWater(heights);
    await setCache(heightsStr, volume);
    logger.info(`Cache miss: ${heightsStr}`);

    res.json({ volume });
  } catch (error) {
    logger.error(`Error processing request: ${error}`);
    next(error);
  }
});

app.use(errorHandler);

app.listen(PORT, async () => {
  await connectToDatabase();
  console.log(`Server running on port ${PORT}`);
});
