import React, { useState, useRef, useEffect, useMemo } from 'react';
import useCanvasStore from '../../stores/useCanvasStore';
import { produce } from 'immer';

const MAX_TIME = 60; // 60 seconds timeline

const TimelinePanel = () => {
    const isPreviewMobile = useCanvasStore(state => state.isPreviewMobile);
    const sections = useCanvasStore(state => state.sections);
    const activeSectionId = useCanvasStore(state => state.activeSectionId);
    const activeLayerIds = useCanvasStore(state => state.activeLayerIds);
    const setActiveLayer = useCanvasStore(state => state.setActiveLayer);
    const updateLayerAnimation = useCanvasStore(state => state.updateLayerAnimation);
    
    const [isOpen, setIsOpen] = useState(true);
    const [panelHeight, setPanelHeight] = useState(250);
    const [timeScale, setTimeScale] = useState(100); // pixels per second (zoomed in for micro adjustments)
    const [playheadPos, setPlayheadPos] = useState(0); // in seconds
    const [isPlaying, setIsPlaying] = useState(false);

    const resizerRef = useRef(null);
    const isResizing = useRef(false);
    
    const playheadRef = useRef(null);
    const isDraggingPlayhead = useRef(false);

    const activeSection = sections.find(s => s.id === activeSectionId);
    const layers = activeSection ? activeSection.layers : [];

    const renderableLayers = useMemo(() => {
        let list = [];
        layers.forEach(layer => {
            if (layer.children) {
                list.push(layer);
                layer.children.forEach(child => list.push({ ...child, isChild: true, parentId: layer.id }));
            } else {
                list.push(layer);
            }
        });
        return list.sort((a, b) => (b.style?.zIndex || 0) - (a.style?.zIndex || 0));
    }, [layers]);

    // Panel Resizer
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing.current) return;
            const newHeight = window.innerHeight - e.clientY;
            setPanelHeight(Math.max(150, Math.min(newHeight, window.innerHeight * 0.8)));
        };
        const handleMouseUp = () => {
            isResizing.current = false;
            document.body.style.cursor = 'default';
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    // Playhead logic
    useEffect(() => {
        let animationFrame;
        let lastTime;

        const animate = (time) => {
            if (!lastTime) lastTime = time;
            const deltaTime = (time - lastTime) / 1000;
            lastTime = time;

            if (isPlaying) {
                setPlayheadPos(prev => {
                    let next = prev + deltaTime;
                    if (next > MAX_TIME) {
                        setIsPlaying(false);
                        return 0; // stop and reset
                    }
                    return next;
                });
            }
            animationFrame = requestAnimationFrame(animate);
        };

        if (isPlaying) {
            animationFrame = requestAnimationFrame(animate);
        }

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [isPlaying]);

    const handlePlayheadDragStart = (e) => {
        e.preventDefault();
        isDraggingPlayhead.current = true;
        setIsPlaying(false); // pause on drag
        
        const container = document.getElementById('timeline-tracks-container');
        if (!container) return;
        const rect = container.getBoundingClientRect();
        
        // Immediate jump on click
        const initialScrollLeft = container.scrollLeft;
        const initialX = e.clientX - rect.left + initialScrollLeft - 256; // 256 is left sidebar width
        const initialTime = Math.max(0, Math.min(initialX / timeScale, MAX_TIME));
        setPlayheadPos(initialTime);

        const handleMouseMove = (moveEvent) => {
            const scrollLeft = container.scrollLeft;
            const x = moveEvent.clientX - rect.left + scrollLeft - 256; // 256 is left sidebar width
            const time = Math.max(0, Math.min(x / timeScale, MAX_TIME));
            setPlayheadPos(time);
        };
        
        const handleMouseUp = () => {
            isDraggingPlayhead.current = false;
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    if (isPreviewMobile) return null;

    return (
        <div 
            className={`absolute bottom-[48px] left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] transition-transform duration-300 z-50 flex flex-col`}
            style={{ 
                height: isOpen ? `${panelHeight}px` : '40px',
                transform: `translateY(0)`
            }}
        >
            {/* Top Resizer Handle */}
            {isOpen && (
                <div 
                    ref={resizerRef}
                    className="absolute top-0 left-0 right-0 h-2 -translate-y-1 cursor-row-resize z-50 hover:bg-indigo-500/20"
                    onMouseDown={() => {
                        isResizing.current = true;
                        document.body.style.cursor = 'row-resize';
                    }}
                ></div>
            )}

            {/* Header / Toolbar */}
            <div className="h-10 border-b border-gray-200 flex items-center justify-between px-4 bg-gray-50 shrink-0">
                <div className="flex items-center gap-3">
                    <button 
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-1 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                    >
                        <svg className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <span className="font-bold text-sm text-gray-700 flex items-center gap-2">
                        <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Nalaruang Studio
                    </span>
                    
                    {/* Play controls */}
                    {isOpen && (
                        <div className="flex items-center gap-2 ml-4 border-l border-gray-300 pl-4">
                            <button 
                                onClick={() => setPlayheadPos(0)}
                                className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                                title="Kembali ke Awal"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                            </button>
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className="p-1.5 bg-indigo-600 text-white hover:bg-indigo-700 rounded transition flex items-center justify-center w-8 h-8"
                            >
                                {isPlaying ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                ) : (
                                    <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path></svg>
                                )}
                            </button>
                            <span className="text-xs font-mono text-gray-600 w-12 text-center">
                                {playheadPos.toFixed(1)}s
                            </span>
                        </div>
                    )}
                </div>

                {isOpen && (
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Zoom Detail</span>
                        <input 
                            type="range" 
                            min="30" 
                            max="300" 
                            value={timeScale}
                            onChange={(e) => setTimeScale(parseInt(e.target.value))}
                            className="w-32 accent-indigo-600 h-1.5 bg-gray-200 rounded-lg appearance-none"
                        />
                    </div>
                )}
            </div>

            {/* Timeline Body */}
            {isOpen && (
                <div className="flex flex-1 overflow-hidden select-none">
                    {/* Left Column: Layers */}
                    <div className="w-64 border-r border-gray-200 bg-white flex flex-col shrink-0 overflow-y-auto hidden-scrollbar">
                        <div className="h-8 border-b border-gray-100 bg-gray-50 flex items-center px-4 sticky top-0 z-10 shrink-0">
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Layer & Z-Index</span>
                        </div>
                        <div className="flex flex-col py-2">
                            {renderableLayers.map(layer => (
                                <div 
                                    key={layer.id}
                                    onClick={() => setActiveLayer(layer.id)}
                                    className={`h-12 flex items-center px-3 border-b border-gray-50 cursor-pointer transition-colors ${activeLayerIds.includes(layer.id) ? 'bg-indigo-50 border-indigo-100' : 'hover:bg-gray-50'} ${layer.isChild ? 'pl-8' : ''}`}
                                >
                                    <div className="w-5 h-5 flex items-center justify-center text-gray-400 cursor-grab active:cursor-grabbing hover:text-gray-600 mr-2">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 8h16M4 16h16"></path></svg>
                                    </div>
                                    <div className="flex-1 truncate flex flex-col">
                                        <span className={`text-xs truncate ${activeLayerIds.includes(layer.id) ? 'font-bold text-indigo-700' : 'font-medium text-gray-700'}`}>
                                            {layer.name || layer.content?.substring(0, 20) || 'Elemen'}
                                        </span>
                                        <span className="text-[9px] text-gray-400 font-mono">z-index: {layer.style?.zIndex || 0}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column: Time Tracks */}
                    <div 
                        className="flex-1 overflow-x-auto overflow-y-auto bg-gray-50 relative hidden-scrollbar" 
                        id="timeline-tracks-container"
                        onMouseDown={(e) => {
                            if (e.target.closest('.timeline-block')) return; // Ignore if clicking on a time block
                            handlePlayheadDragStart(e);
                        }}
                    >
                        <div 
                            className="min-h-full relative" 
                            style={{ width: `${MAX_TIME * timeScale}px` }}
                        >
                            {/* Time Ruler Header */}
                            <div 
                                className="h-8 border-b border-gray-200 bg-white sticky top-0 z-20 flex cursor-text"
                                onMouseDown={(e) => {
                                    // Clicking on ruler moves playhead
                                    handlePlayheadDragStart(e);
                                }}
                            >
                                {Array.from({ length: MAX_TIME * 10 + 1 }).map((_, i) => {
                                    const isSecond = i % 10 === 0;
                                    const sec = i / 10;
                                    return (
                                        <div 
                                            key={i} 
                                            className={`absolute top-0 bottom-0 border-l ${isSecond ? 'border-gray-300' : 'border-gray-100'} flex items-end pb-1 pl-1 text-[10px] ${isSecond ? 'text-gray-500 font-bold' : 'text-transparent'} font-mono`} 
                                            style={{ left: `${sec * timeScale}px`, height: isSecond ? '100%' : '50%', top: isSecond ? '0' : '50%' }}
                                        >
                                            {isSecond ? `${sec}s` : ''}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Background Grid */}
                            <div className="absolute top-8 bottom-0 left-0 right-0 pointer-events-none flex z-0 opacity-20">
                                {Array.from({ length: MAX_TIME * 10 }).map((_, i) => (
                                    <div key={i} className={`h-full border-l ${i % 10 === 0 ? 'border-gray-500' : 'border-gray-300 border-dashed'}`} style={{ width: `${timeScale / 10}px` }}></div>
                                ))}
                            </div>

                            {/* Playhead Line */}
                            <div 
                                ref={playheadRef}
                                className="absolute top-0 bottom-0 z-30 pointer-events-none flex flex-col items-center"
                                style={{ 
                                    left: `${playheadPos * timeScale}px`,
                                    transform: 'translateX(-50%)'
                                }}
                            >
                                <div className="w-3 h-3 rotate-45 bg-red-500 mt-5 pointer-events-auto cursor-ew-resize rounded-sm shadow-sm" onMouseDown={handlePlayheadDragStart}></div>
                                <div className="w-px flex-1 bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]"></div>
                            </div>

                            {/* Tracks */}
                            <div className="flex flex-col py-2 relative z-10">
                                {renderableLayers.map(layer => {
                                    // Map Nalaruang's entry/exit to a Canva-like Block
                                    const startTime = layer.animation?.config?.delay || 0;
                                    const hasExit = !!layer.animation?.exit;
                                    // If no exit animation, default lifespan is until MAX_TIME. 
                                    // If it has exit animation, the end time is configExit.delay
                                    const endTime = hasExit ? (layer.animation?.configExit?.delay || 5) : MAX_TIME;
                                    const duration = endTime - startTime;

                                    return (
                                        <div key={layer.id} className={`h-12 border-b border-transparent flex items-center relative w-full ${activeLayerIds.includes(layer.id) ? 'bg-indigo-50/50' : ''}`}>
                                            <TimeBlock 
                                                layer={layer}
                                                startTime={startTime}
                                                endTime={endTime}
                                                timeScale={timeScale}
                                                updateAnimation={updateLayerAnimation}
                                                active={activeLayerIds.includes(layer.id)}
                                                setActive={() => setActiveLayer(layer.id)}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Unified Time Block (Canva Style)
const TimeBlock = ({ layer, startTime, endTime, timeScale, updateAnimation, active, setActive }) => {
    const [tempStart, setTempStart] = useState(startTime);
    const [tempEnd, setTempEnd] = useState(endTime);
    
    // Sync external changes
    useEffect(() => { setTempStart(startTime); }, [startTime]);
    useEffect(() => { setTempEnd(endTime); }, [endTime]);

    const renderThumbnail = () => {
        if (layer.type === 'image' && layer.content) {
            return (
                <div className="absolute inset-y-0 left-0 right-0 flex overflow-hidden opacity-30 pointer-events-none">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <img key={i} src={layer.content} className="h-full object-cover shrink-0 w-auto mix-blend-luminosity" alt="" />
                    ))}
                </div>
            );
        } else if (layer.type === 'shape' && layer.content) {
            return (
                <div className="absolute inset-y-0 left-0 right-0 flex items-center gap-4 overflow-hidden opacity-20 pointer-events-none px-4">
                     {Array.from({ length: 20 }).map((_, i) => (
                        <div key={i} className="w-6 h-6 shrink-0" dangerouslySetInnerHTML={{ __html: layer.content }} />
                    ))}
                </div>
            );
        } else if (layer.type === 'text') {
             return (
                <div className="absolute inset-y-0 left-0 right-0 flex items-center overflow-hidden opacity-30 pointer-events-none px-2 whitespace-nowrap text-xs font-serif italic text-white/70">
                    {layer.content?.replace(/<[^>]*>?/gm, '')?.repeat(20)}
                </div>
            );
        }
        return null;
    };

    const handleDragStart = (e, dragType) => {
        e.stopPropagation();
        setActive();
        
        const startX = e.clientX;
        const initialStart = tempStart;
        const initialEnd = tempEnd;
        
        const handleMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - startX;
            const dTime = dx / timeScale;
            
            if (dragType === 'move') {
                const duration = initialEnd - initialStart;
                let newStart = Math.max(0, initialStart + dTime);
                let newEnd = newStart + duration;
                
                if (newEnd > MAX_TIME) {
                    newEnd = MAX_TIME;
                    newStart = newEnd - duration;
                }
                
                setTempStart(newStart);
                setTempEnd(newEnd);
            } else if (dragType === 'resize-left') {
                const newStart = Math.max(0, Math.min(initialStart + dTime, tempEnd - 0.2));
                setTempStart(newStart);
            } else if (dragType === 'resize-right') {
                const newEnd = Math.min(MAX_TIME, Math.max(tempStart + 0.2, initialEnd + dTime));
                setTempEnd(newEnd);
            }
        };
        
        const handleMouseUp = () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
            
            // Commit changes
            setTempStart((currentStart) => {
                setTempEnd((currentEnd) => {
                    // Update Entry Delay
                    let entryAnim = layer.animation?.entry || 'fade-up';
                    let exitAnim = layer.animation?.exit;
                    
                    updateAnimation(layer.id, { 
                        entry: entryAnim,
                        config: { ...layer.animation?.config, delay: parseFloat(currentStart.toFixed(2)) } 
                    });

                    // Update Exit Delay if end is not MAX_TIME
                    if (currentEnd < MAX_TIME - 0.5) {
                        updateAnimation(layer.id, {
                            exit: exitAnim || 'fade-out',
                            configExit: { ...layer.animation?.configExit, delay: parseFloat(currentEnd.toFixed(2)) }
                        });
                    } else if (!exitAnim) {
                        // If it reaches the end, maybe remove exit animation to stay forever
                        // Just keep it as is
                    }

                    return currentEnd;
                });
                return currentStart;
            });
        };
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    return (
        <div 
            className={`timeline-block absolute top-2 bottom-2 rounded-md border shadow-sm flex items-center cursor-grab active:cursor-grabbing overflow-visible bg-indigo-500 border-indigo-600 ${active ? 'ring-2 ring-indigo-400 ring-offset-1 z-20' : 'opacity-90 hover:opacity-100 z-10'}`}
            style={{ 
                left: `${tempStart * timeScale}px`,
                width: `${(tempEnd - tempStart) * timeScale}px`,
                minWidth: '10px'
            }}
            onMouseDown={(e) => handleDragStart(e, 'move')}
        >
            {renderThumbnail()}
            <div className="px-2 flex-1 overflow-hidden whitespace-nowrap text-[10px] font-bold text-white tracking-wide z-10 relative">
                {(tempEnd - tempStart).toFixed(1)}s
            </div>
            
            {/* Left Resizer Handle (Wider Hit Area) */}
            <div 
                className="absolute left-0 top-0 bottom-0 w-6 cursor-col-resize hover:bg-white/40 flex items-center justify-center rounded-l-md group z-30"
                onMouseDown={(e) => handleDragStart(e, 'resize-left')}
            >
                <div className="w-1 h-4 bg-white/60 group-hover:bg-white rounded-full shadow-sm"></div>
            </div>

            {/* Right Resizer Handle (Wider Hit Area) */}
            <div 
                className="absolute right-0 top-0 bottom-0 w-6 cursor-col-resize hover:bg-white/40 flex items-center justify-center rounded-r-md group z-30"
                onMouseDown={(e) => handleDragStart(e, 'resize-right')}
            >
                <div className="w-1 h-4 bg-white/60 group-hover:bg-white rounded-full shadow-sm"></div>
            </div>
        </div>
    );
};

export default TimelinePanel;
