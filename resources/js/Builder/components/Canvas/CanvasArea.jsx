import React, { useEffect, useState } from 'react';
import useCanvasStore from '../../stores/useCanvasStore';
import useUIStore from '../../stores/useUIStore';
import LayerElement from './LayerElement';
import PathVisualizerOverlay from './PathVisualizerOverlay';
import IframePreview from './IframePreview';
import Particles from "@tsparticles/react";
import { tsParticles } from "@tsparticles/engine";
import { loadFireflyPreset } from "@tsparticles/preset-firefly";
import { loadSnowPreset } from "@tsparticles/preset-snow";
import apiClient from '../../utils/apiClient';

const SnapLinesOverlay = ({ sectionId }) => {
    const snapLines = useUIStore((state) => state.snapLines);
    const activeSectionId = useCanvasStore((state) => state.activeSectionId);
    
    if (activeSectionId !== sectionId || !snapLines) return null;

    return (
        <>
            {snapLines.map((line, i) => (
                <div 
                    key={`snap-${i}`}
                    style={{
                        position: 'absolute',
                        backgroundColor: line.type === 'center' ? '#f59e0b' : '#ec4899', // Orange for center, pink for edge
                        zIndex: 1000,
                        pointerEvents: 'none',
                        ...(line.axis === 'x' ? {
                            left: `${line.position}px`,
                            top: 0,
                            bottom: 0,
                            width: '1px'
                        } : {
                            top: `${line.position}px`,
                            left: 0,
                            right: 0,
                            height: '1px'
                        })
                    }}
                />
            ))}
        </>
    );
};

const CanvasArea = () => {
    const sections = useCanvasStore((state) => state.sections);
    const activeSectionId = useCanvasStore((state) => state.activeSectionId);
    const setActiveSection = useCanvasStore((state) => state.setActiveSection);
    const removeSection = useCanvasStore((state) => state.removeSection);
    const global_settings = useCanvasStore((state) => state.global_settings);
    const activeCanvasMode = useCanvasStore((state) => state.activeCanvasMode);
    const showGridLines = useUIStore((state) => state.showGridLines);
    const [init, setInit] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "copy";
    };

    const handleDrop = async (e) => {
        e.preventDefault();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            const file = e.dataTransfer.files[0];
            if (file.type.startsWith('image/')) {
                const formData = new FormData();
                formData.append('file', file);
                try {
                    const response = await apiClient.post('/admin/builder/upload', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                        },
                    });
                    
                    if (response.data.success) {
                        if (activeSectionId) {
                            useCanvasStore.getState().addLayer(activeSectionId, 'image', { url: response.data.url });
                        } else if (sections.length > 0) {
                            useCanvasStore.getState().addLayer(sections[0].id, 'image', { url: response.data.url });
                        }
                    }
                } catch (error) {
                    console.error('Error uploading dragged image:', error);
                    alert('Gagal mengupload gambar yang di-drag. Silakan coba lagi.');
                }
            }
        }
    };

    useEffect(() => {
        const initEngine = async () => {
            await loadFireflyPreset(tsParticles);
            await loadSnowPreset(tsParticles);
            setInit(true);
        };
        initEngine();
    }, []);

    // Cek apakah ada elemen di dalam section manapun
    const hasAnyLayers = sections.some(s => s.layers && s.layers.length > 0);
    // Jika ada injeksi kode Penuh dan tidak ada elemen, sembunyikan section default
    const hideEmptySections = global_settings?.custom_code && !hasAnyLayers;

    return (
        <div style={{ display: 'grid' }} onDragOver={handleDragOver} onDrop={handleDrop}>
            {global_settings?.custom_code && (
                <div style={{ gridArea: '1 / 1', zIndex: 0 }}>
                    <IframePreview 
                        htmlContent={global_settings.custom_code} 
                        style={{ position: 'relative', width: '100%', height: '100%' }}
                    />
                </div>
            )}

            {init && global_settings?.particleEffect && (
                <div style={{ gridArea: '1 / 1', zIndex: 0, pointerEvents: 'none' }}>
                    <Particles 
                        id="tsparticles" 
                        options={{ preset: global_settings.particleEffect, background: { opacity: 0 } }} 
                    />
                </div>
            )}

            <div style={{ gridArea: '1 / 1', zIndex: 10, display: 'flex', flexDirection: 'column', pointerEvents: 'none', width: '100%', height: '100%' }}>
                {activeCanvasMode === 'desktop' ? (
                    <section 
                        className="relative group z-10 w-full h-full"
                        style={{
                            flex: 1,
                            minHeight: '100%',
                            background: global_settings?.desktop_thumbnail?.background_color || '#1a1a1a',
                            overflow: 'hidden',
                            pointerEvents: 'auto'
                        }}
                    >
                        {/* Halaman Indicator */}
                        <div className="absolute top-0 left-0 z-50 px-3 py-1.5 text-[10px] font-bold tracking-wider rounded-br-lg shadow-sm border-b border-r bg-indigo-600 text-white border-indigo-700">
                            🖥️ KANVAS DESKTOP (16:9)
                        </div>

                        {global_settings?.desktop_layers?.map((layer) => (
                            <div key={layer.id} style={{ zIndex: layer.style?.zIndex || 1, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                                {!layer.isHidden && layer.children?.map(child => (
                                    <div key={child.id} style={{ pointerEvents: 'auto' }}>
                                        <LayerElement layer={child} sectionId="desktop" />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </section>
                ) : (
                    !hideEmptySections && (
                        sections.length === 0 ? (
                            <div style={{ padding: '40px 20px', textAlign: 'center', color: '#888', fontFamily: 'sans-serif', zIndex: 1, position: 'relative', pointerEvents: 'auto' }}>
                                {/* Placeholder jika belum ada data */}
                                <h2>Kanvas Kosong</h2>
                                <p>Tambahkan Section baru dari panel kontrol.</p>
                            </div>
                        ) : (
                            sections.map((section, index) => (
                                        <section 
                                            id={section.id}
                                            key={section.id} 
                                            onMouseDown={() => {
                                                if (global_settings?.custom_code) return; // Prevent selecting section if it's acting as a transparent overlay
                                                setActiveSection(section.id);
                                            }}
                                            className={`relative group ${activeSectionId === section.id ? 'ring-2 ring-inset ring-indigo-500 z-10' : 'z-0'} ${index > 0 ? 'border-t border-dashed border-gray-300' : ''}`}
                                        style={{
                                            minHeight: (() => {
                                                if (section.layout?.minHeight && section.layout.minHeight !== '844px' && section.layout.minHeight !== '100vh') {
                                                    return section.layout.minHeight;
                                                }
                                                if (index === 0) {
                                                    return '844px'; // Cover is 844px to match phone aspect ratio on PC
                                                }
                                                let maxY = 0;
                                                const checkLayer = (layer, parentY = 0) => {
                                                    const currentY = parentY + (parseFloat(layer.style?.y) || 0);
                                                    const bottom = currentY + (parseFloat(layer.style?.height) || 0);
                                                    if (bottom > maxY) maxY = bottom;
                                                    if (layer.children) {
                                                        layer.children.forEach(child => checkLayer(child, (layer.type === 'canvas_group' || layer.type === 'group') ? currentY : parentY));
                                                    }
                                                };
                                                section.layers?.forEach(l => checkLayer(l, 0));
                                                return maxY > 0 ? `${maxY}px` : (section.layout?.minHeight || '844px');
                                            })(),
                                        flex: 1, // Stretch to fill grid if iframe is taller
                                        height: 'auto',
                                        background: global_settings?.custom_code ? 'transparent' : (section.layout?.background_value || '#ffffff'),
                                        overflow: 'hidden',
                                        pointerEvents: global_settings?.custom_code ? 'none' : 'auto'
                                    }}
                                >
                        {/* Section Controls (Delete) - Only show if > 2 sections to prevent deleting primary content */}
                        {sections.length > 2 && index > 1 && activeSectionId === section.id && (
                            <div className="absolute top-2 right-2 z-50">
                                <button 
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if(await window.confirmAsync('Hapus halaman ini beserta semua isinya?', 'Hapus Halaman')) {
                                            removeSection(section.id);
                                        }
                                    }}
                                    className="p-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition"
                                    title="Hapus Halaman"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                </button>
                            </div>
                        )}
                        {/* Halaman Indicator */}
                        <div className={`absolute top-0 left-0 z-50 px-3 py-1.5 text-[10px] font-bold tracking-wider rounded-br-lg shadow-sm border-b border-r bg-indigo-600 text-white border-indigo-700`}>
                            {index === 0 ? '📄 HALAMAN SAMPUL (COVER)' : '📄 HALAMAN ISI'}
                        </div>

                        {/* Visual Grid Lines for Long Content Pages */}
                        {index > 0 && activeCanvasMode !== 'desktop' && showGridLines && (() => {
                            let maxY = 0;
                            const checkLayer = (layer, parentY = 0) => {
                                const currentY = parentY + (parseFloat(layer.style?.y) || 0);
                                const bottom = currentY + (parseFloat(layer.style?.height) || 0);
                                if (bottom > maxY) maxY = bottom;
                                if (layer.children) {
                                    layer.children.forEach(child => checkLayer(child, (layer.type === 'canvas_group' || layer.type === 'group') ? currentY : parentY));
                                }
                            };
                            section.layers?.forEach(l => checkLayer(l, 0));
                            
                            let sectionH = 844;
                            if (section.layout?.minHeight && section.layout.minHeight !== '844px' && section.layout.minHeight !== '100vh') {
                                sectionH = parseFloat(section.layout.minHeight);
                            } else if (maxY > 0) {
                                sectionH = maxY;
                            }

                            const grids = [];
                            for (let i = 844; i < sectionH; i += 844) {
                                grids.push(
                                    <div key={`grid-${i}`} className="absolute w-full z-[9999] flex items-center pointer-events-none" style={{ top: `${i}px` }}>
                                        <div className="flex-1 border-t border-dashed border-indigo-400/60"></div>
                                        <div className="px-2 py-0.5 bg-indigo-50 text-indigo-500 text-[10px] font-bold rounded-full mx-2 border border-indigo-300/50 shadow-sm">
                                            Batas Layar {Math.floor(i/844) + 1}
                                        </div>
                                        <div className="flex-1 border-t border-dashed border-indigo-400/60"></div>
                                    </div>
                                );
                            }
                            return grids;
                        })()}

                        {section.layers?.map((layer) => (
                            <div key={layer.id} style={{ zIndex: layer.style?.zIndex || 1, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                                {!layer.isHidden && layer.children?.map(child => (
                                    <div key={child.id} style={{ pointerEvents: 'auto' }}>
                                        <LayerElement layer={child} sectionId={section.id} />
                                    </div>
                                ))}
                            </div>
                        ))}

                        {/* Snap Lines Overlay */}
                        <SnapLinesOverlay sectionId={section.id} />
                        <PathVisualizerOverlay />

                        {/* Resize Handle for Content Pages */}
                        {index > 0 && (
                            <div 
                                className="absolute bottom-0 left-0 w-full h-4 bg-indigo-100 hover:bg-indigo-200 cursor-ns-resize flex items-center justify-center border-t border-indigo-200 z-50 transition-colors"
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    e.preventDefault();
                                    const sectionEl = e.currentTarget.parentElement;
                                    const startY = e.clientY;
                                    const startHeight = sectionEl.offsetHeight;
                                    
                                    const rect = sectionEl.getBoundingClientRect();
                                    const scale = startHeight > 0 ? rect.height / startHeight : 1;

                                    const handleMouseMove = (moveEvent) => {
                                        const diffScreen = moveEvent.clientY - startY;
                                        const diffReal = diffScreen / scale;
                                        const newHeight = Math.max(400, startHeight + diffReal);
                                        sectionEl.style.minHeight = `${newHeight}px`;
                                    };

                                    const handleMouseUp = (upEvent) => {
                                        const diffScreen = upEvent.clientY - startY;
                                        const diffReal = diffScreen / scale;
                                        const newHeight = Math.max(400, startHeight + diffReal);
                                        useCanvasStore.getState().updateSectionLayout(section.id, { minHeight: `${newHeight}px` });
                                        document.removeEventListener('mousemove', handleMouseMove);
                                        document.removeEventListener('mouseup', handleMouseUp);
                                    };

                                    document.addEventListener('mousemove', handleMouseMove);
                                    document.addEventListener('mouseup', handleMouseUp);
                                }}
                            >
                                <div className="w-12 h-1 bg-indigo-400 rounded-full"></div>
                            </div>
                        )}
                    </section>
                ))
            )
        )
    )}

            {!hideEmptySections && activeCanvasMode !== 'desktop' && sections.length < 2 && (
                <div className="flex justify-center p-6 relative z-50 pointer-events-auto">
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            useCanvasStore.getState().addSection();
                        }}
                        className="flex items-center gap-2 px-6 py-3 bg-white hover:bg-indigo-50 border-2 border-dashed border-indigo-300 hover:border-indigo-500 rounded-xl text-indigo-600 font-bold shadow-sm transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                        Tambah Halaman Isi
                    </button>
                </div>
            )}
            </div>
        </div>
    );
};

export default CanvasArea;
