import React from 'react';
import useCanvasStore from '../../stores/useCanvasStore';
import useUIStore from '../../stores/useUIStore';
import { FONTS } from '../../utils/fonts';

const ContextualToolbar = () => {
    const activeLayerId = useCanvasStore(state => state.activeLayerId);
    const activeLayerIds = useCanvasStore(state => state.activeLayerIds || []);
    const sections = useCanvasStore(state => state.sections);
    const activeSectionId = useCanvasStore(state => state.activeSectionId);
    const updateLayerStyle = useCanvasStore(state => state.updateLayerStyle);
    const updateLayerAnimation = useCanvasStore(state => state.updateLayerAnimation);
    const setActiveTab = useCanvasStore(state => state.setActiveTab);
    const setInspectorTab = useCanvasStore(state => state.setInspectorTab);
    const duplicateLayer = useCanvasStore(state => state.duplicateLayer);
    const deleteElement = useCanvasStore(state => state.deleteElement);
    const setIsRightSidebarOpen = useUIStore(state => state.setIsRightSidebarOpen);
    
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

    if (activeLayerIds.length > 1) {
        return (
            <div 
                className="absolute top-6 left-1/2 -translate-x-1/2 h-12 bg-indigo-50 border border-indigo-100 rounded-xl flex items-center px-4 z-50 shadow-lg gap-3 w-max transition-all duration-200"
                onMouseDown={(e) => e.stopPropagation()}
            >
                <div className="text-sm font-semibold text-indigo-700">
                    {activeLayerIds.length} Elemen Terseleksi
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => useCanvasStore.getState().groupElements()} 
                        className="px-4 py-1.5 text-sm bg-indigo-600 text-white rounded font-medium shadow-sm hover:bg-indigo-700 transition flex items-center gap-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
                        Grupkan (Ctrl+G)
                    </button>
                </div>
            </div>
        );
    }

    if (!activeLayer) {
        return null;
    }

    const isText = activeLayer.type === 'text';
    const isImage = activeLayer.type === 'image' || activeLayer.type === 'polaroid';
    const isShape = activeLayer.type === 'shape';

    const currentFontSize = parseInt(activeLayer.style?.fontSize) || 16;
    const isBold = activeLayer.style?.fontWeight === 'bold';
    const isItalic = activeLayer.style?.fontStyle === 'italic';
    const isUnderline = activeLayer.style?.textDecoration === 'underline';
    const textAlign = activeLayer.style?.textAlign || 'left';
    const isLocked = activeLayer.style?.isLocked || false;

    const handleTextAlign = () => {
        const aligns = ['left', 'center', 'right', 'justify'];
        const nextIdx = (aligns.indexOf(textAlign) + 1) % aligns.length;
        updateLayerStyle(activeLayer.id, { textAlign: aligns[nextIdx] });
    };

    return (
        <div 
            className="absolute top-6 left-1/2 -translate-x-1/2 h-12 bg-white rounded-xl shadow-lg border border-gray-200 flex items-center px-3 z-50 gap-1 w-max transition-all duration-200"
            onMouseDown={(e) => e.stopPropagation()}
        >
            
            {/* GROUP TOOLS */}
            {activeLayer.type === 'canvas_group' && (
                <div className="flex items-center gap-2 mr-4 border-r border-gray-200 pr-4">
                    <button 
                        onClick={() => useCanvasStore.getState().ungroupElements()} 
                        className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded transition-colors border border-transparent hover:border-red-200 flex items-center gap-1"
                    >
                        Pisahkan Grup (Ctrl+Shift+G)
                    </button>
                </div>
            )}

            {/* TEXT TOOLS */}
            {isText && (
                <div className="flex items-center gap-1 mr-1 border-r border-gray-200 pr-1">
                    {/* Font Family */}
                    <button 
                        onClick={() => setActiveTab('fonts')}
                        className="flex items-center bg-white border border-gray-300 text-gray-700 py-1.5 px-3 rounded hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-indigo-500 text-sm font-medium min-w-[120px] justify-between cursor-pointer transition-colors"
                    >
                        <span style={{ fontFamily: activeLayer.style?.fontFamily || 'Inter' }}>
                            {activeLayer.style?.fontFamily || 'Inter'}
                        </span>
                        <svg className="w-4 h-4 ml-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    {/* Font Size */}
                    <div className="flex items-center border border-gray-300 rounded overflow-hidden">
                        <button onClick={() => updateLayerStyle(activeLayer.id, { fontSize: Math.max(8, currentFontSize - 1) })} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors">-</button>
                        <input 
                            type="number" 
                            value={currentFontSize}
                            onChange={(e) => updateLayerStyle(activeLayer.id, { fontSize: parseInt(e.target.value) || 16 })}
                            className="w-12 text-center text-sm font-medium border-x border-gray-300 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 appearance-none m-0"
                            style={{ MozAppearance: 'textfield' }}
                        />
                        <button onClick={() => updateLayerStyle(activeLayer.id, { fontSize: currentFontSize + 1 })} className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors">+</button>
                    </div>

                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    {/* Text Color */}
                    <button 
                        onClick={() => setActiveTab('colors')}
                        className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 cursor-pointer relative" 
                        title="Warna Teks"
                    >
                        <div className="w-5 h-5 rounded border border-gray-300 overflow-hidden" style={{ backgroundColor: activeLayer.style?.color || '#000000' }}>
                        </div>
                    </button>

                    {/* Text Formatting */}
                    <button onClick={() => updateLayerStyle(activeLayer.id, { fontWeight: isBold ? 'normal' : 'bold' })} className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${isBold ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-600'}`} title="Tebal (Bold)">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M15.6 11.8c1-.7 1.6-1.8 1.6-3 0-2.3-1.9-4.1-4.2-4.1H7v14.6h6.8c2.6 0 4.7-2.1 4.7-4.7 0-1.7-.9-3.2-2.3-4.1zM10.4 7.6h2.6c.7 0 1.3.6 1.3 1.3s-.6 1.3-1.3 1.3h-2.6V7.6zm3.3 8.7h-3.3v-2.9h3.3c.8 0 1.5.7 1.5 1.5s-.7 1.4-1.5 1.4z"></path></svg>
                    </button>
                    <button onClick={() => updateLayerStyle(activeLayer.id, { fontStyle: isItalic ? 'normal' : 'italic' })} className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${isItalic ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-600'}`} title="Miring (Italic)">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M10 5v3h2.2l-3.4 8H6v3h8v-3h-2.2l3.4-8H18V5h-8z"></path></svg>
                    </button>
                    <button onClick={() => updateLayerStyle(activeLayer.id, { textDecoration: isUnderline ? 'none' : 'underline' })} className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${isUnderline ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-600'}`} title="Garis Bawah (Underline)">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 17c3.3 0 6-2.7 6-6V3h-2.5v8c0 1.9-1.6 3.5-3.5 3.5S8.5 12.9 8.5 11V3H6v8c0 3.3 2.7 6 6 6zm-7 2v2.5h14V19H5z"></path></svg>
                    </button>
                    
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>

                    {/* Text Alignment */}
                    <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                        <button onClick={() => updateLayerStyle(activeLayer.id, { textAlign: 'left' })} className={`w-8 h-8 flex items-center justify-center transition-colors ${textAlign === 'left' ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-600'}`} title="Rata Kiri">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm0 14h14v2H3v-2zm0-7h18v2H3v-2z"></path></svg>
                        </button>
                        <button onClick={() => updateLayerStyle(activeLayer.id, { textAlign: 'center' })} className={`w-8 h-8 flex items-center justify-center transition-colors border-l border-r border-gray-200 ${textAlign === 'center' ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-600'}`} title="Rata Tengah">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm4 14h10v2H7v-2zm-4-7h18v2H3v-2z"></path></svg>
                        </button>
                        <button onClick={() => updateLayerStyle(activeLayer.id, { textAlign: 'right' })} className={`w-8 h-8 flex items-center justify-center transition-colors ${textAlign === 'right' ? 'bg-gray-200 text-gray-900' : 'hover:bg-gray-100 text-gray-600'}`} title="Rata Kanan">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 4h18v2H3V4zm4 14h14v2H7v-2zm-4-7h18v2H3v-2z"></path></svg>
                        </button>
                    </div>
                </div>
            )}

            {/* IMAGE TOOLS */}
            {isImage && (
                <div className="flex items-center gap-1 mr-3">
                    <button onClick={() => setActiveTab('edit_image')} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">Edit foto</button>
                    
                    <button 
                        onClick={() => {
                            setInspectorTab('effects');
                            setIsRightSidebarOpen(true);
                        }} 
                        className={`flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors border ${activeLayer.style?.removeBg ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'text-gray-700 hover:bg-gray-100 border-transparent hover:border-gray-200'}`}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                        Hapus Latar
                    </button>

                    <div className="w-px h-5 bg-gray-300 mx-1"></div>
                    <button onClick={() => updateLayerStyle(activeLayer.id, { flipX: !activeLayer.style?.flipX })} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200" title="Balik Horizontal">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                        Balik H
                    </button>
                    <button onClick={() => updateLayerStyle(activeLayer.id, { flipY: !activeLayer.style?.flipY })} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200" title="Balik Vertikal">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8v12m0 0l-4-4m4 4l4-4m6 0V4m0 0l4 4m-4-4l-4 4"></path></svg>
                        Balik V
                    </button>
                    <button onClick={() => updateLayerStyle(activeLayer.id, { borderRadius: (activeLayer.style?.borderRadius || 0) === 0 ? 16 : ((activeLayer.style?.borderRadius || 0) === 16 ? 9999 : 0) })} className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors border border-transparent hover:border-gray-200">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        Sudut
                    </button>
                </div>
            )}

            {/* SHAPE TOOLS */}
            {isShape && (
                <div className="flex items-center gap-2 mr-4">
                    <button 
                        onClick={() => setActiveTab('colors')}
                        className="flex items-center justify-center w-8 h-8 rounded hover:bg-gray-100 cursor-pointer relative" 
                        title="Warna Bentuk"
                    >
                        <div className="w-5 h-5 rounded border border-gray-300 overflow-hidden" style={{ backgroundColor: activeLayer.style?.backgroundColor || '#e5e7eb' }}>
                        </div>
                    </button>
                    <div className="w-px h-6 bg-gray-300 mx-1"></div>
                    <button className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors border border-transparent hover:border-gray-200">
                        Bentuk
                    </button>
                </div>
            )}

            {/* COMMON TOOLS (Always visible) */}
            <div className="flex items-center gap-1 shrink-0 ml-1">
                <button onClick={() => { setInspectorTab('animation'); setIsRightSidebarOpen(true); }} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors border border-transparent hover:border-gray-200 flex items-center gap-1" title="Animasikan">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                    Animasikan
                </button>
                <button onClick={() => { setInspectorTab('design'); setIsRightSidebarOpen(true); }} className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded transition-colors border border-transparent hover:border-gray-200 flex items-center gap-1" title="Posisi">
                    Posisi
                </button>
                
                <div className="w-px h-6 bg-gray-300 mx-2"></div>
                
                <button onClick={() => updateLayerStyle(activeLayer.id, { isLocked: !isLocked })} className={`w-8 h-8 flex items-center justify-center rounded transition-colors ${isLocked ? 'bg-indigo-50 text-indigo-600' : 'text-gray-500 hover:bg-gray-100'}`} title={isLocked ? "Buka Kunci" : "Kunci Posisi"}>
                    {isLocked ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path></svg>
                    ) : (
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
                    )}
                </button>
                
                <button onClick={() => duplicateLayer(activeLayer.id)} className="w-8 h-8 flex items-center justify-center text-gray-500 hover:bg-gray-100 rounded transition-colors shrink-0" title="Duplikat (Salin)">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1 shrink-0"></div>

                <button 
                    onClick={async () => { if (await window.confirmAsync('Hapus elemen ini?', 'Hapus Elemen')) { deleteElement(activeLayer.id); } }} 
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200 shrink-0" 
                    title="Hapus"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    Hapus
                </button>
            </div>
        </div>
    );
};

export default ContextualToolbar;
