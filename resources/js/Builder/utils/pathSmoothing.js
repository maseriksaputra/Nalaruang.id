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
    
    // Start the path at the first point
    let path = `M ${points[0].x} ${points[0].y} `;
    
    // Draw quadratic curves through the midpoints of subsequent points
    for (let i = 1; i < points.length - 1; i++) {
        const p1 = points[i];
        const p2 = points[i + 1];
        
        // Midpoint acts as the end of the curve, while the actual point acts as the control point
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        
        path += `Q ${p1.x} ${p1.y}, ${midX} ${midY} `;
    }
    
    // Finish the path at the last point
    const lastPoint = points[points.length - 1];
    path += `L ${lastPoint.x} ${lastPoint.y}`;
    
    return path;
};
