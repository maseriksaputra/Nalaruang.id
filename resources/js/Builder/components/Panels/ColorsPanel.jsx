import React, { useState } from 'react';
import useCanvasStore from '../../stores/useCanvasStore';

const TAILWIND_COLORS = [
    '#000000', '#ffffff', '#ef4444', '#f97316', '#f59e0b', '#eab308', 
    '#84cc16', '#22c55e', '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', 
    '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
    '#64748b', '#78716c', '#475569', '#334155', '#1e293b', '#0f172a'
];

const DEFAULT_GRADIENTS = [
    'linear-gradient(to right, #ff7e5f, #feb47b)',
    'linear-gradient(to right, #00c6ff, #0072ff)',
    'linear-gradient(to right, #f12711, #f5af19)',
    'linear-gradient(to right, #654ea3, #eaafc8)',
    'linear-gradient(to right, #11998e, #38ef7d)',
    'linear-gradient(to bottom, #fc4a1a, #f7b733)',
    'linear-gradient(to right, #8e2de2, #4a00e0)',
    'linear-gradient(to right, #00b4db, #0083b0)',
    'linear-gradient(to bottom, #ff9966, #ff5e62)',
    'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)',
    'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
    'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
    'linear-gradient(135deg, #cfd9df 0%, #e2ebf0 100%)',
    'linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)'
];

const ColorsPanel = () => {
    const activeLayerId = useCanvasStore(state => state.activeLayerId);
    const sections = useCanvasStore(state => state.sections);
    const updateLayerStyle = useCanvasStore(state => state.updateLayerStyle);

    const findLayer = (sections, id) => {
        for (const section of sections) {
            const layer = section.layers.find(l => l.id === id);
            if (layer) return layer;
            for (const g of section.layers) {
                if (g.children) {
                    const child = g.children.find(c => c.id === id);
                    if (child) return child;
                }
            }
        }
        return null;
    };

    const activeLayer = activeLayerId ? findLayer(sections, activeLayerId) : null;
    
    // Determine which property to change based on layer type
    const colorProperty = activeLayer?.type === 'text' || activeLayer?.type === 'dynamic_guest_name' ? 'color' : 'backgroundColor';
    const currentColor = activeLayer?.style?.[colorProperty] || '#000000';
    const currentBackgroundType = activeLayer?.style?.backgroundType || 'solid';

    const handleSelectColor = (color) => {
        if (!activeLayerId) return;
        const updates = { [colorProperty]: color };
        if (colorProperty !== 'color') {
            updates.backgroundType = 'solid';
        }
        updateLayerStyle(activeLayerId, updates);
    };

    const handleSelectGradient = (gradient) => {
        if (!activeLayerId || activeLayer.type === 'text') return; // gradients typically for shapes/backgrounds
        
        // Extract the two colors from linear-gradient for our simple gradient css
        // This is a naive extraction for the predefined ones
        const colors = gradient.match(/#[a-fA-F0-9]{6}/g) || ['#ffffff', '#000000'];
        
        updateLayerStyle(activeLayerId, {
            backgroundType: 'linear-gradient',
            gradientColor1: colors[0] || '#ffffff',
            gradientColor2: colors[1] || '#000000',
            gradientDirection: '90deg'
        });
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-6">
                    
                    {/* Warna Kustom */}
                    <div>
                        <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-3">Warna Kustom</h3>
                        
                        <div className="flex items-center gap-3 mb-4">
                            {/* Tombol Tambah Warna (Rainbow) */}
                            <div className="w-10 h-10 rounded-full border border-gray-200 p-0.5 shadow-sm hover:shadow transition relative flex items-center justify-center bg-white cursor-pointer group">
                                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-pink-500 via-red-500 to-yellow-500 p-[2px]">
                                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                                        <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    </div>
                                </div>
                                <input 
                                    type="color" 
                                    value={currentBackgroundType === 'solid' ? currentColor : '#ffffff'}
                                    onChange={(e) => handleSelectColor(e.target.value)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    title="Pilih warna kustom"
                                />
                            </div>

                            {/* Tombol Suntik Warna (Eyedropper) */}
                            {typeof window !== 'undefined' && window.EyeDropper && (
                                <button 
                                    onClick={async () => {
                                        try {
                                            const eyeDropper = new window.EyeDropper();
                                            const result = await eyeDropper.open();
                                            handleSelectColor(result.sRGBHex);
                                        } catch (e) {
                                            console.log('Eyedropper cancelled', e);
                                        }
                                    }}
                                    className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 shadow-sm transition text-gray-600"
                                    title="Suntik Warna dari Layar"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                </button>
                            )}

                            {/* Warna Saat Ini */}
                            <div className="w-10 h-10 rounded-full border-2 border-indigo-500 flex items-center justify-center p-0.5">
                                <div className="w-full h-full rounded-full border border-gray-200" style={{ backgroundColor: currentBackgroundType === 'solid' ? currentColor : '#ffffff' }}></div>
                            </div>
                        </div>

                        {/* Info Warna Aktif */}
                        <div className="flex items-center gap-3 p-2 bg-gray-50 border border-gray-200 rounded-lg">
                            <div className="w-10 h-10 rounded shadow-sm border border-gray-200" style={{ backgroundColor: currentBackgroundType === 'solid' ? currentColor : '#ffffff' }}></div>
                            <div>
                                <p className="text-sm font-bold text-gray-800">Warna Aktif</p>
                                <p className="text-xs text-gray-500 uppercase">{currentBackgroundType === 'solid' ? currentColor : 'Gradasi'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Warna Solid Default */}
                    <div>
                        <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-3">Warna Solid Default</h3>
                        <div className="grid grid-cols-5 gap-2">
                            {TAILWIND_COLORS.map((color, index) => {
                                const isActive = currentBackgroundType === 'solid' && currentColor.toLowerCase() === color;
                                return (
                                    <button
                                        key={index}
                                        onClick={() => handleSelectColor(color)}
                                        className={`w-full aspect-square rounded-md border shadow-sm transition-transform hover:scale-110 flex items-center justify-center ${isActive ? 'ring-2 ring-indigo-500 ring-offset-2' : 'border-gray-200'}`}
                                        style={{ backgroundColor: color }}
                                        title={color}
                                    >
                                        {isActive && <svg className={`w-5 h-5 ${color === '#ffffff' ? 'text-gray-900' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Warna Gradasi (Hanya untuk bentuk) */}
                    {(activeLayer?.type === 'shape' || activeLayer?.type === 'button') && (
                        <div>
                            <h3 className="text-xs font-semibold tracking-wider text-gray-500 uppercase mb-3">Warna Gradasi Default</h3>
                            <div className="grid grid-cols-4 gap-2">
                                {DEFAULT_GRADIENTS.map((gradient, index) => {
                                    // A very basic check if it's somewhat active. In reality, we'd need deeper comparison
                                    const isActive = currentBackgroundType === 'linear-gradient'; 
                                    // Not perfectly highlighting the active one yet, just checking if gradient is active at all
                                    return (
                                        <button
                                            key={index}
                                            onClick={() => handleSelectGradient(gradient)}
                                            className="w-full aspect-square rounded-md border border-gray-200 shadow-sm transition-transform hover:scale-110"
                                            style={{ background: gradient }}
                                        ></button>
                                    );
                                })}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-2">Untuk mengatur arah gradasi secara manual, gunakan menu "Efek Latar" di Inspector Kanan.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ColorsPanel;
