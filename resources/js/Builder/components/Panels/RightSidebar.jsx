import React from 'react';
import useCanvasStore from '../../stores/useCanvasStore';

const RightSidebar = () => {
    const activeLayerId = useCanvasStore(state => state.activeLayerId);
    const sections = useCanvasStore(state => state.sections);
    const updateLayerStyle = useCanvasStore(state => state.updateLayerStyle);
    const updateLayerContent = useCanvasStore(state => state.updateLayerContent);
    const removeLayer = useCanvasStore(state => state.removeLayer);

    // Find active layer
    let activeLayer = null;
    sections.forEach(section => {
        const group = section.layers.find(l => l.id === activeLayerId);
        if (group) activeLayer = group;
        section.layers.forEach(g => {
            if (g.children) {
                const child = g.children.find(c => c.id === activeLayerId);
                if (child) activeLayer = child;
            }
        });
    });

    if (!activeLayer) {
        return (
            <aside className="w-72 bg-[#1e293b] border-l border-[#334155] p-5 flex flex-col z-40 overflow-y-auto">
                <div className="text-gray-500 text-center mt-10">
                    <p>Pilih elemen di kanvas untuk mengedit propertinya.</p>
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-72 bg-[#1e293b] border-l border-[#334155] p-5 flex flex-col z-40 overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#334155]">
                <h3 className="font-semibold text-gray-200">Pengaturan {activeLayer.type}</h3>
                <button 
                    onClick={() => removeLayer(activeLayer.id)}
                    className="p-1.5 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>

            <div className="space-y-6">
                {/* Konten */}
                {activeLayer.type === 'group' && (
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400">Nama Layer</label>
                        <input 
                            type="text"
                            value={activeLayer.name || ''}
                            onChange={(e) => {
                                useCanvasStore.setState(state => {
                                    const newSections = [...state.sections];
                                    newSections.forEach(section => {
                                        const group = section.layers.find(l => l.id === activeLayer.id);
                                        if (group) group.name = e.target.value;
                                    });
                                    return { sections: newSections };
                                });
                            }}
                            className="w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-sm text-gray-200 focus:border-primary-500 focus:outline-none"
                        />
                    </div>
                )}
                {activeLayer.type === 'text' && (
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-gray-400">Isi Teks</label>
                        <textarea 
                            value={activeLayer.content}
                            onChange={(e) => updateLayerContent(activeLayer.id, e.target.value)}
                            className="w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-sm text-gray-200 focus:border-primary-500 focus:outline-none min-h-[80px]"
                        />
                    </div>
                )}

                {/* Styling Dasar */}
                <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Gaya Visual</h4>
                    
                    {activeLayer.type === 'text' && (
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500">Warna</label>
                                <input 
                                    type="color" 
                                    value={activeLayer.style.color || '#000000'}
                                    onChange={(e) => updateLayerStyle(activeLayer.id, { color: e.target.value })}
                                    className="w-full h-8 rounded border border-[#334155] bg-[#0f172a] cursor-pointer"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-gray-500">Ukuran Font</label>
                                <input 
                                    type="text" 
                                    value={activeLayer.style.fontSize || '16px'}
                                    onChange={(e) => updateLayerStyle(activeLayer.id, { fontSize: e.target.value })}
                                    className="w-full h-8 bg-[#0f172a] border border-[#334155] rounded px-2 text-sm text-gray-200"
                                />
                            </div>
                        </div>
                    )}
                    
                    <div className="space-y-1">
                        <label className="text-[10px] text-gray-500">Opacity</label>
                        <input 
                            type="range" min="0" max="1" step="0.1" 
                            value={activeLayer.style.opacity ?? 1}
                            onChange={(e) => updateLayerStyle(activeLayer.id, { opacity: parseFloat(e.target.value) })}
                            className="w-full accent-primary-500"
                        />
                    </div>
                </div>

                {/* Simulasi Menu Animasi */}
                <div className="space-y-3 pt-4 border-t border-[#334155]">
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Animasi Masuk</h4>
                    <select className="w-full bg-[#0f172a] border border-[#334155] rounded-lg p-2.5 text-sm text-gray-200 focus:border-primary-500 focus:outline-none">
                        <option value="">Tanpa Animasi</option>
                        <option value="fade-in-up">Fade In Up</option>
                        <option value="zoom-in">Zoom In</option>
                        <option value="slide-in-left">Slide In Left</option>
                    </select>
                </div>
            </div>
        </aside>
    );
};

export default RightSidebar;
