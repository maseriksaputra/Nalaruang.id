import React, { useState, useEffect, useRef } from 'react';
import useUIStore from '../../stores/useUIStore';
import useCanvasStore from '../../stores/useCanvasStore';
import apiClient from '../../utils/apiClient';

const AssetSelectionModal = () => {
    const assetSelectionTarget = useUIStore(state => state.assetSelectionTarget);
    const setAssetSelectionTarget = useUIStore(state => state.setAssetSelectionTarget);
    const updateLayerStyle = useCanvasStore(state => state.updateLayerStyle);
    const updateLayerContent = useCanvasStore(state => state.updateLayerContent);
    const invitationId = window.__INVITATION_ID__;

    const [assets, setAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedAssets, setSelectedAssets] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (assetSelectionTarget && invitationId) {
            fetchClientAssets();
            setSelectedAssets([]);
        }
    }, [assetSelectionTarget, invitationId]);

    const fetchClientAssets = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get(`/api/builder/client-assets/${invitationId}`);
            if (res.data) {
                // Filter only images and videos for media changing
                const mediaAssets = res.data.filter(a => a.type === 'image' || a.url?.match(/\.(mp4|mov|webm|ogg)$/i));
                setAssets(mediaAssets);
            }
        } catch (error) {
            console.error('Failed to fetch client assets:', error);
        }
        setIsLoading(false);
    };

    const handleClose = () => {
        setAssetSelectionTarget(null);
    };

    const handleDeviceUpload = (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        Promise.all(files.map(file => new Promise(resolve => {
            const reader = new FileReader();
            reader.onload = (re) => resolve(re.target.result);
            reader.readAsDataURL(file);
        }))).then(results => {
            applySelection(results);
        });
    };

    const handleSelectAsset = (url) => {
        if (assetSelectionTarget.multiple) {
            if (selectedAssets.includes(url)) {
                setSelectedAssets(selectedAssets.filter(u => u !== url));
            } else {
                setSelectedAssets([...selectedAssets, url]);
            }
        } else {
            applySelection([url]);
        }
    };

    const applySelection = (urls) => {
        if (!assetSelectionTarget || urls.length === 0) return;

        const { layerId, layerType } = assetSelectionTarget;

        if (layerType === 'image') {
            updateLayerContent(layerId, urls[0]);
            updateLayerStyle(layerId, { url: urls[0] });
        } else if (layerType === 'polaroid') {
            const existingData = useCanvasStore.getState().sections.flatMap(s => s.layers).find(l => l.id === layerId)?.style?.polaroidData || {};
            updateLayerStyle(layerId, { polaroidData: { ...existingData, image: urls[0] } });
        } else if (layerType === 'frame') {
            updateLayerStyle(layerId, { mediaUrls: urls });
        } else if (layerType === 'photo_album') {
            const existingData = useCanvasStore.getState().sections.flatMap(s => s.layers).find(l => l.id === layerId)?.style?.albumData || {};
            const newImages = urls.map(url => ({ url }));
            updateLayerStyle(layerId, { albumData: { ...existingData, images: newImages } });
        } else if (layerType === 'desktop_thumbnail') {
            const currentSettings = useCanvasStore.getState().global_settings.desktop_thumbnail || {};
            const newMediaObjs = urls.map(url => ({
                url: url,
                type: url.match(/\.(mp4|mov|webm|ogg)$/i) ? 'video' : 'image',
                name: url.split('/').pop() || 'media'
            }));
            useCanvasStore.getState().updateGlobalSettings({
                desktop_thumbnail: {
                    ...currentSettings,
                    media: [...(currentSettings.media || []), ...newMediaObjs]
                }
            });
        }

        handleClose();
    };

    if (!assetSelectionTarget) return null;

    return (
        <div className="fixed inset-0 z-[9999] bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden animate-fade-in-up">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                    <h3 className="font-bold text-gray-800">Ubah Media {assetSelectionTarget.multiple ? '(Bisa Pilih Banyak)' : ''}</h3>
                    <button onClick={handleClose} className="p-1 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div className="p-4 overflow-y-auto flex-1">
                    <div className="flex gap-4 mb-6">
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex-1 py-3 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                            Unggah dari Perangkat
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept="image/*,video/mp4" 
                            multiple={assetSelectionTarget.multiple} 
                            onChange={handleDeviceUpload} 
                        />
                    </div>

                    <div className="border-t border-gray-200 pt-6">
                        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">Atau Pilih dari Aset Klien</h4>
                        
                        {isLoading ? (
                            <div className="text-center py-8 text-gray-400 text-sm">Memuat aset...</div>
                        ) : assets.length === 0 ? (
                            <div className="text-center py-8 text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-xl">Belum ada aset gambar/video dari klien.</div>
                        ) : (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {assets.map((asset) => {
                                    const isSelected = selectedAssets.includes(asset.url);
                                    const isVideo = asset.url.match(/\.(mp4|mov|webm|ogg)$/i);
                                    return (
                                        <div 
                                            key={asset.id}
                                            onClick={() => handleSelectAsset(asset.url)}
                                            className={`relative group aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${isSelected ? 'border-indigo-500 shadow-md ring-2 ring-indigo-200' : 'border-gray-200 hover:border-indigo-300'}`}
                                        >
                                            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                                {isVideo ? (
                                                    <video src={asset.url} className="w-full h-full object-contain bg-black" />
                                                ) : (
                                                    <img src={asset.url} alt="Aset" className="w-full h-full object-contain bg-gray-200/50" />
                                                )}
                                            </div>
                                            
                                            {assetSelectionTarget.multiple && isSelected && (
                                                <div className="absolute top-2 right-2 bg-indigo-500 text-white rounded-full p-0.5 shadow-sm">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                </div>
                                            )}
                                            
                                            <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1.5">
                                                <p className="text-white text-[10px] truncate text-center">{asset.field_name || 'Aset'}</p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {assetSelectionTarget.multiple && selectedAssets.length > 0 && (
                    <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end">
                        <button 
                            onClick={() => applySelection(selectedAssets)}
                            className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-sm transition-colors"
                        >
                            Terapkan ({selectedAssets.length} Dipilih)
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssetSelectionModal;
