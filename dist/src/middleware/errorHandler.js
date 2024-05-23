"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("../logger"));
function errorHandler(err, req, res, _next) {
    const statusCode = err.status || 500;
    logger_1.default.error(`Error: ${err.message}, Status Code: ${statusCode}`);
    res.status(statusCode).json({
        error: statusCode === 500 ? 'Internal Server Error' : err.message,
    });
}
exports.default = errorHandler;
