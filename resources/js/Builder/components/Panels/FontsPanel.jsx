import React, { useState, useEffect } from 'react';
import useCanvasStore from '../../stores/useCanvasStore';
import { FONTS, loadFont } from '../../utils/fonts';

const FontsPanel = () => {
    const [search, setSearch] = useState('');
    const activeLayerId = useCanvasStore(state => state.activeLayerId);
    const sections = useCanvasStore(state => state.sections);
    const updateLayerStyle = useCanvasStore(state => state.updateLayerStyle);

    // Pre-load all fonts so previews render correctly
    useEffect(() => {
        // We defer it slightly to not block the immediate render of the panel
        setTimeout(() => {
            FONTS.forEach(font => loadFont(font));
        }, 100);
    }, []);

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
    const currentFont = activeLayer?.style?.fontFamily || 'Inter';

    const filteredFonts = FONTS.filter(font => font.toLowerCase().includes(search.toLowerCase()));

    const handleSelectFont = (font) => {
        if (activeLayerId) {
            updateLayerStyle(activeLayerId, { fontFamily: font });
        }
    };

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-100 shrink-0">
                <div className="relative">
                    <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                    <input 
                        type="text" 
                        placeholder="Cari font..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-2">
                    {!search && (
                        <div className="mb-4">
                            <h3 className="px-2 py-1 text-xs font-semibold tracking-wider text-gray-500 uppercase">Font Saat Ini</h3>
                            <button 
                                className="w-full flex items-center justify-between px-3 py-3 mt-1 bg-indigo-50 border border-indigo-100 rounded-lg"
                            >
                                <span className="text-lg text-indigo-900" style={{ fontFamily: currentFont }}>{currentFont}</span>
                                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            </button>
                        </div>
                    )}

                    <div>
                        <h3 className="px-2 py-1 text-xs font-semibold tracking-wider text-gray-500 uppercase mb-2">Semua Font</h3>
                        <div className="space-y-1">
                            {filteredFonts.map(font => {
                                const isActive = currentFont === font;
                                return (
                                    <button 
                                        key={font}
                                        onClick={() => handleSelectFont(font)}
                                        className={`w-full flex items-center justify-between px-3 py-3 rounded-lg transition-colors ${isActive ? 'bg-indigo-50 text-indigo-900' : 'hover:bg-gray-50 text-gray-800'}`}
                                    >
                                        <span className="text-lg truncate" style={{ fontFamily: font }}>{font}</span>
                                        {isActive && <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                                    </button>
                                );
                            })}
                            {filteredFonts.length === 0 && (
                                <div className="text-center py-8 text-sm text-gray-500">
                                    Font tidak ditemukan
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FontsPanel;
