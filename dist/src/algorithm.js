"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.trapRainWater = void 0;
function trapRainWater(height) {
    const n = height.length;
    if (n === 0)
        return 0;
    const leftMax = new Array(n).fill(0);
    const rightMax = new Array(n).fill(0);
    leftMax[0] = height[0];
    for (let i = 1; i < n; i++) {
        leftMax[i] = Math.max(height[i], leftMax[i - 1]);
    }
    rightMax[n - 1] = height[n - 1];
    for (let i = n - 2; i >= 0; i--) {
        rightMax[i] = Math.max(height[i], rightMax[i + 1]);
    }
    let water = 0;
    for (let i = 0; i < n; i++) {
        water += Math.min(leftMax[i], rightMax[i]) - height[i];
    }
    return water;
}
exports.trapRainWater = trapRainWater;
