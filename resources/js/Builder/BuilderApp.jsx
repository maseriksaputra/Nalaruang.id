import React, { useEffect, useState, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import '../bootstrap';
import CanvasArea from './components/Canvas/CanvasArea';
import LeftSidebar from './components/Panels/LeftSidebar';
import LeftDrawer from './components/Panels/LeftDrawer';
import RightInspector from './components/Panels/RightInspector';
import AnimationPanel from './components/Panels/AnimationPanel';
import TopToolbar from './components/Panels/TopToolbar';
import ContextualToolbar from './components/Panels/ContextualToolbar';
import AssetSelectionModal from './components/Panels/AssetSelectionModal';
import TimelinePanel from './components/Panels/TimelinePanel';
import useUIStore from './stores/useUIStore';
import useCanvasStore from './stores/useCanvasStore';
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { ANIMATION_STYLES } from './utils/animations';
import ViewerApp from '../Viewer/ViewerApp';

const SyncSlider = ({ value, onChange, min, max, className, style, inverted }) => {
    const inputRef = useRef(null);
    const isDragging = useRef(false);

    useEffect(() => {
        if (!isDragging.current && inputRef.current) {
            inputRef.current.value = inverted ? -value : value;
        }
    }, [value, inverted]);

    return (
        <input 
            ref={inputRef}
            type="range" 
            min={min} 
            max={max} 
            defaultValue={inverted ? -value : value}
            onMouseDown={() => { isDragging.current = true; }}
            onTouchStart={() => { isDragging.current = true; }}
            onChange={(e) => {
                onChange(inverted ? -parseInt(e.target.value) : parseInt(e.target.value));
            }}
            onMouseUp={() => { isDragging.current = false; }}
            onTouchEnd={() => { isDragging.current = false; }}
            onMouseLeave={() => { isDragging.current = false; }}
            className={className}
            style={style}
        />
    );
};

const ZoomControls = ({ zoomIn, zoomOut, setTransform, centerView, scale, positionX, positionY }) => {
    return (
        <div className="h-12 bg-white border-t border-gray-200 flex items-center px-4 z-10 shrink-0 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
            <div className="flex items-center gap-2 border-r border-gray-200 pr-6 mr-6">
                <button onClick={() => centerView(1, 300)} className="flex items-center gap-1 p-1.5 mr-2 text-primary-600 bg-primary-50 hover:bg-primary-100 rounded transition font-medium text-xs shadow-sm" title="Kembalikan Layar 100% ke Tengah">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>
                    Reset Layar
                </button>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider w-10">Zoom</span>
                <button onClick={() => zoomOut()} className="p-1 text-gray-500 hover:text-primary-600 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4"></path></svg>
                </button>
                <SyncSlider 
                    min="10" 
                    max="300" 
                    value={Math.round(scale * 100)}
                    onChange={(val) => {
                        const newScale = val / 100;
                        setTransform(positionX, positionY, newScale, 0);
                    }}
                    className="w-24 accent-primary-600 cursor-ew-resize h-1.5 bg-gray-200 rounded-lg appearance-none"
                />
                <button onClick={() => zoomIn()} className="p-1 text-gray-500 hover:text-primary-600 transition">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
                </button>
                <span className="text-xs font-semibold text-gray-500 w-10 text-right">
                    {Math.round(scale * 100)}%
                </span>
            </div>

            <div className="flex items-center gap-3 flex-1 max-w-md">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Geser Horizontal</span>
                <SyncSlider 
                    min="-2000" 
                    max="2000" 
                    value={positionX}
                    inverted={true}
                    onChange={(val) => {
                        setTransform(val, positionY, scale, 0);
                    }}
                    className="flex-1 accent-gray-400 cursor-ew-resize h-1.5 bg-gray-200 rounded-lg appearance-none"
                />
            </div>
        </div>
    );
};

const BuilderApp = () => {
    const setCanvasData = useCanvasStore(state => state.setCanvasData);
    const zoom = useCanvasStore(state => state.zoom);
    const setZoom = useCanvasStore(state => state.setZoom);
    const sections = useCanvasStore(state => state.sections);
    const global_settings = useCanvasStore(state => state.global_settings);
    const addSection = useCanvasStore(state => state.addSection);
    const isPreviewMobile = useCanvasStore(state => state.isPreviewMobile);
    const isPreviewMode = useCanvasStore(state => state.isPreviewMode);
    const setIsPreviewMode = useCanvasStore(state => state.setIsPreviewMode);
    const workspaceView = useCanvasStore(state => state.workspaceView);
    const activeCanvasMode = useCanvasStore(state => state.activeCanvasMode);
    const showMockup = useCanvasStore(state => state.showMockup);
    const isTimelineOpen = useUIStore(state => state.isTimelineOpen);
    const timelineHeight = useUIStore(state => state.timelineHeight);
    
    const [isLoading, setIsLoading] = useState(true);
    const [initialScale, setInitialScale] = useState(zoom);
    const [isInitialized, setIsInitialized] = useState(false);
    const [showMobileWarning, setShowMobileWarning] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e) => {
            // Ignore if typing in a text input/textarea
            const isTextInput = e.target.tagName === 'INPUT' && ['text', 'number', 'password', 'email', 'url', 'search'].includes(e.target.type);
            if (isTextInput || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
            
            if (e.ctrlKey || e.metaKey) {
                if (e.key === 'z' || e.key === 'Z') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        useCanvasStore.temporal.getState().redo();
                    } else {
                        useCanvasStore.temporal.getState().undo();
                    }
                } else if (e.key === 'y' || e.key === 'Y') {
                    e.preventDefault();
                    useCanvasStore.temporal.getState().redo();
                } else if (e.key === 'g' || e.key === 'G') {
                    e.preventDefault();
                    if (e.shiftKey) {
                        if (useCanvasStore.getState().ungroupElements) useCanvasStore.getState().ungroupElements();
                    } else {
                        if (useCanvasStore.getState().groupElements) useCanvasStore.getState().groupElements();
                    }
                } else if (e.key === 'c' || e.key === 'C') {
                    if (window.getSelection().toString() !== '') return;
                    e.preventDefault();
                    if (useCanvasStore.getState().copyElements) useCanvasStore.getState().copyElements();
                } else if (e.key === 'v' || e.key === 'V') {
                    if (useCanvasStore.getState().pasteElements) useCanvasStore.getState().pasteElements();
                }
            }
        };

        const handlePaste = (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.isContentEditable) return;
            
            if (e.clipboardData && e.clipboardData.items) {
                for (let i = 0; i < e.clipboardData.items.length; i++) {
                    const item = e.clipboardData.items[i];
                    if (item.type.indexOf('image') !== -1) {
                        const file = item.getAsFile();
                        const reader = new FileReader();
                        reader.onload = (re) => {
                            const store = useCanvasStore.getState();
                            if (store.activeSectionId) {
                                store.addLayer({ type: 'image', url: re.target.result });
                            } else if (store.sections.length > 0) {
                                store.addLayer({ type: 'image', url: re.target.result });
                            }
                        };
                        reader.readAsDataURL(file);
                        break;
                    }
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('paste', handlePaste);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('paste', handlePaste);
        };
    }, []);

    const audioRef = useRef(null);

    useEffect(() => {
        const handlePlayAll = () => {
            if (audioRef.current && global_settings?.audioUrl) {
                audioRef.current.currentTime = global_settings.audioStart || 0;
                audioRef.current.volume = (global_settings.audioVolume ?? 100) / 100;
                audioRef.current.play().catch(e => console.log('Audio play blocked in builder:', e));
            }
        };
        const handleStopAll = () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.currentTime = global_settings?.audioStart || 0;
            }
        };

        const handlePlaybackChange = (e) => {
            if (e.detail.isPlaying) {
                handlePlayAll();
            } else {
                handleStopAll();
            }
        };

        window.addEventListener('builder:playback_change', handlePlaybackChange);
        return () => {
            window.removeEventListener('builder:playback_change', handlePlaybackChange);
        };
    }, [global_settings?.audioUrl, global_settings?.audioStart, global_settings?.audioVolume]);

    useEffect(() => {
        const id = window.__INVITATION_ID__;
        const data = window.__CANVAS_DATA__;
        setCanvasData(id, data);
        
        // Clear history so the initial empty state isn't in the undo stack
        setTimeout(() => {
            useCanvasStore.temporal.getState().clear();
        }, 100);
        
        // Auto-Fit logic: calculate available width with margin
        const availableWidth = window.innerWidth - 680 - 60; // Left sidebar + Right Inspector + 60px margin
        let targetScale = zoom;
        if (availableWidth > 0 && workspaceView === 'desktop') {
            targetScale = Math.min(1, Math.max(0.1, availableWidth / 1200));
        }
        setInitialScale(targetScale);
        setZoom(targetScale);

        setIsLoading(false);
        setTimeout(() => setIsInitialized(true), 50);

        if (window.innerWidth < 768 && !localStorage.getItem('hideMobileWarning')) {
            setShowMobileWarning(true);
        }

        const handleBeforeUnload = () => {
            useCanvasStore.getState().triggerAutoSave.flush();
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [setCanvasData]);

    if (isLoading) return <div className="h-screen w-screen bg-[#f3f4f6] flex items-center justify-center text-gray-700">Memuat Editor...</div>;

    return (
        <div className="flex flex-col h-screen w-screen bg-white text-gray-800 font-sans overflow-hidden">
            <style dangerouslySetInnerHTML={{ __html: ANIMATION_STYLES }} />
            
            {/* Global Color Picker to prevent Chrome native modal freeze bug when unmounting */}
            <input type="color" id="global-color-picker" className="absolute opacity-0" style={{ top: '10px', left: '10px', width: '1px', height: '1px', zIndex: -1 }} />
            
            {showMobileWarning && (
                <div className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6">
                    <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center border-t-4 border-yellow-500 animate-fade-in-up">
                        <div className="w-16 h-16 bg-yellow-100 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">Layar Terlalu Kecil</h2>
                        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                            Editor ini memiliki banyak fitur kompleks. Untuk pengalaman desain terbaik, <strong>harap gunakan PC atau Laptop</strong>.
                        </p>
                        <button 
                            onClick={() => {
                                localStorage.setItem('hideMobileWarning', '1');
                                setShowMobileWarning(false);
                            }}
                            className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-yellow-500/30"
                        >
                            Saya Mengerti, Lanjutkan
                        </button>
                    </div>
                </div>
            )}
            
            {isPreviewMode && (
                <div className="fixed inset-0 z-[1000] bg-black">
                    <ViewerApp 
                        previewData={{ sections, global_settings }} 
                        onClosePreview={() => setIsPreviewMode(false)}
                    />
                </div>
            )}

            <TopToolbar />
            <div className="flex flex-1 overflow-hidden relative">
                {/* Thin Icon Nav */}
                <div className={isPreviewMobile ? 'hidden' : 'flex'}>
                    <LeftSidebar />
                </div>

                <AssetSelectionModal />

                {/* Wide Drawer Panel */}
                <div className={isPreviewMobile ? 'hidden' : 'flex h-full z-20'}>
                    <LeftDrawer />
                </div>

                <div className="flex flex-1 flex-col overflow-hidden">
                    <div className="flex flex-1 overflow-hidden relative">
                        {/* Area Tengah: Canvas Workspace */}
                        <main 
                            id="zoomable-main-area" 
                            className={`flex-1 bg-[#f3f4f6] relative flex flex-col cursor-default ${isPreviewMobile ? 'items-center justify-start overflow-y-auto py-10' : 'overflow-hidden'}`}
                            onMouseDown={() => useCanvasStore.getState().setActiveLayer(null)}
                        >
                            <div className={isPreviewMobile ? 'hidden' : 'block z-40'}>
                                <ContextualToolbar />
                            </div>
                            {isPreviewMobile ? (
                                <div className="flex flex-col items-center gap-4">
                                    <div 
                                        style={{ 
                                            width: '414px', 
                                            height: '844px',
                                        }}
                                        className="canvas-container bg-white shadow-2xl relative shrink-0 overflow-y-auto overflow-x-hidden rounded-[2rem] border-[8px] border-gray-800"
                                    >
                                        <CanvasArea />
                                    </div>
                                    <p className="text-gray-400 text-sm font-medium mt-4">Preview Mode Aktif</p>
                                </div>
                            ) : !isInitialized ? null : (
                                <TransformWrapper 
                                    initialScale={initialScale} 
                                    minScale={0.1} 
                                    maxScale={3}
                                    centerOnInit={true}
                                    limitToBounds={false}
                                    wheel={{ wheelDisabled: false, step: 0.005 }}
                                    panning={{ disabled: false, excluded: ['layer-wrapper', 'context-toolbar', 'react-draggable'] }}
                                    doubleClick={{ disabled: true }}
                                    onZoom={(e) => setZoom(e.state.scale)}
                                    wrapperClass="flex-1 w-full h-full flex flex-col relative !overflow-hidden"
                                    wrapperStyle={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}
                                >
                                    {({ zoomIn, zoomOut, setTransform, state, centerView }) => (
                                        <>
                                            <div className="flex flex-1 overflow-hidden relative">
                                                {/* Canvas Scrollable Area */}
                                                <div className="flex-1 overflow-hidden relative">
                                                    <TransformComponent wrapperClass="!w-full !h-full" contentClass="min-w-full min-h-full flex flex-col items-center justify-center py-20 gap-8 relative">
                                                        {/* Dimension Guide */}
                                                        <div className="text-gray-400/80 font-mono text-xs font-bold uppercase tracking-widest pointer-events-none flex items-center gap-3 select-none">
                                                            <div className="w-12 h-[1px] bg-gray-300"></div>
                                                            {activeCanvasMode === 'desktop' ? 'Resolusi Desktop (16:9)' : workspaceView === 'desktop' ? 'Lebar Maks: 100% (Fleksibel)' : 'Lebar Maks: 414px (Mobile)'}
                                                            <div className="w-12 h-[1px] bg-gray-300"></div>
                                                        </div>

                                                        <div 
                                                            style={{ 
                                                                width: '100%',
                                                                maxWidth: activeCanvasMode === 'desktop' ? '1280px' : (workspaceView === 'desktop' ? '1200px' : '414px'),
                                                                minWidth: '320px',
                                                                minHeight: activeCanvasMode === 'desktop' ? '720px' : '844px',
                                                                height: activeCanvasMode === 'desktop' ? '720px' : (showMockup ? '844px' : 'auto'),
                                                                overflow: 'hidden'
                                                            }}
                                                            className={`canvas-container bg-white relative pointer-events-auto shrink-0 mx-auto ${(!activeCanvasMode || activeCanvasMode === 'mobile') && showMockup ? 'rounded-[2.5rem] border-[4px] border-gray-800 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] overflow-y-auto overflow-x-hidden ring-2 ring-gray-300' : 'shadow-[0_0_50px_rgba(0,0,0,0.1)] rounded-xl border border-gray-200'}`}
                                                        >
                                                            {(!activeCanvasMode || activeCanvasMode === 'mobile') && showMockup && (
                                                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-xl z-[9999] pointer-events-none flex justify-center items-end pb-1.5">
                                                                    <div className="w-12 h-1 rounded-full bg-gray-700"></div>
                                                                </div>
                                                            )}
                                                            <CanvasArea />
                                                        </div>

                                                    </TransformComponent>
                                                </div>

                                                {/* Vertical Slider */}
                                                <div className="w-10 bg-white border-l border-gray-200 flex flex-col items-center justify-center shrink-0 shadow-[-4px_0_6px_-1px_rgba(0,0,0,0.02)] z-10 relative overflow-hidden">
                                                    {/* Text Geser Vertikal removed as requested */}
                                                    <SyncSlider 
                                                        min="-4000" 
                                                        max="4000" 
                                                        value={state.positionY}
                                                        inverted={true}
                                                        onChange={(val) => setTransform(state.positionX, val, state.scale, 0)}
                                                        className="w-[400px] accent-gray-400 cursor-ns-resize absolute h-1.5 bg-gray-200 rounded-lg appearance-none"
                                                        style={{ transform: 'rotate(90deg)' }}
                                                    />
                                                </div>
                                            </div>
                                            
                                            <ZoomControls zoomIn={zoomIn} zoomOut={zoomOut} setTransform={setTransform} centerView={centerView} scale={state.scale} positionX={state.positionX} positionY={state.positionY} />
                                        </>
                                    )}
                                </TransformWrapper>
                            )}
                            
                            {/* Render Timeline Panel */}
                            <TimelinePanel />
                        </main>

                        <div 
                            className={isPreviewMobile ? 'hidden' : 'absolute top-0 right-0 bottom-0 z-[60] flex pointer-events-none transition-all duration-300'}
                        >
                            <RightInspector />
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Background Audio Player for Timeline Preview */}
            <audio ref={audioRef} src={global_settings?.audioUrl || ''} crossOrigin="anonymous" />
        </div>
    );
};

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }
    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }
    componentDidCatch(error, errorInfo) {
        this.setState({ errorInfo });
    }
    render() {
        if (this.state.hasError) {
            return (
                <div style={{ color: 'red', padding: '20px', background: '#fff', margin: '20px', borderRadius: '8px', zIndex: 99999, position: 'relative' }}>
                    <h2>Builder React Crashed!</h2>
                    <p>{this.state.error && this.state.error.toString()}</p>
                    <pre style={{ fontSize: '10px' }}>{this.state.errorInfo && this.state.errorInfo.componentStack}</pre>
                </div>
            );
        }
        return this.props.children;
    }
}

const rootElement = document.getElementById('builder-root');
if (rootElement) {
    rootElement.innerHTML = '<h1 style="color:white; padding:20px;">Memuat Builder...</h1>';
    const root = createRoot(rootElement);
    root.render(
        <ErrorBoundary>
            <BuilderApp />
        </ErrorBoundary>
    );
} else {
    document.body.innerHTML += '<div style="background:red; color:white; padding:20px; z-index:9999; position:absolute; top:0;">CRITICAL: builder-root element not found!</div>';
}
