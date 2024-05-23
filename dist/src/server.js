"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const algorithm_1 = require("./algorithm");
const logger_1 = __importDefault(require("./logger"));
const cache_1 = require("./cache");
const errorHandler_1 = __importDefault(require("./middleware/errorHandler"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
app.post('/calculate-water', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { heights } = req.body;
    if (!Array.isArray(heights) ||
        !heights.every((num) => typeof num === 'number')) {
        return res
            .status(400)
            .json({ error: 'Invalid input, heights must be an array of numbers.' });
    }
    const heightsStr = JSON.stringify(heights);
    logger_1.default.info(`Request received: ${heightsStr}`);
    try {
        const cachedVolume = yield (0, cache_1.getCache)(heightsStr);
        if (cachedVolume !== null) {
            logger_1.default.info(`Cache hit: ${heightsStr}`);
            return res.json({ volume: cachedVolume });
        }
        const volume = (0, algorithm_1.trapRainWater)(heights);
        yield (0, cache_1.setCache)(heightsStr, volume);
        logger_1.default.info(`Cache miss: ${heightsStr}`);
        res.json({ volume });
    }
    catch (error) {
        logger_1.default.error(`Error processing request: ${error}`);
        next(error);
    }
}));
app.use(errorHandler_1.default);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
