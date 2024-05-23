import { trapRainWater } from '../src/algorithm';

describe('trapRainWater', () => {
  it('should return the correct amount of trapped water', () => {
    expect(trapRainWater([4, 1, 1, 0, 2, 3])).toBe(8);
    expect(trapRainWater([3, 2, 4, 1, 2])).toBe(2);
    expect(trapRainWater([1, 1, 1, 1])).toBe(0);
  });
});
