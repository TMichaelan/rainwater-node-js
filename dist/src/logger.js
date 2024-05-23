"use strict";
// import winston from 'winston';
//
// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.json(),
//     transports: [
//         new winston.transports.Console(),
//         new winston.transports.File({ filename: 'combined.log' }),
//     ],
// });
//
// export default logger;
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    level: 'info',
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.printf(({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`)),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'combined.log' }),
    ],
});
exports.default = logger;