import React, { useState, useRef, useEffect, useMemo } from 'react';
import useCanvasStore from '../../stores/useCanvasStore';
import useUIStore from '../../stores/useUIStore';
import { produce } from 'immer';

const MAX_TIME = 60; // 60 seconds timeline

const TimelinePanel = () => {
    const isPreviewMobile = useCanvasStore(state => state.isPreviewMobile);
    const sections = useCanvasStore(state => state.sections);
    const activeSectionId = useCanvasStore(state => state.activeSectionId);
    const activeLayerIds = useCanvasStore(state => state.activeLayerIds);
    const setActiveLayer = useCanvasStore(state => state.setActiveLayer);
    const updateLayerAnimation = useCanvasStore(state => state.updateLayerAnimation);
    const isRightSidebarOpen = useUIStore(state => state.isRightSidebarOpen);
    
    const [isOpen, setIsOpen] = useState(true);
    const [panelHeight, setPanelHeight] = useState(250);
    const [isDraggingResizer, setIsDraggingResizer] = useState(false);
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
            if (layer.type === 'group') {
                list.push(layer);
            } else {
                list.push({ id: `mock_track_${layer.id}`, name: 'Track', type: 'group', children: [layer], style: layer.style });
            }
        });
        // Sort by zIndex descending so higher elements are visually at the top tracks
        return list.sort((a, b) => (b.style?.zIndex || 0) - (a.style?.zIndex || 0));
    }, [layers]);

    // Sync panel height to store so Right Inspector can avoid it
    useEffect(() => {
        useUIStore.getState().setTimelineHeight(panelHeight);
        useUIStore.getState().setIsTimelineOpen(isOpen);
    }, [panelHeight, isOpen]);

    // Panel Resizer
    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!isResizing.current) return;
            // Subtract 48px because the panel is positioned at bottom-[48px]
            const newHeight = window.innerHeight - e.clientY - 48;
            setPanelHeight(Math.max(150, Math.min(newHeight, window.innerHeight * 0.8)));
        };
        const handleMouseUp = () => {
            if (isResizing.current) {
                isResizing.current = false;
                setIsDraggingResizer(false);
                document.body.style.cursor = 'default';
            }
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
        const initialX = e.clientX - rect.left + initialScrollLeft; 
        const initialTime = Math.max(0, Math.min(initialX / timeScale, MAX_TIME));
        setPlayheadPos(initialTime);

        const handleMouseMove = (moveEvent) => {
            const scrollLeft = container.scrollLeft;
            const x = moveEvent.clientX - rect.left + scrollLeft; 
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
            className={`absolute bottom-[48px] left-0 right-0 ${!isDraggingResizer ? 'transition-all duration-300' : ''} bg-white border-t border-gray-200 shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-50 flex flex-col`}
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
                        setIsDraggingResizer(true);
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
                    {/* Time Tracks (Full Width) */}
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
                                    <div key={i} className={`h-full border-l ${i % 10 === 0 ? 'border-gray-400' : 'border-gray-300 border-dashed'}`} style={{ width: `${timeScale / 10}px` }}></div>
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
                            <div className="flex flex-col py-2 relative z-10 px-4 min-w-max">
                                {renderableLayers.map((track, trackIndex) => {
                                    return (
                                        <div key={track.id} className="h-12 border-b border-gray-200 flex items-center relative w-full mb-1 hover:bg-gray-100/50">
                                            {/* Track Label */}
                                            <div className="absolute left-0 top-0 bottom-0 w-24 bg-white/50 border-r border-gray-200 z-40 px-2 flex items-center sticky left-0 shadow-[2px_0_5px_rgba(0,0,0,0.05)] backdrop-blur-sm pointer-events-none">
                                                <span className="text-[10px] font-bold text-gray-500 truncate">{track.name || `Track ${trackIndex + 1}`}</span>
                                            </div>

                                            {/* Elements in this track */}
                                            {track.children && track.children.map(layer => {
                                                const startTime = layer.animation?.config?.delay || 0;
                                                const hasExit = !!layer.animation?.exit;
                                                const endTime = hasExit ? (layer.animation?.configExit?.delay || (startTime + 5)) : (startTime + 5);

                                                return (
                                                    <TimeBlock 
                                                        key={layer.id}
                                                        layer={layer}
                                                        startTime={startTime}
                                                        endTime={endTime}
                                                        timeScale={timeScale}
                                                        updateAnimation={updateLayerAnimation}
                                                        active={activeLayerIds.includes(layer.id)}
                                                        setActive={() => setActiveLayer(layer.id)}
                                                        trackIndex={trackIndex}
                                                        allTracks={renderableLayers}
                                                    />
                                                );
                                            })}
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
const TimeBlock = ({ layer, startTime, endTime, timeScale, updateAnimation, active, setActive, trackIndex, allTracks }) => {
    const isDragging = useRef(false);
    const dragType = useRef(null); // 'start', 'end', 'body'
    const startX = useRef(0);
    const startY = useRef(0);
    const initialStart = useRef(0);
    const initialEnd = useRef(0);
    
    const moveLayerUp = useCanvasStore(state => state.moveLayerUp);
    const moveLayerDown = useCanvasStore(state => state.moveLayerDown);

    const [tempStart, setTempStart] = useState(startTime);
    const [tempEnd, setTempEnd] = useState(endTime);
    const [dragOffsetY, setDragOffsetY] = useState(0);

    const currentStartRef = useRef(startTime);
    const currentEndRef = useRef(endTime);

    // Sync state if props change, BUT ONLY if not dragging to prevent bouncing
    useEffect(() => {
        if (!isDragging.current) {
            setTempStart(startTime);
            setTempEnd(endTime);
            currentStartRef.current = startTime;
            currentEndRef.current = endTime;
        }
    }, [startTime, endTime]);

    const handleMouseDown = (e, type) => {
        e.stopPropagation();
        setActive();
        isDragging.current = true;
        dragType.current = type;
        startX.current = e.clientX;
        startY.current = e.clientY;
        initialStart.current = currentStartRef.current;
        initialEnd.current = currentEndRef.current;

        document.body.style.cursor = type === 'body' ? 'grabbing' : 'col-resize';
        
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        
        const deltaX = e.clientX - startX.current;
        const deltaY = e.clientY - startY.current;
        const deltaTime = deltaX / timeScale;

        if (dragType.current === 'start') {
            const newStart = Math.max(0, Math.min(initialStart.current + deltaTime, currentEndRef.current - 0.5));
            setTempStart(newStart);
            currentStartRef.current = newStart;
        } else if (dragType.current === 'end') {
            const newEnd = Math.max(currentStartRef.current + 0.5, Math.min(initialEnd.current + deltaTime, MAX_TIME));
            setTempEnd(newEnd);
            currentEndRef.current = newEnd;
        } else if (dragType.current === 'body') {
            const duration = initialEnd.current - initialStart.current;
            let newStart = initialStart.current + deltaTime;
            let newEnd = initialEnd.current + deltaTime;

            if (newStart < 0) {
                newStart = 0;
                newEnd = duration;
            } else if (newEnd > MAX_TIME) {
                newEnd = MAX_TIME;
                newStart = MAX_TIME - duration;
            }

            setTempStart(newStart);
            setTempEnd(newEnd);
            currentStartRef.current = newStart;
            currentEndRef.current = newEnd;
            setDragOffsetY(deltaY); // Vertical drag feedback
        }
    };

    const handleMouseUp = (e) => {
        if (isDragging.current) {
            isDragging.current = false;
            document.body.style.cursor = 'default';
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);

            const deltaY = e.clientY - startY.current;
            setDragOffsetY(0);

            // If dragged vertically, calculate track hopping based on row height (~52px)
            if (dragType.current === 'body') {
                const rowOffset = Math.round(deltaY / 52);
                if (rowOffset !== 0 && allTracks) {
                    const targetTrackIndex = trackIndex + rowOffset;
                    if (targetTrackIndex >= 0 && targetTrackIndex < allTracks.length) {
                        const targetTrack = allTracks[targetTrackIndex];
                        if (targetTrack && targetTrack.type === 'group' && !targetTrack.id.startsWith('mock_track')) {
                            useCanvasStore.getState().moveElementToGroup(layer.id, targetTrack.id);
                        } else {
                            if (deltaY < 0) moveLayerUp(layer.id);
                            else moveLayerDown(layer.id);
                        }
                    } else {
                        if (deltaY < 0) moveLayerUp(layer.id);
                        else moveLayerDown(layer.id);
                    }
                }
            }

            // Apply time changes to store
            updateAnimation(layer.id, {
                config: { delay: parseFloat(currentStartRef.current.toFixed(1)) },
                configExit: { delay: parseFloat(currentEndRef.current.toFixed(1)) }
            });
            
            // Auto add exit animation if it didn't exist but we shortened the block
            if (!layer.animation?.exit && currentEndRef.current < MAX_TIME) {
                updateAnimation(layer.id, {
                    exit: 'fadeOut', // Default exit
                    configExit: { delay: parseFloat(currentEndRef.current.toFixed(1)), speed: 1 }
                });
            }
        }
    };

    // Helper to extract a usable image url
    const getThumbUrl = () => {
        if (layer.type === 'image' && layer.content) return layer.content;
        if (layer.content && layer.content.includes('<img')) {
            const match = layer.content.match(/src="([^"]+)"/);
            if (match) return match[1];
        }
        return null;
    };
    
    const thumbUrl = getThumbUrl();
    const displayName = layer.name || (layer.type === 'text' ? 'Teks' : (layer.type === 'image' ? 'Gambar' : 'Elemen'));

    const hasEntry = !!layer.animation?.entry;
    const hasExit = !!layer.animation?.exit;
    const entryAnimName = layer.animation?.entry || '';
    const exitAnimName = layer.animation?.exit || '';

    return (
        <div 
            className={`timeline-block absolute top-1 bottom-1 rounded-md shadow-sm flex items-center cursor-grab active:cursor-grabbing overflow-hidden bg-indigo-500 ${active ? 'ring-2 ring-indigo-400 z-20 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'hover:ring-1 hover:ring-indigo-400 z-10'}`}
            style={{ 
                left: `${tempStart * timeScale}px`,
                width: `${(tempEnd - tempStart) * timeScale}px`,
                minWidth: '20px',
                transform: `translateY(${dragOffsetY}px)`,
                zIndex: isDragging.current ? 50 : undefined,
                transition: isDragging.current ? 'none' : 'transform 0.2s'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'body')}
        >
            {/* Repeating Thumbnail Background */}
            {thumbUrl && (
                <div 
                    className="absolute inset-0 pointer-events-none opacity-30 mix-blend-luminosity"
                    style={{
                        backgroundImage: `url('${thumbUrl}')`,
                        backgroundSize: 'auto 100%',
                        backgroundRepeat: 'repeat-x',
                        backgroundPosition: 'left center'
                    }}
                ></div>
            )}
            
            {!thumbUrl && (
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 pointer-events-none"></div>
            )}

            {/* Entry Handle (Green) */}
            <div 
                className="absolute left-0 top-0 bottom-0 w-6 flex items-center justify-start group cursor-col-resize z-30 hover:bg-white/10"
                onMouseDown={(e) => handleMouseDown(e, 'start')}
            >
                <div className="w-1.5 h-6 bg-green-400 rounded-r-md shadow-sm opacity-80 group-hover:opacity-100 group-hover:w-2 transition-all"></div>
                {hasEntry && (
                    <div className="absolute left-2 text-[8px] font-bold text-white bg-green-500 px-1 py-0.5 rounded shadow-sm pointer-events-none whitespace-nowrap z-40">
                        {entryAnimName}
                    </div>
                )}
            </div>
            
            {/* Name Label */}
            <div className="absolute left-6 right-6 top-0 bottom-0 flex items-center px-2 pointer-events-none z-10 overflow-hidden">
                <span className="text-[11px] font-bold text-white drop-shadow-md truncate bg-black/20 px-1.5 py-0.5 rounded backdrop-blur-sm">
                    {displayName}
                </span>
            </div>

            {/* Exit Handle (Red) */}
            <div 
                className="absolute right-0 top-0 bottom-0 w-6 flex items-center justify-end group cursor-col-resize z-30 hover:bg-white/10"
                onMouseDown={(e) => handleMouseDown(e, 'end')}
            >
                <div className="w-1.5 h-6 bg-red-400 rounded-l-md shadow-sm opacity-80 group-hover:opacity-100 group-hover:w-2 transition-all"></div>
                {hasExit && (
                    <div className="absolute right-2 text-[8px] font-bold text-white bg-red-500 px-1 py-0.5 rounded shadow-sm pointer-events-none whitespace-nowrap z-40">
                        {exitAnimName}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TimelinePanel;
