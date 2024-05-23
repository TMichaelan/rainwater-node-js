"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const algorithm_1 = require("../src/algorithm");
describe('trapRainWater', () => {
    it('should return 0 for an empty array', () => {
        expect((0, algorithm_1.trapRainWater)([])).toBe(0);
    });
    it('should return 0 for an array with one element', () => {
        expect((0, algorithm_1.trapRainWater)([1])).toBe(0);
    });
    it('should return 0 for an array with two elements', () => {
        expect((0, algorithm_1.trapRainWater)([1, 2])).toBe(0);
    });
    it('should return the correct amount of trapped water for simple cases', () => {
        expect((0, algorithm_1.trapRainWater)([4, 1, 1, 0, 2, 3])).toBe(8);
        expect((0, algorithm_1.trapRainWater)([3, 2, 4, 1, 2])).toBe(2);
        expect((0, algorithm_1.trapRainWater)([1, 1, 1, 1])).toBe(0);
    });
    it('should handle a flat array', () => {
        expect((0, algorithm_1.trapRainWater)(new Array(1000).fill(1))).toBe(0);
    });
    it('should handle large arrays', () => {
        const largeArray = new Array(1000).fill(0).map((_, i) => (i % 2 === 0 ? 5 : 1));
        expect((0, algorithm_1.trapRainWater)(largeArray)).toBe(1996);
    });
    it('should handle arrays with varying heights', () => {
        expect((0, algorithm_1.trapRainWater)([0, 2, 0, 2, 0])).toBe(2);
        expect((0, algorithm_1.trapRainWater)([3, 0, 3, 0, 3])).toBe(6);
    });
});
