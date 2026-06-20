import React, { useRef, useState } from 'react';
import useCanvasStore from '../../stores/useCanvasStore';
import useUIStore from '../../stores/useUIStore';
import apiClient from '../../utils/apiClient';
import { compressImageToWebp } from '../../utils/imageCompressor';
import { ANIMATION_CATEGORIES } from '../../utils/animations';

const DesktopThumbnailPanel = () => {
    const global_settings = useCanvasStore(state => state.global_settings);
    const updateGlobalSettings = useCanvasStore(state => state.updateGlobalSettings);
    
    const settings = global_settings.desktop_thumbnail || {};
    const fileInputRef = useRef(null);

    const activeCanvasMode = useCanvasStore(state => state.activeCanvasMode);
    const setActiveCanvasMode = useCanvasStore(state => state.setActiveCanvasMode);

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-sm z-10">
                <h2 className="font-bold text-gray-800 flex items-center gap-2">
                    <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    Tampilan Desktop
                </h2>
                <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                        type="checkbox" 
                        className="sr-only peer" 
                        checked={settings.enabled || false}
                        onChange={(e) => handleChange('enabled', e.target.checked)}
                    />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                </label>
            </div>

            <div className={`p-4 flex-1 flex flex-col items-center justify-center text-center ${!settings.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                </div>
                
                <h3 className="font-bold text-gray-800 mb-2">Desktop Canvas Editor</h3>
                <p className="text-sm text-gray-500 mb-6 px-4">
                    Area ini akan memenuhi layar PC/Laptop (Rasio 16:9). Anda bebas merancang background, teks, dan animasi tambahan khusus untuk Desktop.
                </p>

                {activeCanvasMode === 'desktop' ? (
                    <button 
                        onClick={() => setActiveCanvasMode('mobile')}
                        className="px-6 py-3 bg-red-50 text-red-600 hover:bg-red-100 font-bold rounded-xl transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                        Tutup Editor Desktop
                    </button>
                ) : (
                    <button 
                        onClick={() => setActiveCanvasMode('desktop')}
                        className="px-6 py-3 bg-indigo-600 text-white hover:bg-indigo-700 font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all hover:-translate-y-1 flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        Buka Kanvas Desktop
                    </button>
                )}
            </div>
            
            {/* Background Color Fallback */}
            <div className={`p-4 border-t border-gray-100 ${!settings.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Warna Latar Dasar</label>
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full shadow-inner border border-gray-200 overflow-hidden shrink-0 relative">
                        <input 
                            type="color" 
                            value={settings.background_color || '#1a1a1a'}
                            onChange={(e) => handleChange('background_color', e.target.value)}
                            className="w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer absolute"
                        />
                    </div>
                    <input 
                        type="text" 
                        value={settings.background_color || '#1a1a1a'}
                        onChange={(e) => handleChange('background_color', e.target.value)}
                        className="flex-1 px-3 py-1.5 border border-gray-300 rounded-md text-sm font-mono"
                    />
                </div>
            </div>
        </div>
    );
};

export default DesktopThumbnailPanel;
