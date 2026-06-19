import React, { useState } from 'react';
import useCanvasStore from '../../stores/useCanvasStore';
import useUIStore from '../../stores/useUIStore';

import { IMAGE_FILTERS } from '../../utils/imageFilters';
import { FONTS } from '../../utils/fonts';
import apiClient from '../../utils/apiClient';

import { ANIMATION_CATEGORIES, ANIMATION_STYLES } from '../../utils/animations';

const AnimatedIcon = ({ anim, isText = false, isActive = false }) => {
    return (
        <div className="w-full h-14 mb-2 flex items-center justify-center overflow-hidden border border-gray-100 bg-gray-50 rounded-lg group-hover:shadow-sm transition-shadow">
            {isText ? (
                <div 
                    className={`font-bold text-[20px] tracking-widest transition-colors ${isActive ? 'text-indigo-600' : 'text-purple-600 group-hover:text-purple-500'}`} 
                    style={{ animation: anim.anim }}
                >
                    ABC
                </div>
            ) : (
                <div 
                    className={`w-8 h-8 rounded transition-colors ${isActive ? 'bg-indigo-600' : 'bg-purple-500 group-hover:bg-purple-400'}`} 
                    style={{ animation: anim.anim }}
                ></div>
            )}
        </div>
    );
};

import { removeBackground } from '@imgly/background-removal';

const RightInspector = () => {
    const activeLayerId = useCanvasStore(state => state.activeLayerId);
    const sections = useCanvasStore(state => state.sections);
    const activeSectionId = useCanvasStore(state => state.activeSectionId);
    

    const global_settings = useCanvasStore(state => state.global_settings);
    const updateLayerStyle = useCanvasStore(state => state.updateLayerStyle);
    const updateLayerContent = useCanvasStore(state => state.updateLayerContent);
    const updateLayerAnimation = useCanvasStore(state => state.updateLayerAnimation);
    const setActiveTab = useCanvasStore(state => state.setActiveTab);
    const updateGlobalSettings = useCanvasStore(state => state.updateGlobalSettings);
    const updateLayerPosition = useCanvasStore(state => state.updateLayerPosition);
    const updateLayerSize = useCanvasStore(state => state.updateLayerSize);
    const updateLayerInteraction = useCanvasStore(state => state.updateLayerInteraction);
    const moveLayerUp = useCanvasStore(state => state.moveLayerUp);
    const moveLayerDown = useCanvasStore(state => state.moveLayerDown);
    const moveLayerToFront = useCanvasStore(state => state.moveLayerToFront);
    const moveLayerToBack = useCanvasStore(state => state.moveLayerToBack);
    const alignLayer = useCanvasStore(state => state.alignLayer);
    const inspectorTab = useCanvasStore(state => state.inspectorTab);
    const setInspectorTab = useCanvasStore(state => state.setInspectorTab);
    const [editingAlbumPhotoIdx, setEditingAlbumPhotoIdx] = useState(null);
    const [customMotionTab, setCustomMotionTab] = useState('keyframes');
    const [animationMode, setAnimationMode] = useState('entry'); // 'entry' | 'exit'
    const isDrawingPath = useUIStore(state => state.isDrawingPath);
    const setIsDrawingPath = useUIStore(state => state.setIsDrawingPath);
    const isRightSidebarOpen = useUIStore(state => state.isRightSidebarOpen);
    const setIsRightSidebarOpen = useUIStore(state => state.setIsRightSidebarOpen);
    const isRemovingBg = useUIStore(state => state.isRemovingBg);
    const setIsRemovingBg = useUIStore(state => state.setIsRemovingBg);

    const handleToggleRemoveBg = async (checked, layer) => {
        if (!checked) {
            // Restore original image if it exists
            if (layer.style?.originalUrl) {
                useCanvasStore.getState().updateLayer(layer.id, { url: layer.style.originalUrl });
                updateLayerStyle(layer.id, { 
                    removeBg: false,
                    originalUrl: null
                });
            } else {
                updateLayerStyle(layer.id, { removeBg: false });
            }
            return;
        }

        // If toggled ON and we already have a bgRemovedUrl, just use it
        if (layer.style?.bgRemovedUrl) {
            useCanvasStore.getState().updateLayer(layer.id, { url: layer.style.bgRemovedUrl });
            updateLayerStyle(layer.id, { 
                removeBg: true
            });
            return;
        }

        // Run AI Background Removal
        try {
            setIsRemovingBg(true);
            
            // Save original URL before processing
            const originalUrl = layer.style?.url || layer.url;

            // 1. Ambil gambar sebagai blob terlebih dahulu untuk mencegah error CORS di dalam imgly
            let imageBlob;
            try {
                let fetchUrl = originalUrl;
                try {
                    const urlObj = new URL(originalUrl);
                    // Force same-origin path to avoid CORS/Mixed Content over ngrok/cloudflare tunnels
                    if (urlObj.host !== window.location.host) {
                        fetchUrl = urlObj.pathname + urlObj.search;
                    }
                } catch (e) {
                    // Ignore if not a valid URL string
                }
                
                const res = await fetch(fetchUrl);
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                imageBlob = await res.blob();
            } catch (e) {
                throw new Error("Gagal mengunduh gambar sumber. " + e.message);
            }
            
            const config = {
                debug: true,
                device: 'cpu', // Fallback to cpu to avoid WebGPU silent fails
                model: 'isnet_quint8', // More robust model
                publicPath: 'https://cdn.jsdelivr.net/npm/@imgly/background-removal-data@1.7.0/dist/'
            };
            const blob = await removeBackground(imageBlob, config);
            const file = new File([blob], `transparent_${Date.now()}.png`, { type: 'image/png' });

            const formData = new FormData();
            formData.append('file', file);

            // Upload the transparent image to server to make it permanent
            const response = await apiClient.post('/admin/builder/user-assets', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (response.data && response.data.url) {
                // Update the layer's main url property so everything (including inspector) updates
                useCanvasStore.getState().updateLayer(layer.id, { url: response.data.url });
                updateLayerStyle(layer.id, { 
                    removeBg: true,
                    originalUrl: originalUrl,
                    bgRemovedUrl: response.data.url,
                    backgroundColor: 'transparent',
                    url: null
                });
            }
        } catch (error) {
            console.error('Failed to remove background:', error);
            alert('Gagal menghapus latar belakang: ' + (error.message || 'Silakan coba lagi nanti.'));
            updateLayerStyle(layer.id, { removeBg: false });
        } finally {
            setIsRemovingBg(false);
        }
    };

    const renderToggleButton = () => (
        <button
            onClick={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
            className="absolute top-1/2 -left-4 -translate-y-1/2 w-8 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-gray-50 shadow-md z-[60] transition-all hover:scale-105"
            title={isRightSidebarOpen ? "Tutup Panel" : "Buka Panel"}
        >
            <svg className={`w-4 h-4 mr-1 transition-transform ${isRightSidebarOpen ? '' : 'rotate-180'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
        </button>
    );

    if (!activeLayerId) {
        return null;
    }

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
        const activeSection = sections.find(s => s.id === activeSectionId);
        return (
            <div className={`bg-white border-l border-gray-200 flex flex-col z-[60] shrink-0 shadow-2xl pointer-events-auto transition-all duration-300 relative ${isRightSidebarOpen ? 'w-[320px]' : 'w-0'}`}>
                {renderToggleButton()}
                <div className="w-[320px] h-full flex flex-col overflow-hidden">
                    <div className="h-14 border-b border-gray-100 flex items-center px-4 shrink-0 bg-gray-50">
                        <h2 className="font-bold text-gray-800 text-sm">Pengaturan Halaman</h2>
                    </div>
                    {activeSection ? (
                        <div className="p-4 space-y-6 overflow-y-auto">
                            <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-lg text-xs text-indigo-800">
                                Tidak ada elemen yang dipilih. Anda sedang mengatur properti halaman (Section) secara keseluruhan.
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-700 block mb-2">Tinggi Halaman (Minimal)</span>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="text" 
                                        value={activeSection.layout?.minHeight || ''}
                                        onChange={(e) => useCanvasStore.getState().updateSectionLayout(activeSectionId, { minHeight: e.target.value })}
                                        className="w-full border border-gray-300 rounded p-2 text-sm focus:ring-1 focus:ring-indigo-500"
                                        placeholder="contoh: 844px atau 100vh"
                                    />
                                </div>
                                <p className="text-[10px] text-gray-500 mt-1">Gunakan <b>844px</b> untuk tinggi standar HP (iPhone), atau <b>100vh</b> agar menyesuaikan tinggi layar HP tamu.</p>
                            </div>
                            <div>
                                <span className="text-xs font-bold text-gray-700 block mb-2">Warna Latar Belakang</span>
                                <div className="flex gap-2">
                                    <input 
                                        type="color" 
                                        value={activeSection.layout?.background_value || '#ffffff'}
                                        onChange={(e) => useCanvasStore.getState().updateSectionLayout(activeSectionId, { background_value: e.target.value })}
                                        className="w-8 h-8 rounded cursor-pointer border border-gray-300 p-0"
                                    />
                                    <input 
                                        type="text" 
                                        value={activeSection.layout?.background_value || '#ffffff'}
                                        onChange={(e) => useCanvasStore.getState().updateSectionLayout(activeSectionId, { background_value: e.target.value })}
                                        className="flex-1 border border-gray-300 rounded p-1 text-sm focus:ring-1 focus:ring-indigo-500 uppercase"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 text-center text-sm text-gray-500">
                            Elemen tidak ditemukan.
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const handleAddKeyframe = () => {
        if (!activeLayer) return;
        const currentAnimation = activeLayer.animation || {};
        const keyframes = currentAnimation.custom_keyframes || [];
        
        const newKf = {
            id: 'kf_' + Date.now(),
            x: activeLayer.style?.x || 0,
            y: activeLayer.style?.y || 0,
            opacity: activeLayer.style?.opacity ?? 1,
            scale: activeLayer.style?.scale ?? 1,
            rotation: activeLayer.style?.rotation || 0,
            width: activeLayer.style?.width !== undefined ? parseFloat(activeLayer.style.width) : undefined,
            height: activeLayer.style?.height !== undefined ? parseFloat(activeLayer.style.height) : undefined,
            duration: 1.0, 
            ease: 'none'
        };

        updateLayerAnimation(activeLayer.id, {
            idle: 'custom_timeline', 
            custom_keyframes: [...keyframes, newKf],
            isLooping: currentAnimation.isLooping ?? true
        });
    };

    const handleUpdateKeyframe = (index, field, value) => {
        if (!activeLayer || !activeLayer.animation?.custom_keyframes) return;
        const keyframes = [...activeLayer.animation.custom_keyframes];
        keyframes[index] = { ...keyframes[index], [field]: value };
        updateLayerAnimation(activeLayer.id, { custom_keyframes: keyframes });
    };

    const handleRemoveKeyframe = (index) => {
        if (!activeLayer || !activeLayer.animation?.custom_keyframes) return;
        const keyframes = [...activeLayer.animation.custom_keyframes];
        keyframes.splice(index, 1);
        
        if (keyframes.length === 0) {
            updateLayerAnimation(activeLayer.id, { idle: null, custom_keyframes: [] });
        } else {
            updateLayerAnimation(activeLayer.id, { custom_keyframes: keyframes });
        }
    };

    return (
        <div className={`bg-white border-l border-gray-200 flex flex-col z-[60] shrink-0 shadow-2xl pointer-events-auto transition-all duration-300 relative ${isRightSidebarOpen ? 'w-[320px]' : 'w-0'}`}>
            {renderToggleButton()}
            <div className="w-[320px] h-full flex flex-col overflow-hidden">
                {/* Tabs Header */}
                <div className="h-14 border-b border-gray-100 flex items-center px-2 shrink-0 bg-gray-50">
                <button 
                    onClick={() => setInspectorTab('design')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${inspectorTab === 'design' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                >
                    Desain
                </button>
                <button 
                    onClick={() => setInspectorTab('animation')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${inspectorTab === 'animation' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                >
                    Animasi
                </button>

                <button 
                    onClick={() => setInspectorTab('interaction')}
                    className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${inspectorTab === 'interaction' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                >
                    Interaksi
                </button>
                {activeLayer.type === 'photo_album' && (
                    <button 
                        onClick={() => setInspectorTab('album')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${inspectorTab === 'album' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                        Album
                    </button>
                )}
                {(activeLayer.type === 'interactive_rsvp' || activeLayer.type === 'interactive_comments') && (
                    <button 
                        onClick={() => setInspectorTab('rsvp')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${inspectorTab === 'rsvp' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                        {activeLayer.type === 'interactive_comments' ? 'Desain' : 'Form'}
                    </button>
                )}
                {activeLayer.type === 'image' && (
                    <button 
                        onClick={() => setInspectorTab('effects')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${inspectorTab === 'effects' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                        Efek
                    </button>
                )}
                {activeLayer.type === 'interactive_map' && (
                    <button 
                        onClick={() => setInspectorTab('map')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${inspectorTab === 'map' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                        Map
                    </button>
                )}
                {activeLayer.type === 'interactive_countdown' && (
                    <button 
                        onClick={() => setInspectorTab('countdown')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${inspectorTab === 'countdown' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                        Waktu
                    </button>
                )}
                {activeLayer.type === 'interactive_copy' && (
                    <button 
                        onClick={() => setInspectorTab('copy')}
                        className={`flex-1 py-2 text-sm font-semibold rounded-md transition ${inspectorTab === 'copy' ? 'bg-white shadow-sm text-indigo-600' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'}`}
                    >
                        Salin
                    </button>
                )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                
                {inspectorTab === 'design' && (
                    <>
                        {/* Control Panel: Lock & Rotasi */}
                        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                            <label className="flex items-center gap-2 text-sm font-medium cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    checked={activeLayer.style.isLocked || false}
                                    onChange={(e) => updateLayerStyle(activeLayer.id, { isLocked: e.target.checked })}
                                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                />
                                <span className="text-gray-700">Kunci Posisi</span>
                            </label>
                        </div>
                
                {/* Dimensi & Posisi Dasar */}
                <div className="grid grid-cols-2 gap-3 mt-2">
                    <div>
                        <span className="text-[10px] text-gray-500 block mb-1">Lebar</span>
                        <input 
                            type="number" 
                            value={activeLayer.style?.width || ''}
                            onChange={(e) => updateLayerSize(activeLayer.id, parseFloat(e.target.value), activeLayer.style.height)}
                            className="w-full border border-gray-200 rounded p-1.5 text-xs text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 block mb-1">Tinggi</span>
                        <input 
                            type="number" 
                            value={activeLayer.style?.height || ''}
                            onChange={(e) => updateLayerSize(activeLayer.id, activeLayer.style.width, parseFloat(e.target.value))}
                            className="w-full border border-gray-200 rounded p-1.5 text-xs text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 block mb-1">Posisi X</span>
                        <input 
                            type="number" 
                            value={activeLayer.style?.x || 0}
                            onChange={(e) => updateLayerPosition(activeLayer.id, parseFloat(e.target.value), activeLayer.style.y)}
                            className="w-full border border-gray-200 rounded p-1.5 text-xs text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 block mb-1">Posisi Y</span>
                        <input 
                            type="number" 
                            value={activeLayer.style?.y || 0}
                            onChange={(e) => updateLayerPosition(activeLayer.id, activeLayer.style.x, parseFloat(e.target.value))}
                            className="w-full border border-gray-200 rounded p-1.5 text-xs text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 block mb-1">Rotasi (deg)</span>
                        <input 
                            type="number" 
                            value={activeLayer.style?.rotation || 0}
                            onChange={(e) => updateLayerStyle(activeLayer.id, { rotation: parseFloat(e.target.value) })}
                            className="w-full border border-gray-200 rounded p-1.5 text-xs text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                        />
                    </div>
                    <div>
                        <span className="text-[10px] text-gray-500 block mb-1">Opacity</span>
                        <input 
                            type="number" step="0.1" min="0" max="1"
                            value={activeLayer.style?.opacity !== undefined ? activeLayer.style.opacity : 1}
                            onChange={(e) => updateLayerStyle(activeLayer.id, { opacity: parseFloat(e.target.value) })}
                            className="w-full border border-gray-200 rounded p-1.5 text-xs text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none"
                        />
                    </div>
                </div>

                    {/* Pengaturan Posisi & Rata Halaman (Canva Style) */}
                    <div className="pt-4 border-t border-gray-100">
                        <label className="text-xs font-bold text-gray-800 mb-3 block">Rata Horizontal</label>
                        <div className="grid grid-cols-3 gap-2 mb-4">
                            <button onClick={() => alignLayer(activeLayer.id, 'left')} className={`flex flex-col items-center gap-1 p-2 border border-gray-200 rounded text-[10px] transition-colors ${Math.abs(activeLayer.style?.x || 0) < 2 ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm' : 'hover:bg-gray-50 text-gray-600'}`}>
                                <svg className={`w-5 h-5 ${Math.abs(activeLayer.style?.x || 0) < 2 ? 'text-indigo-600' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="2" x2="4" y2="22"></line><rect x="8" y="6" width="12" height="4" rx="1"></rect><rect x="8" y="14" width="8" height="4" rx="1"></rect></svg> Kiri
                            </button>
                            <button onClick={() => alignLayer(activeLayer.id, 'center')} className={`flex flex-col items-center gap-1 p-2 border border-gray-200 rounded text-[10px] transition-colors ${Math.abs((activeLayer.style?.x || 0) - (414 - (parseInt(activeLayer.style?.width) || 100)) / 2) < 2 ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm' : 'hover:bg-gray-50 text-gray-600'}`}>
                                <svg className={`w-5 h-5 ${Math.abs((activeLayer.style?.x || 0) - (414 - (parseInt(activeLayer.style?.width) || 100)) / 2) < 2 ? 'text-indigo-600' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="2" x2="12" y2="22"></line><rect x="6" y="6" width="12" height="4" rx="1"></rect><rect x="8" y="14" width="8" height="4" rx="1"></rect></svg> Tengah
                            </button>
                            <button onClick={() => alignLayer(activeLayer.id, 'right')} className={`flex flex-col items-center gap-1 p-2 border border-gray-200 rounded text-[10px] transition-colors ${Math.abs((activeLayer.style?.x || 0) - (414 - (parseInt(activeLayer.style?.width) || 100))) < 2 ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm' : 'hover:bg-gray-50 text-gray-600'}`}>
                                <svg className={`w-5 h-5 ${Math.abs((activeLayer.style?.x || 0) - (414 - (parseInt(activeLayer.style?.width) || 100))) < 2 ? 'text-indigo-600' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="20" y1="2" x2="20" y2="22"></line><rect x="4" y="6" width="12" height="4" rx="1"></rect><rect x="8" y="14" width="8" height="4" rx="1"></rect></svg> Kanan
                            </button>
                        </div>
    
                        <label className="text-xs font-bold text-gray-800 mb-3 block">Rata Vertikal</label>
                        <div className="grid grid-cols-3 gap-2 mb-3">
                            <button onClick={() => alignLayer(activeLayer.id, 'top')} className={`flex flex-col items-center gap-1 p-2 border border-gray-200 rounded text-[10px] transition-colors ${Math.abs(activeLayer.style?.y || 0) < 2 ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm' : 'hover:bg-gray-50 text-gray-600'}`}>
                                <svg className={`w-5 h-5 ${Math.abs(activeLayer.style?.y || 0) < 2 ? 'text-indigo-600' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="4" x2="22" y2="4"></line><rect x="6" y="8" width="4" height="12" rx="1"></rect><rect x="14" y="8" width="4" height="8" rx="1"></rect></svg> Atas
                            </button>
                            <button onClick={() => alignLayer(activeLayer.id, 'middle')} className={`flex flex-col items-center gap-1 p-2 border border-gray-200 rounded text-[10px] transition-colors ${Math.abs((activeLayer.style?.y || 0) - (844 - (parseInt(activeLayer.style?.height) || 100)) / 2) < 2 ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm' : 'hover:bg-gray-50 text-gray-600'}`}>
                                <svg className={`w-5 h-5 ${Math.abs((activeLayer.style?.y || 0) - (844 - (parseInt(activeLayer.style?.height) || 100)) / 2) < 2 ? 'text-indigo-600' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="12" x2="22" y2="12"></line><rect x="6" y="6" width="4" height="12" rx="1"></rect><rect x="14" y="8" width="4" height="8" rx="1"></rect></svg> Tengah
                            </button>
                            <button onClick={() => alignLayer(activeLayer.id, 'bottom')} className={`flex flex-col items-center gap-1 p-2 border border-gray-200 rounded text-[10px] transition-colors ${Math.abs((activeLayer.style?.y || 0) - (844 - (parseInt(activeLayer.style?.height) || 100))) < 2 ? 'bg-indigo-50 text-indigo-700 border-indigo-200 shadow-sm' : 'hover:bg-gray-50 text-gray-600'}`}>
                                <svg className={`w-5 h-5 ${Math.abs((activeLayer.style?.y || 0) - (844 - (parseInt(activeLayer.style?.height) || 100))) < 2 ? 'text-indigo-600' : 'text-gray-500'}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="2" y1="20" x2="22" y2="20"></line><rect x="6" y="4" width="4" height="12" rx="1"></rect><rect x="14" y="8" width="4" height="8" rx="1"></rect></svg> Bawah
                            </button>
                        </div>

                    <label className="text-xs font-bold text-gray-800 mb-3 block mt-4">Urutan Layer</label>
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => moveLayerUp(activeLayer.id)} className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 text-xs text-gray-700">
                            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg> Maju
                        </button>
                        <button onClick={() => moveLayerDown(activeLayer.id)} className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 text-xs text-gray-700">
                            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg> Mundur
                        </button>
                        <button onClick={() => moveLayerToFront(activeLayer.id)} className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 text-xs text-gray-700">
                            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="17 11 12 6 7 11"></polyline><polyline points="17 18 12 13 7 18"></polyline></svg> Ke Paling Depan
                        </button>
                        <button onClick={() => moveLayerToBack(activeLayer.id)} className="flex items-center gap-2 p-2 border border-gray-200 rounded hover:bg-gray-50 text-xs text-gray-700">
                            <svg className="w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="7 13 12 18 17 13"></polyline><polyline points="7 6 12 11 17 6"></polyline></svg> Ke Paling Belakang
                        </button>
                    </div>
                </div>

                {/* Khusus Bingkai (Frame) */}
                {activeLayer.type === 'frame' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-2 bg-gray-100 p-2 rounded">Isi Bingkai (Media)</h3>
                        <div className="flex flex-col gap-2">
                            <button 
                                onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*,video/mp4';
                                    input.multiple = true;
                                    input.onchange = (e) => {
                                        const files = Array.from(e.target.files);
                                        if (files.length > 0) {
                                            Promise.all(files.map(file => new Promise(resolve => {
                                                const reader = new FileReader();
                                                reader.onload = (re) => resolve(re.target.result);
                                                reader.readAsDataURL(file);
                                            }))).then(results => {
                                                updateLayerStyle(activeLayer.id, { mediaUrls: results });
                                            });
                                        }
                                    };
                                    input.click();
                                }}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded transition text-sm flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                {activeLayer.style?.mediaUrls?.length > 0 ? 'Ganti Media' : 'Unggah Media'}
                            </button>
                            {activeLayer.style?.mediaUrls?.length > 0 && (
                                <button 
                                    onClick={() => updateLayerStyle(activeLayer.id, { mediaUrls: [] })}
                                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded transition text-sm flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                    Hapus Media
                                </button>
                            )}
                            {activeLayer.style?.mediaUrls?.length > 1 && (
                                <p className="text-[10px] text-gray-500 text-center">Menampilkan {activeLayer.style.mediaUrls.length} foto sebagai Slideshow (Album).</p>
                            )}
                        </div>
                    </div>
                )}

                {/* Khusus Polaroid */}
                {activeLayer.type === 'polaroid' && (
                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-2 bg-gray-100 p-2 rounded">Pengaturan Polaroid</h3>
                        
                        <div>
                            <span className="text-xs text-gray-500 block mb-1">Gambar Polaroid</span>
                            <button 
                                onClick={() => {
                                    const input = document.createElement('input');
                                    input.type = 'file';
                                    input.accept = 'image/*';
                                    input.onchange = (e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            const reader = new FileReader();
                                            reader.onload = (re) => {
                                                const currentData = activeLayer.style?.polaroidData || {};
                                                updateLayerStyle(activeLayer.id, { polaroidData: { ...currentData, image: re.target.result } });
                                            };
                                            reader.readAsDataURL(file);
                                        }
                                    };
                                    input.click();
                                }}
                                className="w-full flex items-center justify-center gap-2 p-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-colors shadow-sm"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                Ganti Gambar
                            </button>
                        </div>

                        <div>
                            <span className="text-xs text-gray-500 block mb-1">Teks Caption</span>
                            <input 
                                type="text"
                                className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-1 focus:ring-indigo-500" 
                                placeholder="Kenangan Indah"
                                value={activeLayer.style?.polaroidData?.caption || ''}
                                onChange={(e) => {
                                    const currentData = activeLayer.style?.polaroidData || {};
                                    updateLayerStyle(activeLayer.id, { polaroidData: { ...currentData, caption: e.target.value } });
                                }}
                            />
                        </div>

                        <div>
                            <span className="text-xs text-gray-500 block mb-2">Gaya Polaroid</span>
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => {
                                        const currentData = activeLayer.style?.polaroidData || {};
                                        updateLayerStyle(activeLayer.id, { polaroidData: { ...currentData, type: 'classic' } });
                                    }}
                                    className={`flex flex-col items-center justify-center py-2 border rounded-lg transition-colors ${(activeLayer.style?.polaroidData?.type || 'classic') === 'classic' ? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <span className="text-[10px] font-bold">Klasik Lurus</span>
                                </button>
                                <button
                                    onClick={() => {
                                        const currentData = activeLayer.style?.polaroidData || {};
                                        updateLayerStyle(activeLayer.id, { polaroidData: { ...currentData, type: 'tilted' } });
                                    }}
                                    className={`flex flex-col items-center justify-center py-2 border rounded-lg transition-colors ${(activeLayer.style?.polaroidData?.type || 'classic') === 'tilted' ? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <span className="text-[10px] font-bold">Miring Natural</span>
                                </button>
                                <button
                                    onClick={() => {
                                        const currentData = activeLayer.style?.polaroidData || {};
                                        updateLayerStyle(activeLayer.id, { polaroidData: { ...currentData, type: 'taped' } });
                                    }}
                                    className={`col-span-2 flex flex-col items-center justify-center py-2 border rounded-lg transition-colors ${(activeLayer.style?.polaroidData?.type || 'classic') === 'taped' ? 'border-indigo-500 bg-indigo-50 text-indigo-600 shadow-sm' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <span className="text-[10px] font-bold">Miring dgn Selotip</span>
                                </button>
                            </div>
                        </div>

                        <div>
                            <span className="text-xs text-gray-500 block mb-1">Efek Filter Visual</span>
                            <select 
                                value={activeLayer.style?.polaroidData?.filterId || 'none'}
                                onChange={(e) => {
                                    const currentData = activeLayer.style?.polaroidData || {};
                                    updateLayerStyle(activeLayer.id, { polaroidData: { ...currentData, filterId: e.target.value } });
                                }}
                                className="w-full text-xs font-bold text-gray-700 border border-gray-300 rounded-lg p-2 focus:ring-1 focus:ring-indigo-500 bg-white"
                            >
                                {IMAGE_FILTERS.map(filter => (
                                    <option key={filter.id} value={filter.id}>{filter.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}



                {/* Khusus Teks */}
                {(activeLayer.type === 'text' || activeLayer.type === 'dynamic_guest_name') && (
                    <div className="space-y-4">
                        <div>
                            <span className="text-xs text-gray-500 block mb-1">Teks Utama</span>
                            <textarea 
                                className="w-full text-sm border-gray-300 rounded p-2 focus:ring-1 focus:ring-indigo-500" 
                                rows="3"
                                value={activeLayer.content}
                                onChange={(e) => updateLayerContent(activeLayer.id, e.target.value)}
                            ></textarea>
                        </div>
                        
                        <div>
                            <span className="text-xs text-gray-500 block mb-1">Font Family</span>
                            <button 
                                onClick={() => setActiveTab('fonts')}
                                className="w-full flex items-center justify-between text-sm border border-gray-300 rounded p-2 focus:border-indigo-500 bg-white hover:bg-gray-50 transition-colors text-left"
                            >
                                <span style={{ fontFamily: activeLayer.style.fontFamily || 'Inter' }}>
                                    {activeLayer.style.fontFamily || 'Inter'}
                                </span>
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-xs text-gray-500 block mb-1">Warna Teks</span>
                                <button 
                                    onClick={() => setActiveTab('colors')}
                                    className="w-full h-8 rounded cursor-pointer border border-gray-300 overflow-hidden relative group hover:border-gray-400 transition-colors block"
                                    title="Pilih Warna"
                                >
                                    <div className="absolute inset-0 w-full h-full" style={{ backgroundColor: activeLayer.style.color || '#000000' }}></div>
                                </button>
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block mb-1">Ukuran (px)</span>
                                <input 
                                    type="number" 
                                    value={parseInt(activeLayer.style.fontSize) || 24}
                                    onChange={(e) => updateLayerStyle(activeLayer.id, { fontSize: e.target.value + 'px' })}
                                    className="w-full h-8 text-sm border-gray-300 rounded px-2"
                                />
                            </div>
                        </div>

                        {/* Formatting Buttons */}
                        <div>
                            <span className="text-xs text-gray-500 block mb-1">Format</span>
                            <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                                <button 
                                    onClick={() => updateLayerStyle(activeLayer.id, { fontWeight: activeLayer.style.fontWeight === 'bold' ? 'normal' : 'bold' })}
                                    className={`flex-1 py-1.5 font-bold transition-colors ${activeLayer.style.fontWeight === 'bold' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-700'}`}
                                >B</button>
                                <button 
                                    onClick={() => updateLayerStyle(activeLayer.id, { fontStyle: activeLayer.style.fontStyle === 'italic' ? 'normal' : 'italic' })}
                                    className={`flex-1 py-1.5 italic border-l border-r border-gray-200 transition-colors ${activeLayer.style.fontStyle === 'italic' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-700'}`}
                                >I</button>
                                <button 
                                    onClick={() => updateLayerStyle(activeLayer.id, { textDecoration: activeLayer.style.textDecoration === 'underline' ? 'none' : 'underline' })}
                                    className={`flex-1 py-1.5 underline transition-colors ${activeLayer.style.textDecoration === 'underline' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-700'}`}
                                >U</button>
                            </div>
                        </div>
                        
                        {/* Alignment Buttons */}
                        <div>
                            <span className="text-xs text-gray-500 block mb-1">Perataan Teks</span>
                            <div className="flex items-center border border-gray-200 rounded overflow-hidden">
                                <button 
                                    onClick={() => updateLayerStyle(activeLayer.id, { textAlign: 'left' })}
                                    className={`flex-1 py-1.5 flex justify-center transition-colors ${activeLayer.style.textAlign === 'left' || !activeLayer.style.textAlign ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-700'}`}
                                ><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h10M4 18h16"></path></svg></button>
                                <button 
                                    onClick={() => updateLayerStyle(activeLayer.id, { textAlign: 'center' })}
                                    className={`flex-1 py-1.5 border-l border-r border-gray-200 flex justify-center transition-colors ${activeLayer.style.textAlign === 'center' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-700'}`}
                                ><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M7 12h10M4 18h16"></path></svg></button>
                                <button 
                                    onClick={() => updateLayerStyle(activeLayer.id, { textAlign: 'right' })}
                                    className={`flex-1 py-1.5 flex justify-center transition-colors ${activeLayer.style.textAlign === 'right' ? 'bg-indigo-100 text-indigo-700' : 'hover:bg-gray-200 text-gray-700'}`}
                                ><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M10 12h10M4 18h16"></path></svg></button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <span className="text-xs text-gray-500 block mb-1">Letter Spacing</span>
                                <input 
                                    type="number" 
                                    value={parseInt(activeLayer.style.letterSpacing) || 0}
                                    onChange={(e) => updateLayerStyle(activeLayer.id, { letterSpacing: e.target.value + 'px' })}
                                    className="w-full h-8 text-sm border-gray-300 rounded px-2"
                                />
                            </div>
                            <div>
                                <span className="text-xs text-gray-500 block mb-1">Line Height</span>
                                <input 
                                    type="number" step="0.1"
                                    value={activeLayer.style.lineHeight || 1.2}
                                    onChange={(e) => updateLayerStyle(activeLayer.id, { lineHeight: e.target.value })}
                                    className="w-full h-8 text-sm border-gray-300 rounded px-2"
                                />
                            </div>
                        </div>
                    </div>
                )}

                
                {/* Advanced Styling: Shadows & Gradients */}
                <div className="pt-4 border-t border-gray-100 space-y-4">
                    <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-2 bg-gray-100 p-2 rounded">Efek Latar & Visual</h3>
                    
                    {/* Opacity */}
                    <div className="border border-gray-200 rounded-lg p-3 bg-white">
                        <div className="flex justify-between text-[10px] text-gray-500 mb-2">
                            <span className="font-bold text-gray-700">Opasitas (Transparansi)</span>
                            <span>{Math.round((activeLayer.style.opacity ?? 1) * 100)}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="1" step="0.05" 
                            value={activeLayer.style.opacity ?? 1} 
                            onChange={(e) => updateLayerStyle(activeLayer.id, { opacity: parseFloat(e.target.value) })} 
                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                        />
                    </div>

                    {/* Lengkungan Sudut (Rounded Corners) */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
                        <div className="bg-gray-50 p-3 flex justify-between items-center border-b border-gray-200">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-2">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" ry="4" strokeWidth="2"></rect></svg>
                                Sudut Melengkung
                            </label>
                            <button 
                                onClick={() => updateLayerStyle(activeLayer.id, { 
                                    borderRadius: activeLayer.style.borderRadius !== undefined ? undefined : 0,
                                    borderRadiusType: activeLayer.style.borderRadiusType || 'all'
                                })}
                                className={`w-8 h-4 rounded-full relative transition-colors ${activeLayer.style.borderRadius !== undefined ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                                <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${activeLayer.style.borderRadius !== undefined ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                            </button>
                        </div>
                        
                        {activeLayer.style.borderRadius !== undefined && (
                            <div className="p-3 space-y-4 bg-white">
                                <div>
                                    <span className="text-[10px] text-gray-500 block mb-2">Tipe Kelengkungan</span>
                                    <div className="grid grid-cols-5 gap-1 border border-gray-200 rounded p-1 bg-gray-50 mb-1">
                                        <button title="Semua Sudut" onClick={() => updateLayerStyle(activeLayer.id, { borderRadiusType: 'all' })} className={`flex justify-center items-center py-1.5 rounded transition-colors ${(!activeLayer.style.borderRadiusType || activeLayer.style.borderRadiusType === 'all') ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" ry="4"></rect></svg>
                                        </button>
                                        <button title="Sudut Atas" onClick={() => updateLayerStyle(activeLayer.id, { borderRadiusType: 'top' })} className={`flex justify-center items-center py-1.5 rounded transition-colors ${activeLayer.style.borderRadiusType === 'top' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 20v-12a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v12"></path></svg>
                                        </button>
                                        <button title="Sudut Bawah" onClick={() => updateLayerStyle(activeLayer.id, { borderRadiusType: 'bottom' })} className={`flex justify-center items-center py-1.5 rounded transition-colors ${activeLayer.style.borderRadiusType === 'bottom' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4v12a4 4 0 0 0 4 4h8a4 4 0 0 0 4-4v-12"></path></svg>
                                        </button>
                                        <button title="Sudut Kiri" onClick={() => updateLayerStyle(activeLayer.id, { borderRadiusType: 'left' })} className={`flex justify-center items-center py-1.5 rounded transition-colors ${activeLayer.style.borderRadiusType === 'left' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 4h-12a4 4 0 0 0 -4 4v8a4 4 0 0 0 4 4h12"></path></svg>
                                        </button>
                                        <button title="Sudut Kanan" onClick={() => updateLayerStyle(activeLayer.id, { borderRadiusType: 'right' })} className={`flex justify-center items-center py-1.5 rounded transition-colors ${activeLayer.style.borderRadiusType === 'right' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 4h12a4 4 0 0 1 4 4v8a4 4 0 0 1 -4 4h-12"></path></svg>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-4 gap-1 border border-gray-200 rounded p-1 bg-gray-50">
                                        <button title="Sudut Kiri Atas" onClick={() => updateLayerStyle(activeLayer.id, { borderRadiusType: 'top-left' })} className={`flex justify-center items-center py-1.5 rounded transition-colors ${activeLayer.style.borderRadiusType === 'top-left' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M4 14v-6a4 4 0 0 1 4 -4h6"></path><path d="M20 4v16h-16" strokeDasharray="2 4" strokeWidth="1" stroke="currentColor"></path></svg>
                                        </button>
                                        <button title="Sudut Kanan Atas" onClick={() => updateLayerStyle(activeLayer.id, { borderRadiusType: 'top-right' })} className={`flex justify-center items-center py-1.5 rounded transition-colors ${activeLayer.style.borderRadiusType === 'top-right' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M10 4h6a4 4 0 0 1 4 4v6"></path><path d="M4 4v16h16" strokeDasharray="2 4" strokeWidth="1" stroke="currentColor"></path></svg>
                                        </button>
                                        <button title="Sudut Kanan Bawah" onClick={() => updateLayerStyle(activeLayer.id, { borderRadiusType: 'bottom-right' })} className={`flex justify-center items-center py-1.5 rounded transition-colors ${activeLayer.style.borderRadiusType === 'bottom-right' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M20 10v6a4 4 0 0 1 -4 4h-6"></path><path d="M4 20v-16h16" strokeDasharray="2 4" strokeWidth="1" stroke="currentColor"></path></svg>
                                        </button>
                                        <button title="Sudut Kiri Bawah" onClick={() => updateLayerStyle(activeLayer.id, { borderRadiusType: 'bottom-left' })} className={`flex justify-center items-center py-1.5 rounded transition-colors ${activeLayer.style.borderRadiusType === 'bottom-left' ? 'bg-white shadow-sm text-indigo-600 font-bold' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-200'}`}>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M14 20h-6a4 4 0 0 1 -4 -4v-6"></path><path d="M4 4h16v16" strokeDasharray="2 4" strokeWidth="1" stroke="currentColor"></path></svg>
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                        <span>Tingkat Lengkungan (px)</span>
                                        <span>{activeLayer.style.borderRadius || 0}px</span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="200" step="1"
                                        value={activeLayer.style.borderRadius || 0}
                                        onChange={(e) => updateLayerStyle(activeLayer.id, { borderRadius: parseInt(e.target.value) || 0 })}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Garis Tepi (Stroke) */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-3 flex justify-between items-center border-b border-gray-200">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-2">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16"></path></svg>
                                Garis Tepi (Stroke)
                            </label>
                            <button 
                                onClick={() => updateLayerStyle(activeLayer.id, { 
                                    borderWidth: activeLayer.style.borderWidth ? 0 : 2,
                                    borderStyle: activeLayer.style.borderStyle || 'solid',
                                    borderColor: activeLayer.style.borderColor || '#000000'
                                })}
                                className={`w-8 h-4 rounded-full relative transition-colors ${activeLayer.style.borderWidth ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                                <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${activeLayer.style.borderWidth ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                            </button>
                        </div>
                        
                        {!!activeLayer.style.borderWidth && (
                            <div className="p-3 space-y-4 bg-white">
                                <div>
                                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                        <span>Ketebalan (px)</span>
                                        <span>{parseFloat(activeLayer.style.borderWidth) || 0}px</span>
                                    </div>
                                    <input 
                                        type="range" min="0.1" max="50" step="0.1"
                                        value={parseFloat(activeLayer.style.borderWidth) || 0}
                                        onChange={(e) => updateLayerStyle(activeLayer.id, { borderWidth: parseFloat(e.target.value) || 0 })}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <span className="text-[10px] text-gray-500 block mb-1">Gaya Garis</span>
                                        <select 
                                            value={activeLayer.style.borderStyle || 'solid'}
                                            onChange={(e) => updateLayerStyle(activeLayer.id, { borderStyle: e.target.value })}
                                            className="w-full h-8 text-xs border-gray-300 rounded px-1"
                                        >
                                            <option value="solid">Solid (Utuh)</option>
                                            <option value="dashed">Dashed (Putus)</option>
                                            <option value="dotted">Dotted (Titik)</option>
                                        </select>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-500 block mb-1">Warna Garis</span>
                                        <input 
                                            type="color" 
                                            value={activeLayer.style.borderColor || '#000000'} 
                                            onChange={(e) => updateLayerStyle(activeLayer.id, { borderColor: e.target.value })} 
                                            className="w-full h-8 rounded cursor-pointer border border-gray-300 p-0" 
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    {/* Gradient Panel */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-3 flex justify-between items-center border-b border-gray-200">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-2">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                                Gradasi Warna
                            </label>
                            <button 
                                onClick={() => {
                                    const isActive = activeLayer.style.backgroundType === 'linear-gradient' || activeLayer.style.backgroundType === 'radial-gradient';
                                    updateLayerStyle(activeLayer.id, { backgroundType: isActive ? 'transparent' : 'linear-gradient' });
                                }}
                                className={`w-8 h-4 rounded-full relative transition-colors ${activeLayer.style.backgroundType === 'linear-gradient' || activeLayer.style.backgroundType === 'radial-gradient' ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                                <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${activeLayer.style.backgroundType === 'linear-gradient' || activeLayer.style.backgroundType === 'radial-gradient' ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                            </button>
                        </div>
                        
                        {(activeLayer.style.backgroundType === 'linear-gradient' || activeLayer.style.backgroundType === 'radial-gradient') && (
                            <div className="p-3 space-y-4 bg-white">
                                <div>
                                    <span className="text-[10px] text-gray-500 block mb-1">Tipe Gradasi</span>
                                    <div className="flex border border-gray-200 rounded text-xs overflow-hidden">
                                        <button 
                                            onClick={() => updateLayerStyle(activeLayer.id, { backgroundType: 'linear-gradient' })}
                                            className={`flex-1 py-1.5 ${activeLayer.style.backgroundType === 'linear-gradient' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-gray-50'}`}
                                        >Linear</button>
                                        <button 
                                            onClick={() => updateLayerStyle(activeLayer.id, { backgroundType: 'radial-gradient' })}
                                            className={`flex-1 py-1.5 border-l border-gray-200 ${activeLayer.style.backgroundType === 'radial-gradient' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-gray-50'}`}
                                        >Radial</button>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="p-2 border border-gray-100 rounded bg-gray-50">
                                        <span className="text-[10px] font-bold text-gray-600 block mb-2">Titik Warna 1</span>
                                        <div className="flex gap-2">
                                            <input type="color" value={activeLayer.style.gradientStart || '#ffffff'} onChange={(e) => updateLayerStyle(activeLayer.id, { gradientStart: e.target.value })} className="w-8 h-8 rounded cursor-pointer border border-gray-300 p-0 shrink-0" />
                                            <div className="flex-1">
                                                <div className="flex justify-between text-[9px] text-gray-500 mb-1">
                                                    <span>Opasitas</span>
                                                    <span>{activeLayer.style.gradientStartOpacity ?? 100}%</span>
                                                </div>
                                                <input type="range" min="0" max="100" value={activeLayer.style.gradientStartOpacity ?? 100} onChange={(e) => updateLayerStyle(activeLayer.id, { gradientStartOpacity: parseInt(e.target.value) })} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-2 border border-gray-100 rounded bg-gray-50">
                                        <span className="text-[10px] font-bold text-gray-600 block mb-2">Titik Warna 2</span>
                                        <div className="flex gap-2">
                                            <input type="color" value={activeLayer.style.gradientEnd || '#000000'} onChange={(e) => updateLayerStyle(activeLayer.id, { gradientEnd: e.target.value })} className="w-8 h-8 rounded cursor-pointer border border-gray-300 p-0 shrink-0" />
                                            <div className="flex-1">
                                                <div className="flex justify-between text-[9px] text-gray-500 mb-1">
                                                    <span>Opasitas</span>
                                                    <span>{activeLayer.style.gradientEndOpacity ?? 100}%</span>
                                                </div>
                                                <input type="range" min="0" max="100" value={activeLayer.style.gradientEndOpacity ?? 100} onChange={(e) => updateLayerStyle(activeLayer.id, { gradientEndOpacity: parseInt(e.target.value) })} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {activeLayer.style.backgroundType === 'linear-gradient' && (
                                    <div>
                                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                            <span>Arah Sudut (Angle)</span>
                                            <span>{activeLayer.style.gradientAngle ?? 90}°</span>
                                        </div>
                                        <input type="range" min="0" max="360" value={activeLayer.style.gradientAngle ?? 90} onChange={(e) => updateLayerStyle(activeLayer.id, { gradientAngle: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Shadow Panel */}
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-3 flex justify-between items-center border-b border-gray-200">
                            <label className="text-xs font-bold text-gray-700 flex items-center gap-2">
                                <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>
                                Drop Shadow
                            </label>
                            <button 
                                onClick={() => updateLayerStyle(activeLayer.id, { isShadowActive: !activeLayer.style.isShadowActive })}
                                className={`w-8 h-4 rounded-full relative transition-colors ${activeLayer.style.isShadowActive ? 'bg-indigo-600' : 'bg-gray-300'}`}
                            >
                                <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${activeLayer.style.isShadowActive ? 'translate-x-4' : 'translate-x-0.5'}`}></div>
                            </button>
                        </div>

                        {activeLayer.style.isShadowActive && (
                            <div className="p-3 space-y-4 bg-white">
                                <div>
                                    <span className="text-[10px] text-gray-500 block mb-2">Preset Cepat</span>
                                    <div className="grid grid-cols-4 gap-2">
                                        {[
                                            { id: 'soft', name: 'Lembut', values: { shadowDistance: 8, shadowBlur: 20, shadowAngle: 90, shadowOpacity: 0.15, shadowColor: '#000000', shadowSpread: 0 } },
                                            { id: 'hard', name: 'Tegas', values: { shadowDistance: 5, shadowBlur: 0, shadowAngle: 45, shadowOpacity: 0.4, shadowColor: '#000000', shadowSpread: 0 } },
                                            { id: 'glow', name: 'Pendar', values: { shadowDistance: 0, shadowBlur: 15, shadowAngle: 0, shadowOpacity: 0.5, shadowColor: '#4f46e5', shadowSpread: 5 } },
                                            { id: 'float', name: 'Ngambang', values: { shadowDistance: 15, shadowBlur: 30, shadowAngle: 90, shadowOpacity: 0.1, shadowColor: '#000000', shadowSpread: -5 } }
                                        ].map(preset => (
                                            <button 
                                                key={preset.id}
                                                onClick={() => updateLayerStyle(activeLayer.id, preset.values)}
                                                className="flex flex-col items-center gap-1 p-2 border border-gray-100 rounded hover:bg-indigo-50 hover:border-indigo-200 transition-colors"
                                                title={preset.name}
                                            >
                                                <div className="w-5 h-5 bg-gray-200 rounded border border-gray-300" style={{ boxShadow: `2px 2px 5px rgba(0,0,0,0.3)` }}></div>
                                                <span className="text-[8px] text-gray-600">{preset.name}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                        <span>Warna & Opasitas</span>
                                        <span>{Math.round((activeLayer.style.shadowOpacity ?? 0.5) * 100)}%</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <input type="color" value={activeLayer.style.shadowColor || '#000000'} onChange={(e) => updateLayerStyle(activeLayer.id, { shadowColor: e.target.value })} className="w-8 h-8 rounded cursor-pointer border border-gray-300 p-0 shrink-0" />
                                        <input type="range" min="0" max="1" step="0.05" value={activeLayer.style.shadowOpacity ?? 0.5} onChange={(e) => updateLayerStyle(activeLayer.id, { shadowOpacity: parseFloat(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 mt-3" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                            <span>Arah (Angle)</span>
                                            <span>{activeLayer.style.shadowAngle ?? 90}°</span>
                                        </div>
                                        <input type="range" min="0" max="360" value={activeLayer.style.shadowAngle ?? 90} onChange={(e) => updateLayerStyle(activeLayer.id, { shadowAngle: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                    </div>
                                    
                                    <div>
                                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                            <span>Jarak (Distance)</span>
                                            <span>{activeLayer.style.shadowDistance ?? 0}px</span>
                                        </div>
                                        <input type="range" min="0" max="100" value={activeLayer.style.shadowDistance ?? 0} onChange={(e) => updateLayerStyle(activeLayer.id, { shadowDistance: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                            <span>Kehalusan (Blur)</span>
                                            <span>{activeLayer.style.shadowBlur ?? 0}px</span>
                                        </div>
                                        <input type="range" min="0" max="100" value={activeLayer.style.shadowBlur ?? 0} onChange={(e) => updateLayerStyle(activeLayer.id, { shadowBlur: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                            <span>Sebaran (Spread)</span>
                                            <span>{activeLayer.style.shadowSpread ?? 0}px</span>
                                        </div>
                                        <input type="range" min="-50" max="100" value={activeLayer.style.shadowSpread ?? 0} onChange={(e) => updateLayerStyle(activeLayer.id, { shadowSpread: parseInt(e.target.value) })} className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                </>
                )}


                {inspectorTab === 'animation' && (
                    <div className="space-y-6 pb-20">
                        {/* Entry/Exit Mode Switcher */}
                        <div className="px-1 flex bg-gray-100 p-1 rounded-lg gap-1 mb-4">
                            <button 
                                onClick={() => setAnimationMode('entry')}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${animationMode === 'entry' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500 hover:bg-gray-200'}`}
                            >
                                Masuk (Entry)
                            </button>
                            <button 
                                onClick={() => setAnimationMode('exit')}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${animationMode === 'exit' ? 'bg-white shadow-sm text-pink-600' : 'text-gray-500 hover:bg-gray-200'}`}
                            >
                                Keluar (Exit)
                            </button>
                        </div>

                        {ANIMATION_CATEGORIES.filter(c => animationMode === 'entry' || !c.isContinuous).map((category, catIdx) => {
                            const hasActiveAnimation = category.items.some(anim => {
                                if (category.isContinuous) return activeLayer.animation?.idle === anim.id;
                                return animationMode === 'entry' ? activeLayer.animation?.entry === anim.id : activeLayer.animation?.exit === anim.id;
                            });

                            return (
                                <div key={catIdx} className={catIdx > 0 ? "pt-6 border-t border-gray-100" : ""}>
                                    <div className="mb-3 px-1">
                                        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">{category.name} {category.isContinuous ? '' : (animationMode === 'exit' ? '(Saat Keluar)' : '(Saat Muncul)')}</h3>
                                        {category.isContinuous && <p className="text-[10px] text-gray-500 mt-1">Animasi yang berjalan terus menerus.</p>}
                                    </div>
                                    
                                    <div className="grid grid-cols-3 gap-2 px-1">
                                        {(catIdx === 0 || category.isContinuous) && (
                                            <button 
                                                onClick={() => {
                                                    if (category.isContinuous) {
                                                        updateLayerAnimation(activeLayer.id, { idle: null, configIdle: null });
                                                    } else {
                                                        if (animationMode === 'entry') {
                                                            updateLayerAnimation(activeLayer.id, { entry: null, config: null });
                                                        } else {
                                                            updateLayerAnimation(activeLayer.id, { exit: null, configExit: null });
                                                        }
                                                    }
                                                }}
                                                className="group flex flex-col items-center cursor-pointer p-1"
                                            >
                                                <div className="w-full h-14 mb-2 flex items-center justify-center border border-gray-200 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                                                    <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                                </div>
                                                <span className="text-[10px] text-gray-500 font-medium text-center">Tanpa Animasi</span>
                                            </button>
                                        )}

                                        {category.items.map(anim => {
                                            const isActive = category.isContinuous 
                                                ? activeLayer.animation?.idle === anim.id 
                                                : (animationMode === 'entry' ? activeLayer.animation?.entry === anim.id : activeLayer.animation?.exit === anim.id);

                                            return (
                                                <button 
                                                    key={anim.id}
                                                    onClick={() => {
                                                        if (category.isContinuous) {
                                                            updateLayerAnimation(activeLayer.id, { idle: anim.id });
                                                            if (!activeLayer.animation?.configIdle) updateLayerAnimation(activeLayer.id, { configIdle: { speed: 1 } });
                                                        } else {
                                                            let dir = 'default';
                                                            if (anim.id.includes('left')) dir = 'left';
                                                            else if (anim.id.includes('right')) dir = 'right';
                                                            else if (anim.id.includes('down')) dir = 'down';
                                                            else if (anim.id.includes('up')) dir = 'up';
                                                            else {
                                                                const conf = animationMode === 'entry' ? activeLayer.animation?.config : activeLayer.animation?.configExit;
                                                                if (conf?.direction) dir = conf.direction;
                                                            }

                                                            if (animationMode === 'entry') {
                                                                const currentConfig = activeLayer.animation?.config || { speed: 1.5, trigger: 'onLoad', delay: 0 };
                                                                updateLayerAnimation(activeLayer.id, { entry: anim.id, config: { ...currentConfig, direction: dir } });
                                                            } else {
                                                                const currentConfigExit = activeLayer.animation?.configExit || { speed: 1.5, delay: 0 };
                                                                updateLayerAnimation(activeLayer.id, { exit: anim.id, configExit: { ...currentConfigExit, direction: dir } });
                                                            }
                                                        }
                                                    }}
                                                    className="group flex flex-col items-center cursor-pointer outline-none"
                                                >
                                                    <div className={`w-full rounded-xl transition-all p-1 ${isActive ? 'bg-indigo-50 border-indigo-500 ring-1 ring-indigo-500' : 'border-transparent hover:bg-gray-50'}`}>
                                                        <AnimatedIcon anim={anim} isText={activeLayer.type === 'text' || activeLayer.type === 'dynamic_guest_name'} isActive={isActive} />
                                                        <span className={`text-[10px] text-center leading-tight block pb-1 ${isActive ? 'text-indigo-700 font-semibold' : 'text-gray-600 group-hover:text-gray-800'}`}>{anim.label}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>

                                    {/* Inline Configurator for Animations */}
                                    {!category.isContinuous && hasActiveAnimation && (animationMode === 'entry' ? activeLayer.animation?.entry : activeLayer.animation?.exit) && (
                                        <div className="mt-4 p-4 bg-gray-50/80 border border-indigo-100 rounded-xl space-y-4">
                                            
                                            {/* Delay Config */}
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[10px] font-bold text-gray-700">Waktu Jeda (Delay)</span>
                                                    <span className="text-[10px] font-bold text-indigo-600">{(animationMode === 'entry' ? activeLayer.animation.config?.delay : activeLayer.animation.configExit?.delay) || 0}s</span>
                                                </div>
                                                <input 
                                                    type="range" min="0" max="5" step="0.1"
                                                    value={(animationMode === 'entry' ? activeLayer.animation.config?.delay : activeLayer.animation.configExit?.delay) || 0}
                                                    onChange={(e) => {
                                                        if (animationMode === 'entry') {
                                                            const currentConfig = activeLayer.animation?.config || { speed: 1.5, delay: 0 };
                                                            updateLayerAnimation(activeLayer.id, { config: { ...currentConfig, delay: parseFloat(e.target.value) } });
                                                        } else {
                                                            const currentConfigExit = activeLayer.animation?.configExit || { speed: 1.5, delay: 0 };
                                                            updateLayerAnimation(activeLayer.id, { configExit: { ...currentConfigExit, delay: parseFloat(e.target.value) } });
                                                        }
                                                    }}
                                                    className="w-full accent-indigo-600"
                                                />
                                            </div>

                                            {/* Speed Config */}
                                            <div>
                                                <div className="flex justify-between items-center mb-1">
                                                    <span className="text-[10px] font-bold text-gray-700">Durasi (Kecepatan)</span>
                                                    <span className="text-[10px] font-bold text-indigo-600">{(animationMode === 'entry' ? activeLayer.animation.config?.speed : activeLayer.animation.configExit?.speed) || 1.5}s</span>
                                                </div>
                                                <input 
                                                    type="range" min="0.1" max="5" step="0.1"
                                                    value={(animationMode === 'entry' ? activeLayer.animation.config?.speed : activeLayer.animation.configExit?.speed) || 1.5}
                                                    onChange={(e) => {
                                                        if (animationMode === 'entry') {
                                                            const currentConfig = activeLayer.animation?.config || { speed: 1.5, delay: 0 };
                                                            updateLayerAnimation(activeLayer.id, { config: { ...currentConfig, speed: parseFloat(e.target.value) } });
                                                        } else {
                                                            const currentConfigExit = activeLayer.animation?.configExit || { speed: 1.5, delay: 0 };
                                                            updateLayerAnimation(activeLayer.id, { configExit: { ...currentConfigExit, speed: parseFloat(e.target.value) } });
                                                        }
                                                    }}
                                                    className="w-full accent-indigo-600"
                                                />
                                            </div>

                                            {/* Direction Config */}
                                            {['slide-up', 'slide-down', 'slide-left', 'slide-right', 'shift', 'bounce-text', 'ascend', 'wipe', 'drift', 'block-reveal'].includes(animationMode === 'entry' ? activeLayer.animation.entry : activeLayer.animation.exit) && (
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-700 block mb-2">Arah Gerak:</span>
                                                    <div className="grid grid-cols-4 gap-2">
                                                        {[
                                                            { id: 'up', icon: '↑', mapTo: 'slide-up' },
                                                            { id: 'right', icon: '→', mapTo: 'slide-right' },
                                                            { id: 'down', icon: '↓', mapTo: 'slide-down' },
                                                            { id: 'left', icon: '←', mapTo: 'slide-left' },
                                                        ].map(dir => {
                                                            const isActiveDir = (animationMode === 'entry' ? activeLayer.animation.config?.direction : activeLayer.animation.configExit?.direction) === dir.id;
                                                            return (
                                                                <button
                                                                    key={dir.id}
                                                                    onClick={() => {
                                                                        if (animationMode === 'entry') {
                                                                            const currentConfig = activeLayer.animation?.config || { speed: 1.5 };
                                                                            updateLayerAnimation(activeLayer.id, { config: { ...currentConfig, direction: dir.id } });
                                                                            
                                                                            if (activeLayer.animation.entry?.startsWith('slide-')) {
                                                                                updateLayerAnimation(activeLayer.id, { entry: dir.mapTo });
                                                                            }
                                                                        } else {
                                                                            const currentConfigExit = activeLayer.animation?.configExit || { speed: 1.5 };
                                                                            updateLayerAnimation(activeLayer.id, { configExit: { ...currentConfigExit, direction: dir.id } });
                                                                            
                                                                            if (activeLayer.animation.exit?.startsWith('slide-')) {
                                                                                updateLayerAnimation(activeLayer.id, { exit: dir.mapTo });
                                                                            }
                                                                        }
                                                                    }}
                                                                    className={`p-2 text-sm font-bold border rounded-lg flex items-center justify-center transition ${isActiveDir ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-gray-200 text-gray-400 hover:border-indigo-200 hover:bg-white'}`}
                                                                >
                                                                    {dir.icon}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            )}



                                            {/* Trigger Config - ONLY FOR ENTRY */}
                                            {animationMode === 'entry' && (
                                                <div>
                                                    <span className="text-[10px] font-bold text-gray-700 block mb-2">Pemicu Animasi:</span>
                                                    <div className="flex gap-1 bg-white p-1 rounded-lg border border-gray-200">
                                                        {['onLoad', 'onScroll'].map(trigger => (
                                                            <button 
                                                                key={trigger}
                                                                onClick={() => {
                                                                    const currentConfig = activeLayer.animation?.config || { speed: 1.5 };
                                                                    updateLayerAnimation(activeLayer.id, { config: { ...currentConfig, trigger } });
                                                                }}
                                                                className={`flex-1 py-1.5 text-[10px] font-medium rounded-md transition ${(activeLayer.animation.config?.trigger || 'onLoad') === trigger ? 'bg-indigo-100 text-indigo-700' : 'text-gray-500 hover:bg-gray-50'}`}
                                                            >
                                                                {trigger === 'onLoad' ? 'Saat Dimuat' : 'Saat Scroll'}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}


                                            {/* Looping */}
                                            <div className="pt-2 flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-[10px] font-bold text-gray-800">Looping Berkelanjutan</h3>
                                                    <p className="text-[9px] text-gray-500 mt-0.5">Animasi diputar bolak-balik terus menerus</p>
                                                </div>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={activeLayer.animation?.isLooping || false}
                                                        onChange={(e) => updateLayerAnimation(activeLayer.id, { isLooping: e.target.checked })}
                                                    />
                                                    <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    )}

                                    {/* Inline Configurator for Continuous Animations */}
                                    {category.isContinuous && activeLayer.animation?.idle && hasActiveAnimation && (
                                        <div className="mt-4 p-4 bg-gray-50/80 border border-indigo-100 rounded-xl space-y-4">
                                            {activeLayer.animation.idle === 'wind-sway' ? (
                                                <>
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-[10px] font-bold text-gray-700">Kekuatan Angin</span>
                                                            <span className="text-[10px] font-bold text-indigo-600">{activeLayer.animation.configIdle?.windStrength ?? 70}%</span>
                                                        </div>
                                                        <input 
                                                            type="range" min="0" max="100" step="1"
                                                            value={activeLayer.animation.configIdle?.windStrength ?? 70}
                                                            onChange={(e) => {
                                                                const currentConfig = activeLayer.animation?.configIdle || { windStrength: 70, stiffness: 60, damping: 40, randomize: true };
                                                                updateLayerAnimation(activeLayer.id, { configIdle: { ...currentConfig, windStrength: parseInt(e.target.value) } });
                                                            }}
                                                            className="w-full accent-indigo-600"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-[10px] font-bold text-gray-700">Kelenturan</span>
                                                            <span className="text-[10px] font-bold text-indigo-600">{activeLayer.animation.configIdle?.stiffness ?? 60}%</span>
                                                        </div>
                                                        <input 
                                                            type="range" min="0" max="100" step="1"
                                                            value={activeLayer.animation.configIdle?.stiffness ?? 60}
                                                            onChange={(e) => {
                                                                const currentConfig = activeLayer.animation?.configIdle || { windStrength: 70, stiffness: 60, damping: 40, randomize: true };
                                                                updateLayerAnimation(activeLayer.id, { configIdle: { ...currentConfig, stiffness: parseInt(e.target.value) } });
                                                            }}
                                                            className="w-full accent-indigo-600"
                                                        />
                                                    </div>
                                                    <div>
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-[10px] font-bold text-gray-700">Hambatan Udara</span>
                                                            <span className="text-[10px] font-bold text-indigo-600">{activeLayer.animation.configIdle?.damping ?? 40}%</span>
                                                        </div>
                                                        <input 
                                                            type="range" min="0" max="100" step="1"
                                                            value={activeLayer.animation.configIdle?.damping ?? 40}
                                                            onChange={(e) => {
                                                                const currentConfig = activeLayer.animation?.configIdle || { windStrength: 70, stiffness: 60, damping: 40, randomize: true };
                                                                updateLayerAnimation(activeLayer.id, { configIdle: { ...currentConfig, damping: parseInt(e.target.value) } });
                                                            }}
                                                            className="w-full accent-indigo-600"
                                                        />
                                                    </div>
                                                    <div className="pt-2 flex items-center justify-between">
                                                        <div>
                                                            <h3 className="text-[10px] font-bold text-gray-800">Acak Arah</h3>
                                                            <p className="text-[9px] text-gray-500 mt-0.5">Gerakan poros tidak selalu konstan</p>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer">
                                                            <input 
                                                                type="checkbox" 
                                                                className="sr-only peer" 
                                                                checked={activeLayer.animation.configIdle?.randomize ?? true}
                                                                onChange={(e) => {
                                                                    const currentConfig = activeLayer.animation?.configIdle || { windStrength: 70, stiffness: 60, damping: 40, randomize: true };
                                                                    updateLayerAnimation(activeLayer.id, { configIdle: { ...currentConfig, randomize: e.target.checked } });
                                                                }}
                                                            />
                                                            <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
                                                        </label>
                                                    </div>
                                                </>
                                            ) : (
                                                /* Speed Config for Normal Continuous */
                                                <div>
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[10px] font-bold text-gray-700">Durasi (Kecepatan)</span>
                                                        <span className="text-[10px] font-bold text-indigo-600">{activeLayer.animation.configIdle?.speed || 1}s</span>
                                                    </div>
                                                    <input 
                                                        type="range" min="0.1" max="5" step="0.1"
                                                        value={activeLayer.animation.configIdle?.speed || 1}
                                                        onChange={(e) => {
                                                            const currentConfig = activeLayer.animation?.configIdle || { speed: 1 };
                                                            updateLayerAnimation(activeLayer.id, { configIdle: { ...currentConfig, speed: parseFloat(e.target.value) } });
                                                        }}
                                                        className="w-full accent-indigo-600"
                                                    />
                                                </div>
                                            )}
                                            
                                            <button 
                                                onClick={() => updateLayerAnimation(activeLayer.id, { idle: null, configIdle: null })}
                                                className="w-full mt-2 py-2 text-[11px] font-medium text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-red-100"
                                            >
                                                Hapus Efek Tambahan
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Advanced Motion Panel (Kustomisasi Gerak / Keyframe) */}
                        <div className="mt-2 p-4 bg-white border border-gray-200 rounded-xl space-y-4 shadow-sm">
                            <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-3">
                                <div className="flex gap-2 items-center">
                                    <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path></svg>
                                    <div>
                                        <h3 className="text-xs font-bold text-gray-800">Kustomisasi Gerak & Motion</h3>
                                        <p className="text-[10px] text-gray-500 mt-0.5">Atur Keyframe dan animasi lanjutan</p>
                                    </div>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input 
                                        type="checkbox" 
                                        className="sr-only peer" 
                                        checked={['custom_timeline', 'custom_path'].includes(activeLayer.animation?.idle)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                const targetIdle = customMotionTab === 'keyframes' ? 'custom_timeline' : 'custom_path';
                                                updateLayerAnimation(activeLayer.id, { idle: targetIdle, custom_keyframes: [] });
                                            } else {
                                                updateLayerAnimation(activeLayer.id, { idle: null, custom_keyframes: null, custom_path_data: null });
                                                setIsDrawingPath(false);
                                            }
                                        }}
                                    />
                                    <div className="w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-indigo-600"></div>
                                </label>
                            </div>

                            {['custom_timeline', 'custom_path'].includes(activeLayer.animation?.idle) && (
                                <div className="space-y-4">
                                    <div className="flex bg-gray-100 p-1 rounded-lg gap-1">
                                        <button 
                                            onClick={() => {
                                                setCustomMotionTab('keyframes');
                                                updateLayerAnimation(activeLayer.id, { idle: 'custom_timeline' });
                                                setIsDrawingPath(false);
                                            }}
                                            className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${customMotionTab === 'keyframes' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            Titik Bertahap
                                        </button>
                                        <button 
                                            onClick={() => {
                                                setCustomMotionTab('path');
                                                updateLayerAnimation(activeLayer.id, { idle: 'custom_path' });
                                            }}
                                            className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${customMotionTab === 'path' ? 'bg-white shadow-sm text-indigo-700' : 'text-gray-500 hover:bg-gray-200'}`}
                                        >
                                            Jalur Bebas
                                        </button>
                                    </div>

                                    {customMotionTab === 'keyframes' && (
                                        <>
                                            <div className="flex items-center justify-between bg-indigo-50 p-3 rounded-lg border border-indigo-100 mb-2">
                                                <div className="text-xs text-indigo-800">
                                                    <span className="font-bold block">Animasi Keyframe</span>
                                                    Geser elemen di kanvas lalu rekam sebagai titik pergerakan.
                                                </div>
                                            </div>
                                    
                                    {/* Pengaturan Looping */}
                                    {(activeLayer.animation?.custom_keyframes?.length > 0) && (
                                        <div className="flex items-center justify-between px-1 mb-2 border-b border-gray-100 pb-3">
                                            <label className="text-xs font-semibold text-gray-700">Looping Berkelanjutan</label>
                                            <label className="relative inline-flex items-center cursor-pointer">
                                                <input 
                                                    type="checkbox" 
                                                    className="sr-only peer" 
                                                    checked={activeLayer.animation?.isLooping ?? true}
                                                    onChange={(e) => updateLayerAnimation(activeLayer.id, { isLooping: e.target.checked })}
                                                />
                                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                            </label>
                                        </div>
                                    )}

                                    {/* Daftar Keyframes */}
                                    <div className="space-y-2">
                                        {(activeLayer.animation?.custom_keyframes || []).map((kf, index) => (
                                            <div key={kf.id} className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-indigo-300 transition-all mb-3 relative overflow-hidden group">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 rounded-l-xl"></div>
                                                <div className="flex items-center justify-between mb-3 pl-2">
                                                    <span className="text-xs font-bold text-gray-800 flex items-center gap-2">
                                                        <div className="w-5 h-5 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center text-[10px] shadow-inner">{index + 1}</div>
                                                        Titik {index + 1}
                                                    </span>
                                                    <div className="flex items-center gap-2">
                                                        <button 
                                                            onClick={() => {
                                                                const keyframes = [...activeLayer.animation.custom_keyframes];
                                                                keyframes[index] = {
                                                                    ...keyframes[index],
                                                                    x: activeLayer.style?.x || 0,
                                                                    y: activeLayer.style?.y || 0,
                                                                    opacity: activeLayer.style?.opacity ?? 1,
                                                                    scale: activeLayer.style?.scale ?? 1,
                                                                    rotation: activeLayer.style?.rotation || 0,
                                                                    width: activeLayer.style?.width !== undefined ? parseFloat(activeLayer.style.width) : undefined,
                                                                    height: activeLayer.style?.height !== undefined ? parseFloat(activeLayer.style.height) : undefined,
                                                                };
                                                                updateLayerAnimation(activeLayer.id, { custom_keyframes: keyframes });
                                                                alert('Titik ' + (index + 1) + ' telah diperbarui dengan posisi elemen saat ini di kanvas!');
                                                            }} 
                                                            className="flex items-center gap-1 text-[9px] font-semibold text-indigo-600 hover:text-white hover:bg-indigo-500 px-2 py-1 bg-indigo-50 rounded-md transition-colors"
                                                            title="Timpa dengan posisi elemen saat ini"
                                                        >
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                                                            Sync Canvas
                                                        </button>
                                                        <button onClick={() => handleRemoveKeyframe(index)} className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-md transition-colors" title="Hapus Titik">
                                                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 gap-2 pl-2">
                                                    <div>
                                                        <label className="text-[9px] font-semibold text-gray-500 mb-1 block">Posisi X (px)</label>
                                                        <input 
                                                            type="number" 
                                                            value={Math.round(kf.x)}
                                                            onChange={(e) => handleUpdateKeyframe(index, 'x', parseFloat(e.target.value) || 0)}
                                                            className="w-full text-xs p-1.5 border border-gray-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-semibold text-gray-500 mb-1 block">Posisi Y (px)</label>
                                                        <input 
                                                            type="number" 
                                                            value={Math.round(kf.y)}
                                                            onChange={(e) => handleUpdateKeyframe(index, 'y', parseFloat(e.target.value) || 0)}
                                                            className="w-full text-xs p-1.5 border border-gray-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-semibold text-gray-500 mb-1 block">Opasitas (0-1)</label>
                                                        <input 
                                                            type="number" min="0" max="1" step="0.1"
                                                            value={kf.opacity ?? 1}
                                                            onChange={(e) => handleUpdateKeyframe(index, 'opacity', parseFloat(e.target.value) ?? 1)}
                                                            className="w-full text-xs p-1.5 border border-gray-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[9px] font-semibold text-gray-500 mb-1 block">Skala (Besar)</label>
                                                        <input 
                                                            type="number" min="0.1" step="0.1"
                                                            value={kf.scale ?? 1}
                                                            onChange={(e) => handleUpdateKeyframe(index, 'scale', parseFloat(e.target.value) ?? 1)}
                                                            className="w-full text-xs p-1.5 border border-gray-200 rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 bg-gray-50"
                                                        />
                                                    </div>
                                                </div>
                                                
                                                {index > 0 && (
                                                    <>
                                                        <div className="mt-3 pl-2 pt-3 border-t border-gray-100">
                                                            <div className="flex justify-between items-center mb-1">
                                                                <span className="text-[10px] font-semibold text-gray-600 block">Waktu Tempuh (s)</span>
                                                                <span className="text-[10px] font-bold text-indigo-600">{kf.duration || 1}s</span>
                                                            </div>
                                                            <input 
                                                                type="range" min="0" max="15" step="0.05"
                                                                value={kf.duration || 1}
                                                                onChange={(e) => handleUpdateKeyframe(index, 'duration', parseFloat(e.target.value))}
                                                                className="w-full accent-indigo-600 cursor-pointer"
                                                            />
                                                        </div>

                                                        <div className="mt-3 pl-2">
                                                            <label className="text-[10px] font-semibold text-gray-600 mb-1 block">Gaya Gerak (Ease)</label>
                                                            <div className="relative">
                                                                <select 
                                                                    value={kf.ease}
                                                                    onChange={(e) => handleUpdateKeyframe(index, 'ease', e.target.value)}
                                                                    className="appearance-none w-full text-[11px] font-medium text-gray-700 bg-gray-50 border border-gray-200 hover:border-indigo-400 hover:bg-white rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer shadow-sm"
                                                                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`, backgroundPosition: 'right 0.5rem center', backgroundRepeat: 'no-repeat', backgroundSize: '1.5em 1.5em' }}
                                                                >
                                                                    <option value="none">Linear (Datar & Konstan)</option>
                                                                    <option value="power1.inOut">Smooth (Mulus Alami)</option>
                                                                    <option value="power2.in">Ease In (Makin Cepat)</option>
                                                                    <option value="power2.out">Ease Out (Makin Lambat)</option>
                                                                    <option value="back.out(1.7)">Back (Mendal Kelebihan)</option>
                                                                    <option value="bounce.out">Bounce (Memantul)</option>
                                                                    <option value="elastic.out(1, 0.3)">Elastic (Seperti Karet)</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                                {index === 0 && (
                                                    <div className="mt-2 pl-2 pt-2 border-t border-gray-100">
                                                        <span className="text-[9px] text-gray-400 italic block">Titik 1 adalah titik awal, durasi & transisi diatur di titik selanjutnya.</span>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="flex flex-col gap-2 mt-4">
                                        <button 
                                            onClick={handleAddKeyframe}
                                            className="w-full py-3 border-2 border-dashed border-indigo-300 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 hover:border-indigo-400 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                            {(activeLayer.animation?.custom_keyframes?.length > 0) ? 'Rekam Titik Selanjutnya' : 'Mulai Rekam Titik 1'}
                                        </button>
                                        
                                        {(activeLayer.animation?.custom_keyframes?.length > 0) && (
                                            <button 
                                                onClick={() => {
                                                    const currentConfig = activeLayer.animation?.config || { speed: 1.5 };
                                                    updateLayerAnimation(activeLayer.id, { config: { ...currentConfig, previewKey: Date.now() } });
                                                }}
                                                className="w-full py-2 bg-indigo-600 text-white hover:bg-indigo-700 font-bold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-sm"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                Preview Animasi
                                            </button>
                                        )}
                                    </div>
                                            <p className="text-[10px] text-gray-400 mt-2 text-center">
                                                Geser elemen di kanvas atau ubah gaya di panel atas terlebih dahulu, lalu klik rekam. Jika titik salah, Anda bisa menimpanya dengan ikon <i>refresh</i>.
                                            </p>
                                        </>
                                    )}

                                    {customMotionTab === 'path' && (
                                        <div className="space-y-4">
                                            {/* Info Box */}
                                            <div className="flex gap-3 bg-indigo-50/80 p-3.5 rounded-xl border border-indigo-100/50">
                                                <div className="shrink-0 mt-0.5">
                                                    <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                </div>
                                                <div className="text-[11px] text-indigo-900/80 leading-relaxed">
                                                    <span className="font-bold block text-indigo-900 mb-0.5">Animasi Jalur (Freehand)</span>
                                                    Pilih tombol rekam di bawah, lalu seret langsung elemen ini di kanvas untuk menggambar rute kemanapun Anda mau.
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <button 
                                                onClick={() => setIsDrawingPath(!isDrawingPath)}
                                                className={`w-full py-3 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm ${isDrawingPath ? 'bg-red-500 text-white shadow-red-500/20 hover:bg-red-600' : 'bg-indigo-600 text-white shadow-indigo-600/20 hover:bg-indigo-700 hover:shadow-md hover:-translate-y-0.5'}`}
                                            >
                                                {isDrawingPath ? (
                                                    <>
                                                        <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"></circle></svg>
                                                        Selesai & Berhenti Merekam
                                                    </>
                                                ) : (
                                                    <>
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                                        {activeLayer.animation?.idle === 'custom_path' && activeLayer.animation?.custom_path_data ? 'Rekam Ulang Jalur' : 'Mulai Rekam Jalur Baru'}
                                                    </>
                                                )}
                                            </button>

                                            {activeLayer.animation?.idle === 'custom_path' && activeLayer.animation?.custom_path_data && (
                                                <div className="mt-5 space-y-5 bg-white p-4 rounded-xl border border-gray-100 shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
                                                    
                                                    {/* Slider Durasi */}
                                                    <div>
                                                        <div className="flex justify-between items-center mb-2">
                                                            <label className="text-[11px] font-bold text-gray-700">Waktu Tempuh</label>
                                                            <div className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-0.5 rounded-md border border-indigo-100">
                                                                {activeLayer.animation.custom_path_data.duration || 5}s
                                                            </div>
                                                        </div>
                                                        <div className="relative flex items-center gap-3">
                                                            <span className="text-[9px] text-gray-400 font-medium">0.5s</span>
                                                            <input 
                                                                type="range" min="0.5" max="30" step="0.5"
                                                                value={activeLayer.animation.custom_path_data.duration || 5}
                                                                onChange={(e) => {
                                                                    updateLayerAnimation(activeLayer.id, { 
                                                                        custom_path_data: { ...activeLayer.animation.custom_path_data, duration: parseFloat(e.target.value) } 
                                                                    });
                                                                }}
                                                                className="flex-1 h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                                                            />
                                                            <span className="text-[9px] text-gray-400 font-medium">30s</span>
                                                        </div>
                                                    </div>

                                                    {/* Toggle Rotasi */}
                                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                        <div className="pr-4">
                                                            <h3 className="text-[11px] font-bold text-gray-800">Auto Rotate (Rotasi)</h3>
                                                            <p className="text-[9px] text-gray-500 mt-1 leading-snug">Ujung depan elemen akan menghadap ke arah jalannya rute</p>
                                                        </div>
                                                        <label className="relative inline-flex items-center cursor-pointer shrink-0">
                                                            <input 
                                                                type="checkbox" 
                                                                className="sr-only peer" 
                                                                checked={activeLayer.animation.custom_path_data.autoRotate || false}
                                                                onChange={(e) => {
                                                                    updateLayerAnimation(activeLayer.id, { 
                                                                        custom_path_data: { ...activeLayer.animation.custom_path_data, autoRotate: e.target.checked } 
                                                                    });
                                                                }}
                                                            />
                                                            <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                                                        </label>
                                                    </div>

                                                    {/* Grid Gaya Gerak */}
                                                    <div className="pt-4 border-t border-gray-100">
                                                        <div className="mb-3">
                                                            <h3 className="text-[11px] font-bold text-gray-800">Gaya Gerak (Ease)</h3>
                                                            <p className="text-[9px] text-gray-500 mt-0.5">Pilih dinamika laju pergerakan elemen</p>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            {[
                                                                { id: 'none', label: 'Konstan', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 21L21 3" /> },
                                                                { id: 'power2.inOut', label: 'Mulus', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 21c9 0 9-18 18-18" /> },
                                                                { id: 'power2.out', label: 'Melambat', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 21c0-12 6-18 18-18" /> },
                                                                { id: 'bounce.out', label: 'Memantul', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 21c3-10 6-10 9 0 2-5 4-5 6 0 1-2 2-2 3 0" /> },
                                                                { id: 'elastic.out(1, 0.3)', label: 'Kenyal', icon: <path strokeLinecap="round" strokeLinejoin="round" d="M3 21c2-15 4 5 6-8 2 10 3-4 5 2 1-3 2 0 4 0" /> },
                                                            ].map((easeOption) => {
                                                                const isActive = (activeLayer.animation.custom_path_data.ease || 'power2.inOut') === easeOption.id;
                                                                return (
                                                                    <button
                                                                        key={easeOption.id}
                                                                        onClick={() => {
                                                                            updateLayerAnimation(activeLayer.id, { 
                                                                                custom_path_data: { ...activeLayer.animation.custom_path_data, ease: easeOption.id } 
                                                                            });
                                                                        }}
                                                                        className={`relative flex flex-col items-center justify-center p-2.5 rounded-xl border-2 transition-all group ${isActive ? 'border-indigo-500 bg-indigo-50/50 shadow-[0_2px_8px_rgba(99,102,241,0.15)]' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
                                                                    >
                                                                        {isActive && (
                                                                            <div className="absolute top-1.5 right-1.5">
                                                                                <svg className="w-3 h-3 text-indigo-600" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                                                            </div>
                                                                        )}
                                                                        <div className={`w-8 h-8 mb-1.5 flex items-center justify-center rounded-lg transition-colors ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-white text-gray-400 shadow-sm group-hover:text-gray-600'}`}>
                                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                                                                                {easeOption.icon}
                                                                            </svg>
                                                                        </div>
                                                                        <span className={`text-[9px] font-bold text-center leading-tight ${isActive ? 'text-indigo-700' : 'text-gray-500 group-hover:text-gray-700'}`}>
                                                                            {easeOption.label}
                                                                        </span>
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </div>
                            )}
                        </div>
                    </div>
                )}


                {inspectorTab === 'album' && activeLayer.type === 'photo_album' && (
                    <div className="space-y-6 pb-20">
                        {editingAlbumPhotoIdx !== null ? (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-4 bg-gray-50 p-2 rounded border border-gray-200">
                                    <h3 className="text-xs font-bold text-gray-800 flex items-center gap-2">
                                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                                        Edit Efek Visual (Foto {editingAlbumPhotoIdx + 1})
                                    </h3>
                                    <button 
                                        onClick={() => setEditingAlbumPhotoIdx(null)}
                                        className="py-1 px-2 text-[10px] font-bold bg-white border border-gray-300 rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
                                    >
                                        <svg className="w-3 h-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                                        Kembali
                                    </button>
                                </div>
                                <div className="space-y-6">
                                    {Object.entries(
                                        IMAGE_FILTERS.reduce((acc, filter) => {
                                            if (!acc[filter.category]) acc[filter.category] = [];
                                            acc[filter.category].push(filter);
                                            return acc;
                                        }, {})
                                    ).map(([category, filters]) => (
                                        <div key={category} className="space-y-3">
                                            <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider sticky top-0 bg-white/90 backdrop-blur py-1 z-10 border-b border-gray-100">{category}</h3>
                                            <div className="grid grid-cols-3 gap-3">
                                                {filters.map(filter => {
                                                    const currentImage = activeLayer.style?.albumData?.images?.[editingAlbumPhotoIdx];
                                                    if (!currentImage) return null;
                                                    const isSelected = (currentImage.filterId || 'none') === filter.id;

                                                    return (
                                                        <div 
                                                            key={filter.id}
                                                            onClick={() => {
                                                                const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                                                const newImages = [...currentData.images];
                                                                newImages[editingAlbumPhotoIdx].filterId = filter.id;
                                                                updateLayerStyle(activeLayer.id, { albumData: { ...currentData, images: newImages } });
                                                            }}
                                                            className="flex flex-col items-center gap-2 cursor-pointer group"
                                                        >
                                                            <div className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${isSelected ? 'border-indigo-600 ring-2 ring-indigo-200 shadow-md' : 'border-transparent group-hover:border-gray-300 bg-gray-50'}`}>
                                                                <img 
                                                                    src={currentImage.url} 
                                                                    alt={filter.name} 
                                                                    className="w-full h-full object-cover"
                                                                    style={{ filter: filter.getCss(100) }}
                                                                />
                                                            </div>
                                                            <span className={`text-[10px] text-center font-medium leading-tight ${isSelected ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}>{filter.name}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <h3 className="text-[11px] font-bold text-gray-800 uppercase tracking-wider mb-2 bg-gray-100 p-2 rounded">Pengaturan Wadah Album</h3>
                            
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-2">Gaya Animasi Album</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, animationStyle: 'slide' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.animationStyle || 'slide') === 'slide' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
                                        <span className="text-[10px] font-bold">Geser (Slide)</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, animationStyle: 'coverflow' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.animationStyle || 'slide') === 'coverflow' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                        <span className="text-[10px] font-bold">Usap (Coverflow)</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, animationStyle: 'cards' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.animationStyle || 'slide') === 'cards' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                                        <span className="text-[10px] font-bold">Tumpuk (Cards)</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, animationStyle: 'fade' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.animationStyle || 'slide') === 'fade' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                        <span className="text-[10px] font-bold">Pudar (Fade)</span>
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg space-y-3">
                                <label className="text-xs font-bold text-gray-700 block mb-1">Pengaturan Animasi</label>
                                
                                {(activeLayer.style?.albumData?.animationStyle === 'slide' || !activeLayer.style?.albumData?.animationStyle) && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-gray-500">Arah Gerak</span>
                                        <select
                                            value={activeLayer.style?.albumData?.direction || 'horizontal'}
                                            onChange={(e) => {
                                                const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                                updateLayerStyle(activeLayer.id, { albumData: { ...currentData, direction: e.target.value } });
                                            }}
                                            className="text-[10px] border border-gray-300 rounded p-1 outline-none focus:border-indigo-500 text-gray-700 bg-white"
                                        >
                                            <option value="horizontal">Horizontal (Kiri-Kanan)</option>
                                            <option value="vertical">Vertikal (Atas-Bawah)</option>
                                        </select>
                                    </div>
                                )}

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-gray-500">Kecepatan Transisi</span>
                                        <span className="text-[10px] font-bold text-indigo-600">{activeLayer.style?.albumData?.speed || 500}ms</span>
                                    </div>
                                    <input 
                                        type="range" min="100" max="3000" step="100"
                                        value={activeLayer.style?.albumData?.speed || 500}
                                        onChange={(e) => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, speed: parseInt(e.target.value) } });
                                        }}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-[10px] font-bold text-gray-500">Jeda Autoplay</span>
                                        <span className="text-[10px] font-bold text-indigo-600">{(activeLayer.style?.albumData?.autoplayDelay || 2500) / 1000}s</span>
                                    </div>
                                    <input 
                                        type="range" min="1000" max="10000" step="500"
                                        value={activeLayer.style?.albumData?.autoplayDelay || 2500}
                                        onChange={(e) => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, autoplayDelay: parseInt(e.target.value) } });
                                        }}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-2">Bentuk Frame Foto</label>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, shape: 'square' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.shape || 'square') === 'square' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" strokeWidth="2"></rect></svg>
                                        <span className="text-[10px] font-bold">Kotak</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, shape: 'rounded' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.shape || 'square') === 'rounded' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="18" height="18" x="3" y="3" rx="4" ry="4" strokeWidth="2"></rect></svg>
                                        <span className="text-[10px] font-bold">Sudut Melengkung</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, shape: 'circle' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.shape || 'square') === 'circle' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" strokeWidth="2"></circle></svg>
                                        <span className="text-[10px] font-bold">Lingkaran</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, shape: 'pill' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.shape || 'square') === 'pill' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="10" x="2" y="7" rx="5" ry="5" strokeWidth="2"></rect></svg>
                                        <span className="text-[10px] font-bold">Kapsul</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, shape: 'arch' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.shape || 'square') === 'arch' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M4 21V12a8 8 0 0116 0v9" strokeWidth="2" strokeLinecap="round"></path></svg>
                                        <span className="text-[10px] font-bold">Kubah</span>
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <label className="text-xs font-bold text-gray-700 block mb-2">Gaya & Template Polaroid</label>
                                <p className="text-[10px] text-gray-500 mb-3">Pilih desain frame estetik untuk foto-foto Anda.</p>
                                <div className="grid grid-cols-3 gap-2">
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, polaroidTheme: 'none' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${(!activeLayer.style?.albumData?.polaroidTheme || activeLayer.style.albumData.polaroidTheme === 'none') ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-8 h-10 border border-gray-300 rounded mb-2 flex items-center justify-center bg-gray-100">
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        </div>
                                        <span className="text-[10px] font-bold text-center">Tanpa Polaroid</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, polaroidTheme: 'classic' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.polaroidTheme === 'classic') ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-8 h-10 bg-white border border-gray-200 shadow-sm p-1 pb-3 flex flex-col mb-2 items-center">
                                            <div className="w-full h-full bg-gray-300"></div>
                                            <div className="w-4 h-[2px] bg-gray-300 rounded-full mt-1"></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-center">Klasik Bawah</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, polaroidTheme: 'classic-notext' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.polaroidTheme === 'classic-notext') ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-8 h-10 bg-white border border-gray-200 shadow-sm p-1 pb-1 flex flex-col mb-2 items-center">
                                            <div className="w-full h-full bg-gray-300"></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-center">Klasik (No Teks)</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, polaroidTheme: 'vintage' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.polaroidTheme === 'vintage') ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-8 h-10 bg-[#f4f1ea] border border-gray-300 shadow-sm p-1 pb-3 flex flex-col mb-2 transform rotate-[-3deg] items-center">
                                            <div className="w-full h-full bg-orange-200/50"></div>
                                            <div className="w-5 h-[2px] bg-orange-900/50 rounded-full mt-1 transform rotate-2"></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-center">Vintage / Retro</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, polaroidTheme: 'toptext' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.polaroidTheme === 'toptext') ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-8 h-10 bg-white border border-gray-200 shadow-sm p-1 pt-3 flex flex-col mb-2 items-center">
                                            <div className="w-5 h-[2px] bg-gray-400 rounded-full mb-1"></div>
                                            <div className="w-full h-full bg-gray-300"></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-center">Jurnal Atas</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, polaroidTheme: 'modern' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.polaroidTheme === 'modern') ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-8 h-10 bg-white shadow p-1 rounded-md flex flex-col mb-2 items-center">
                                            <div className="w-full h-full bg-blue-100 rounded-sm"></div>
                                            <div className="w-3 h-[2px] bg-gray-800 rounded-full mt-[3px]"></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-center">Modern Bawah</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, polaroidTheme: 'modern-notext' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.polaroidTheme === 'modern-notext') ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-8 h-10 bg-white shadow p-1 rounded-md flex flex-col mb-2 items-center">
                                            <div className="w-full h-full bg-blue-100 rounded-sm"></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-center">Modern (No Teks)</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, polaroidTheme: 'film' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.polaroidTheme === 'film') ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-8 h-10 bg-gray-900 p-[2px] py-1 flex flex-col mb-2 items-center border-x-[3px] border-dotted border-gray-600 relative">
                                            <div className="w-full h-full bg-gray-300"></div>
                                            <div className="w-4 h-[2px] bg-gray-400 rounded-full mt-1"></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-center">Film Strip</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                            updateLayerStyle(activeLayer.id, { albumData: { ...currentData, polaroidTheme: 'tape' } });
                                        }}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${(activeLayer.style?.albumData?.polaroidTheme === 'tape') ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-8 h-10 bg-[#fafafa] border border-gray-200 shadow-sm p-1 flex flex-col mb-2 relative items-center">
                                            <div className="absolute top-[-4px] left-1/2 transform -translate-x-1/2 rotate-[-4deg] w-6 h-2 bg-yellow-100/80 border border-yellow-200/50 z-10"></div>
                                            <div className="w-full h-full bg-gray-300 mt-1"></div>
                                        </div>
                                        <span className="text-[10px] font-bold text-center">Selotip (No Teks)</span>
                                    </button>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-4 mt-4">
                                <label className="text-xs font-bold text-gray-700 block mb-2">Daftar Foto</label>
                                <p className="text-[10px] text-gray-500 mb-3">Upload foto untuk ditambahkan ke album ini.</p>
                                
                                <button 
                                    onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.multiple = true;
                                        input.onchange = (e) => {
                                            const files = Array.from(e.target.files);
                                            files.forEach(file => {
                                                const reader = new FileReader();
                                                reader.onload = (re) => {
                                                    const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                                    const newImage = { url: re.target.result, caption: '', filterId: 'none' };
                                                    updateLayerStyle(activeLayer.id, { albumData: { ...currentData, images: [...currentData.images, newImage] } });
                                                };
                                                reader.readAsDataURL(file);
                                            });
                                        };
                                        input.click();
                                    }}
                                    className="w-full py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg text-xs font-bold hover:bg-indigo-100 transition shadow-sm mb-3 flex items-center justify-center gap-1"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                    Tambah Foto
                                </button>

                                <div className="space-y-2">
                                    {(activeLayer.style?.albumData?.images || []).map((img, idx) => (
                                        <div key={idx} className="flex flex-col gap-2 bg-gray-50 p-2 rounded border border-gray-200">
                                            <div className="flex gap-2 items-center">
                                                <img src={img.url} alt="" className="w-8 h-8 object-cover rounded" />
                                                <input 
                                                    type="text" 
                                                    placeholder="Caption (opsional)" 
                                                    value={img.caption || ''}
                                                    onChange={(e) => {
                                                        const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                                        const newImages = [...currentData.images];
                                                        newImages[idx].caption = e.target.value;
                                                        updateLayerStyle(activeLayer.id, { albumData: { ...currentData, images: newImages } });
                                                    }}
                                                    className="flex-1 text-[10px] border border-gray-300 rounded p-1 outline-none focus:border-indigo-500"
                                                />
                                                <button 
                                                    onClick={() => {
                                                        const currentData = activeLayer.style?.albumData || { animationStyle: 'slide', shape: 'square', images: [] };
                                                        const newImages = [...currentData.images];
                                                        newImages.splice(idx, 1);
                                                        updateLayerStyle(activeLayer.id, { albumData: { ...currentData, images: newImages } });
                                                    }}
                                                    className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2 mt-1">
                                                <button
                                                    onClick={() => setEditingAlbumPhotoIdx(idx)}
                                                    className="flex items-center justify-center gap-1 flex-1 py-1.5 px-2 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 transition-colors shadow-sm"
                                                >
                                                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"></path></svg>
                                                    {img.filterId !== 'none' && img.filterId ? (IMAGE_FILTERS.find(f => f.id === img.filterId)?.name || 'Edit Efek Visual') : 'Edit Efek Visual'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {(!activeLayer.style?.albumData?.images || activeLayer.style.albumData.images.length === 0) && (
                                        <p className="text-[10px] text-gray-400 text-center py-4">Belum ada foto.</p>
                                    )}

                                    {/* Album Photo Adjustments */}
                                    {activeLayer.style?.albumData?.images && activeLayer.style.albumData.images.length > 0 && editingAlbumPhotoIdx !== null && (
                                        <div className="pt-4 border-t border-gray-200 mt-4 space-y-4">
                                            <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Penyesuaian Profesional</h3>
                                            
                                            <div>
                                                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                                    <span>Kecerahan (Brightness)</span>
                                                    <span>{Math.round((activeLayer.style.albumData.images[editingAlbumPhotoIdx]?.brightness ?? 1) * 100)}%</span>
                                                </div>
                                                <input type="range" min="0" max="2" step="0.05" value={activeLayer.style.albumData.images[editingAlbumPhotoIdx]?.brightness ?? 1} onChange={(e) => {
                                                    const newImages = [...activeLayer.style.albumData.images];
                                                    newImages[editingAlbumPhotoIdx].brightness = parseFloat(e.target.value);
                                                    updateLayerStyle(activeLayer.id, { albumData: { ...activeLayer.style.albumData, images: newImages } });
                                                }} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                            </div>

                                            <div>
                                                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                                    <span>Kontras (Contrast)</span>
                                                    <span>{Math.round((activeLayer.style.albumData.images[editingAlbumPhotoIdx]?.contrast ?? 1) * 100)}%</span>
                                                </div>
                                                <input type="range" min="0" max="2" step="0.05" value={activeLayer.style.albumData.images[editingAlbumPhotoIdx]?.contrast ?? 1} onChange={(e) => {
                                                    const newImages = [...activeLayer.style.albumData.images];
                                                    newImages[editingAlbumPhotoIdx].contrast = parseFloat(e.target.value);
                                                    updateLayerStyle(activeLayer.id, { albumData: { ...activeLayer.style.albumData, images: newImages } });
                                                }} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                            </div>

                                            <div>
                                                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                                    <span>Saturasi Warna</span>
                                                    <span>{Math.round((activeLayer.style.albumData.images[editingAlbumPhotoIdx]?.saturate ?? 1) * 100)}%</span>
                                                </div>
                                                <input type="range" min="0" max="2" step="0.05" value={activeLayer.style.albumData.images[editingAlbumPhotoIdx]?.saturate ?? 1} onChange={(e) => {
                                                    const newImages = [...activeLayer.style.albumData.images];
                                                    newImages[editingAlbumPhotoIdx].saturate = parseFloat(e.target.value);
                                                    updateLayerStyle(activeLayer.id, { albumData: { ...activeLayer.style.albumData, images: newImages } });
                                                }} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                            </div>

                                            <div>
                                                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                                                    <span>Efek Buram (Blur)</span>
                                                    <span>{activeLayer.style.albumData.images[editingAlbumPhotoIdx]?.blur ?? 0}px</span>
                                                </div>
                                                <input type="range" min="0" max="10" step="0.5" value={activeLayer.style.albumData.images[editingAlbumPhotoIdx]?.blur ?? 0} onChange={(e) => {
                                                    const newImages = [...activeLayer.style.albumData.images];
                                                    newImages[editingAlbumPhotoIdx].blur = parseFloat(e.target.value);
                                                    updateLayerStyle(activeLayer.id, { albumData: { ...activeLayer.style.albumData, images: newImages } });
                                                }} className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        )}
                    </div>
                )}

                {inspectorTab === 'interaction' && (
                    <div className="space-y-6 pb-20">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Jadikan Tombol Interaktif</h3>
                                <p className="text-[10px] text-gray-500 mt-1">Elemen akan memicu aksi saat ditekan</p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer" 
                                    checked={activeLayer.interaction?.isButton || false}
                                    onChange={(e) => updateLayerInteraction(activeLayer.id, { isButton: e.target.checked })}
                                />
                                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
                            </label>
                        </div>

                        {activeLayer.interaction?.isButton && (
                            <div className="space-y-4 pt-4 border-t border-gray-100">
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-2">Tipe Aksi</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            onClick={() => updateLayerInteraction(activeLayer.id, { action: 'open_invitation' })}
                                            className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${activeLayer.interaction?.action === 'open_invitation' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            <svg className={`w-5 h-5 mb-1 ${activeLayer.interaction?.action === 'open_invitation' ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M14 16a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                                            <span className={`text-[10px] text-center leading-tight ${activeLayer.interaction?.action === 'open_invitation' ? 'text-indigo-700 font-bold' : 'text-gray-600'}`}>Buka Undangan</span>
                                        </button>
                                        
                                        <button 
                                            onClick={() => updateLayerInteraction(activeLayer.id, { action: 'navigate' })}
                                            className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${activeLayer.interaction?.action === 'navigate' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            <svg className={`w-5 h-5 mb-1 ${activeLayer.interaction?.action === 'navigate' ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
                                            <span className={`text-[10px] text-center leading-tight ${activeLayer.interaction?.action === 'navigate' ? 'text-indigo-700 font-bold' : 'text-gray-600'}`}>Navigasi Scroll</span>
                                        </button>
                                        
                                        <button 
                                            onClick={() => updateLayerInteraction(activeLayer.id, { action: 'trigger_animation' })}
                                            className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${activeLayer.interaction?.action === 'trigger_animation' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            <svg className={`w-5 h-5 mb-1 ${activeLayer.interaction?.action === 'trigger_animation' ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                            <span className={`text-[10px] text-center leading-tight ${activeLayer.interaction?.action === 'trigger_animation' ? 'text-indigo-700 font-bold' : 'text-gray-600'}`}>Picu Elemen</span>
                                        </button>
                                        
                                        <button 
                                            onClick={() => updateLayerInteraction(activeLayer.id, { action: 'open_link' })}
                                            className={`flex flex-col items-center justify-center p-3 border rounded-lg transition-all ${activeLayer.interaction?.action === 'open_link' ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                        >
                                            <svg className={`w-5 h-5 mb-1 ${activeLayer.interaction?.action === 'open_link' ? 'text-indigo-600' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                            <span className={`text-[10px] text-center leading-tight ${activeLayer.interaction?.action === 'open_link' ? 'text-indigo-700 font-bold' : 'text-gray-600'}`}>Buka Tautan</span>
                                        </button>
                                    </div>
                                </div>

                                {activeLayer.interaction?.action === 'open_invitation' && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-2">Efek Transisi Cover</label>
                                        <div className="grid grid-cols-3 gap-2">
                                            {[
                                                { id: 'slide_up', label: 'Ke Atas', icon: <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path></svg> },
                                                { id: 'slide_down', label: 'Ke Bawah', icon: <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg> },
                                                { id: 'slide_left', label: 'Ke Kiri', icon: <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg> },
                                                { id: 'slide_right', label: 'Ke Kanan', icon: <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg> },
                                                { id: 'fade_out', label: 'Memudar', icon: <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path></svg> },
                                                { id: 'zoom_out', label: 'Mengecil', icon: <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7"></path></svg> },
                                                { id: 'zoom_in', label: 'Membesar', icon: <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"></path></svg> },
                                                { id: 'split_horizontal', label: 'Terbelah', icon: <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg> },
                                                { id: 'blur_out', label: 'Blur', icon: <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg> },
                                            ].map(transition => {
                                                const isActive = (activeLayer.interaction?.transition || 'slide_up') === transition.id;
                                                return (
                                                    <button
                                                        key={transition.id}
                                                        onClick={() => updateLayerInteraction(activeLayer.id, { transition: transition.id })}
                                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-all ${isActive ? 'border-indigo-500 bg-indigo-50 shadow-sm' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}`}
                                                    >
                                                        <div className={isActive ? 'text-indigo-600' : 'text-gray-500'}>
                                                            {transition.icon}
                                                        </div>
                                                        <span className={`text-[9px] text-center leading-tight mt-1 ${isActive ? 'text-indigo-700 font-bold' : 'text-gray-600'}`}>
                                                            {transition.label}
                                                        </span>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {activeLayer.interaction?.action === 'navigate' && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-2">Target ID Seksi (Section)</label>
                                        <input 
                                            type="text" 
                                            placeholder="Contoh: sec_12345"
                                            value={activeLayer.interaction?.targetId || ''}
                                            onChange={(e) => updateLayerInteraction(activeLayer.id, { targetId: e.target.value })}
                                            className="w-full border border-gray-300 rounded p-2 text-sm text-gray-800"
                                        />
                                    </div>
                                )}

                                {activeLayer.interaction?.action === 'trigger_animation' && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-2">Target ID Elemen</label>
                                        <input 
                                            type="text" 
                                            placeholder="Contoh: elem_12345"
                                            value={activeLayer.interaction?.targetId || ''}
                                            onChange={(e) => updateLayerInteraction(activeLayer.id, { targetId: e.target.value })}
                                            className="w-full border border-gray-300 rounded p-2 text-sm text-gray-800"
                                        />
                                    </div>
                                )}

                                {activeLayer.interaction?.action === 'open_link' && (
                                    <div>
                                        <label className="text-xs font-bold text-gray-700 block mb-2">URL Tautan</label>
                                        <input 
                                            type="text" 
                                            placeholder="https://google.com"
                                            value={activeLayer.interaction?.url || ''}
                                            onChange={(e) => updateLayerInteraction(activeLayer.id, { url: e.target.value })}
                                            className="w-full border border-gray-300 rounded p-2 text-sm text-gray-800"
                                        />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {inspectorTab === 'effects' && activeLayer.type === 'image' && (
                    <div className="space-y-6 pb-20">
                        <div className="space-y-6">
                            {/* Smart Background Removal */}
                            <div className="space-y-3 pb-4 border-b border-gray-100">
                                <div className="flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur py-1 z-10 border-b border-gray-100">
                                    <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider">Hapus Latar Belakang (AI)</h3>
                                    <label className="relative inline-flex items-center cursor-pointer">
                                        <input 
                                            type="checkbox" 
                                            className="sr-only peer" 
                                            checked={activeLayer.style?.removeBg || false}
                                            onChange={(e) => handleToggleRemoveBg(e.target.checked, activeLayer)}
                                            disabled={isRemovingBg}
                                        />
                                        <div className={`w-8 h-4 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all ${isRemovingBg ? 'opacity-50' : 'peer-checked:bg-indigo-600'}`}></div>
                                    </label>
                                </div>
                                
                                {isRemovingBg && (
                                    <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 flex flex-col items-center justify-center space-y-3 shadow-inner">
                                        <svg className="animate-spin h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <div className="text-center">
                                            <p className="text-xs font-bold text-indigo-800">Sedang Menghapus Latar...</p>
                                            <p className="text-[9px] text-indigo-600 mt-1">AI sedang memproses gambar Anda. Proses ini memakan waktu beberapa detik.</p>
                                        </div>
                                    </div>
                                )}
                                
                                {activeLayer.style?.removeBg && !isRemovingBg && (
                                    <div className="bg-green-50 border border-green-100 rounded-xl p-3 shadow-inner">
                                        <p className="text-[10px] text-green-700 text-center font-medium">Latar belakang berhasil dihapus oleh AI!</p>
                                    </div>
                                )}
                            </div>

                            {/* Grouping by Category */}
                            {Object.entries(
                                IMAGE_FILTERS.reduce((acc, filter) => {
                                    if (!acc[filter.category]) acc[filter.category] = [];
                                    acc[filter.category].push(filter);
                                    return acc;
                                }, {})
                            ).map(([category, filters]) => (
                                <div key={category} className="space-y-3">
                                    <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wider sticky top-0 bg-white/90 backdrop-blur py-1 z-10 border-b border-gray-100">{category}</h3>
                                    <div className="grid grid-cols-3 gap-3">
                                        {filters.map(filter => (
                                            <React.Fragment key={filter.id}>
                                                <div 
                                                    onClick={() => {
                                                        updateLayerStyle(activeLayer.id, { 
                                                            imageFilter: filter.id,
                                                            imageFilterIntensity: activeLayer.style?.imageFilterIntensity ?? 100
                                                        });
                                                    }}
                                                    className="flex flex-col items-center gap-2 cursor-pointer group"
                                                >
                                                    <div className={`w-full aspect-square rounded-xl overflow-hidden border-2 transition-all ${activeLayer.style?.imageFilter === filter.id ? 'border-indigo-600 ring-2 ring-indigo-200 shadow-md' : 'border-transparent group-hover:border-gray-300 bg-gray-50'}`}>
                                                        <img 
                                                            src={activeLayer.url} 
                                                            alt={filter.name} 
                                                            className="w-full h-full object-cover"
                                                            style={{ filter: filter.getCss(100) }}
                                                        />
                                                    </div>
                                                    <span className={`text-[10px] text-center font-medium leading-tight ${activeLayer.style?.imageFilter === filter.id ? 'text-indigo-600 font-bold' : 'text-gray-600'}`}>{filter.name}</span>
                                                </div>
                                                
                                                {/* Intensitas Slider di bawah item terpilih */}
                                                {activeLayer.style?.imageFilter === filter.id && filter.id !== 'none' && (
                                                    <div className="col-span-3 bg-gray-50 p-4 rounded-xl border border-indigo-100 shadow-inner mt-1 mb-2 relative">
                                                        <div className="relative z-10 flex justify-between items-center mb-2">
                                                            <label className="text-[11px] font-bold text-gray-800">Intensitas {filter.name}</label>
                                                            <span className="text-[10px] text-gray-500 font-medium bg-white px-2 py-0.5 rounded border border-gray-200">
                                                                {activeLayer.style?.imageFilterIntensity ?? 100}%
                                                            </span>
                                                        </div>
                                                        <input 
                                                            type="range" 
                                                            min="0" max="100" 
                                                            value={activeLayer.style?.imageFilterIntensity ?? 100}
                                                            onChange={(e) => updateLayerStyle(activeLayer.id, { imageFilterIntensity: parseInt(e.target.value) })}
                                                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 relative z-10"
                                                        />
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            

                        </div>
                    </div>
                )}
                {inspectorTab === 'rsvp' && (activeLayer.type === 'interactive_rsvp' || activeLayer.type === 'interactive_comments') && (
                    <div className="space-y-6 pb-20">
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-2 bg-gray-100 p-2 rounded">Tema & Tampilan</h3>
                            
                            <div>
                                <label className="text-[11px] font-bold text-gray-800 block mb-2">Tema Form RSVP</label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={() => updateLayerStyle(activeLayer.id, { rsvpTheme: 'solid' })}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${(activeLayer.style?.rsvpTheme || 'solid') === 'solid' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-10 h-8 bg-white border border-gray-300 rounded shadow-sm mb-1"></div>
                                        <span className="text-[9px] font-bold">Solid</span>
                                    </button>
                                    <button 
                                        onClick={() => updateLayerStyle(activeLayer.id, { rsvpTheme: 'glass' })}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${activeLayer.style?.rsvpTheme === 'glass' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-10 h-8 bg-blue-100/30 border border-blue-200/50 rounded backdrop-blur-sm mb-1 relative overflow-hidden">
                                            <div className="absolute inset-0 bg-gradient-to-tr from-white/40 to-transparent"></div>
                                        </div>
                                        <span className="text-[9px] font-bold">Glassmorphism</span>
                                    </button>
                                    <button 
                                        onClick={() => updateLayerStyle(activeLayer.id, { rsvpTheme: 'romance' })}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${activeLayer.style?.rsvpTheme === 'romance' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-10 h-8 bg-rose-50 border border-rose-200 rounded-2xl shadow-sm mb-1 flex items-center justify-center">
                                            <div className="w-4 h-0.5 bg-rose-300 rounded-full"></div>
                                        </div>
                                        <span className="text-[9px] font-bold">Romance</span>
                                    </button>
                                    <button 
                                        onClick={() => updateLayerStyle(activeLayer.id, { rsvpTheme: 'classic' })}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${activeLayer.style?.rsvpTheme === 'classic' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-10 h-8 bg-[#fdfbf7] border-2 border-double border-amber-600 rounded mb-1"></div>
                                        <span className="text-[9px] font-bold">Klasik (Double)</span>
                                    </button>
                                    <button 
                                        onClick={() => updateLayerStyle(activeLayer.id, { rsvpTheme: 'adat' })}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${activeLayer.style?.rsvpTheme === 'adat' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-10 h-8 bg-[#faf4ec] border border-[#8b5a2b] rounded-t-full mb-1"></div>
                                        <span className="text-[9px] font-bold">Adat / Tradisional</span>
                                    </button>
                                    <button 
                                        onClick={() => updateLayerStyle(activeLayer.id, { rsvpTheme: 'minimalist' })}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${activeLayer.style?.rsvpTheme === 'minimalist' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-10 h-8 bg-transparent border border-gray-300 border-dashed rounded mb-1"></div>
                                        <span className="text-[9px] font-bold">Minimalis</span>
                                    </button>
                                    <button 
                                        onClick={() => updateLayerStyle(activeLayer.id, { rsvpTheme: 'rustic' })}
                                        className={`flex flex-col items-center justify-center p-2 border rounded-lg transition-colors ${activeLayer.style?.rsvpTheme === 'rustic' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 hover:border-indigo-300 text-gray-500 hover:bg-gray-50'}`}
                                    >
                                        <div className="w-10 h-8 bg-[#f3efe6] border-2 border-stone-400 rounded-lg mb-1 relative">
                                            <div className="absolute inset-1 border border-stone-300 border-dashed"></div>
                                        </div>
                                        <span className="text-[9px] font-bold">Rustic</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-800 block mb-2">Warna Latar (Background)</label>
                                <div className="flex items-center gap-2 mb-3">
                                    <input 
                                        type="color" 
                                        value={activeLayer.style?.backgroundColor || '#ffffff'}
                                        onChange={(e) => updateLayerStyle(activeLayer.id, { backgroundColor: e.target.value })}
                                        className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                    />
                                    <span className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200 uppercase flex-1 text-center">
                                        {activeLayer.style?.backgroundColor || '#FFFFFF'}
                                    </span>
                                </div>
                                
                                <label className="text-[11px] font-bold text-gray-800 block mb-2">Gambar Latar (Opsional)</label>
                                <div className="flex flex-col gap-2">
                                    <button 
                                        onClick={() => document.getElementById('rsvp-bg-upload').click()}
                                        className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold py-2 px-4 rounded transition text-sm flex items-center justify-center gap-2 border border-indigo-200"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                        {activeLayer.style?.backgroundImageUrl ? 'Ganti Gambar Latar' : 'Unggah Gambar Latar'}
                                    </button>
                                    <input 
                                        id="rsvp-bg-upload"
                                        type="file" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (ev) => {
                                                    updateLayerStyle(activeLayer.id, { backgroundImageUrl: ev.target.result });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                            e.target.value = null;
                                        }} 
                                    />
                                    {activeLayer.style?.backgroundImageUrl && (
                                        <button 
                                            onClick={() => updateLayerStyle(activeLayer.id, { backgroundImageUrl: null })}
                                            className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded transition text-[10px] flex items-center justify-center gap-2"
                                        >
                                            Hapus Gambar
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-800 block mb-2">Warna Teks Utama</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="color" 
                                        value={activeLayer.style?.textColor || '#1f2937'}
                                        onChange={(e) => updateLayerStyle(activeLayer.id, { textColor: e.target.value })}
                                        className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                    />
                                    <span className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200 uppercase flex-1 text-center">
                                        {activeLayer.style?.textColor || '#1F2937'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <h3 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-2 bg-gray-100 p-2 rounded">Elemen Input & Tombol</h3>
                            
                            <div>
                                <label className="text-[11px] font-bold text-gray-800 block mb-2">Warna Latar Input Kolom</label>
                                <div className="flex flex-col gap-3">
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="color" 
                                            value={activeLayer.style?.inputBackgroundColor || '#f3f4f6'}
                                            onChange={(e) => updateLayerStyle(activeLayer.id, { inputBackgroundColor: e.target.value })}
                                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                        />
                                        <span className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200 uppercase flex-1 text-center">
                                            {activeLayer.style?.inputBackgroundColor || '#F3F4F6'}
                                        </span>
                                    </div>
                                    <div className="border border-gray-100 rounded p-2 bg-gray-50">
                                        <div className="flex justify-between text-[9px] text-gray-500 mb-1">
                                            <span className="font-bold">Opasitas (Transparansi)</span>
                                            <span>{Math.round((activeLayer.style?.inputBackgroundOpacity ?? 1) * 100)}%</span>
                                        </div>
                                        <input 
                                            type="range" min="0" max="1" step="0.05" 
                                            value={activeLayer.style?.inputBackgroundOpacity ?? 1} 
                                            onChange={(e) => updateLayerStyle(activeLayer.id, { inputBackgroundOpacity: parseFloat(e.target.value) })} 
                                            className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600" 
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-800 block mb-2">Warna Tombol Kirim</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="color" 
                                        value={activeLayer.style?.buttonColor || '#4f46e5'}
                                        onChange={(e) => updateLayerStyle(activeLayer.id, { buttonColor: e.target.value })}
                                        className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                    />
                                    <span className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200 uppercase flex-1 text-center">
                                        {activeLayer.style?.buttonColor || '#4F46E5'}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-800 block mb-2">Warna Teks Tombol</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="color" 
                                        value={activeLayer.style?.buttonTextColor || '#ffffff'}
                                        onChange={(e) => updateLayerStyle(activeLayer.id, { buttonTextColor: e.target.value })}
                                        className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                    />
                                    <span className="text-xs text-gray-600 font-mono bg-gray-50 px-2 py-1 rounded border border-gray-200 uppercase flex-1 text-center">
                                        {activeLayer.style?.buttonTextColor || '#FFFFFF'}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                )}

                {inspectorTab === 'map' && activeLayer.type === 'interactive_map' && (
                    <div className="space-y-4">
                        <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg mb-4">
                            <h3 className="text-[11px] font-bold text-blue-800 uppercase tracking-wider mb-1">Pengaturan Peta</h3>
                            <p className="text-[10px] text-blue-600">Sesuaikan lokasi dan tampilan Google Maps Anda.</p>
                        </div>
                        
                        <div>
                            <span className="text-xs font-bold text-gray-800 block mb-2">Link Google Maps</span>
                            <textarea 
                                id={`map_input_${activeLayer.id}`}
                                key={`map_input_${activeLayer.id}`}
                                className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500" 
                                rows="4"
                                placeholder="https://maps.google.com/..."
                                defaultValue={activeLayer.content === 'Google Maps' ? '' : (activeLayer.content || '')}
                                onChange={(e) => updateLayerContent(activeLayer.id, e.target.value)}
                                onBlur={(e) => updateLayerContent(activeLayer.id, e.target.value)}
                            ></textarea>
                            
                            <button 
                                onClick={() => {
                                    const val = document.getElementById(`map_input_${activeLayer.id}`).value;
                                    updateLayerContent(activeLayer.id, val);
                                }}
                                className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                Simpan Link Peta
                            </button>

                            <div className="mt-3">
                                <p className="text-[10px] text-gray-500 leading-relaxed text-center">
                                    Tempelkan link Anda di atas, lalu klik <strong>Simpan Link Peta</strong> untuk mengonfirmasi.
                                </p>
                            </div>
                        </div>

                        <div className="border-t border-gray-100 pt-4">
                            <label className="text-xs font-bold text-gray-800 block mb-3">Tampilan Peta</label>
                            
                            <div className="grid grid-cols-2 gap-2 mb-4">
                                <button
                                    onClick={() => updateLayerStyle(activeLayer.id, { mapDisplayType: 'full' })}
                                    className={`py-2 px-3 text-[11px] font-bold rounded-lg border flex flex-col items-center gap-1 transition-all ${activeLayer.style?.mapDisplayType !== 'button_only' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"></path></svg>
                                    Peta + Tombol
                                </button>
                                <button
                                    onClick={() => updateLayerStyle(activeLayer.id, { mapDisplayType: 'button_only' })}
                                    className={`py-2 px-3 text-[11px] font-bold rounded-lg border flex flex-col items-center gap-1 transition-all ${activeLayer.style?.mapDisplayType === 'button_only' ? 'border-indigo-500 bg-indigo-50 text-indigo-600' : 'border-gray-200 text-gray-500 hover:bg-gray-50'}`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path></svg>
                                    Tombol Saja
                                </button>
                            </div>

                            {activeLayer.style?.mapDisplayType !== 'button_only' && (
                                <div className="mb-4">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-[11px] font-bold text-gray-700">Opasitas Peta</label>
                                        <span className="text-[10px] text-gray-500 font-mono">{Math.round((activeLayer.style?.mapOpacity ?? 1) * 100)}%</span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="1" step="0.05"
                                        value={activeLayer.style?.mapOpacity ?? 1}
                                        onChange={(e) => updateLayerStyle(activeLayer.id, { mapOpacity: parseFloat(e.target.value) })}
                                        className="w-full accent-indigo-600 cursor-pointer"
                                    />
                                    <p className="text-[9px] text-gray-400 mt-1">Hilangkan background (opasitas 0%) untuk menyisakan tombol saja secara halus.</p>
                                </div>
                            )}

                            <div className="space-y-3 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-700 block mb-1">Teks Tombol</label>
                                    <input 
                                        type="text" 
                                        value={activeLayer.style?.mapButtonText || 'Buka Google Maps'}
                                        onChange={(e) => updateLayerStyle(activeLayer.id, { mapButtonText: e.target.value })}
                                        className="w-full text-xs p-1.5 border border-gray-200 rounded focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-700 block mb-1">Warna Tombol</label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="color" 
                                                value={activeLayer.style?.mapButtonColor || '#ef4444'}
                                                onChange={(e) => updateLayerStyle(activeLayer.id, { mapButtonColor: e.target.value })}
                                                className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                                            />
                                            <span className="text-[9px] font-mono text-gray-500">{activeLayer.style?.mapButtonColor || '#ef4444'}</span>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-700 block mb-1">Warna Teks</label>
                                        <div className="flex items-center gap-2">
                                            <input 
                                                type="color" 
                                                value={activeLayer.style?.mapButtonTextColor || '#ffffff'}
                                                onChange={(e) => updateLayerStyle(activeLayer.id, { mapButtonTextColor: e.target.value })}
                                                className="w-6 h-6 p-0 border-0 rounded cursor-pointer"
                                            />
                                            <span className="text-[9px] font-mono text-gray-500">{activeLayer.style?.mapButtonTextColor || '#ffffff'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {inspectorTab === 'countdown' && activeLayer.type === 'interactive_countdown' && (
                    <div className="space-y-6 pb-20">
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-2 bg-gray-100 p-2 rounded">Pengaturan Hitung Mundur</h3>
                            
                            <div>
                                <label className="text-[11px] font-bold text-gray-800 block mb-2">Tanggal & Waktu Target</label>
                                <input 
                                    type="datetime-local" 
                                    value={activeLayer.style?.countdownTarget || ''}
                                    onChange={(e) => updateLayerStyle(activeLayer.id, { countdownTarget: e.target.value })}
                                    className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-800 block mb-2">Pilihan Font</label>
                                <button 
                                    onClick={() => setActiveTab('fonts')}
                                    className="w-full flex items-center justify-between text-sm border border-gray-300 rounded p-2 focus:border-indigo-500 bg-white hover:bg-gray-50 transition-colors text-left"
                                >
                                    <span style={{ fontFamily: activeLayer.style?.fontFamily || 'monospace' }}>
                                        {activeLayer.style?.fontFamily || 'Monospace Default'}
                                    </span>
                                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                </button>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-800 block mb-2">Warna Teks</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="color" 
                                        value={activeLayer.style?.countdownColor || '#ffffff'}
                                        onChange={(e) => updateLayerStyle(activeLayer.id, { countdownColor: e.target.value })}
                                        className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                    />
                                    <input 
                                        type="text" 
                                        value={activeLayer.style?.countdownColor || '#ffffff'}
                                        onChange={(e) => updateLayerStyle(activeLayer.id, { countdownColor: e.target.value })}
                                        className="flex-1 border border-gray-300 rounded p-1.5 text-[10px] focus:ring-1 focus:ring-indigo-500 outline-none uppercase w-full min-w-0"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[11px] font-bold text-gray-800 block mb-2">Gaya Latar</label>
                                    <select 
                                        value={activeLayer.style?.countdownBgStyle || 'glass'}
                                        onChange={(e) => updateLayerStyle(activeLayer.id, { countdownBgStyle: e.target.value })}
                                        className="w-full text-[11px] border border-gray-300 rounded p-1.5 focus:ring-1 focus:ring-indigo-500 outline-none h-8"
                                    >
                                        <option value="glass">Efek Kaca</option>
                                        <option value="solid">Solid/Biasa</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-gray-800 block mb-2">Warna Latar</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="color" 
                                            value={activeLayer.style?.countdownBgColor || '#111827'}
                                            onChange={(e) => updateLayerStyle(activeLayer.id, { countdownBgColor: e.target.value })}
                                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                        />
                                        <input 
                                            type="text" 
                                            value={activeLayer.style?.countdownBgColor || '#111827'}
                                            onChange={(e) => updateLayerStyle(activeLayer.id, { countdownBgColor: e.target.value })}
                                            className="flex-1 border border-gray-300 rounded p-1.5 text-[10px] focus:ring-1 focus:ring-indigo-500 outline-none uppercase w-full min-w-0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-[11px] font-bold text-gray-800">Opasitas Background</label>
                                    <span className="text-xs text-gray-500">{Math.round((activeLayer.style?.countdownBgOpacity ?? 0.8) * 100)}%</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" max="1" step="0.01"
                                    value={activeLayer.style?.countdownBgOpacity ?? 0.8}
                                    onChange={(e) => updateLayerStyle(activeLayer.id, { countdownBgOpacity: parseFloat(e.target.value) })}
                                    className="w-full accent-indigo-600"
                                />
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <label className="text-[11px] font-bold text-gray-800">Jarak Antar Waktu (Gap)</label>
                                    <span className="text-xs text-gray-500">{activeLayer.style?.countdownGap ?? 16}px</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="0" max="40" step="1"
                                    value={activeLayer.style?.countdownGap ?? 16}
                                    onChange={(e) => updateLayerStyle(activeLayer.id, { countdownGap: parseInt(e.target.value) })}
                                    className="w-full accent-indigo-600"
                                />
                            </div>

                            <div>
                                <label className="flex items-center gap-2 cursor-pointer mt-2">
                                    <input 
                                        type="checkbox" 
                                        checked={activeLayer.style?.countdownShowSeconds || false}
                                        onChange={(e) => updateLayerStyle(activeLayer.id, { countdownShowSeconds: e.target.checked })}
                                        className="w-4 h-4 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
                                    />
                                    <span className="text-[11px] font-bold text-gray-800">Tampilkan Detik</span>
                                </label>
                            </div>

                            <div>
                                <label className="text-[11px] font-bold text-gray-800 block mb-2">Atau Gunakan Gambar Latar</label>
                                <button 
                                    onClick={() => {
                                        const input = document.createElement('input');
                                        input.type = 'file';
                                        input.accept = 'image/*';
                                        input.onchange = (e) => {
                                            const file = e.target.files[0];
                                            if (file) {
                                                const reader = new FileReader();
                                                reader.onload = (re) => {
                                                    updateLayerStyle(activeLayer.id, { countdownBgImage: re.target.result });
                                                };
                                                reader.readAsDataURL(file);
                                            }
                                        };
                                        input.click();
                                    }}
                                    className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2 px-4 rounded transition flex items-center justify-center gap-2"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    Upload Gambar
                                </button>
                                {activeLayer.style?.countdownBgImage && (
                                    <div className="mt-2 relative">
                                        <img src={activeLayer.style.countdownBgImage} className="w-full h-24 object-cover rounded border border-gray-200" alt="Background Preview" />
                                        <button 
                                            onClick={() => updateLayerStyle(activeLayer.id, { countdownBgImage: null })}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {inspectorTab === 'copy' && activeLayer.type === 'interactive_copy' && (
                    <div className="space-y-6 pb-20">
                        <div className="space-y-4">
                            <h3 className="font-bold text-gray-800 text-[11px] uppercase tracking-wider mb-2 bg-gray-100 p-2 rounded">Pengaturan Salin Rekening</h3>
                            
                            <div>
                                <label className="text-[11px] font-bold text-gray-800 block mb-2">Isi Rekening / Teks</label>
                                <input 
                                    type="text" 
                                    value={activeLayer.content || ''}
                                    placeholder="Cth: BCA 1234567890 (Budi)"
                                    onChange={(e) => updateLayerContent(activeLayer.id, e.target.value)}
                                    className="w-full text-sm border border-gray-300 rounded p-2 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[11px] font-bold text-gray-800 block mb-2">Warna Teks Utama</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="color" 
                                            value={activeLayer.style?.textColor || '#1f2937'}
                                            onChange={(e) => updateLayerStyle(activeLayer.id, { textColor: e.target.value })}
                                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                        />
                                        <span className="text-[10px] font-mono text-gray-500">{activeLayer.style?.textColor || '#1f2937'}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-[11px] font-bold text-gray-800">Opasitas Teks</label>
                                        <span className="text-[10px] font-mono text-gray-500">{Math.round((activeLayer.style?.textOpacity ?? 1) * 100)}%</span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="1" step="0.05"
                                        value={activeLayer.style?.textOpacity ?? 1}
                                        onChange={(e) => updateLayerStyle(activeLayer.id, { textOpacity: parseFloat(e.target.value) })}
                                        className="w-full accent-indigo-600 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[11px] font-bold text-gray-800 block mb-2">Warna Latar Belakang</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="color" 
                                            value={activeLayer.style?.backgroundColor || '#ffffff'}
                                            onChange={(e) => updateLayerStyle(activeLayer.id, { backgroundColor: e.target.value })}
                                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                        />
                                        <span className="text-[10px] font-mono text-gray-500">{activeLayer.style?.backgroundColor || '#ffffff'}</span>
                                    </div>
                                </div>
                                <div>
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="text-[11px] font-bold text-gray-800">Opasitas Latar</label>
                                        <span className="text-[10px] font-mono text-gray-500">{Math.round((activeLayer.style?.bgOpacity ?? 1) * 100)}%</span>
                                    </div>
                                    <input 
                                        type="range" min="0" max="1" step="0.05"
                                        value={activeLayer.style?.bgOpacity ?? 1}
                                        onChange={(e) => updateLayerStyle(activeLayer.id, { bgOpacity: parseFloat(e.target.value) })}
                                        className="w-full accent-indigo-600 cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[11px] font-bold text-gray-800 block mb-2">Warna Ikon Salin</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="color" 
                                            value={activeLayer.style?.iconColor || '#4f46e5'}
                                            onChange={(e) => updateLayerStyle(activeLayer.id, { iconColor: e.target.value })}
                                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                        />
                                        <span className="text-[10px] font-mono text-gray-500">{activeLayer.style?.iconColor || '#4f46e5'}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[11px] font-bold text-gray-800 block mb-2">Latar Ikon Salin</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="color" 
                                            value={activeLayer.style?.iconBgColor || '#e0e7ff'}
                                            onChange={(e) => updateLayerStyle(activeLayer.id, { iconBgColor: e.target.value })}
                                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                        />
                                        <span className="text-[10px] font-mono text-gray-500">{activeLayer.style?.iconBgColor || '#e0e7ff'}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[11px] font-bold text-gray-800 block mb-2">Warna Garis Tepi</label>
                                    <div className="flex items-center gap-2">
                                        <input 
                                            type="color" 
                                            value={activeLayer.style?.borderColor || '#e5e7eb'}
                                            onChange={(e) => updateLayerStyle(activeLayer.id, { borderColor: e.target.value })}
                                            className="w-8 h-8 rounded cursor-pointer border-0 p-0"
                                        />
                                        <span className="text-[10px] font-mono text-gray-500">{activeLayer.style?.borderColor || '#e5e7eb'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            </div>
        </div>
    );
};

export default RightInspector;
