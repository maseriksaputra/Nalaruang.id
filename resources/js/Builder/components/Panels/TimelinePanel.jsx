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
    const activeCanvasMode = useCanvasStore(state => state.activeCanvasMode);
    const global_settings = useCanvasStore(state => state.global_settings);
    
    const [isOpen, setIsOpen] = useState(true);
    const [panelHeight, setPanelHeight] = useState(250);
    const [isDraggingResizer, setIsDraggingResizer] = useState(false);
    const [timeScale, setTimeScale] = useState(100); // pixels per second (zoomed in for micro adjustments)
    const [playheadPos, setPlayheadPos] = useState(0); // in seconds
    const playheadPosRef = useRef(0); // For smooth animation without re-renders
    const [isPlaying, setIsPlaying] = useState(false);

    const resizerRef = useRef(null);
    const isResizing = useRef(false);
    
    useEffect(() => {
        if (!isPlaying) {
            playheadPosRef.current = playheadPos;
            window.__BUILDER_IS_PLAYING__ = false;
            window.__BUILDER_PLAYHEAD_POS__ = playheadPos;
            window.dispatchEvent(new CustomEvent('builder:time_update', { detail: { time: playheadPos } }));
        } else {
            window.__BUILDER_IS_PLAYING__ = true;
        }
    }, [playheadPos, isPlaying]);

    const playheadRef = useRef(null);
    const timeDisplayRef = useRef(null);
    const isDraggingPlayhead = useRef(false);

    const activeSection = activeCanvasMode === 'desktop' 
        ? { id: 'desktop', layers: global_settings?.desktop_layers || [] }
        : sections.find(s => s.id === activeSectionId);
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
                playheadPosRef.current += deltaTime;
                let next = playheadPosRef.current;
                
                if (next > MAX_TIME) {
                    setIsPlaying(false);
                    setPlayheadPos(0); // stop and reset
                    window.__BUILDER_IS_PLAYING__ = false;
                    window.__BUILDER_PLAYHEAD_POS__ = 0;
                    return;
                }
                
                window.__BUILDER_PLAYHEAD_POS__ = next;
                // Update DOM directly for smooth animation without React re-renders
                if (playheadRef.current) {
                    playheadRef.current.style.left = `${next * timeScale}px`;
                }
                if (timeDisplayRef.current) {
                    timeDisplayRef.current.innerText = `${next.toFixed(1)}s`;
                }
                
                animationFrame = requestAnimationFrame(animate);
            }
        };

        if (isPlaying) {
            playheadPosRef.current = playheadPos; // sync before playing
            lastTime = performance.now();
            animationFrame = requestAnimationFrame(animate);
        } else {
            // sync state back when paused
            setPlayheadPos(playheadPosRef.current);
        }

        return () => {
            if (animationFrame) cancelAnimationFrame(animationFrame);
        };
    }, [isPlaying, timeScale]);

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
            playheadPosRef.current = time;
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

    const [expandedGroups, setExpandedGroups] = useState([]);
    const toggleGroup = (id) => {
        setExpandedGroups(prev => prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]);
    };

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
                    className="absolute top-0 left-0 right-0 h-2 -translate-y-1 cursor-row-resize z-50 hover:bg-primary-500/20"
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
                        className="p-1 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded transition"
                    >
                        <svg className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </button>
                    <span className="font-bold text-sm text-gray-700 flex items-center gap-2">
                        <svg className="w-4 h-4 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Nalaruang Studio
                    </span>
                    
                    {/* Play controls */}
                    {isOpen && (
                        <div className="flex items-center gap-2 ml-4 border-l border-gray-300 pl-4">
                            <button 
                                onClick={() => setPlayheadPos(0)}
                                className="p-1.5 text-gray-500 hover:text-primary-600 hover:bg-primary-50 rounded transition"
                                title="Kembali ke Awal"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>
                            </button>
                            <button 
                                onClick={() => {
                                    const newIsPlaying = !isPlaying;
                                    setIsPlaying(newIsPlaying);
                                    if (newIsPlaying) {
                                        window.dispatchEvent(new Event('builder:play_all_animations'));
                                    } else {
                                        window.dispatchEvent(new Event('builder:stop_all_animations'));
                                    }
                                }}
                                className="p-1.5 bg-primary-600 text-white hover:bg-primary-700 rounded transition flex items-center justify-center w-8 h-8"
                            >
                                {isPlaying ? (
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                ) : (
                                    <svg className="w-4 h-4 ml-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path></svg>
                                )}
                            </button>
                            <span ref={timeDisplayRef} className="text-xs font-mono text-gray-600 w-12 text-center">
                                {playheadPos.toFixed(1)}s
                            </span>
                            
                            {/* Switch Section Buttons */}
                            {sections.length > 1 && (
                                <div className="flex items-center ml-2 border border-primary-200 rounded-lg overflow-hidden shrink-0">
                                    <button 
                                        onClick={() => useCanvasStore.getState().setActiveSection(sections[0].id)}
                                        className={`px-3 py-1.5 text-[10px] font-bold transition-colors ${activeSectionId === sections[0].id ? 'bg-primary-600 text-white' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'}`}
                                    >
                                        Halaman Cover
                                    </button>
                                    <button 
                                        onClick={() => useCanvasStore.getState().setActiveSection(sections[1].id)}
                                        className={`px-3 py-1.5 text-[10px] font-bold transition-colors border-l border-primary-200 ${activeSectionId === sections[1].id ? 'bg-primary-600 text-white border-l-primary-600' : 'bg-primary-50 text-primary-600 hover:bg-primary-100'}`}
                                    >
                                        Halaman Isi
                                    </button>
                                </div>
                            )}
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
                            className="w-32 accent-primary-600 h-1.5 bg-gray-200 rounded-lg appearance-none"
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
                                    left: `${(isPlaying ? playheadPosRef.current : playheadPos) * timeScale}px`,
                                    transform: 'translateX(-50%)',
                                    willChange: 'left'
                                }}
                            >
                                <div className="w-3 h-3 rotate-45 bg-red-500 mt-5 pointer-events-auto cursor-ew-resize rounded-sm shadow-sm" onMouseDown={handlePlayheadDragStart}></div>
                                <div className="w-px flex-1 bg-red-500 shadow-[0_0_4px_rgba(239,68,68,0.5)]"></div>
                            </div>

                            {/* Tracks */}
                            <div className="flex flex-col pt-2 pb-48 relative z-10 px-4 min-w-max">
                                {renderableLayers.map((track, trackIndex) => {
                                    const isRealGroup = track.type === 'group' && !track.id.startsWith('mock_track');
                                    const isExpanded = expandedGroups.includes(track.id);

                                    const groupStart = (track.children && track.children.length > 0)
                                        ? Math.min(...track.children.map(c => c.animation?.config?.delay || 0))
                                        : 0;
                                    const groupEnd = (track.children && track.children.length > 0)
                                        ? Math.max(...track.children.map(c => {
                                            const s = c.animation?.config?.delay || 0;
                                            return c.animation?.exit ? (c.animation?.configExit?.delay || s + 5) : s + 5;
                                        }))
                                        : 5;

                                    return (
                                        <React.Fragment key={track.id}>
                                            <div className={`h-12 border-b border-gray-200 flex items-center relative w-full mb-1 ${isRealGroup && isExpanded ? 'bg-primary-50/50' : 'hover:bg-gray-100/50'}`}>
                                                {/* Track Label */}
                                                <div className="absolute left-0 top-0 bottom-0 w-24 bg-white/50 border-r border-gray-200 z-40 px-2 flex items-center sticky left-0 shadow-[2px_0_5px_rgba(0,0,0,0.05)] backdrop-blur-sm pointer-events-none">
                                                    {isRealGroup && (
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); toggleGroup(track.id); }}
                                                            className="mr-1 pointer-events-auto p-0.5 hover:bg-gray-200 rounded"
                                                        >
                                                            <svg className={`w-3 h-3 text-gray-500 transform transition-transform ${isExpanded ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                                                        </button>
                                                    )}
                                                    <span className={`text-[10px] font-bold text-gray-500 truncate ${!isRealGroup && 'ml-4'}`}>{track.name || `Track ${trackIndex + 1}`}</span>
                                                </div>

                                                {/* Elements in this track */}
                                                {isRealGroup ? (
                                                    <React.Fragment>
                                                        {track.children && track.children.map(childLayer => {
                                                            const startTime = childLayer.animation?.config?.delay || 0;
                                                            const hasExit = !!childLayer.animation?.exit;
                                                            const endTime = hasExit ? (childLayer.animation?.configExit?.delay || (startTime + 5)) : (startTime + 5);

                                                            return (
                                                                <TimeBlock 
                                                                    key={childLayer.id}
                                                                    layer={childLayer}
                                                                    parentTrackId={track.id}
                                                                    startTime={startTime}
                                                                    endTime={endTime}
                                                                    timeScale={timeScale}
                                                                    updateAnimation={updateLayerAnimation}
                                                                    active={activeLayerIds.includes(childLayer.id) || activeLayerIds.includes(track.id)}
                                                                    setActive={(multi) => setActiveLayer(childLayer.id, multi)}
                                                                    trackIndex={trackIndex}
                                                                    allTracks={renderableLayers}
                                                                    isGroupParent={false}
                                                                />
                                                            );
                                                        })}
                                                    </React.Fragment>
                                                ) : (
                                                    track.children && track.children.map(layer => {
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
                                                                setActive={(multi) => setActiveLayer(layer.id, multi)}
                                                                trackIndex={trackIndex}
                                                                allTracks={renderableLayers}
                                                                isGroupParent={false}
                                                            />
                                                        );
                                                    })
                                                )}
                                            </div>

                                            {/* Child Tracks (if Expanded) */}
                                            {isRealGroup && isExpanded && track.children?.map((childLayer, childIndex) => (
                                                <RecursiveChildTrackRow 
                                                    key={childLayer.id}
                                                    childLayer={childLayer}
                                                    childIndex={childIndex}
                                                    depth={1}
                                                    timeScale={timeScale}
                                                    updateLayerAnimation={updateLayerAnimation}
                                                    activeLayerIds={activeLayerIds}
                                                    setActiveLayer={setActiveLayer}
                                                    trackIndex={trackIndex}
                                                    renderableLayers={renderableLayers}
                                                />
                                            ))}
                                        </React.Fragment>
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

// Recursive Child Track Row Component
const RecursiveChildTrackRow = ({ childLayer, childIndex, depth, timeScale, updateLayerAnimation, activeLayerIds, setActiveLayer, trackIndex, renderableLayers }) => {
    const startTime = childLayer.animation?.config?.delay || 0;
    const hasExit = !!childLayer.animation?.exit;
    const endTime = hasExit ? (childLayer.animation?.configExit?.delay || (startTime + 5)) : (startTime + 5);

    return (
        <React.Fragment>
            <div className="h-10 border-b border-gray-100 flex items-center relative w-full mb-1 bg-gray-50/50 hover:bg-gray-100/80">
                {/* Child Label */}
                <div className="absolute left-0 top-0 bottom-0 w-24 bg-white/50 border-r border-gray-200 z-40 px-2 flex items-center sticky left-0 shadow-[2px_0_5px_rgba(0,0,0,0.05)] backdrop-blur-sm pointer-events-none" style={{ paddingLeft: `${1.5 + (depth - 1) * 0.5}rem` }}>
                    <div className="w-1.5 h-1.5 border-l-2 border-b-2 border-gray-400 mr-1.5 opacity-50"></div>
                    <span className="text-[9px] font-medium text-gray-500 truncate">{childLayer.name || `Child ${childIndex + 1}`}</span>
                </div>

                {/* Child TimeBlock */}
                <TimeBlock 
                    layer={childLayer}
                    startTime={startTime}
                    endTime={endTime}
                    timeScale={timeScale}
                    updateAnimation={updateLayerAnimation}
                    active={activeLayerIds.includes(childLayer.id)}
                    setActive={(multi) => setActiveLayer(childLayer.id, multi)}
                    trackIndex={trackIndex}
                    allTracks={renderableLayers}
                    isGroupParent={false}
                />
            </div>
            {childLayer.children && childLayer.children.length > 0 && childLayer.children.map((nestedChild, nestedIndex) => (
                <RecursiveChildTrackRow 
                    key={nestedChild.id}
                    childLayer={nestedChild}
                    childIndex={nestedIndex}
                    depth={depth + 1}
                    timeScale={timeScale}
                    updateLayerAnimation={updateLayerAnimation}
                    activeLayerIds={activeLayerIds}
                    setActiveLayer={setActiveLayer}
                    trackIndex={trackIndex}
                    renderableLayers={renderableLayers}
                />
            ))}
        </React.Fragment>
    );
};

// Unified Time Block (Canva Style)
const TimeBlock = ({ layer, parentTrackId, startTime, endTime, timeScale, updateAnimation, active, setActive, trackIndex, allTracks, isGroupParent }) => {
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

    // Generate snap points from other tracks
    const snapPoints = useMemo(() => {
        if (!allTracks) return [];
        const points = new Set([0]); // Always snap to 0
        
        allTracks.forEach(t => {
            if (t.id !== layer.id) {
                const st = t.animation?.config?.delay || 0;
                const hasEx = !!t.animation?.exit;
                const et = hasEx ? (t.animation?.configExit?.delay || (st + 5)) : (st + 5);
                points.add(st);
                points.add(et);
            }
            if (t.children) {
                t.children.forEach(c => {
                    if (c.id !== layer.id) {
                        const cSt = c.animation?.config?.delay || 0;
                        const cHasEx = !!c.animation?.exit;
                        const cEt = cHasEx ? (c.animation?.configExit?.delay || (cSt + 5)) : (cSt + 5);
                        points.add(cSt);
                        points.add(cEt);
                    }
                });
            }
        });
        return Array.from(points).sort((a,b) => a-b);
    }, [allTracks, layer.id]);

    const getSnappedTime = (time) => {
        const SNAP_THRESHOLD = 0.2; // roughly 0.2s stickiness
        let closest = time;
        let minDiff = SNAP_THRESHOLD;
        snapPoints.forEach(p => {
            if (Math.abs(time - p) < minDiff) {
                minDiff = Math.abs(time - p);
                closest = p;
            }
        });
        return closest;
    };

    const handleMouseDown = (e, type) => {
        e.stopPropagation();
        setActive(e.shiftKey || e.ctrlKey || e.metaKey);
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
            let newStart = Math.max(0, Math.min(initialStart.current + deltaTime, currentEndRef.current - 0.2));
            newStart = getSnappedTime(newStart);
            if (newStart > currentEndRef.current - 0.2) newStart = currentEndRef.current - 0.2;
            setTempStart(newStart);
            currentStartRef.current = newStart;
        } else if (dragType.current === 'end') {
            let newEnd = Math.max(currentStartRef.current + 0.2, Math.min(initialEnd.current + deltaTime, MAX_TIME));
            newEnd = getSnappedTime(newEnd);
            if (newEnd < currentStartRef.current + 0.2) newEnd = currentStartRef.current + 0.2;
            setTempEnd(newEnd);
            currentEndRef.current = newEnd;
        } else if (dragType.current === 'body') {
            const duration = initialEnd.current - initialStart.current;
            let newStart = initialStart.current + deltaTime;
            let newEnd = initialEnd.current + deltaTime;

            // Snapping for body
            const snappedStart = getSnappedTime(newStart);
            const snappedEnd = getSnappedTime(newEnd);
            
            if (Math.abs(snappedStart - newStart) < Math.abs(snappedEnd - newEnd)) {
                if (snappedStart !== newStart) {
                    newStart = snappedStart;
                    newEnd = newStart + duration;
                }
            } else {
                if (snappedEnd !== newEnd) {
                    newEnd = snappedEnd;
                    newStart = newEnd - duration;
                }
            }

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

            let hasMovedTrack = false;

            // If dragged vertically, calculate track hopping based on row height (~52px)
            if (dragType.current === 'body') {
                const rowOffset = Math.round(deltaY / 52);
                if (rowOffset !== 0 && allTracks) {
                    const targetTrackIndex = trackIndex + rowOffset;
                    if (targetTrackIndex >= 0 && targetTrackIndex < allTracks.length) {
                        const targetTrack = allTracks[targetTrackIndex];
                        // If we are dragging a child element, move it to the target group
                        if (!isGroupParent && targetTrack && targetTrack.type === 'group' && !targetTrack.id.startsWith('mock_track')) {
                            if (targetTrack.id !== parentTrackId) {
                                useCanvasStore.getState().moveElementToGroup(layer.id, targetTrack.id);
                                hasMovedTrack = true;
                            }
                        }
                    } else if (targetTrackIndex >= allTracks.length) {
                        // Create a new track if dropped below the last track
                        if (!isGroupParent) {
                            useCanvasStore.getState().moveElementToNewGroup(layer.id);
                            hasMovedTrack = true;
                        }
                    } else if (targetTrackIndex < 0) {
                        // Create a new track at the top? For now, we can just use the same logic or let it snap to 0.
                    }
                }
            }

            // Apply time changes to store
            if (isGroupParent) {
                if (dragType.current === 'body') {
                    const deltaX = currentStartRef.current - initialStart.current;
                    if (deltaX !== 0) {
                        useCanvasStore.getState().offsetGroupChildrenTime(layer.id, deltaX);
                    }
                }
            } else {
                const currentConfig = layer.animation?.config || {};
                const currentConfigExit = layer.animation?.configExit || {};
                
                const newAnimationData = {
                    config: { ...currentConfig, delay: parseFloat(currentStartRef.current.toFixed(1)) },
                    configExit: { ...currentConfigExit, delay: parseFloat(currentEndRef.current.toFixed(1)) }
                };
                
                // Set default speed if missing to ensure it saves correctly
                if (!newAnimationData.config.speed) newAnimationData.config.speed = 1.5;
                if (!newAnimationData.configExit.speed) newAnimationData.configExit.speed = 1.5;
                
                updateAnimation(layer.id, newAnimationData);
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
            className={`timeline-block absolute top-1.5 bottom-1.5 rounded shadow-sm flex items-center cursor-grab active:cursor-grabbing overflow-hidden transition-all ${active ? 'bg-primary-500 ring-2 ring-white z-30 shadow-[0_4px_15px_rgba(0,0,0,0.3)] opacity-100' : 'bg-primary-500 hover:ring-1 hover:ring-white/50 z-10 opacity-40 hover:opacity-70'}`}
            style={{ 
                left: `${tempStart * timeScale}px`,
                width: `${(tempEnd - tempStart) * timeScale}px`,
                minWidth: '24px',
                transform: `translateY(${dragOffsetY}px)`,
                zIndex: isDragging.current ? 50 : (active ? 30 : 10),
                transition: isDragging.current ? 'none' : 'transform 0.15s ease-out'
            }}
            onMouseDown={(e) => handleMouseDown(e, 'body')}
        >
            {/* Repeating Thumbnail Background */}
            {thumbUrl && (
                <div 
                    className="absolute inset-0 pointer-events-none opacity-40 mix-blend-luminosity"
                    style={{
                        backgroundImage: `url('${thumbUrl}')`,
                        backgroundSize: 'auto 100%',
                        backgroundRepeat: 'repeat-x',
                        backgroundPosition: 'left center'
                    }}
                ></div>
            )}
            
            {!thumbUrl && (
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500 to-primary-600 pointer-events-none"></div>
            )}

            {/* Entry Handle (Green) */}
            {!isGroupParent && (
                <div 
                    className="absolute left-0 top-0 bottom-0 w-4 md:w-6 flex items-center justify-start group cursor-col-resize z-40 hover:bg-white/20"
                    onMouseDown={(e) => handleMouseDown(e, 'start')}
                >
                    <div className="w-1.5 h-full bg-green-400 opacity-90 group-hover:opacity-100 group-hover:w-2 transition-all shadow-[1px_0_2px_rgba(0,0,0,0.2)]"></div>
                    {hasEntry && (
                        <div className="absolute left-2 text-[9px] font-bold text-white bg-green-500/90 px-1.5 py-0.5 rounded shadow-sm pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm border border-green-400/50">
                            IN: {entryAnimName.replace('-', ' ')}
                        </div>
                    )}
                </div>
            )}
            
            {/* Name Label */}
            <div className="absolute left-6 right-6 top-0 bottom-0 flex items-center px-2 pointer-events-none z-20 overflow-hidden justify-center">
                <span className="text-[11px] font-bold text-white drop-shadow-md truncate bg-black/30 px-2 py-0.5 rounded backdrop-blur-sm border border-white/10">
                    {displayName}
                </span>
            </div>

            {/* Exit Handle (Red) */}
            {!isGroupParent && (
                <div 
                    className="absolute right-0 top-0 bottom-0 w-4 md:w-6 flex items-center justify-end group cursor-col-resize z-40 hover:bg-white/20"
                    onMouseDown={(e) => handleMouseDown(e, 'end')}
                >
                    <div className="w-1.5 h-full bg-rose-400 opacity-90 group-hover:opacity-100 group-hover:w-2 transition-all shadow-[-1px_0_2px_rgba(0,0,0,0.2)]"></div>
                    {hasExit && (
                        <div className="absolute right-2 text-[9px] font-bold text-white bg-rose-500/90 px-1.5 py-0.5 rounded shadow-sm pointer-events-none whitespace-nowrap z-50 backdrop-blur-sm border border-rose-400/50">
                            OUT: {exitAnimName.replace('-', ' ')}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TimelinePanel;
