/**
 * Utility functions for SVG Path Generation and Smoothing
 */

/**
 * Converts an array of coordinate objects {x, y} into an SVG Path string
 * using Quadratic Bezier curves for a smoother appearance.
 * 
 * @param {Array<{x: number, y: number}>} points - The recorded points
 * @returns {string} - The SVG path string
 */
export const pointsToSmoothedSvgPath = (points) => {
    if (!points || points.length === 0) return '';
    if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
    if (points.length === 2) return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;

    // 1. Simplification pass: Remove points that are too close (distance filtering)
    const simplified = [points[0]];
    for (let i = 1; i < points.length; i++) {
        const last = simplified[simplified.length - 1];
        const curr = points[i];
        if (Math.hypot(curr.x - last.x, curr.y - last.y) > 20 || i === points.length - 1) {
            simplified.push(curr);
        }
    }

    // 2. Smoothing pass: Moving average to remove sharp zig-zags that cause GSAP autoRotate jitter
    const smoothed = [];
    if (simplified.length > 2) {
        smoothed.push(simplified[0]);
        for (let i = 1; i < simplified.length - 1; i++) {
            const prev = simplified[i - 1];
            const curr = simplified[i];
            const next = simplified[i + 1];
            smoothed.push({
                x: (prev.x + curr.x + next.x) / 3,
                y: (prev.y + curr.y + next.y) / 3
            });
        }
        smoothed.push(simplified[simplified.length - 1]);
    } else {
        smoothed.push(...simplified);
    }

    if (smoothed.length <= 2) {
        return `M ${smoothed[0].x} ${smoothed[0].y} L ${smoothed[smoothed.length - 1].x} ${smoothed[smoothed.length - 1].y}`;
    }

    // 3. Catmull-Rom spline to Bezier for perfectly smooth curves
    let path = `M ${smoothed[0].x} ${smoothed[0].y} `;

    for (let i = 0; i < smoothed.length - 1; i++) {
        const p0 = i === 0 ? smoothed[0] : smoothed[i - 1];
        const p1 = smoothed[i];
        const p2 = smoothed[i + 1];
        const p3 = i + 2 < smoothed.length ? smoothed[i + 2] : p2;

        // Tension parameter
        const tension = 0.25;

        const cp1x = p1.x + (p2.x - p0.x) * tension;
        const cp1y = p1.y + (p2.y - p0.y) * tension;

        const cp2x = p2.x - (p3.x - p1.x) * tension;
        const cp2y = p2.y - (p3.y - p1.y) * tension;

        path += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y} `;
    }

    return path;
};
