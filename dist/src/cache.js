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
exports.setCache = exports.getCache = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const logger_1 = __importDefault(require("./logger"));
dotenv_1.default.config();
const client = new pg_1.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD),
    port: parseInt(process.env.DB_PORT || '5432'),
});
if (process.env.NODE_ENV !== 'test') {
    client
        .connect()
        .catch((error) => logger_1.default.error(`Database connection error: ${error}`));
}
function getCache(heights) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield client.query("SELECT volume FROM cache WHERE heights = $1 AND created_at > NOW() - INTERVAL '1 minute'", [heights]);
            if (res.rows.length > 0) {
                logger_1.default.info(`Cache hit for heights: ${heights}`);
                return res.rows[0].volume;
            }
            else {
                logger_1.default.info(`Cache miss for heights: ${heights}`);
                return null;
            }
        }
        catch (error) {
            logger_1.default.error(`Error querying cache: ${error}`);
            throw error;
        }
    });
}
exports.getCache = getCache;
function setCache(heights, volume) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield client.query('INSERT INTO cache (heights, volume, created_at) VALUES ($1, $2, NOW())', [heights, volume]);
            logger_1.default.info(`Cache set for heights: ${heights}, volume: ${volume}`);
        }
        catch (error) {
            logger_1.default.error(`Error setting cache: ${error}`);
            throw error;
        }
    });
}
exports.setCache = setCache;
