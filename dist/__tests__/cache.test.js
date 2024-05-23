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
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const cache_1 = require("../src/cache");
jest.mock('pg', () => {
    const mClient = {
        connect: jest.fn(),
        query: jest.fn(),
        end: jest.fn(),
    };
    return { Client: jest.fn(() => mClient) };
});
const client = new pg_1.Client();
describe('Cache', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should get cache', () => __awaiter(void 0, void 0, void 0, function* () {
        client.query.mockResolvedValueOnce({ rows: [{ volume: 8 }] });
        const volume = yield (0, cache_1.getCache)('[4,1,1,0,2,3]');
        expect(volume).toBe(8);
        expect(client.query).toHaveBeenCalledWith('SELECT volume FROM cache WHERE heights = $1 AND created_at > NOW() - INTERVAL \'1 minute\'', ['[4,1,1,0,2,3]']);
    }));
    it('should set cache', () => __awaiter(void 0, void 0, void 0, function* () {
        client.query.mockResolvedValueOnce({ rows: [] });
        yield (0, cache_1.setCache)('[4,1,1,0,2,3]', 8);
        expect(client.query).toHaveBeenCalledWith('INSERT INTO cache (heights, volume, created_at) VALUES ($1, $2, NOW())', ['[4,1,1,0,2,3]', 8]);
    }));
});
