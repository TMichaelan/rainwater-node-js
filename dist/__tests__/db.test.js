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
const pg_1 = require("pg");
const db_1 = require("../src/db");
const logger_1 = __importDefault(require("../src/logger"));
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
const client = new pg_1.Client();
describe('Database connection', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should connect to the database when not in test environment', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.NODE_ENV = 'development';
        yield (0, db_1.connectToDatabase)();
        expect(client.connect).toHaveBeenCalled();
        expect(logger_1.default.info).toHaveBeenCalledWith('Connected to the database');
    }));
    it('should not connect to the database when in test environment', () => __awaiter(void 0, void 0, void 0, function* () {
        process.env.NODE_ENV = 'test';
        yield (0, db_1.connectToDatabase)();
        expect(client.connect).not.toHaveBeenCalled();
    }));
    it('should log an error if the database connection fails', () => __awaiter(void 0, void 0, void 0, function* () {
        const error = new Error('Connection failed');
        client.connect.mockRejectedValueOnce(error);
        process.env.NODE_ENV = 'development';
        yield (0, db_1.connectToDatabase)();
        expect(logger_1.default.error).toHaveBeenCalledWith(`Database connection error: ${error}`);
    }));
});
