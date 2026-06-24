import React, { useEffect, useState } from 'react';
import useCanvasStore from '../../stores/useCanvasStore';
import useUIStore from '../../stores/useUIStore';

import { ANIMATION_CATEGORIES, ANIMATION_STYLES } from '../../utils/animations';

const AnimatedIcon = ({ anim, isText = false, isActive = false }) => {
    return (
        <div className="w-full h-14 mb-2 flex items-center justify-center overflow-hidden border border-gray-100 bg-white rounded-lg group-hover:shadow-sm transition-shadow">
            {isText ? (
                <div 
                    className={`font-bold text-[20px] tracking-widest transition-colors ${isActive ? 'text-primary-600' : 'text-primary-600 group-hover:text-primary-500'}`} 
                    style={{ animation: anim.anim }}
                >
                    ABC
                </div>
            ) : (
                <div 
                    className={`w-8 h-8 rounded transition-colors ${isActive ? 'bg-primary-600' : 'bg-primary-500 group-hover:bg-primary-400'}`} 
                    style={{ animation: anim.anim }}
                ></div>
            )}
        </div>
    );
};

const AnimationPanel = () => {
    const activeLayerId = useCanvasStore(state => state.activeLayerId);
    const sections = useCanvasStore(state => state.sections);
    const updateLayerAnimation = useCanvasStore(state => state.updateLayerAnimation);
    
    const isDrawingPath = useUIStore(state => state.isDrawingPath);
    const setIsDrawingPath = useUIStore(state => state.setIsDrawingPath);

    const [subTab, setSubTab] = useState('teks');
    const [customMode, setCustomMode] = useState('keyframes');

    useEffect(() => {
        if (!document.getElementById('builder-anim-styles-panel')) {
            const style = document.createElement('style');
            style.id = 'builder-anim-styles-panel';
            style.innerHTML = ANIMATION_STYLES;
            document.head.appendChild(style);
        }
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
    const isText = activeLayer?.type === 'text' || activeLayer?.type === 'dynamic_guest_name';

    const handleAddKeyframe = () => {
        if (!activeLayer) return;
        const currentAnimation = activeLayer.animation || {};
        const keyframes = currentAnimation.custom_keyframes || [];
        
        // Capture current state
        const newKf = {
            id: 'kf_' + Date.now(),
            x: activeLayer.style?.x || 0,
            y: activeLayer.style?.y || 0,
            opacity: activeLayer.style?.opacity ?? 1,
            scale: activeLayer.style?.scale ?? 1,
            rotation: activeLayer.style?.rotation || 0,
            width: activeLayer.style?.width !== undefined ? parseFloat(activeLayer.style.width) : undefined,
            height: activeLayer.style?.height !== undefined ? parseFloat(activeLayer.style.height) : undefined,
            duration: 1.0, // Default speed to reach this point
            ease: 'none'
        };

        updateLayerAnimation(activeLayer.id, {
            idle: 'custom_timeline', // A special flag for engineGSAP
            custom_keyframes: [...keyframes, newKf],
            isLooping: currentAnimation.isLooping ?? true
        });
    };

    const handleUpdateKeyframe = (index, field, value) => {
        if (!activeLayer || !activeLayer.animation?.custom_keyframes) return;
        const keyframes = [...activeLayer.animation.custom_keyframes];
        keyframes[index][field] = value;
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

    if (!activeLayer) {
        return (
            <div className="p-8 text-center text-gray-500 text-sm">
                Pilih sebuah elemen di kanvas untuk melihat daftar animasi.
            </div>
        );
    }

    const setAnimation = (animId, isContinuous = false) => {
        const previewConfig = { previewKey: Date.now() };
        if (isContinuous) {
            updateLayerAnimation(activeLayer.id, { 
                idle: animId,
                config: { ...(activeLayer.animation?.config || {}), ...previewConfig },
                configIdle: activeLayer.animation?.configIdle || { speed: 1 }
            });
        } else {
            updateLayerAnimation(activeLayer.id, { 
                entry: animId,
                config: { ...(activeLayer.animation?.config || { speed: 1.5 }), ...previewConfig }
            });
        }
    };

    const currentEntryAnim = activeLayer.animation?.entry || '';
    const currentIdleAnim = activeLayer.animation?.idle || '';

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-4 border-b border-gray-100 shrink-0">
                <div className="flex bg-gray-100 rounded-lg p-1">
                    <button 
                        onClick={() => setSubTab('halaman')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${subTab === 'halaman' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Halaman
                    </button>
                    <button 
                        onClick={() => setSubTab('teks')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors ${subTab === 'teks' ? 'bg-white shadow-sm text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        {isText ? 'Teks' : 'Elemen'}
                    </button>
                    <button 
                        onClick={() => setSubTab('kustom')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-1 ${subTab === 'kustom' ? 'bg-primary-50 text-primary-600 shadow-sm' : 'text-primary-400 hover:text-primary-600'}`}
                    >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                        Kustom
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-8">
                    
                    {subTab === 'halaman' ? (
                        <div className="text-center text-gray-500 text-sm mt-10">
                            Fitur Animasi Halaman sedang dalam pengembangan. Silakan beralih ke tab Teks/Elemen.
                        </div>
                    ) : subTab === 'kustom' ? (
                        <div className="space-y-4">
                            {/* Toggle Mode Animasi Kustom */}
                            <div className="flex bg-gray-100 rounded-lg p-1 mb-2">
                                <button onClick={() => setCustomMode('keyframes')} className={`flex-1 py-1.5 text-xs rounded transition-colors ${customMode === 'keyframes' ? 'bg-white shadow text-primary-600 font-bold' : 'text-gray-500'}`}>Titik Bertahap</button>
                                <button onClick={() => setCustomMode('path')} className={`flex-1 py-1.5 text-xs rounded transition-colors ${customMode === 'path' ? 'bg-white shadow text-primary-600 font-bold' : 'text-gray-500'}`}>Jalur Bebas (Freehand)</button>
                            </div>

                            {customMode === 'keyframes' ? (
                                <>
                                    <div className="flex items-center justify-between bg-primary-50 p-3 rounded-lg border border-primary-100 mb-2">
                                        <div className="text-xs text-primary-800">
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
                                        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                                    </label>
                                </div>
                            )}

                            {/* Daftar Keyframes */}
                            <div className="space-y-2">
                                {(activeLayer.animation?.custom_keyframes || []).map((kf, index) => (
                                    <div key={kf.id} className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-primary-300 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-gray-800 flex items-center gap-2">
                                                <div className="w-5 h-5 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-[10px]">{index + 1}</div>
                                                Titik {index + 1}
                                            </span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                                                    X:{Math.round(kf.x)} Y:{Math.round(kf.y)}
                                                </span>
                                                <button onClick={() => handleRemoveKeyframe(index)} className="text-red-400 hover:text-red-600 p-1">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                                                </button>
                                            </div>
                                        </div>
                                        
                                        <div className="mt-1">
                                            {index > 0 && (
                                                <>
                                                    <div className="mt-3 pl-2 pt-3 border-t border-gray-100">
                                                        <div className="flex justify-between items-center mb-1">
                                                            <span className="text-[10px] font-semibold text-gray-600 block">Waktu Tempuh (s)</span>
                                                            <span className="text-[10px] font-bold text-primary-600">{kf.duration || 1}s</span>
                                                        </div>
                                                        <input 
                                                            type="range" min="0" max="15" step="0.05"
                                                            value={kf.duration || 1}
                                                            onChange={(e) => handleUpdateKeyframe(index, 'duration', parseFloat(e.target.value))}
                                                            className="w-full accent-primary-600 cursor-pointer"
                                                        />
                                                    </div>

                                                    <div className="mt-3 pl-2">
                                                        <label className="text-[10px] font-semibold text-gray-600 mb-1 block">Gaya Gerak (Ease)</label>
                                                        <div className="relative">
                                                            <select 
                                                                value={kf.ease}
                                                                onChange={(e) => handleUpdateKeyframe(index, 'ease', e.target.value)}
                                                                className="appearance-none w-full text-[11px] font-medium text-gray-700 bg-gray-50 border border-gray-200 hover:border-primary-400 hover:bg-white rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer shadow-sm"
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
                                        
                                        {/* Info properties captured */}
                                        <div className="mt-2 text-[9px] text-gray-400 flex gap-2">
                                            {kf.opacity !== 1 && <span>Opasitas: {Math.round(kf.opacity * 100)}%</span>}
                                            {kf.rotation !== 0 && <span>Rotasi: {Math.round(kf.rotation)}°</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            
                            <button 
                                onClick={handleAddKeyframe}
                                className="w-full py-3 mt-4 border-2 border-dashed border-primary-300 text-primary-600 bg-primary-50 hover:bg-primary-100 hover:border-primary-400 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                                {(activeLayer.animation?.custom_keyframes?.length > 0) ? 'Rekam Titik Selanjutnya' : 'Mulai Rekam Titik 1'}
                            </button>
                                </>
                            ) : (
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between bg-primary-50 p-3 rounded-lg border border-primary-100 mb-2">
                                        <div className="text-xs text-primary-800">
                                            <span className="font-bold block">Animasi Jalur (Freehand)</span>
                                            Seret (drag) elemen ini di kanvas untuk merekam pergerakan rute secara langsung.
                                        </div>
                                    </div>

                                    <button 
                                        onClick={() => setIsDrawingPath(!isDrawingPath)}
                                        className={`w-full py-3 mt-2 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 ${isDrawingPath ? 'bg-red-500 text-white shadow-lg shadow-red-500/30' : 'bg-primary-600 text-white shadow-lg shadow-primary-600/30 hover:bg-primary-700'}`}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                                        {isDrawingPath ? 'Selesai & Berhenti Merekam' : (activeLayer.animation?.idle === 'custom_path' ? 'Rekam Ulang Jalur' : 'Mulai Rekam Jalur')}
                                    </button>

                                    {activeLayer.animation?.idle === 'custom_path' && activeLayer.animation?.custom_path_data && (
                                        <div className="p-3 bg-white border border-gray-200 rounded-lg mt-4 space-y-4 shadow-sm">
                                            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                                                <span className="text-xs font-bold text-gray-800">Pengaturan Jalur</span>
                                                <button onClick={() => updateLayerAnimation(activeLayer.id, { idle: null, custom_path_data: null })} className="text-[10px] text-red-500 hover:text-red-700 bg-red-50 px-2 py-1 rounded">Hapus Jalur</button>
                                            </div>
                                            
                                            <div>
                                                <label className="text-[10px] font-semibold text-gray-500 mb-2 flex justify-between">
                                                    <span>Kecepatan/Durasi (Detik)</span>
                                                    <span className="text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded font-bold">{activeLayer.animation.custom_path_data.duration}s</span>
                                                </label>
                                                <input 
                                                    type="range" 
                                                    min="0.5" max="15" step="0.5"
                                                    value={activeLayer.animation.custom_path_data.duration || 5}
                                                    onChange={(e) => updateLayerAnimation(activeLayer.id, { 
                                                        custom_path_data: { ...activeLayer.animation.custom_path_data, duration: parseFloat(e.target.value) } 
                                                    })}
                                                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                                                />
                                            </div>

                                            <div>
                                                <label className="text-[10px] font-semibold text-gray-500 mb-1 block">Gaya Gerakan (Ease)</label>
                                                <select 
                                                    value={activeLayer.animation.custom_path_data.ease || 'power2.inOut'}
                                                    onChange={(e) => updateLayerAnimation(activeLayer.id, { 
                                                        custom_path_data: { ...activeLayer.animation.custom_path_data, ease: e.target.value } 
                                                    })}
                                                    className="w-full text-xs p-2 border border-gray-300 rounded focus:ring-primary-500 focus:border-primary-500 bg-white"
                                                >
                                                    <option value="power2.inOut">Mulus (Smooth/Default)</option>
                                                    <option value="none">Konstan (Linear)</option>
                                                    <option value="power1.out">Asli (Cepat lalu lambat)</option>
                                                    <option value="back.out(1.7)">Mendal (Back Out)</option>
                                                    <option value="elastic.out(1, 0.3)">Karet (Elastic)</option>
                                                </select>
                                            </div>

                                            <div className="flex items-center justify-between pt-2">
                                                <label className="text-[11px] font-semibold text-gray-700">Arahkan Mengikuti Jalur</label>
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input 
                                                        type="checkbox" 
                                                        className="sr-only peer" 
                                                        checked={activeLayer.animation.custom_path_data.autoRotate || false}
                                                        onChange={(e) => updateLayerAnimation(activeLayer.id, { 
                                                            custom_path_data: { ...activeLayer.animation.custom_path_data, autoRotate: e.target.checked } 
                                                        })}
                                                    />
                                                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary-600"></div>
                                                </label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                            <p className="text-[10px] text-gray-400 mt-2 text-center">
                                Geser elemen di kanvas atau ubah gaya di panel kanan terlebih dahulu, lalu klik rekam.
                            </p>
                        </div>
                    ) : (
                        <>
                            {ANIMATION_CATEGORIES.map((category, catIdx) => (
                                <div key={catIdx}>
                                    <h3 className="text-sm font-bold text-gray-800 mb-4">{category.name}</h3>
                                    
                                    <div className="grid grid-cols-3 gap-3">
                                        {/* Tombol Hapus Animasi */}
                                        {catIdx === 0 && (
                                            <button 
                                                onClick={() => {
                                                    updateLayerAnimation(activeLayer.id, { entry: null, config: null });
                                                }}
                                                className="group flex flex-col items-center cursor-pointer"
                                            >
                                                <div className="w-full h-14 mb-2 flex items-center justify-center border border-gray-200 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                                                    <svg className="w-6 h-6 text-gray-400 group-hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                                </div>
                                                <span className="text-[10px] text-gray-500 font-medium text-center">Tanpa Animasi</span>
                                            </button>
                                        )}

                                        {category.items.map((anim) => {
                                            const isActive = category.isContinuous ? currentIdleAnim === anim.id : currentEntryAnim === anim.id;
                                            
                                            return (
                                                <button 
                                                    key={anim.id}
                                                    onClick={() => setAnimation(anim.id, category.isContinuous)}
                                                    className="group flex flex-col items-center cursor-pointer outline-none"
                                                >
                                                    <div className={`w-full rounded-xl transition-all p-1 ${isActive ? 'bg-primary-50 border-primary-500 ring-1 ring-primary-500' : 'border-transparent hover:bg-gray-50'}`}>
                                                        <AnimatedIcon anim={anim} isText={isText} isActive={isActive} />
                                                        <span className={`text-[10px] text-center leading-tight block pb-1 ${isActive ? 'text-primary-700 font-semibold' : 'text-gray-600 group-hover:text-gray-800'}`}>{anim.label}</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                    
                                    {/* Jika kategori berkelanjutan, tambahkan opsi "Hapus Efek Tambahan" */}
                                    {category.isContinuous && currentIdleAnim && (
                                         <button 
                                            onClick={() => updateLayerAnimation(activeLayer.id, { idle: null, configIdle: null })}
                                            className="mt-4 w-full py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                                         >
                                             Hapus Efek Tambahan
                                         </button>
                                    )}
                                </div>
                            ))}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnimationPanel;
