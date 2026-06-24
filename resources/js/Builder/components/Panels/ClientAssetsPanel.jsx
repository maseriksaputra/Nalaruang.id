import React, { useState, useEffect } from 'react';
import apiClient from '../../utils/apiClient';
import useCanvasStore from '../../stores/useCanvasStore';

const ClientAssetsPanel = () => {
    const addLayer = useCanvasStore(state => state.addLayer);
    const invitationId = window.__INVITATION_ID__;
    
    const [assets, setAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    useEffect(() => {
        if (invitationId) {
            fetchClientAssets();
        }
    }, [invitationId]);

    const fetchClientAssets = async () => {
        setIsLoading(true);
        try {
            const res = await apiClient.get(`/api/builder/client-assets/${invitationId}`);
            if (res.data) {
                setAssets(res.data);
            }
        } catch (error) {
            console.error('Failed to fetch client assets:', error);
        }
        setIsLoading(false);
    };

    const copyToClipboard = (id, text) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const textAssets = assets.filter(a => a.type === 'text' || a.type === 'textarea');
    const imageAssets = assets.filter(a => a.type === 'image');
    const audioAssets = assets.filter(a => a.type === 'audio');

    return (
        <div className="p-4 space-y-6 flex flex-col h-full bg-white">
            <div className="space-y-2 flex-shrink-0">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                    Aset Klien
                    {isLoading && <span className="text-[10px] text-primary-500 normal-case animate-pulse">Memuat...</span>}
                </h3>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                    Aset yang diunggah klien melalui form data otomatis muncul di sini. Klik untuk menambahkan ke kanvas atau salin.
                </p>
                <button 
                    onClick={fetchClientAssets}
                    className="w-full mt-2 py-1.5 bg-gray-50 text-gray-600 border border-gray-200 rounded text-[10px] font-bold hover:bg-gray-100 transition shadow-sm flex items-center justify-center gap-1"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                    Refresh Data
                </button>
            </div>

            <div className="flex-1 overflow-y-auto space-y-6 pb-6 custom-scrollbar">
                {assets.length === 0 && !isLoading ? (
                    <div className="text-center p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400">
                        Klien belum mengisi form atau form tidak memiliki input.
                    </div>
                ) : (
                    <>
                        {imageAssets.length > 0 && (
                            <div>
                                <h4 className="text-[10px] font-bold text-primary-700 uppercase mb-3 border-b border-primary-100 pb-1 flex items-center gap-1">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    Media Gambar / Video
                                </h4>
                                <div className="grid grid-cols-2 gap-2">
                                    {imageAssets.map((asset) => {
                                        const isVideo = asset.url.match(/\.(mp4|mov|webm|ogg)$/i);
                                        return (
                                        <div 
                                            key={asset.id}
                                            onClick={() => addLayer({ 
                                                id: 'layer_' + Date.now(), 
                                                type: isVideo ? 'video' : 'image', 
                                                url: asset.url, 
                                                style: { x: 50, y: 50, width: 200, height: 200 } 
                                            })}
                                            className="relative group flex flex-col items-center justify-center p-1 bg-gray-100 border border-gray-200 rounded-xl hover:border-primary-500 cursor-pointer aspect-square overflow-hidden shadow-sm"
                                            title={`Klik untuk menambahkan: ${asset.field_name}`}
                                        >
                                            {isVideo ? (
                                                <video src={asset.url} className="w-full h-full object-contain rounded-lg bg-black" />
                                            ) : (
                                                <img src={asset.url} alt={asset.field_name} className="w-full h-full object-contain rounded-lg bg-gray-200/50" />
                                            )}
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                                                <span className="text-white text-[9px] font-bold text-center px-1">Tambah</span>
                                            </div>
                                            <div className="absolute bottom-0 inset-x-0 bg-black/60 p-1 rounded-b-xl">
                                                <p className="text-white text-[8px] truncate text-center font-medium">{asset.field_name}</p>
                                            </div>
                                        </div>
                                    )})}
                                </div>
                            </div>
                        )}

                        {textAssets.length > 0 && (
                            <div>
                                <h4 className="text-[10px] font-bold text-primary-700 uppercase mb-3 border-b border-primary-100 pb-1 flex items-center gap-1 mt-4">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                                    Data Teks
                                </h4>
                                <div className="space-y-3">
                                    {textAssets.map((asset) => (
                                        <div key={asset.id} className="p-3 bg-primary-50/50 border border-primary-100 rounded-xl shadow-sm">
                                            <div className="flex items-center justify-between mb-1.5">
                                                <p className="text-[9px] text-primary-600 uppercase font-bold">{asset.field_name}</p>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); copyToClipboard(asset.id, asset.content); }}
                                                    className="text-xs flex items-center gap-1 px-1.5 py-0.5 rounded text-primary-500 hover:bg-primary-100 transition-colors font-medium"
                                                >
                                                    {copiedId === asset.id ? 'Tersalin!' : 'Salin'}
                                                </button>
                                            </div>
                                            <div className="bg-white p-2 rounded-lg border border-gray-100 text-xs text-gray-700 font-medium whitespace-pre-wrap max-h-32 overflow-y-auto">
                                                {asset.content}
                                            </div>
                                            <button
                                                onClick={() => addLayer({ 
                                                    id: 'layer_' + Date.now(), 
                                                    type: 'text', 
                                                    content: asset.content, 
                                                    style: { x: 50, y: 50, width: 300, height: Math.max(40, asset.content.length > 50 ? 100 : 40), fontSize: '18px', color: '#1f2937' } 
                                                })}
                                                className="mt-2 w-full text-[10px] py-1 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-primary-600 transition-colors font-semibold"
                                            >
                                                Tambah sebagai Elemen Teks
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {audioAssets.length > 0 && (
                            <div>
                                <h4 className="text-[10px] font-bold text-primary-700 uppercase mb-3 border-b border-primary-100 pb-1 flex items-center gap-1 mt-4">
                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                                    Audio & Musik Latar
                                </h4>
                                <div className="space-y-3">
                                    {audioAssets.map((asset) => (
                                        <div key={asset.id} className="p-3 bg-pink-50/50 border border-pink-100 rounded-xl shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="text-[9px] text-pink-600 uppercase font-bold">{asset.field_name}</p>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); copyToClipboard(asset.id, asset.url); }}
                                                    className="text-xs flex items-center gap-1 px-1.5 py-0.5 rounded text-pink-500 hover:bg-pink-100 transition-colors font-medium"
                                                >
                                                    {copiedId === asset.id ? 'Link Tersalin!' : 'Salin URL'}
                                                </button>
                                            </div>
                                            {asset.url && (
                                                <audio controls src={asset.url} className="w-full h-8" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default ClientAssetsPanel;

