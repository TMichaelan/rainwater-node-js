"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const algorithm_1 = require("../src/algorithm");
describe('trapRainWater', () => {
    it('should return the correct amount of trapped water', () => {
        expect((0, algorithm_1.trapRainWater)([4, 1, 1, 0, 2, 3])).toBe(8);
        expect((0, algorithm_1.trapRainWater)([3, 2, 4, 1, 2])).toBe(2);
        expect((0, algorithm_1.trapRainWater)([1, 1, 1, 1])).toBe(0);
    });
});
