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
    
    // Simplification pass to remove points that are too close (reduces jaggedness from micro-movements)
    const simplified = [points[0]];
    for (let i = 1; i < points.length; i++) {
        const last = simplified[simplified.length - 1];
        const curr = points[i];
        if (Math.hypot(curr.x - last.x, curr.y - last.y) > 15 || i === points.length - 1) {
            simplified.push(curr);
        }
    }

    if (simplified.length <= 2) {
        return `M ${simplified[0].x} ${simplified[0].y} L ${simplified[simplified.length - 1].x} ${simplified[simplified.length - 1].y}`;
    }

    // Catmull-Rom spline to Bezier for perfectly smooth curves
    let path = `M ${simplified[0].x} ${simplified[0].y} `;
    
    for (let i = 0; i < simplified.length - 1; i++) {
        const p0 = i === 0 ? simplified[0] : simplified[i - 1];
        const p1 = simplified[i];
        const p2 = simplified[i + 1];
        const p3 = i + 2 < simplified.length ? simplified[i + 2] : p2;
        
        // Tension parameter, usually 0.5 for Catmull-Rom, but we use a smoother tension for hand drawing
        const tension = 0.2;
        
        const cp1x = p1.x + (p2.x - p0.x) * tension;
        const cp1y = p1.y + (p2.y - p0.y) * tension;
        
        const cp2x = p2.x - (p3.x - p1.x) * tension;
        const cp2y = p2.y - (p3.y - p1.y) * tension;
        
        path += `C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y} `;
    }
    
    return path;
};
