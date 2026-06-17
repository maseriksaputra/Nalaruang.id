import React, { useRef, useState } from 'react';
import useUIStore from '../../stores/useUIStore';
import useCanvasStore from '../../stores/useCanvasStore';
import { pointsToSmoothedSvgPath } from '../../utils/pathSmoothing';

const PathDrawOverlay = ({ sectionId }) => {
    const isDrawingPath = useUIStore(state => state.isDrawingPath);
    const setIsDrawingPath = useUIStore(state => state.setIsDrawingPath);
    const updateLayerAnimation = useCanvasStore(state => state.updateLayerAnimation);
    const activeLayerId = useCanvasStore(state => state.activeLayerId);
    
    const [points, setPoints] = useState([]);
    const [isPointerDown, setIsPointerDown] = useState(false);
    const overlayRef = useRef(null);

    // Only render if drawing mode is active
    if (!isDrawingPath) return null;

    const handlePointerDown = (e) => {
        setIsPointerDown(true);
        const rect = overlayRef.current.getBoundingClientRect();
        // Record coordinates relative to the canvas section
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setPoints([{ x, y }]);
    };

    const handlePointerMove = (e) => {
        if (!isPointerDown) return;
        
        const rect = overlayRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        setPoints(prev => {
            const last = prev[prev.length - 1];
            if (!last) return [{x, y}];
            
            // SENSITIVITAS JARAK: Rekam titik baru jika kursor bergeser lebih dari 5px.
            // Angka 5 dapat diperbesar/diperkecil untuk menentukan kerapatan rekaman titik.
            // Berguna mencegah SVG path yang terlalu kompleks akibat getaran tangan.
            if (Math.hypot(x - last.x, y - last.y) > 5) {
                return [...prev, { x, y }];
            }
            return prev;
        });
    };

    const handlePointerUp = () => {
        setIsPointerDown(false);
        setIsDrawingPath(false); // Selesai menggambar
        
        if (points.length > 2 && activeLayerId) {
            const svgPath = pointsToSmoothedSvgPath(points);
            
            // Menyimpan jalur baru ke store dan secara otomatis mengubah jenis animasi menjadi custom_path
            updateLayerAnimation(activeLayerId, {
                idle: 'custom_path',
                custom_path_data: {
                    svgPath: svgPath,
                    ease: 'power2.inOut',
                    duration: 5,
                    autoRotate: false
                }
            });
        }
        
        setPoints([]);
    };

    return (
        <div 
            ref={overlayRef}
            className="absolute inset-0 z-[100] cursor-crosshair touch-none"
            style={{ backgroundColor: 'rgba(99, 102, 241, 0.1)', backdropFilter: 'blur(1px)' }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
        >
            <div className="absolute top-4 w-full text-center pointer-events-none">
                <span className="bg-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold shadow-lg shadow-indigo-500/30">
                    Mulai coret/geser untuk merekam lintasan...
                </span>
            </div>
            
            {/* Visualisasi jalur real-time saat pengguna menggambar */}
            <svg className="w-full h-full pointer-events-none">
                {points.length > 1 && (
                    <path 
                        d={pointsToSmoothedSvgPath(points)}
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="3"
                        strokeDasharray="6 6"
                        strokeLinecap="round"
                    />
                )}
            </svg>
        </div>
    );
};

export default PathDrawOverlay;
