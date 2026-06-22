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

    // Midpoint Quadratic Bezier Curve algorithm
    // Ini menjamin 100% kurva mulus tanpa ada "overshoot" atau melingkar mundur seperti Catmull-Rom
    let path = `M ${simplified[0].x} ${simplified[0].y} `;
    
    let p1 = simplified[0];
    let p2 = simplified[1];

    for (let i = 1; i < simplified.length; i++) {
        const midPoint = {
            x: p1.x + (p2.x - p1.x) / 2,
            y: p1.y + (p2.y - p1.y) / 2
        };
        
        path += `Q ${p1.x} ${p1.y}, ${midPoint.x} ${midPoint.y} `;
        
        p1 = simplified[i];
        p2 = simplified[i + 1] || p1;
    }
    
    path += `L ${p1.x} ${p1.y}`;
    
    return path;
};
