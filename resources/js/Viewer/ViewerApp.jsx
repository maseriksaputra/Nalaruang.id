import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '../bootstrap';
import PublicCanvas from './components/PublicCanvas';
import IframePreview from '../Builder/components/Canvas/IframePreview';
import DesktopThumbnail from '../Builder/components/Canvas/DesktopThumbnail';
import BackgroundAudio from './components/BackgroundAudio';

const ViewerApp = ({ previewData, onClosePreview }) => {
    const isInsideBuilderPreview = window.location.pathname.includes('/builder/');
    
    // Use previewData if provided (builder preview mode), otherwise fall back to window.__INVITATION_DATA__ (public mode)
    const initialData = previewData || (typeof window !== 'undefined' && window.__INVITATION_DATA__ ? window.__INVITATION_DATA__ : null);
    
    const [viewerData, setViewerData] = useState(initialData);
    const [isLoading, setIsLoading] = useState(!initialData && isInsideBuilderPreview);

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data?.type === 'PREVIEW_UPDATE') {
                console.log("ViewerApp received PREVIEW_UPDATE:", event.data.data);
                setViewerData(event.data.data);
                setIsLoading(false);
            }
        };

        window.addEventListener('message', handleMessage);

        if (window.opener) {
            window.opener.postMessage({ type: 'VIEWER_READY' }, '*');
        } else if (window.parent !== window) {
            window.parent.postMessage({ type: 'VIEWER_READY' }, '*');
        } else {
            console.warn("Viewer is opened directly without a parent window.");
            setIsLoading(false);
        }

        return () => window.removeEventListener('message', handleMessage);
    }, []);

    if (isLoading) {
        return (
            <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
                <div className="text-gray-500 animate-pulse font-medium">Memuat pratinjau...</div>
            </div>
        );
    }

    if (!viewerData) {
        return (
            <div className="w-screen h-screen flex flex-col items-center justify-center bg-gray-100 p-4 text-center">
                <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                <h2 className="text-xl font-bold text-gray-700 mb-2">Data Pratinjau Tidak Ditemukan</h2>
                <p className="text-gray-500 max-w-md">Tidak dapat memuat data dari editor. Pastikan Anda membuka halaman ini melalui tombol Pratinjau di dalam Builder.</p>
            </div>
        );
    }

    const hasDesktopThumbnail = viewerData?.global_settings?.desktop_thumbnail?.enabled;

    const [desktopScale, setDesktopScale] = useState(1);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);
    useEffect(() => {
        const handleResize = () => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            setIsMobile(screenWidth < 1024);
            if (screenWidth >= 1024 && hasDesktopThumbnail) {
                setDesktopScale(screenHeight / 844);
            } else if (screenWidth < 414) {
                setDesktopScale(screenWidth / 414);
            } else {
                setDesktopScale(1);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [hasDesktopThumbnail]);

    const isMobilePublic = !isInsideBuilderPreview && isMobile;

    return (
        <div className={`w-full relative ${isMobilePublic ? 'min-h-screen' : 'h-screen overflow-hidden'} ${isInsideBuilderPreview ? 'bg-transparent' : 'bg-white flex justify-center'} ${!isInsideBuilderPreview && !hasDesktopThumbnail ? 'py-0 sm:py-8' : ''}`}>
            
            {/* Desktop Thumbnail Background Layer */}
            {hasDesktopThumbnail && (
                <div className="fixed inset-0 z-0 hidden lg:block">
                     <DesktopThumbnail settings={viewerData?.global_settings} isViewer={true} />
                </div>
            )}

            {isInsideBuilderPreview && (
                <div className="fixed top-0 left-0 right-0 h-14 bg-white/10 backdrop-blur-md flex items-center justify-between px-4 z-[2000] border-b border-white/20">
                    <button 
                        onClick={onClosePreview}
                        className="text-white flex items-center gap-2 hover:text-gray-200 transition bg-black/30 px-3 py-1.5 rounded-lg"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        <span className="font-semibold text-sm">Tutup Preview</span>
                    </button>
                    <div className="text-white/80 text-sm font-medium">Pratinjau Pengguna</div>
                    <div className="w-24"></div>
                </div>
            )}
            
            {/* Main Canvas Container */}
            <div className={`relative z-10 w-full ${isMobilePublic ? 'h-auto' : 'h-full'} flex ${hasDesktopThumbnail ? 'justify-center lg:justify-end' : 'justify-center items-center'} ${isInsideBuilderPreview && !hasDesktopThumbnail ? 'pt-14 pb-6' : ''}`}>
                <div 
                    id="viewer-scroll-container" 
                    className={`w-full bg-white relative ${isMobilePublic ? '' : 'overflow-y-auto'} ${!hasDesktopThumbnail && desktopScale === 1 ? 'shadow-2xl rounded-xl border border-gray-200/20' : ''}`} 
                    style={{ 
                        height: 'auto', 
                        maxHeight: isMobilePublic ? 'none' : (hasDesktopThumbnail ? '100vh' : (isInsideBuilderPreview ? 'calc(100vh - 80px)' : 'calc(100vh - 64px)')),
                        maxWidth: `${414 * desktopScale}px` 
                    }}
                >
                    <PublicCanvas config={viewerData} />
                </div>
            </div>

            {/* Background Audio */}
            {viewerData?.global_settings?.audioUrl && window.__IS_PREVIEW__ !== true && !new URLSearchParams(window.location.search).has('preview') && (
                <BackgroundAudio settings={viewerData.global_settings} />
            )}
        </div>
    );
};

const root = document.getElementById('viewer-root');
if (root) {
    createRoot(root).render(<ViewerApp />);
}

export default ViewerApp;
