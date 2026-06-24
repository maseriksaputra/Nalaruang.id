import React, { useState } from 'react';
import useCanvasStore from '../../stores/useCanvasStore';
import useUIStore from '../../stores/useUIStore';
import { useStore } from 'zustand';
import axios from 'axios';

const TopToolbar = () => {
    const activeLayerId = useCanvasStore(state => state.activeLayerId);
    const activeSectionId = useCanvasStore(state => state.activeSectionId);
    const sections = useCanvasStore(state => state.sections);
    const updateLayerStyle = useCanvasStore(state => state.updateLayerStyle);
    const isPreviewMobile = useCanvasStore(state => state.isPreviewMobile);
    const setIsPreviewMobile = useCanvasStore(state => state.setIsPreviewMobile);
    const setIsPreviewMode = useCanvasStore(state => state.setIsPreviewMode);
    const workspaceView = useCanvasStore(state => state.workspaceView);
    const setWorkspaceView = useCanvasStore(state => state.setWorkspaceView);
    const showMockup = useCanvasStore(state => state.showMockup);
    const setShowMockup = useCanvasStore(state => state.setShowMockup);
    const isSaving = useUIStore(state => state.isSaving);
    const showGridLines = useUIStore(state => state.showGridLines);
    const setShowGridLines = useUIStore(state => state.setShowGridLines);

    const handlePublishSubmit = () => {
        window.open(`/admin/invitation-portal?tab=distribusi&id=${window.__INVITATION_ID__}`, '_blank');
    };

    const handleUndo = () => useCanvasStore.temporal.getState().undo();
    const handleRedo = () => useCanvasStore.temporal.getState().redo();
    
    // Subscribe to temporal state to enable/disable buttons
    const pastStates = useStore(useCanvasStore.temporal, state => state.pastStates);
    const futureStates = useStore(useCanvasStore.temporal, state => state.futureStates);
    const canUndo = pastStates.length > 0;
    const canRedo = futureStates.length > 0;

    const [isTemplateModalOpen, setIsTemplateModalOpen] = useState(false);
    const [templateData, setTemplateData] = useState({
        title: window.__INVITATION_TITLE__ || '',
        category: window.__INVITATION_CATEGORY__ || '',
        price: window.__INVITATION_PRICE__ || 0,
        description: window.__INVITATION_DESCRIPTION__ || '',
        features: {
            photo: true,
            max_photos: 0,
            audio: true,
            text: true,
            rekening: true,
            tanggal: true,
            lokasi: true,
            custom_request: true
        }
    });
    const [isSavingTemplate, setIsSavingTemplate] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [folderList, setFolderList] = useState([]);

    React.useEffect(() => {
        if (isTemplateModalOpen && folderList.length === 0) {
            axios.get('/admin/invitation-portal/template-folders')
                .then(res => {
                    if (Array.isArray(res.data)) {
                        setFolderList(res.data);
                    }
                })
                .catch(e => console.error("Error fetching folders", e));
        }
    }, [isTemplateModalOpen]);

    const handleSaveTemplateSubmit = async (e) => {
        e.preventDefault();
        setIsSavingTemplate(true);
        try {
            const canvas_config = {
                global_settings: useCanvasStore.getState().global_settings,
                sections: useCanvasStore.getState().sections
            };
            
            await axios.post(`/api/builder/invitations/${window.__INVITATION_ID__}/save-as-template`, {
                title: templateData.title,
                category: templateData.category,
                price: templateData.price,
                description: templateData.description,
                canvas_config: canvas_config,
                features: templateData.features
            });
            
            setIsTemplateModalOpen(false);
            setToastMessage('Template & Form Klien berhasil disimpan!');
            setTimeout(() => setToastMessage(''), 3000);
        } catch (error) {
            console.error('Error saving template:', error);
            alert('Gagal menyimpan sebagai template.');
        } finally {
            setIsSavingTemplate(false);
        }
    };

    const activeSection = sections.find(s => s.id === activeSectionId) || sections[0];
    const activeLayer = activeSection?.layers?.find(l => l.id === activeLayerId);

    return (
        <>
        <header className="h-14 bg-primary-600 flex items-center justify-between px-4 z-50 text-white shadow">
            <div className="flex items-center gap-4">
                <a href="/admin/invitation-portal" className="p-2 hover:bg-white/10 rounded-full transition">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
                </a>
                <div className="h-6 w-[1px] bg-white/30"></div>
                <img src="/logo.png" alt="Nalaruang.id" className="h-12 scale-[2] origin-left w-auto brightness-0 invert object-contain" />
            </div>
            
            <div className="flex items-center gap-2 hidden md:flex">
                {/* Viewport toggler moved to the right */}
            </div>

            <div className="flex items-center gap-2">
                <div className="flex bg-white/10 p-0.5 rounded-md hidden md:flex">
                    <button 
                        onClick={() => setWorkspaceView('desktop')} 
                        className={`p-1.5 text-sm font-semibold rounded transition flex items-center justify-center ${workspaceView === 'desktop' ? 'bg-white shadow-sm text-primary-600' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                        title="Tampilan Desktop"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                    </button>
                    <button 
                        onClick={() => setWorkspaceView('mobile')} 
                        className={`p-1.5 text-sm font-semibold rounded transition flex items-center justify-center ${workspaceView === 'mobile' ? 'bg-white shadow-sm text-primary-600' : 'text-white/70 hover:text-white hover:bg-white/10'}`}
                        title="Tampilan Mobile"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    </button>
                </div>

                <div className="flex items-center bg-white/10 rounded-md p-0.5 hidden sm:flex">
                    <button 
                        onClick={handleUndo} 
                        disabled={!canUndo}
                        className={`p-1.5 rounded transition flex items-center ${canUndo ? 'text-white hover:bg-white/20' : 'text-white/30 cursor-not-allowed'}`}
                        title="Undo (Ctrl+Z)"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"></path></svg>
                    </button>
                    <button 
                        onClick={handleRedo} 
                        disabled={!canRedo}
                        className={`p-1.5 rounded transition flex items-center ${canRedo ? 'text-white hover:bg-white/20' : 'text-white/30 cursor-not-allowed'}`}
                        title="Redo (Ctrl+Y)"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 10h-10a8 8 0 00-8 8v2M21 10l-6 6m6-6l-6-6"></path></svg>
                    </button>
                </div>
                {isSaving ? (
                    <span className="text-xs font-medium text-white/70 flex items-center justify-center mr-2 w-6 h-6" title="Menyimpan...">
                        <svg className="animate-spin w-4 h-4 text-white/70" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                    </span>
                ) : (
                    <span className="text-xs font-medium text-white/70 flex items-center justify-center mr-2 w-6 h-6" title="Tersimpan otomatis">
                        <svg className="w-4 h-4 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                    </span>
                )}
                <button 
                    onClick={() => setShowMockup(!showMockup)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition border shadow-sm ${showMockup ? 'bg-white text-primary-600 border-white' : 'text-white bg-white/10 hover:bg-white/20 border-transparent hover:border-white/20'}`}
                    title="Tampilkan Mockup HP"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                    <span className="text-sm font-semibold hidden lg:inline">Mockup</span>
                </button>
                <button 
                    onClick={() => setShowGridLines(!showGridLines)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition border shadow-sm ${showGridLines ? 'bg-white text-primary-600 border-white' : 'text-white bg-white/10 hover:bg-white/20 border-transparent hover:border-white/20'}`}
                    title="Tampilkan Kisi-kisi Batas Layar"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
                    <span className="text-sm font-semibold hidden lg:inline">Grid</span>
                </button>
                <button 
                    onClick={() => setIsPreviewMode(true)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md transition text-white bg-white/10 hover:bg-white/20 border border-transparent hover:border-white/20 shadow-sm"
                    title="Preview Demo (POV User)"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    <span className="text-sm font-semibold hidden lg:inline">Preview</span>
                </button>
                <div className="h-5 w-[1px] bg-white/20 mx-1 hidden lg:block"></div>
                <button 
                    onClick={() => {
                        useCanvasStore.getState().triggerAutoSave.flush();
                        alert('Perubahan disimpan!');
                    }}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-md transition text-white bg-white/10 hover:bg-white/20 border border-transparent hover:border-white/20 shadow-sm hidden xl:flex"
                    title="Simpan Perubahan"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                    <span className="text-sm font-semibold">Simpan</span>
                </button>
                {window.__IS_TEMPLATE__ ? (
                    <button 
                        onClick={() => setIsTemplateModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md transition text-white bg-primary-500 hover:bg-primary-600 shadow-sm hidden xl:flex"
                        title="Update Metadata Template"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                        <span className="text-sm font-semibold">Update Metadata Template</span>
                    </button>
                ) : (
                    <button 
                        onClick={() => setIsTemplateModalOpen(true)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-md transition text-white bg-white/10 hover:bg-white/20 border border-transparent hover:border-white/20 shadow-sm hidden xl:flex"
                        title="Simpan sebagai Template"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path></svg>
                        <span className="text-sm font-semibold">Simpan Template</span>
                    </button>
                )}
                <button 
                    onClick={handlePublishSubmit}
                    className="px-4 py-1.5 text-sm bg-white text-primary-600 hover:bg-primary-50 rounded-md font-semibold transition shadow-sm flex items-center gap-2 ml-1"
                >
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse"></div>
                    <span className="hidden sm:inline">Publish & Bagikan</span>
                </button>
            </div>
        </header>

        {isTemplateModalOpen && (
            <div className="fixed inset-0 z-[2000] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 shrink-0">
                        <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                            <span className="text-xl">🏷️</span> Simpan sbg Template
                        </h3>
                        <button type="button" onClick={() => setIsTemplateModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                    
                    <div className="p-6 overflow-y-auto custom-scrollbar">
                        <form onSubmit={handleSaveTemplateSubmit}>
                            <div className="space-y-4">
                                <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nama Template</label>
                                <input 
                                    type="text" 
                                    required
                                    value={templateData.title}
                                    onChange={e => setTemplateData({...templateData, title: e.target.value})}
                                    placeholder="Contoh: Template Pernikahan Elegan"
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-sm"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Folder / Kategori</label>
                                <input 
                                    list="folder-options"
                                    type="text" 
                                    value={templateData.category}
                                    onChange={e => setTemplateData({...templateData, category: e.target.value})}
                                    placeholder="Contoh: Premium, Pernikahan, Khitanan"
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-sm"
                                />
                                <datalist id="folder-options">
                                    {folderList.map(f => (
                                        <option key={f.id} value={f.name} />
                                    ))}
                                </datalist>
                                <p className="text-xs text-gray-500 mt-1">Kategori ini akan otomatis menjadi nama Folder di halaman Kelola Template. Biarkan kosong jika tidak pakai folder.</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Harga Template (Rp)</label>
                                <input 
                                    type="number" 
                                    min="0"
                                    value={templateData.price}
                                    onChange={e => setTemplateData({...templateData, price: e.target.value})}
                                    placeholder="0 untuk gratis"
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-sm"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Deskripsi Singkat</label>
                                <textarea 
                                    rows="2"
                                    value={templateData.description}
                                    onChange={e => setTemplateData({...templateData, description: e.target.value})}
                                    placeholder="Deskripsi template ini..."
                                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-gray-800 outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all text-sm resize-none"
                                ></textarea>
                            </div>

                            <div className="pt-4 border-t border-gray-100">
                                <label className="block text-sm font-bold text-gray-800 mb-3">Konfigurasi Form Klien (Paket Fitur)</label>
                                <p className="text-xs text-gray-500 mb-4">Centang fitur apa saja yang diizinkan untuk diisi oleh klien saat membuat pesanan dari template ini.</p>
                                
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50/50">
                                        <div className="flex items-center gap-3">
                                            <input 
                                                type="checkbox" 
                                                id="feat_photo"
                                                checked={templateData.features.photo}
                                                onChange={e => setTemplateData({...templateData, features: {...templateData.features, photo: e.target.checked}})}
                                                className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                            />
                                            <label htmlFor="feat_photo" className="text-sm font-semibold text-gray-700 cursor-pointer">Fitur Foto / Galeri</label>
                                        </div>
                                        {templateData.features.photo && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs text-gray-500">Maksimal:</span>
                                                <input 
                                                    type="number" 
                                                    min="0"
                                                    value={templateData.features.max_photos === 0 ? '' : templateData.features.max_photos}
                                                    onChange={e => setTemplateData({...templateData, features: {...templateData.features, max_photos: e.target.value ? parseInt(e.target.value) : 0}})}
                                                    placeholder="∞"
                                                    className="w-16 text-xs bg-white border border-gray-300 rounded px-2 py-1 outline-none focus:border-primary-500"
                                                    title="Kosongkan untuk tak terbatas"
                                                />
                                                <span className="text-[10px] text-gray-400">
                                                    {templateData.features.max_photos === 0 ? '(Tanpa batas)' : 'file'}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'audio', label: 'Audio Latar' },
                                            { id: 'text', label: 'Teks Cerita/Quotes' },
                                            { id: 'rekening', label: 'Rekening Amplop' },
                                            { id: 'tanggal', label: 'Tanggal & Waktu' },
                                            { id: 'lokasi', label: 'Link Lokasi (Maps)' },
                                            { id: 'custom_request', label: 'Request Warna/Kata' }
                                        ].map(feat => (
                                            <div key={feat.id} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50/50 transition">
                                                <input 
                                                    type="checkbox" 
                                                    id={`feat_${feat.id}`}
                                                    checked={templateData.features[feat.id]}
                                                    onChange={e => setTemplateData({...templateData, features: {...templateData.features, [feat.id]: e.target.checked}})}
                                                    className="w-4 h-4 text-primary-600 rounded focus:ring-primary-500"
                                                />
                                                <label htmlFor={`feat_${feat.id}`} className="text-sm font-medium text-gray-700 cursor-pointer flex-1 line-clamp-1">{feat.label}</label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="mt-8 flex gap-3">
                            <button 
                                type="button"
                                onClick={() => setIsTemplateModalOpen(false)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-semibold transition-colors text-sm"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit"
                                disabled={isSavingTemplate}
                                className="flex-1 px-4 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-bold transition-colors shadow-lg shadow-primary-200 text-sm disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
                            >
                                {isSavingTemplate ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                        Menyimpan...
                                    </>
                                ) : 'Simpan Sekarang'}
                            </button>
                        </div>
                        </form>
                    </div>
                </div>
            </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
            <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[3000] bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 animate-bounce-in">
                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                </div>
                <span className="font-semibold text-sm">{toastMessage}</span>
            </div>
        )}
        </>
    );
};

export default TopToolbar;
