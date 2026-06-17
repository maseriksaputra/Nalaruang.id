import React from 'react';
import useUIStore from '../../stores/useUIStore';
import { pointsToSmoothedSvgPath } from '../../utils/pathSmoothing';

const PathVisualizerOverlay = () => {
    const isDrawingPath = useUIStore(state => state.isDrawingPath);
    const currentPathPoints = useUIStore(state => state.currentPathPoints);

    if (!isDrawingPath || !currentPathPoints || currentPathPoints.length < 2) return null;

    const svgPath = pointsToSmoothedSvgPath(currentPathPoints);

    return (
        <div className="absolute inset-0 z-50 pointer-events-none">
            <svg className="w-full h-full overflow-visible">
                {/* Garis putus-putus rute yang ditarik */}
                <path
                    d={svgPath}
                    fill="none"
                    stroke="#8b5cf6"
                    strokeWidth="3"
                    strokeDasharray="6 6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-80"
                />
                
                {/* Titik awal mula (Starting point) */}
                <circle 
                    cx={currentPathPoints[0].x} 
                    cy={currentPathPoints[0].y} 
                    r="5" 
                    fill="#ec4899" 
                />
                
                {/* Titik akhir (Kursor saat ini) */}
                <circle 
                    cx={currentPathPoints[currentPathPoints.length - 1].x} 
                    cy={currentPathPoints[currentPathPoints.length - 1].y} 
                    r="4" 
                    fill="#8b5cf6" 
                />
            </svg>
        </div>
    );
};

export default PathVisualizerOverlay;
