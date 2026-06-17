import React from 'react';
import useCanvasStore from '../../stores/useCanvasStore';

const ImageEditorPanel = () => {
    const activeLayerId = useCanvasStore(state => state.activeLayerId);
    const sections = useCanvasStore(state => state.sections);
    const updateLayerStyle = useCanvasStore(state => state.updateLayerStyle);
    const setActiveTab = useCanvasStore(state => state.setActiveTab);

    const findElement = (sections, id) => {
        for (const section of sections) {
            const group = section.layers.find(l => l.id === id);
            if (group) return group;
            for (const g of section.layers) {
                if (g.children) {
                    const child = g.children.find(c => c.id === id);
                    if (child) return child;
                }
            }
        }
        return null;
    };

    const activeLayer = activeLayerId ? findElement(sections, activeLayerId) : null;

    if (!activeLayer || (activeLayer.type !== 'image' && activeLayer.type !== 'polaroid')) {
        return (
            <div className="flex flex-col h-full bg-white w-full">
                <div className="p-4 text-sm text-gray-500 text-center">Silakan pilih gambar terlebih dahulu.</div>
            </div>
        );
    }



    return (
        <div className="flex flex-col h-full bg-white w-full">
            <div className="p-4 space-y-6">
                
                {/* Crop Tool */}
                <div className="space-y-3">
                    <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Potong (Crop) Langsung</h3>
                    <p className="text-[11px] text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100 leading-relaxed">
                        Anda sekarang berada dalam <strong>Mode Editor Foto</strong>. <br/><br/>
                        Untuk melakukan crop, <strong>langsung klik dan seret (drag)</strong> gambar di dalam kanvas untuk menggeser posisinya. Anda juga dapat mengatur ukuran bingkainya menggunakan ujung titik biru.
                    </p>
                </div>

                {/* Transform */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Transformasi</h3>
                    
                    <div className="flex gap-2">
                        <button 
                            onClick={() => updateLayerStyle(activeLayer.id, { flipX: !activeLayer.style?.flipX })}
                            className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 flex flex-col items-center justify-center gap-1 transition-colors"
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                            <span className="text-[10px] font-medium text-gray-600">Flip X</span>
                        </button>
                        <button 
                            onClick={() => updateLayerStyle(activeLayer.id, { flipY: !activeLayer.style?.flipY })}
                            className="flex-1 py-2 bg-gray-50 hover:bg-gray-100 rounded border border-gray-200 flex flex-col items-center justify-center gap-1 transition-colors"
                        >
                            <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ transform: 'rotate(90deg)' }}><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                            <span className="text-[10px] font-medium text-gray-600">Flip Y</span>
                        </button>
                    </div>

                    <div>
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>Rotasi Manual</span>
                            <span>{activeLayer.style?.rotation ?? 0}&deg;</span>
                        </div>
                        <input 
                            type="range" min="0" max="360" step="1" 
                            value={activeLayer.style?.rotation ?? 0} 
                            onChange={(e) => updateLayerStyle(activeLayer.id, { rotation: parseInt(e.target.value) })} 
                            className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                        />
                    </div>
                </div>

                {/* Adjustments */}
                <div className="space-y-4 pt-4 border-t border-gray-200">
                    <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Penyesuaian Cahaya & Warna</h3>
                    
                    <div>
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>Kecerahan (Brightness)</span>
                            <span>{Math.round((activeLayer.style?.brightness ?? 1) * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="2" step="0.05" value={activeLayer.style?.brightness ?? 1} onChange={(e) => updateLayerStyle(activeLayer.id, { brightness: parseFloat(e.target.value) })} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                    </div>

                    <div>
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>Kontras (Contrast)</span>
                            <span>{Math.round((activeLayer.style?.contrast ?? 1) * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="2" step="0.05" value={activeLayer.style?.contrast ?? 1} onChange={(e) => updateLayerStyle(activeLayer.id, { contrast: parseFloat(e.target.value) })} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                    </div>

                    <div>
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>Saturasi Warna</span>
                            <span>{Math.round((activeLayer.style?.saturate ?? 1) * 100)}%</span>
                        </div>
                        <input type="range" min="0" max="2" step="0.05" value={activeLayer.style?.saturate ?? 1} onChange={(e) => updateLayerStyle(activeLayer.id, { saturate: parseFloat(e.target.value) })} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                    </div>

                    <div>
                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                            <span>Blur</span>
                            <span>{activeLayer.style?.blur ?? 0}px</span>
                        </div>
                        <input type="range" min="0" max="20" step="0.5" value={activeLayer.style?.blur ?? 0} onChange={(e) => updateLayerStyle(activeLayer.id, { blur: parseFloat(e.target.value) })} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                    </div>
                    
                    <button 
                        onClick={() => updateLayerStyle(activeLayer.id, { brightness: 1, contrast: 1, saturate: 1, blur: 0 })}
                        className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 text-[11px] font-bold uppercase tracking-wider rounded border border-gray-200 transition-colors mt-2"
                    >
                        Reset Penyesuaian
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImageEditorPanel;
