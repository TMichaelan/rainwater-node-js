import express from 'express';
import { trapRainWater } from './algorithm';
import logger from './logger';
import { getCache, setCache } from './cache';

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.post('/calculate-water', async (req, res) => {
    const { heights } = req.body;
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
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
