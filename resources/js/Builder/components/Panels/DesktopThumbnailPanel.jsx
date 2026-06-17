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

    const handleChange = (key, value) => {
        updateGlobalSettings({
            desktop_thumbnail: {
                ...settings,
                [key]: value
            }
        });
    };

    const handleUploadClick = () => {
        useUIStore.getState().setAssetSelectionTarget({
            layerType: 'desktop_thumbnail',
            multiple: true
        });
    };

    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploading(true);
        const newMediaObjs = [];

        try {
            for (let file of files) {
                const compressedFile = await compressImageToWebp(file);
                const formData = new FormData();
                formData.append('file', compressedFile);

                const response = await apiClient.post('/admin/builder/user-assets', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                if (response.data.success) {
                    newMediaObjs.push({
                        url: response.data.url,
                        type: compressedFile.type.startsWith('video/') ? 'video' : 'image',
                        name: compressedFile.name
                    });
                }
            }

            if (newMediaObjs.length > 0) {
                handleChange('media', [...(settings.media || []), ...newMediaObjs]);
            }
        } catch (error) {
            console.error('Failed to upload thumbnail media:', error);
            alert('Gagal mengunggah media.');
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeMedia = (index) => {
        const newMedia = [...(settings.media || [])];
        newMedia.splice(index, 1);
        handleChange('media', newMedia);
    };

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

            <div className={`p-4 flex-1 overflow-y-auto ${!settings.enabled ? 'opacity-50 pointer-events-none' : ''}`}>
                <p className="text-xs text-gray-500 mb-6">Aktifkan fitur ini untuk menampilkan area tambahan di sisi kiri layar ketika undangan dibuka di PC/Laptop.</p>

                <div className="space-y-6">
                    {/* Media Upload */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Media Background</label>
                        
                        <div className="space-y-3">
                            <button 
                                onClick={handleUploadClick}
                                disabled={isUploading}
                                className={`w-full py-3 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:bg-gray-50 hover:border-indigo-400 transition-colors ${isUploading ? 'opacity-50 cursor-wait' : ''}`}
                            >
                                <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                <span className="text-xs font-medium">{isUploading ? 'Mengunggah...' : 'Unggah / Pilih Media'}</span>
                            </button>

                            {/* Media Preview */}
                            {settings.media && settings.media.length > 0 && (
                                <div className={`grid gap-2 ${settings.media.length > 1 ? 'grid-cols-2' : 'grid-cols-1'}`}>
                                    {settings.media.map((item, idx) => {
                                        // Handle backward compatibility: item might be a string URL
                                        const isObject = typeof item === 'object';
                                        const url = isObject ? item.url : item;
                                        // If it's a string from old version, assume it's an image. Otherwise use the object's type.
                                        const type = isObject ? item.type : 'image';

                                        return (
                                            <div key={idx} className="relative group rounded-lg overflow-hidden border border-gray-200 bg-gray-50 aspect-video flex items-center justify-center">
                                                {type === 'video' ? (
                                                    <video src={url} className="w-full h-full object-cover" />
                                                ) : (
                                                    <img src={url} className="w-full h-full object-cover" />
                                                )}
                                                <button 
                                                    onClick={() => removeMedia(idx)}
                                                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Specific Settings based on Detected Type */}
                    {settings.media && settings.media.length > 1 && (
                        <div className="pt-4 border-t border-gray-100">
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Pengaturan Album</label>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="flex justify-between items-center text-xs text-gray-600 mb-1">
                                        <span>Durasi per Foto</span>
                                        <span className="font-semibold text-indigo-600">{(settings.album_duration || 3000) / 1000} detik</span>
                                    </label>
                                    <input 
                                        type="range" 
                                        min="1000" max="10000" step="500"
                                        value={settings.album_duration || 3000}
                                        onChange={(e) => handleChange('album_duration', parseInt(e.target.value) || 3000)}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                                <div>
                                    <label className="flex justify-between items-center text-xs text-gray-600 mb-1">
                                        <span>Kecepatan Transisi</span>
                                        <span className="font-semibold text-indigo-600">{(settings.transition_speed || 1000) / 1000} detik</span>
                                    </label>
                                    <input 
                                        type="range" 
                                        min="300" max="5000" step="100"
                                        value={settings.transition_speed || 1000}
                                        onChange={(e) => handleChange('transition_speed', parseInt(e.target.value) || 1000)}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-gray-600 mb-1">Efek Transisi</label>
                                    <select 
                                        value={settings.transition_effect || 'fade'}
                                        onChange={(e) => handleChange('transition_effect', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
                                    >
                                        <option value="fade">Fade (Memudar)</option>
                                        <option value="slide">Slide (Geser)</option>
                                        <option value="cards">Cards (Tumpukan Kartu)</option>
                                        <option value="coverflow">Coverflow (Sampul 3D)</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {settings.media && settings.media.length > 0 && settings.media.some(m => (typeof m === 'object' && m.type === 'video')) && (
                        <div className="pt-4 border-t border-gray-100">
                            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-3">Pengaturan Video</label>
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="videoLoop"
                                    checked={settings.video_loop !== false}
                                    onChange={(e) => handleChange('video_loop', e.target.checked)}
                                    className="rounded text-indigo-600 focus:ring-indigo-500"
                                />
                                <label htmlFor="videoLoop" className="text-sm text-gray-700 font-medium">Ulangi Otomatis (Loop)</label>
                            </div>
                        </div>
                    )}

                    {/* Overlay Text */}
                    <div className="pt-4 border-t border-gray-100">
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Teks Sambutan</label>
                        <textarea 
                            value={settings.overlay_text || ''}
                            onChange={(e) => handleChange('overlay_text', e.target.value)}
                            placeholder="Ketik teks yang tampil di atas foto/video..."
                            rows="3"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm mb-3 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        ></textarea>

                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Animasi Teks</label>
                        <select 
                            value={settings.text_animation || 'fade-up'}
                            onChange={(e) => handleChange('text_animation', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="none">Tanpa Animasi (Statis)</option>
                            {ANIMATION_CATEGORIES.map(category => (
                                <optgroup key={category.name} label={category.name}>
                                    {category.items.map(anim => (
                                        <option key={anim.id} value={anim.id}>{anim.label}</option>
                                    ))}
                                </optgroup>
                            ))}
                        </select>
                    </div>

                    {/* Background Color Fallback */}
                    <div className="pt-4 border-t border-gray-100">
                        <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Warna Background</label>
                        <div className="flex items-center gap-3">
                            <div 
                                className="w-8 h-8 rounded-full shadow-inner border border-gray-200 overflow-hidden shrink-0"
                            >
                                <input 
                                    type="color" 
                                    value={settings.background_color || '#1a1a1a'}
                                    onChange={(e) => handleChange('background_color', e.target.value)}
                                    className="w-[200%] h-[200%] -translate-x-1/4 -translate-y-1/4 cursor-pointer"
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
            </div>
        </div>
    );
};

export default DesktopThumbnailPanel;
