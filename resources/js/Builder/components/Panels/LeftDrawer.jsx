import React, { useState, useEffect } from 'react';
import useCanvasStore from '../../stores/useCanvasStore';
import apiClient from '../../utils/apiClient';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import AudioWaveformEditor from './AudioWaveformEditor';
import { compressImageToWebp } from '../../utils/imageCompressor';

import { useDraggable } from '@dnd-kit/core';
import FontsPanel from './FontsPanel';
import ColorsPanel from './ColorsPanel';
import ImageEditorPanel from './ImageEditorPanel';
import DesktopThumbnailPanel from './DesktopThumbnailPanel';
import ClientAssetsPanel from './ClientAssetsPanel';

const DraggableChildItem = ({ childId, child, parentId, isActive }) => {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
        id: childId,
        data: { type: 'child', parentId }
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        zIndex: transform ? 50 : 'auto',
        position: transform ? 'relative' : 'static'
    };

    if (!child) return null;

    return (
        <div 
            ref={setNodeRef}
            style={style}
            onClick={() => useCanvasStore.getState().setActiveLayer(child.id)}
            className={`flex items-center justify-between h-8 px-2 border cursor-pointer ${isActive ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-100 hover:bg-gray-50'}`}
        >
            <div className="flex items-center gap-2 overflow-hidden flex-1">
                <button 
                    {...attributes} 
                    {...listeners}
                    className="p-1 text-gray-300 hover:text-gray-500 rounded cursor-grab"
                    title="Geser ke layer lain"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
                </button>
                <div className="w-5 h-5 bg-gray-100 rounded overflow-hidden flex items-center justify-center shrink-0 border border-gray-200">
                    {child.type === 'image' && child.url ? (
                        <img src={child.url} alt="" className="w-full h-full object-cover" />
                    ) : child.type === 'shape' ? (
                        <div className="w-3 h-3 bg-indigo-500 rounded-sm"></div>
                    ) : child.type === 'text' ? (
                        <span className="text-[10px] font-bold text-gray-700 font-serif">T</span>
                    ) : child.type === 'lottie' ? (
                        <svg className="w-3 h-3 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    ) : (
                        <span className="text-[8px] font-bold text-gray-500 uppercase">{(child.type || 'E').charAt(0)}</span>
                    )}
                </div>
                <span className="text-xs font-medium text-gray-600 truncate">{child.content || (child.type === 'image' ? 'Gambar Asset' : 'Elemen')}</span>
            </div>
            <div className="flex items-center shrink-0 ml-2">
                <button 
                    onClick={(e) => { e.stopPropagation(); useCanvasStore.getState().toggleLayerLock(child.id); }} 
                    className={`p-1 rounded transition-colors ${child.isLocked ? 'text-amber-500 hover:text-amber-600' : 'text-gray-400 hover:text-gray-600'}`}
                    title={child.isLocked ? "Buka Kunci" : "Kunci Elemen"}
                >
                    {child.isLocked ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                    ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
                    )}
                </button>
                <button 
                    onClick={(e) => { e.stopPropagation(); useCanvasStore.getState().toggleLayerVisibility(child.id); }} 
                    className={`p-1 rounded transition-colors ${child.isHidden ? 'text-gray-300' : 'text-gray-400 hover:text-gray-600'}`}
                    title={child.isHidden ? "Tampilkan" : "Sembunyikan"}
                >
                    {child.isHidden ? (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>
                    ) : (
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                    )}
                </button>
                    <button 
                        onClick={async (e) => {
                            e.stopPropagation();
                            if (await window.confirmAsync('Hapus elemen ini?', 'Hapus Elemen')) {
                                useCanvasStore.getState().deleteElement(child.id);
                            }
                        }} 
                    className="p-1 rounded text-red-300 hover:text-red-500 transition-colors ml-0.5"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                </button>
            </div>

            {/* Recursive Children Rendering */}
            {child.children && child.children.length > 0 && (
                <div className="pl-6 pr-2 py-1 space-y-1 bg-gray-50/50 border-l border-r border-b border-gray-100">
                    <SortableContext items={[...child.children].reverse().map((c, i) => c?.id ? c.id.toString() : `temp-nested-${child.id}-${i}`)} strategy={verticalListSortingStrategy}>
                        {[...child.children].reverse().map((nestedChild, i) => {
                            const cid = nestedChild?.id ? nestedChild.id.toString() : `temp-nested-${child.id}-${i}`;
                            return <DraggableChildItem key={cid} childId={cid} child={nestedChild} parentId={child.id} isActive={isActive || useCanvasStore.getState().activeLayerId === nestedChild?.id} />
                        })}
                    </SortableContext>
                </div>
            )}
        </div>
    );
};


const SortableLayerItem = ({ layer }) => {
    const activeLayerId = useCanvasStore(state => state.activeLayerId);
    
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ 
        id: layer.id, 
        data: { type: 'group' }
    });
    
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (layer.isHeader) {
        const sectionId = layer.id.replace('header_', '');
        const isActiveSection = useCanvasStore(state => state.activeSectionId === sectionId);
        
        return (
            <div 
                ref={setNodeRef} 
                style={style} 
                className={`w-full flex items-center h-8 px-2 border-b-2 border-t-2 mt-4 mb-2 first:mt-0 shadow-sm rounded-sm cursor-pointer transition ${isActiveSection ? 'bg-indigo-100 border-indigo-300' : 'bg-indigo-50 border-indigo-100 hover:bg-indigo-100/70'}`}
                onClick={() => useCanvasStore.getState().setActiveSection(sectionId)}
            >
                <button 
                    {...attributes} 
                    {...listeners}
                    className={`p-1 mr-2 rounded cursor-grab flex-shrink-0 transition ${isActiveSection ? 'text-indigo-600' : 'text-indigo-400 hover:text-indigo-600'}`}
                    title="Geser urutan halaman"
                    onClick={(e) => e.stopPropagation()}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
                </button>
                <span className={`text-[10px] font-bold uppercase tracking-widest ${isActiveSection ? 'text-indigo-900' : 'text-indigo-700'}`}>{layer.title}</span>
            </div>
        );
    }

    const isActive = activeLayerId === layer.id;

    return (
        <div ref={setNodeRef} style={style} className="mb-2">
            <div 
                onClick={() => useCanvasStore.getState().setActiveLayer(layer.id)}
                className={`flex items-center justify-between h-10 px-2 border cursor-pointer ${isActive ? 'bg-indigo-50 border-indigo-500' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
            >
                <div className="flex items-center gap-2 overflow-hidden flex-1">
                    <button 
                        {...attributes} 
                        {...listeners}
                        className="p-1 text-gray-400 hover:text-gray-600 rounded cursor-grab"
                        title="Drag to reorder"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
                    </button>
                    <div className="w-5 h-5 bg-indigo-100 rounded flex items-center justify-center shrink-0 text-indigo-600">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                    </div>
                    <span className="text-xs font-bold text-gray-800 truncate">{layer.name || 'Layer'}</span>
                </div>
                <div className="flex items-center shrink-0 ml-2">
                    <button 
                        onClick={(e) => { e.stopPropagation(); useCanvasStore.getState().toggleLayerLock(layer.id); }} 
                        className={`p-1 rounded transition-colors ${layer.isLocked ? 'text-amber-500 hover:text-amber-600' : 'text-gray-500 hover:text-gray-700'}`}
                        title={layer.isLocked ? "Buka Kunci Layer" : "Kunci Layer"}
                    >
                        {layer.isLocked ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
                        )}
                    </button>
                    <button 
                        onClick={(e) => { e.stopPropagation(); useCanvasStore.getState().toggleLayerVisibility(layer.id); }} 
                        className={`p-1 rounded transition-colors ${layer.isHidden ? 'text-gray-300' : 'text-gray-500 hover:text-gray-700'}`}
                        title={layer.isHidden ? "Tampilkan Layer" : "Sembunyikan Layer"}
                    >
                        {layer.isHidden ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"></path></svg>
                        ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                        )}
                    </button>
                    <button 
                        onClick={async (e) => {
                            e.stopPropagation();
                            if (await window.confirmAsync('Hapus layer wadah ini beserta seluruh isinya?', 'Hapus Layer')) {
                                useCanvasStore.getState().deleteElement(layer.id);
                            }
                        }} 
                        className="p-1 rounded text-red-400 hover:text-red-600 transition-colors ml-1"
                        title="Hapus Layer"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                    </button>
                </div>
            </div>
            
            {/* Render Children */}
            {layer.children && layer.children.length > 0 && (
                <div className="pl-6 pr-2 py-2 space-y-1 bg-gray-50 border-l border-r border-b border-gray-200">
                    <SortableContext items={[...layer.children].reverse().map((c, i) => c?.id ? c.id.toString() : `temp-child-${i}`)} strategy={verticalListSortingStrategy}>
                        {[...layer.children].reverse().map((child, i) => {
                            const cid = child?.id ? child.id.toString() : `temp-child-${i}`;
                            return <DraggableChildItem key={cid} childId={cid} child={child} parentId={layer.id} isActive={activeLayerId === child?.id} />
                        })}
                    </SortableContext>
                </div>
            )}
        </div>
    );
};

const LeftDrawer = () => {
    const activeTab = useCanvasStore(state => state.activeTab);
    const sections = useCanvasStore(state => state.sections);
    const activeSectionId = useCanvasStore(state => state.activeSectionId);
    const activeLayerId = useCanvasStore(state => state.activeLayerId);
    const addLayer = useCanvasStore(state => state.addLayer);
    const global_settings = useCanvasStore(state => state.global_settings);
    const updateGlobalSettings = useCanvasStore(state => state.updateGlobalSettings);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    const [globalElements, setGlobalElements] = useState([]);
    const [isLoadingElements, setIsLoadingElements] = useState(false);
    const [activeFolder, setActiveFolder] = useState(null);
    const [isUploadingAudio, setIsUploadingAudio] = useState(false);
    const [clientAudioAssets, setClientAudioAssets] = useState([]);
    const [isLoadingClientAudio, setIsLoadingClientAudio] = useState(false);

    const fetchClientAudio = async () => {
        if (!window.__INVITATION_ID__) return;
        setIsLoadingClientAudio(true);
        try {
            const res = await apiClient.get(`/api/builder/client-assets/${window.__INVITATION_ID__}`);
            if (res.data) {
                setClientAudioAssets(res.data.filter(a => a.type === 'audio'));
            }
        } catch (error) {
            console.error('Failed to fetch client audio assets:', error);
        }
        setIsLoadingClientAudio(false);
    };

    useEffect(() => {
        if (activeTab === 'elements') {
            fetchGlobalElements();
        }
        if (activeTab === 'uploads') {
            fetchUserAssets();
        }
        if (activeTab === 'music') {
            fetchClientAudio();
        }
    }, [activeTab]);

    const fetchGlobalElements = async () => {
        setIsLoadingElements(true);
        try {
            const res = await apiClient.get('/admin/builder/global-elements?t=' + Date.now());
            if (res.data.success) {
                setGlobalElements(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch elements:', error);
        }
        setIsLoadingElements(false);
    };

    const [userAssets, setUserAssets] = useState([]);
    const [isLoadingAssets, setIsLoadingAssets] = useState(false);

    const fetchUserAssets = async () => {
        setIsLoadingAssets(true);
        try {
            const res = await apiClient.get('/admin/builder/user-assets');
            if (res.data.success) {
                setUserAssets(res.data.data);
            }
        } catch (error) {
            console.error('Failed to fetch user assets:', error);
        }
        setIsLoadingAssets(false);
    };

    const deleteUserAsset = async (id, e) => {
        e.stopPropagation();
        if (await window.confirmAsync('Hapus aset ini permanen?', 'Hapus Aset')) {
            try {
                const res = await apiClient.delete(`/admin/builder/user-assets/${id}`);
                if (res.data.success) {
                    fetchUserAssets();
                }
            } catch (error) {
                console.error('Failed to delete asset:', error);
            }
        }
    };

    const saveGlobalElement = async (name, type, payload, thumbnailUrl = null, category = 'Umum') => {
        try {
            const res = await apiClient.post('/admin/builder/global-elements', {
                name,
                type,
                payload,
                thumbnail_url: thumbnailUrl,
                category
            });
            if (res.data.success) {
                const newElement = {
                    id: res.data.data ? res.data.data.id : Date.now(),
                    name, 
                    type, 
                    payload, 
                    thumbnail_url: thumbnailUrl, 
                    category
                };
                setGlobalElements(prev => [newElement, ...prev]);

                addLayer({
                    id: 'layer_' + Date.now(),
                    ...payload
                });
                fetchGlobalElements();
                if (activeFolder !== category) {
                    setActiveFolder(category);
                }
            }
        } catch (error) {
            console.error('Failed to save element permanently:', error);
            alert('Gagal menyimpan elemen ke pustaka.');
        }
    };

    const handleUploadGlobalElement = async (file, type) => {
        let name = await window.promptAsync(`Masukkan nama untuk menyimpan elemen ${type} ini permanen di Pustaka:`, `Custom ${type}`);
        if (name === null) return; // Cancelled
        if (!name.trim()) name = `Custom ${type}`;
        
        let folderName = await window.promptAsync(`Simpan di folder apa? (Kosongkan untuk 'Umum')`, activeFolder || 'Umum');
        if (folderName === null) return; // Cancelled
        if (!folderName.trim()) folderName = 'Umum';

        if (type === 'lottie') {
            const reader = new FileReader();
            reader.onload = async (event) => {
                try {
                    const animationData = JSON.parse(event.target.result);
                    const payload = {
                        type: 'lottie',
                        animationData: animationData,
                        style: { x: 50, y: 50, width: 200, height: 200 }
                    };
                    await saveGlobalElement(name, 'lottie', payload, null, folderName);
                } catch (err) {
                    alert('File JSON tidak valid!');
                }
            };
            reader.readAsText(file);
        } else {
            // Compress image to WebP before uploading
            const compressedFile = await compressImageToWebp(file);
            
            const formData = new FormData();
            formData.append('file', compressedFile);
            try {
                const response = await apiClient.post('/admin/builder/global-elements/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });
                if (response.data.success) {
                    const payload = {
                        type: 'image',
                        url: response.data.url,
                        style: { x: 50, y: 50, width: 150, height: 150 }
                    };
                    await saveGlobalElement(name, 'image', payload, response.data.url, folderName);
                }
            } catch (error) {
                console.error('Upload failed:', error);
                alert('Gagal mengunggah file elemen.');
            }
        }
    };

    const handleAudioUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setIsUploadingAudio(true);
        
        const formData = new FormData();
        formData.append('file', file);
        try {
            const response = await apiClient.post('/admin/builder/global-elements/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.data.success) {
                updateGlobalSettings({ audioUrl: response.data.url });
            }
        } catch (error) {
            console.error('Audio upload failed:', error);
            alert('Gagal mengunggah file musik. Pastikan format didukung dan ukuran di bawah 20MB.');
        }
        setIsUploadingAudio(false);
        e.target.value = null;
    };

    if (!activeTab) return null;

    const activeSection = sections.find(s => s.id === activeSectionId);

    const renderContent = () => {
        if (activeTab === 'settings') {
            return (
                <div className="p-4 space-y-6">
                    <div className="space-y-4">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
                            EFEK PARTIKEL LATAR (ANIMASI)
                        </label>
                        <p className="text-[10px] text-gray-500 leading-relaxed">
                            Pilih animasi yang akan melayang di lapisan paling belakang kanvas halaman Anda.
                        </p>
                        
                        <div className="grid grid-cols-3 gap-2 mt-2">
                            <button
                                onClick={() => updateGlobalSettings({ particleEffect: 'none' })}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${(!global_settings?.particleEffect || global_settings.particleEffect === 'none') ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'}`}
                            >
                                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"></path></svg>
                                <span className="text-[9px] font-bold">Tidak Ada</span>
                            </button>
                            <button
                                onClick={() => updateGlobalSettings({ particleEffect: 'firefly' })}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${global_settings?.particleEffect === 'firefly' ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'}`}
                            >
                                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                                <span className="text-[9px] font-bold text-center leading-tight">Kunang<br/>kunang</span>
                            </button>
                            <button
                                onClick={() => updateGlobalSettings({ particleEffect: 'snow' })}
                                className={`flex flex-col items-center justify-center p-2 rounded-lg border transition-all ${global_settings?.particleEffect === 'snow' ? 'bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300'}`}
                            >
                                <svg className="w-5 h-5 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                                <span className="text-[9px] font-bold text-center leading-tight">Salju /<br/>Kelopak</span>
                            </button>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2 mb-4">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            PENGATURAN LAINNYA
                        </label>
                        <div className="space-y-3">
                            <p className="text-[10px] text-gray-500 leading-relaxed mb-2">
                                Pengaturan halaman spesifik (warna latar halaman) dapat dilakukan melalui tab <strong>Desain</strong> di Inspector kanan saat Anda tidak mengklik elemen apa pun di kanvas.
                            </p>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeTab === 'music') {
            const audioEffects = [
                { id: 'none', label: 'Asli' },
                { id: 'echo', label: 'Gema' },
                { id: 'hall', label: 'Aula Konser' },
                { id: 'room', label: 'Ruang Kosong' },
                { id: 'radio', label: 'Radio FM' },
                { id: 'telephone', label: 'Telepon' },
                { id: 'underwater', label: 'Dalam Air' },
                { id: 'bass', label: 'Bass Booster' },
            ];

            return (
                <div className="p-4 space-y-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                                Studio Musik Latar
                            </label>
                        </div>
                        
                        <div>
                            {!global_settings?.audioUrl ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-indigo-500 hover:bg-indigo-50 transition-colors group cursor-pointer relative">
                                    <input 
                                        type="file" 
                                        accept="audio/mpeg, audio/wav, audio/ogg" 
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                                        onChange={handleAudioUpload} 
                                        disabled={isUploadingAudio}
                                    />
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                                    </div>
                                    <h4 className="text-xs font-bold text-gray-700">{isUploadingAudio ? 'Mengunggah...' : 'Pilih atau Tarik File Musik'}</h4>
                                    <p className="text-[9px] text-gray-500 mt-1">MP3, WAV, OGG (Maks 20MB)</p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between mb-1">
                                        <label className="text-[10px] font-semibold text-gray-500 block">Lagu Saat Ini</label>
                                        <div className="flex items-center gap-2">
                                            <button 
                                                onClick={() => {
                                                    if(window.confirm('Hapus musik latar ini?')) {
                                                        updateGlobalSettings({ audioUrl: null, audioStart: null, audioEnd: null });
                                                    }
                                                }}
                                                className="text-[9px] text-red-600 font-bold hover:text-red-800 flex items-center gap-1 bg-red-50 px-2 py-1 rounded-md border border-red-100 transition-colors hover:bg-red-100"
                                            >
                                                Hapus
                                            </button>
                                            <label className="cursor-pointer text-[9px] text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-100 transition-colors hover:bg-indigo-100">
                                                {isUploadingAudio ? 'Mengunggah...' : 'Ganti Lagu'}
                                                <input 
                                                    type="file" 
                                                    accept="audio/mpeg, audio/wav, audio/ogg" 
                                                    className="hidden" 
                                                    onChange={handleAudioUpload} 
                                                    disabled={isUploadingAudio}
                                                />
                                            </label>
                                        </div>
                                    </div>
                                    <input 
                                        type="text"
                                        placeholder="Atau tempel https://contoh.com/lagu.mp3"
                                        value={global_settings?.audioUrl || ''}
                                        onChange={(e) => updateGlobalSettings({ audioUrl: e.target.value })}
                                        className="w-full border border-gray-200 bg-gray-50 rounded-lg p-2 text-xs text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                                    />
                                    
                                    <AudioWaveformEditor 
                                        audioUrl={global_settings.audioUrl}
                                        audioStart={global_settings.audioStart}
                                        audioEnd={global_settings.audioEnd}
                                        onSetStart={(val) => updateGlobalSettings({ audioStart: val })}
                                        onSetEnd={(val) => updateGlobalSettings({ audioEnd: val })}
                                    />
                                </div>
                            )}
                        </div>

                        {clientAudioAssets.length > 0 && (
                            <div className="pt-2">
                                <label className="text-[10px] font-semibold text-gray-500 block mb-2">Atau Pilih dari Aset Klien</label>
                                <div className="space-y-2">
                                    {clientAudioAssets.map(asset => (
                                        <button 
                                            key={asset.id}
                                            onClick={() => updateGlobalSettings({ audioUrl: (window.ASSET_URL || '/storage/') + asset.file_path, audioStart: null, audioEnd: null })}
                                            className="w-full text-left p-2 rounded-lg border hover:bg-indigo-50 border-gray-200 hover:border-indigo-300 transition text-xs flex items-center justify-between group"
                                        >
                                            <div className="flex items-center gap-2 overflow-hidden">
                                                <div className="w-6 h-6 bg-indigo-100 text-indigo-500 rounded flex items-center justify-center shrink-0">
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"></path></svg>
                                                </div>
                                                <span className="truncate font-medium text-gray-700">{asset.field_name || 'Audio Klien'}</span>
                                            </div>
                                            <span className="text-indigo-600 bg-indigo-100 px-2 py-0.5 rounded text-[9px] font-bold shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">Pakai</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div>
                            <div className="flex items-center justify-between mb-1">
                                <label className="text-[10px] font-semibold text-gray-500">Volume Suara</label>
                                <span className="text-[10px] font-bold text-indigo-600">{global_settings?.audioVolume ?? 100}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" max="100" 
                                value={global_settings?.audioVolume ?? 100}
                                onChange={(e) => updateGlobalSettings({ audioVolume: parseInt(e.target.value) })}
                                className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <div>
                                <label className="text-[10px] font-semibold text-gray-500 mb-1 block">Pudar Masuk (Fade In)</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="range" min="0" max="5" step="0.5"
                                        value={global_settings?.audioFadeIn || 0}
                                        onChange={(e) => updateGlobalSettings({ audioFadeIn: parseFloat(e.target.value) })}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                    <span className="text-[10px] font-bold text-gray-600 w-6 text-right">{global_settings?.audioFadeIn || 0}s</span>
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-semibold text-gray-500 mb-1 block">Pudar Keluar (Fade Out)</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="range" min="0" max="5" step="0.5"
                                        value={global_settings?.audioFadeOut || 0}
                                        onChange={(e) => updateGlobalSettings({ audioFadeOut: parseFloat(e.target.value) })}
                                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                                    />
                                    <span className="text-[10px] font-bold text-gray-600 w-6 text-right">{global_settings?.audioFadeOut || 0}s</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                            <label className="text-[10px] font-semibold text-gray-500 mb-3 block">Filter Suara (Efek Khusus)</label>
                            <div className="grid grid-cols-3 gap-2">
                                {audioEffects.map(effect => {
                                    const isSelected = (global_settings?.audioEffect || 'none') === effect.id;
                                    return (
                                        <button
                                            key={effect.id}
                                            onClick={() => updateGlobalSettings({ audioEffect: effect.id })}
                                            className={`py-2 px-1 rounded-xl text-[9px] font-bold transition-all border ${isSelected ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-[0_2px_10px_-3px_rgba(79,70,229,0.3)] ring-1 ring-indigo-500' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300'}`}
                                        >
                                            {effect.label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100">
                            <div>
                                <label className="text-[10px] font-semibold text-gray-500 mb-1 block" title="Waktu mulai lagu">Potong Mulai (s)</label>
                                <input 
                                    type="number" min="0" step="0.5"
                                    value={global_settings?.audioStart || 0}
                                    onChange={(e) => updateGlobalSettings({ audioStart: parseFloat(e.target.value) || 0 })}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-semibold text-gray-500 mb-1 block" title="Waktu selesai lagu">Potong Selesai (s)</label>
                                <input 
                                    type="number" min="0" step="0.5"
                                    value={global_settings?.audioEnd || 0}
                                    onChange={(e) => updateGlobalSettings({ audioEnd: parseFloat(e.target.value) || 0 })}
                                    className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                                />
                            </div>
                        </div>

                        <div className="pt-2 border-t border-gray-100">
                            <label className="text-[10px] font-semibold text-gray-500 mb-1 block">Musik Nyala Saat</label>
                            <select
                                value={global_settings?.audioTrigger || 'onclick'}
                                onChange={(e) => updateGlobalSettings({ audioTrigger: e.target.value })}
                                className="w-full border border-gray-300 rounded-lg p-2 text-sm text-gray-800 focus:ring-2 focus:ring-indigo-500 outline-none"
                            >
                                <option value="autoplay">Dari Halaman Pertama (Cover)</option>
                                <option value="onclick">Dari Halaman Isi (Setelah Buka)</option>
                            </select>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeTab === 'elements') {
            return (
                <div className="p-4 space-y-6">
                    {/* Koleksi Permanen / Folders */}
                    <div className="space-y-3">
                        {activeFolder ? (
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 mb-2">
                                    <button 
                                        onClick={() => setActiveFolder(null)}
                                        className="p-1 hover:bg-gray-100 rounded text-gray-500 hover:text-indigo-600 transition"
                                        title="Kembali ke Folder"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                                    </button>
                                    <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex-1 truncate">
                                        {activeFolder}
                                    </h3>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                    {globalElements.filter(el => (el.category || 'Umum') === activeFolder).map((el) => (
                                        <div key={el.id} className="relative group">
                                            <button 
                                                onClick={() => addLayer({ id: 'layer_' + Date.now(), ...el.payload })}
                                                className="w-full flex flex-col items-center justify-center p-2 bg-white border border-gray-200 rounded hover:border-indigo-500 hover:shadow-sm transition aspect-square"
                                                title={el.name}
                                            >
                                                {el.type === 'image' && el.thumbnail_url ? (
                                                    <img src={el.thumbnail_url} alt={el.name} className="w-8 h-8 object-contain mb-1" />
                                                ) : el.type === 'lottie' ? (
                                                    <div className="w-8 h-8 bg-indigo-50 text-indigo-400 flex items-center justify-center rounded mb-1">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 bg-gray-100 flex items-center justify-center rounded mb-1">
                                                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                                    </div>
                                                )}
                                                <span className="text-[9px] font-semibold text-gray-600 truncate w-full text-center leading-tight">{el.name}</span>
                                            </button>
                                            <button 
                                                onClick={(e) => deleteGlobalElement(el.id, e)}
                                                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition shadow-sm z-10"
                                                title="Hapus Elemen"
                                            >
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between">
                                    Koleksi Permanen
                                    {isLoadingElements && <span className="text-[10px] text-indigo-500 normal-case animate-pulse">Memuat...</span>}
                                </h3>
                                {globalElements.length === 0 && !isLoadingElements ? (
                                    <div className="text-center p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400">
                                        Belum ada elemen tersimpan.
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 gap-2">
                                        {[...new Set(globalElements.map(el => el.category || 'Umum'))].map(folder => {
                                            const itemsInFolder = globalElements.filter(el => (el.category || 'Umum') === folder);
                                            return (
                                                <button
                                                    key={folder}
                                                    onClick={() => setActiveFolder(folder)}
                                                    className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2"
                                                >
                                                    <div className="w-10 h-10 bg-indigo-50 flex items-center justify-center rounded-lg text-indigo-500">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"></path></svg>
                                                    </div>
                                                    <div className="text-center">
                                                        <span className="text-[10px] font-bold text-gray-700 block truncate w-full">{folder}</span>
                                                        <span className="text-[9px] text-gray-400">{itemsInFolder.length} item</span>
                                                    </div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Upload Baru */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tambah ke Pustaka</h3>
                        <div className="space-y-2">
                            {/* Lottie Upload */}
                            <div>
                                <label className="w-full flex items-center justify-center gap-2 p-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 hover:shadow-md transition cursor-pointer">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                    <span className="text-xs font-semibold">Upload Animasi (JSON)</span>
                                    <input 
                                        type="file" 
                                        accept=".json" 
                                        className="hidden" 
                                        onChange={(e) => {
                                            if (e.target.files[0]) handleUploadGlobalElement(e.target.files[0], 'lottie');
                                            e.target.value = null;
                                        }} 
                                    />
                                </label>
                            </div>
                            
                            {/* Image/SVG Element Upload */}
                            <div>
                                <label className="w-full flex items-center justify-center gap-2 p-2.5 bg-white text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 hover:shadow-md transition cursor-pointer">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    <span className="text-xs font-semibold">Upload Gambar (PNG/SVG/GIF)</span>
                                    <input 
                                        type="file" 
                                        accept="image/png, image/svg+xml, image/jpeg, image/gif" 
                                        className="hidden" 
                                        onChange={(e) => {
                                            if (e.target.files[0]) handleUploadGlobalElement(e.target.files[0], 'image');
                                            e.target.value = null;
                                        }} 
                                    />
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Bentuk Dasar */}
                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Bentuk Dasar</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => addLayer({
                                    id: 'layer_' + Date.now(),
                                    type: 'shape',
                                    content: 'square',
                                    style: { x: 50, y: 50, width: 100, height: 100, backgroundColor: '#e0e7ff', borderRadius: '0px' }
                                })}
                                className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2"
                            >
                                <div className="w-8 h-8 bg-indigo-100 border-2 border-indigo-500"></div>
                                <span className="text-[10px] font-semibold text-gray-700">Persegi</span>
                            </button>
                            <button 
                                onClick={() => addLayer({
                                    id: 'layer_' + Date.now(),
                                    type: 'shape',
                                    content: 'circle',
                                    style: { x: 50, y: 50, width: 100, height: 100, backgroundColor: '#fce7f3', borderRadius: '50%' }
                                })}
                                className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2"
                            >
                                <div className="w-8 h-8 bg-pink-100 border-2 border-pink-500 rounded-full"></div>
                                <span className="text-[10px] font-semibold text-gray-700">Lingkaran</span>
                            </button>
                            <button 
                                onClick={() => addLayer({
                                    id: 'layer_' + Date.now(),
                                    type: 'shape',
                                    content: 'pill',
                                    style: { x: 50, y: 50, width: 150, height: 50, backgroundColor: '#dcfce3', borderRadius: '9999px' }
                                })}
                                className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2"
                            >
                                <div className="w-10 h-5 bg-green-100 border-2 border-green-500 rounded-full"></div>
                                <span className="text-[10px] font-semibold text-gray-700">Kapsul</span>
                            </button>
                            <button 
                                onClick={() => addLayer({
                                    id: 'layer_' + Date.now(),
                                    type: 'shape',
                                    content: 'line',
                                    style: { x: 50, y: 50, width: 200, height: 4, backgroundColor: '#9ca3af', borderRadius: '2px' }
                                })}
                                className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2"
                            >
                                <div className="w-10 h-1 bg-gray-400 rounded-full"></div>
                                <span className="text-[10px] font-semibold text-gray-700">Garis</span>
                            </button>
                        </div>
                    </div>

                    {/* Bingkai (Frames) */}
                    <div className="pt-4 border-t border-gray-100">
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Bingkai (Wadah Foto/Video)</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={() => addLayer({
                                    id: 'layer_' + Date.now(),
                                    type: 'frame',
                                    content: 'frame',
                                    style: { x: 50, y: 50, width: 120, height: 120, backgroundColor: '#f3f4f6', borderRadius: '0px', borderWidth: 2, borderColor: '#d1d5db', borderStyle: 'dashed' }
                                })}
                                className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2"
                            >
                                <div className="w-8 h-8 bg-gray-100 border-2 border-dashed border-gray-400 flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <span className="text-[10px] font-semibold text-gray-700">Persegi</span>
                            </button>
                            <button 
                                onClick={() => addLayer({
                                    id: 'layer_' + Date.now(),
                                    type: 'frame',
                                    content: 'frame',
                                    style: { x: 50, y: 50, width: 120, height: 120, backgroundColor: '#f3f4f6', borderRadius: '50%', borderWidth: 2, borderColor: '#d1d5db', borderStyle: 'dashed' }
                                })}
                                className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2"
                            >
                                <div className="w-8 h-8 bg-gray-100 border-2 border-dashed border-gray-400 rounded-full flex items-center justify-center">
                                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                </div>
                                <span className="text-[10px] font-semibold text-gray-700">Lingkaran</span>
                            </button>
                            <button 
                                onClick={() => addLayer({
                                    id: 'layer_' + Date.now(),
                                    type: 'frame',
                                    content: 'frame',
                                    style: { x: 50, y: 50, width: 120, height: 160, backgroundColor: '#f3f4f6', borderRadiusType: 'top', borderRadius: 60, borderWidth: 2, borderColor: '#d1d5db', borderStyle: 'dashed' }
                                })}
                                className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2"
                            >
                                <div className="w-6 h-8 bg-gray-100 border-2 border-dashed border-gray-400 rounded-t-full flex items-center justify-center"></div>
                                <span className="text-[10px] font-semibold text-gray-700">Kubah (Arch)</span>
                            </button>
                            <button 
                                onClick={() => addLayer({
                                    id: 'layer_' + Date.now(),
                                    type: 'frame',
                                    content: 'frame',
                                    style: { x: 50, y: 50, width: 160, height: 100, backgroundColor: '#f3f4f6', borderRadius: '16px', borderWidth: 2, borderColor: '#d1d5db', borderStyle: 'dashed' }
                                })}
                                className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2"
                            >
                                <div className="w-8 h-6 bg-gray-100 border-2 border-dashed border-gray-400 rounded-md flex items-center justify-center"></div>
                                <span className="text-[10px] font-semibold text-gray-700">Lengkung</span>
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        if (activeTab === 'text') {
            return (
                <div className="p-4 space-y-4">
                    <button 
                        onClick={() => addLayer({
                            id: 'layer_' + Date.now(),
                            type: 'text',
                            content: 'Judul Utama',
                            style: { x: 50, y: 50, width: 300, height: 60, fontSize: '32px', fontWeight: 'bold', color: '#1f2937', textAlign: 'center', fontFamily: 'serif' }
                        })}
                        className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
                    >
                        <div className="w-10 h-10 bg-indigo-50 rounded flex items-center justify-center text-indigo-600 font-bold text-lg">T</div>
                        <div className="text-left flex-1">
                            <span className="text-sm font-bold text-gray-800 block">Tambahkan Judul</span>
                            <span className="text-[10px] text-gray-400">Teks ukuran besar (H1)</span>
                        </div>
                    </button>
                    <button 
                        onClick={() => addLayer({
                            id: 'layer_' + Date.now(),
                            type: 'text',
                            content: 'Subjudul Acara',
                            style: { x: 50, y: 120, width: 300, height: 40, fontSize: '20px', fontWeight: 'normal', color: '#4b5563', textAlign: 'center' }
                        })}
                        className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
                    >
                        <div className="w-10 h-10 bg-indigo-50 rounded flex items-center justify-center text-indigo-600 font-medium">T</div>
                        <div className="text-left flex-1">
                            <span className="text-sm font-semibold text-gray-700 block">Tambahkan Subjudul</span>
                            <span className="text-[10px] text-gray-400">Teks ukuran sedang (H2)</span>
                        </div>
                    </button>
                    <button 
                        onClick={() => addLayer({
                            id: 'layer_' + Date.now(),
                            type: 'text',
                            content: 'Tambahkan sedikit isi teks deskripsi di sini',
                            style: { x: 50, y: 180, width: 300, height: 40, fontSize: '14px', color: '#6b7280', textAlign: 'left' }
                        })}
                        className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition"
                    >
                        <div className="w-10 h-10 bg-indigo-50 rounded flex items-center justify-center text-indigo-600 text-sm">t</div>
                        <div className="text-left flex-1">
                            <span className="text-sm font-medium text-gray-600 block">Tambahkan Isi Teks</span>
                            <span className="text-[10px] text-gray-400">Teks paragraf biasa</span>
                        </div>
                    </button>
                    <button 
                        onClick={() => addLayer({
                            id: 'layer_' + Date.now(),
                            type: 'dynamic_guest_name',
                            content: '[Nama Tamu]',
                            style: { x: 50, y: 240, width: 300, height: 50, fontSize: '24px', fontWeight: 'bold', color: '#1f2937', textAlign: 'center', fontFamily: 'serif' }
                        })}
                        className="w-full flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-purple-500 hover:shadow-md transition"
                    >
                        <div className="w-10 h-10 bg-purple-50 rounded flex items-center justify-center text-purple-600 text-sm font-bold border border-purple-200">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                        <div className="text-left flex-1">
                            <span className="text-sm font-bold text-gray-800 block">Nama Tamu (Otomatis)</span>
                            <span className="text-[10px] text-gray-400">Berubah otomatis tiap link dibagikan</span>
                        </div>
                    </button>
                </div>
            );
        }

        if (activeTab === 'layers') {

            const flattenedItems = [];
            sections.forEach((section, index) => {
                flattenedItems.push({
                    id: `header_${section.id}`,
                    isHeader: true,
                    title: index === 0 ? '✨ BATAS HALAMAN SAMPUL (COVER)' : `📄 BATAS HALAMAN ISI ${index}`
                });
                const sortedLayers = [...(section.layers || [])].reverse();
                sortedLayers.forEach(layer => {
                    flattenedItems.push({
                        ...layer,
                        id: layer.id || `temp-id-${Math.random()}`,
                        originalSectionId: section.id
                    });
                });
            });

            const handleDragEnd = (event) => {
                const { active, over } = event;
                if (!over) return;

                if (active.data.current?.type === 'child') {
                    let targetGroupId = null;
                    if (over.data.current?.type === 'group') targetGroupId = over.id;
                    else if (over.data.current?.type === 'child') targetGroupId = over.data.current.parentId;
                    
                    if (!targetGroupId || targetGroupId.toString().startsWith('header_')) return;

                    if (active.data.current.parentId !== targetGroupId) {
                        // Moved to a different group
                        useCanvasStore.getState().moveElementToGroup(active.id, targetGroupId);
                    } else if (active.id !== over.id) {
                        // Reordered within the SAME group
                        const newSections = JSON.parse(JSON.stringify(sections));
                        let changed = false;

                        for (let s of newSections) {
                            const group = s.layers.find(l => l.id === targetGroupId);
                            if (group && group.children) {
                                const visualChildren = [...group.children].reverse();
                                const oldIndex = visualChildren.findIndex(c => c.id === active.id);
                                const newIndex = visualChildren.findIndex(c => c.id === over.id);
                                
                                if (oldIndex !== -1 && newIndex !== -1) {
                                    const newSorted = arrayMove(visualChildren, oldIndex, newIndex);
                                    group.children = newSorted.reverse();
                                    
                                    // Update z-index
                                    group.children.forEach((c, idx) => { if(c.style) c.style.zIndex = idx + 1; });
                                    changed = true;
                                }
                                break;
                            }
                        }

                        if (changed) {
                            useCanvasStore.getState().setAllSections(newSections);
                        }
                    }
                    return;
                }

                if (active.id !== over.id) {
                    const isDraggingSection = active.id.toString().startsWith('header_');

                    if (isDraggingSection) {
                        // Section Reordering
                        const activeSectionId = active.id.replace('header_', '');
                        const oldSectionIndex = sections.findIndex(s => s.id === activeSectionId);
                        
                        // Find which section it's dropped over
                        let overSectionId = over.id;
                        if (over.id.toString().startsWith('header_')) {
                            overSectionId = over.id.replace('header_', '');
                        } else {
                            // Find section of the layer
                            const layerItem = flattenedItems.find(l => l.id === over.id);
                            if (layerItem) overSectionId = layerItem.originalSectionId;
                        }

                        const newSectionIndex = sections.findIndex(s => s.id === overSectionId);
                        
                        if (oldSectionIndex !== -1 && newSectionIndex !== -1 && oldSectionIndex !== newSectionIndex) {
                            const newSections = arrayMove(sections, oldSectionIndex, newSectionIndex);
                            useCanvasStore.getState().setAllSections(newSections);
                        }
                    } else {
                        // Layer Reordering (within sections or across sections)
                        const oldIndex = flattenedItems.findIndex(l => l.id === active.id);
                        const newIndex = flattenedItems.findIndex(l => l.id === over.id);
                        
                        const newSorted = arrayMove(flattenedItems, oldIndex, newIndex);
                        
                        // Reconstruct sections based on the new header order
                        const newSections = [];
                        let currentSection = null;

                        newSorted.forEach(item => {
                            if (item.isHeader) {
                                const secId = item.id.replace('header_', '');
                                const originalSection = sections.find(s => s.id === secId);
                                if (originalSection) {
                                    currentSection = { ...originalSection, layers: [] };
                                    newSections.push(currentSection);
                                }
                            } else {
                                if (!currentSection) {
                                    const secId = sections[0].id;
                                    const originalSection = sections.find(s => s.id === secId);
                                    currentSection = { ...originalSection, layers: [] };
                                    newSections.push(currentSection);
                                }
                                const { originalSectionId, isHeader, ...layerData } = item;
                                currentSection.layers.push(layerData);
                            }
                        });

                        // Reverse layers back to correct zIndex order for state
                        newSections.forEach(sec => {
                            sec.layers.reverse();
                            sec.layers.forEach((l, idx) => { if(l.style) l.style.zIndex = idx + 1; });
                        });

                        useCanvasStore.getState().setAllSections(newSections);
                    }
                }
            };

            return (
                <div className="p-4 flex flex-col h-full">
                    <div className="flex gap-2 mb-4">
                        <button 
                            onClick={() => addLayer({
                                id: 'layer_' + Date.now(),
                                type: 'group',
                                name: `Layer Baru`,
                            })}
                            className="w-full py-2 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-lg text-[10px] font-bold hover:bg-indigo-100 transition shadow-sm flex flex-col items-center justify-center gap-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                            Tambah Wadah
                        </button>
                    </div>

                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                        <SortableContext items={flattenedItems.map(l => l.id)} strategy={verticalListSortingStrategy}>
                            {flattenedItems.map(layer => (
                                <SortableLayerItem key={layer.id} layer={layer} />
                            ))}
                        </SortableContext>
                    </DndContext>
                </div>
            );
        }

        if (activeTab === 'uploads') {
            const handleFileUpload = async (e) => {
                const originalFile = e.target.files[0];
                if (!originalFile) return;

                // Compress image to WebP before uploading
                const file = await compressImageToWebp(originalFile);

                const formData = new FormData();
                formData.append('file', file);

                try {
                    const response = await apiClient.post('/admin/builder/user-assets', formData, {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    });

                    if (response.data.success) {
                        fetchUserAssets();
                        addLayer({
                            id: 'layer_' + Date.now(),
                            type: response.data.data.type,
                            url: response.data.url,
                            style: { x: 50, y: 50, width: 200, height: 200 }
                        });
                    }
                } catch (error) {
                    console.error('Upload failed:', error);
                    alert('Gagal mengunggah file.');
                }
            };

            return (
                <div className="p-4 space-y-6">
                    <label className="border-2 border-dashed border-indigo-300 rounded-xl p-6 flex flex-col items-center justify-center bg-indigo-50 hover:bg-indigo-100 transition cursor-pointer">
                        <input type="file" className="hidden" accept="image/*,video/mp4" onChange={handleFileUpload} />
                        <svg className="w-8 h-8 text-indigo-500 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                        <span className="text-sm font-bold text-indigo-700">Pilih File Media</span>
                        <span className="text-xs text-indigo-400 mt-1">PNG, JPG, SVG, MP4</span>
                    </label>
                    <div>
                        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center justify-between mb-3">
                            Pustaka Media Anda
                            {isLoadingAssets && <span className="text-[10px] text-indigo-500 normal-case animate-pulse">Memuat...</span>}
                        </h3>
                        {userAssets.length === 0 && !isLoadingAssets ? (
                            <div className="text-center p-4 bg-gray-50 border border-dashed border-gray-200 rounded-lg text-xs text-gray-400">
                                Belum ada aset tersimpan. Silakan unggah file dari perangkat Anda.
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2">
                                {userAssets.map((asset) => (
                                    <div 
                                        key={asset.id}
                                        onClick={() => addLayer({ 
                                            id: 'layer_' + Date.now(), 
                                            type: asset.type, 
                                            url: asset.url, 
                                            style: { x: 50, y: 50, width: 200, height: 200 } 
                                        })}
                                        className="relative group flex flex-col items-center justify-center p-1 bg-gray-50 border border-gray-200 rounded hover:border-indigo-500 cursor-pointer aspect-square overflow-hidden"
                                        title={asset.name}
                                    >
                                        {asset.type === 'video' ? (
                                            <div className="w-full h-full bg-black flex items-center justify-center relative">
                                                <svg className="w-6 h-6 text-white/70 absolute z-10" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                                                <video src={asset.url} className="w-full h-full object-cover opacity-50" />
                                            </div>
                                        ) : (
                                            <img src={asset.url} alt={asset.name} className="w-full h-full object-cover" />
                                        )}
                                        <button
                                            onClick={(e) => deleteUserAsset(asset.id, e)}
                                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                            title="Hapus"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        if (activeTab === 'interactive') {
            return (
                <div className="p-4 grid grid-cols-2 gap-3">
                    <button 
                        onClick={() => addLayer({
                            id: 'layer_' + Date.now(),
                            type: 'dynamic_guest_name',
                            content: 'Yth. [Nama Tamu]',
                            style: { x: 50, y: 50, width: 250, height: 40, color: '#1f2937', fontSize: 24, textAlign: 'center', fontFamily: 'serif' }
                        })}
                        className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2 text-center"
                    >
                        <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600 shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 leading-tight">Nama Tamu<br/>Dinamis</span>
                    </button>
                    <button 
                        onClick={() => addLayer({
                            id: 'layer_' + Date.now(),
                            type: 'interactive_countdown',
                            content: 'Hitung Mundur',
                            style: { x: 50, y: 50, width: 300, height: 100 }
                        })}
                        className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2 text-center"
                    >
                        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600 shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 leading-tight">Hitung<br/>Mundur</span>
                    </button>
                    <button 
                        onClick={() => addLayer({
                            id: 'layer_' + Date.now(),
                            type: 'interactive_rsvp',
                            content: 'Form RSVP',
                            style: { x: 50, y: 50, width: 300, height: 400 }
                        })}
                        className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2 text-center"
                    >
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 leading-tight">Form<br/>RSVP</span>
                    </button>
                    <button 
                        onClick={() => addLayer({
                            id: 'layer_' + Date.now(),
                            type: 'interactive_comments',
                            content: 'Komentar RSVP',
                            style: { x: 50, y: 50, width: 320, height: 300, backgroundColor: '#f8fafc', borderRadius: '1rem', padding: '1rem' }
                        })}
                        className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2 text-center"
                    >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"></path></svg>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 leading-tight">Komentar<br/>RSVP</span>
                    </button>
                    <button 
                        onClick={() => addLayer({
                            id: 'layer_' + Date.now(),
                            type: 'interactive_copy',
                            content: 'Salin Rekening',
                            style: { x: 50, y: 50, width: 250, height: 60 }
                        })}
                        className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2 text-center"
                    >
                        <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-yellow-600 shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 leading-tight">Salin<br/>Rekening</span>
                    </button>
                    <button 
                        onClick={() => addLayer({
                            id: 'layer_' + Date.now(),
                            type: 'interactive_map',
                            content: 'Google Maps',
                            style: { x: 50, y: 50, width: 300, height: 250 }
                        })}
                        className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2 text-center"
                    >
                        <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-red-600 shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 leading-tight">Google<br/>Maps</span>
                    </button>

                    <button 
                        onClick={() => addLayer({
                            id: 'layer_' + Date.now(),
                            type: 'photo_album',
                            content: 'Wadah Album',
                            style: { 
                                x: 50, y: 50, width: 300, height: 300, borderRadius: '10px',
                                albumData: {
                                    direction: 'horizontal',
                                    shape: 'square',
                                    images: []
                                }
                            }
                        })}
                        className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2 text-center"
                    >
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 leading-tight">Wadah<br/>Foto Album</span>
                    </button>
                    <button 
                        onClick={() => addLayer({
                            id: 'layer_' + Date.now(),
                            type: 'polaroid',
                            content: 'Template Polaroid',
                            style: { 
                                x: 50, y: 50, width: 240, height: 280,
                                isShadowActive: true,
                                shadowDistance: 8, shadowBlur: 20, shadowAngle: 90, shadowOpacity: 0.15, shadowColor: '#000000', shadowSpread: 0,
                                polaroidData: {
                                    image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=300',
                                    caption: 'Kenangan Indah',
                                    type: 'classic',
                                    filterId: 'none'
                                }
                            }
                        })}
                        className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 hover:shadow-md transition gap-2 text-center"
                    >
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 shrink-0">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="14" height="18" x="5" y="3" rx="1" ry="1" strokeWidth="2"></rect><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 16h14"></path></svg>
                        </div>
                        <span className="text-xs font-semibold text-gray-700 leading-tight">Template<br/>Polaroid</span>
                    </button>
                </div>
            );
        }

        if (activeTab === 'code') {
            return (
                <div className="p-4 flex flex-col h-[calc(100vh-60px)]">
                    <h3 className="font-bold text-gray-800 mb-2">Injeksi Kode Global</h3>
                    <p className="text-xs text-gray-500 mb-4">
                        Masukkan HTML, CSS, atau Javascript yang akan diterapkan secara global pada seluruh halaman undangan. Kode ini otomatis dirender di kanvas utama.
                    </p>
                    <textarea 
                        className="w-full flex-1 border border-gray-300 rounded-lg p-3 text-sm font-mono bg-gray-50 text-gray-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none outline-none" 
                        placeholder="<!-- Ketik HTML/CSS di sini... -->"
                        value={global_settings?.custom_code || ''}
                        onChange={(e) => updateGlobalSettings({ custom_code: e.target.value })}
                    ></textarea>
                </div>
            );
        }

        if (activeTab === 'fonts') return <FontsPanel />;
        if (activeTab === 'colors') return <ColorsPanel />;
        if (activeTab === 'edit_image') return <ImageEditorPanel />;
        if (activeTab === 'desktop_thumbnail') return <DesktopThumbnailPanel />;
        if (activeTab === 'client_assets') return <ClientAssetsPanel />;

        return <div className="p-4 text-gray-500">Fitur dalam pengembangan...</div>;
    };

    return (
        <div className="w-[320px] bg-white border-r border-gray-200 flex flex-col z-30 shrink-0 shadow-lg relative">
            <div className="h-14 border-b border-gray-100 flex items-center px-5 shrink-0 justify-between">
                <h2 className="font-bold text-gray-800 capitalize text-lg">
                    {activeTab === 'fonts' ? 'Pilih Font' : activeTab === 'colors' ? 'Pilih Warna' : activeTab === 'edit_image' ? 'Editor Foto Expert' : activeTab === 'desktop_thumbnail' ? 'Tampilan Desktop' : activeTab === 'client_assets' ? 'Aset Klien' : activeTab}
                </h2>
                {(activeTab === 'fonts' || activeTab === 'colors' || activeTab === 'edit_image' || activeTab === 'desktop_thumbnail' || activeTab === 'client_assets') && (
                    <button 
                        onClick={() => useCanvasStore.getState().setActiveTab(null)}
                        className="p-1 rounded hover:bg-gray-100 text-gray-500"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                )}
            </div>
            <div className="flex-1 overflow-y-auto">
                {renderContent()}
            </div>

            {/* Collapse Button */}
            <button 
                onClick={() => useCanvasStore.getState().setActiveTab(null)}
                className="absolute top-1/2 -right-4 -translate-y-1/2 w-8 h-12 bg-white border border-gray-200 rounded-full flex items-center justify-center text-gray-500 hover:text-indigo-600 hover:bg-gray-50 shadow-md z-40 transition-all hover:scale-105"
                title="Tutup Panel"
            >
                <svg className="w-4 h-4 pr-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"></path></svg>
            </button>
        </div>
    );
};

export default LeftDrawer;
