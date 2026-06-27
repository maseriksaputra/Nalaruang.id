import React, { useState, useEffect, useRef } from 'react';
import { Rnd } from 'react-rnd';
import { Player } from '@lottiefiles/react-lottie-player';
import { ShapePaths } from '../../utils/ShapePaths';
import useCanvasStore from '../../stores/useCanvasStore';
import useUIStore from '../../stores/useUIStore';
import { pointsToSmoothedSvgPath } from '../../utils/pathSmoothing';
import { applyAnimation } from '../../utils/engineGSAP';
import { getFilterById } from '../../utils/imageFilters';
import { loadFont } from '../../utils/fonts';
import { PaymentLogo, ChipIcon } from '../../utils/PaymentLogos';


import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards, EffectCoverflow, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-fade';

const hexToRgba = (hex, opacity = 100) => {
    hex = (hex || '#ffffff').replace('#', '');
    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    return `rgba(${r}, ${g}, ${b}, ${opacity / 100})`;
};

const getGradientCss = (style) => {
    if (style?.backgroundType === 'solid') return style.backgroundColor || '#ffffff';
    
    if (style?.backgroundType === 'linear-gradient' || style?.backgroundType === 'radial-gradient') {
        const color1 = hexToRgba(style.gradientStart || '#ffffff', style.gradientStartOpacity ?? 100);
        const color2 = hexToRgba(style.gradientEnd || '#000000', style.gradientEndOpacity ?? 100);
        
        if (style.backgroundType === 'linear-gradient') {
            return `linear-gradient(${style.gradientAngle ?? 90}deg, ${color1}, ${color2})`;
        }
        return `radial-gradient(circle, ${color1}, ${color2})`;
    }
    return 'transparent';
};

const getShadowCss = (style) => {
    if (!style?.isShadowActive) return 'none';
    
    let x = style.shadowX || 0;
    let y = style.shadowY || 0;
    
    if (style.shadowDistance !== undefined && style.shadowAngle !== undefined) {
        const angleRad = (style.shadowAngle * Math.PI) / 180;
        x = Math.round(style.shadowDistance * Math.cos(angleRad));
        y = Math.round(style.shadowDistance * Math.sin(angleRad));
    }
    
    const blur = style.shadowBlur || 0;
    // Note: drop-shadow filter does not support spread radius.
    const rgbaColor = hexToRgba(style.shadowColor || '#000000', (style.shadowOpacity ?? 0.5) * 100);
    
    return `drop-shadow(${x}px ${y}px ${blur}px ${rgbaColor})`;
};

const ResizeHandle = () => (
    <div className="w-3 h-3 bg-white border-2 border-primary-500 rounded-full shadow pointer-events-auto hover:bg-primary-50 transition-colors" />
);

const CountdownDisplay = ({ targetDate, textColor, bgColor, bgImage, fontFamily, bgOpacity, gap, showSeconds, bgStyle }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 12, hours: 8, minutes: 45, seconds: 0 });
    
    useEffect(() => {
        if (!targetDate) return;
        const target = new Date(targetDate).getTime();
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = target - now;
            if (distance < 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                clearInterval(interval);
                return;
            }
            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [targetDate]);

    // Parse hex to rgba for background opacity
    const getBgColorWithOpacity = (hex, opacity) => {
        if (!hex) return 'transparent';
        if (hex.startsWith('rgba')) return hex;
        let c;
        if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
            c= hex.substring(1).split('');
            if(c.length== 3){
                c= [c[0], c[0], c[1], c[1], c[2], c[2]];
            }
            c= '0x'+c.join('');
            return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+','+(opacity !== undefined ? opacity : 0.8)+')';
        }
        return hex;
    };

    return (
        <div 
            className={`w-full h-full flex items-center justify-center rounded-xl pointer-events-none relative overflow-hidden ${(!bgStyle || bgStyle === 'glass') ? 'backdrop-blur-sm' : ''}`}
            style={{ backgroundColor: bgImage ? 'transparent' : getBgColorWithOpacity(bgColor || '#111827', bgOpacity) }}
        >
            {bgImage && (
                <div 
                    className="absolute inset-0 w-full h-full bg-cover bg-center" 
                    style={{ backgroundImage: `url(${bgImage})`, opacity: bgOpacity !== undefined ? bgOpacity : 0.8 }} 
                />
            )}
            <div className="flex text-center relative z-10" style={{ color: textColor || 'white', fontFamily: fontFamily || 'monospace', gap: `${gap !== undefined ? gap : 16}px` }}>
                <div><span className="block text-3xl font-bold">{String(timeLeft.days).padStart(2, '0')}</span><span className="text-[10px] uppercase tracking-widest opacity-70">Hari</span></div>
                <span className="text-3xl font-bold opacity-80">:</span>
                <div><span className="block text-3xl font-bold">{String(timeLeft.hours).padStart(2, '0')}</span><span className="text-[10px] uppercase tracking-widest opacity-70">Jam</span></div>
                <span className="text-3xl font-bold opacity-80">:</span>
                <div><span className="block text-3xl font-bold">{String(timeLeft.minutes).padStart(2, '0')}</span><span className="text-[10px] uppercase tracking-widest opacity-70">Mnt</span></div>
                {showSeconds && (
                    <>
                    <span className="text-3xl font-bold opacity-80">:</span>
                    <div><span className="block text-3xl font-bold">{String(timeLeft.seconds).padStart(2, '0')}</span><span className="text-[10px] uppercase tracking-widest opacity-70">Dtk</span></div>
                    </>
                )}
            </div>
        </div>
    );
};

const LayerElement = ({ layer, isChildOfGroup, sectionId, isActiveParent }) => {
    if (layer.isHidden) return null;
    const updateLayerPosition = useCanvasStore(state => state.updateLayerPosition);
    const zoom = useCanvasStore(state => state.zoom);
    const activeTab = useCanvasStore(state => state.activeTab);
    
    const [localPos, setLocalPos] = useState({ x: layer.style?.x || 0, y: layer.style?.y || 0 });
    const [localSize, setLocalSize] = useState({ width: layer.style?.width || 100, height: layer.style?.height || 100 });
    const [isDragging, setIsDragging] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const isDrawingPath = useUIStore(state => state.isDrawingPath);

    const isSelfActive = useCanvasStore(state => state.activeLayerIds?.includes(layer.id) || state.activeLayerId === layer.id);
    const isActive = isSelfActive || isActiveParent;
    const isCropMode = activeTab === 'edit_image' && isActive;
    // Referensi untuk GSAP dan Rnd
    const visibilityRef = useRef(null);
    const elementRef = useRef(null);
    const rndRef = useRef(null);
    const localPosRef = useRef({ x: layer.style?.x || 0, y: layer.style?.y || 0 });
    useEffect(() => { localPosRef.current = localPos; }, [localPos]);

    const dragStartRef = useRef(null);

    const handleCropPointerDown = (e) => {
        if (!isCropMode) return;
        e.stopPropagation();
        dragStartRef.current = { x: e.clientX, y: e.clientY };
        e.target.setPointerCapture(e.pointerId);
    };

    const handleCropPointerMove = (e) => {
        if (!isCropMode || !dragStartRef.current) return;
        e.stopPropagation();
        const deltaX = e.clientX - dragStartRef.current.x;
        const deltaY = e.clientY - dragStartRef.current.y;
        
        const currentCrop = layer.style?.crop || { x: 0, y: 0 };
        useCanvasStore.getState().updateLayerStyle(layer.id, {
            crop: {
                ...currentCrop,
                x: currentCrop.x - deltaX,
                y: currentCrop.y - deltaY
            }
        });
        
        dragStartRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleCropPointerUp = (e) => {
        if (!isCropMode || !dragStartRef.current) return;
        e.stopPropagation();
        dragStartRef.current = null;
        e.target.releasePointerCapture(e.pointerId);
    };

    // Sinkronisasi data saat layer diubah dari Sidebar atau saat Undo/Redo
    useEffect(() => {
        const newX = layer.style?.x || 0;
        const newY = layer.style?.y || 0;
        const newWidth = layer.style?.width || 100;
        const newHeight = layer.style?.height || 100;
        
        setLocalPos({ x: newX, y: newY });
        setLocalSize({ width: newWidth, height: newHeight });
    }, [layer.style?.x, layer.style?.y, layer.style?.width, layer.style?.height]);

    // Engine Animasi Eksekusi
    useEffect(() => {
        let animationInstance = null;
        
        // If element is selected in builder, disable animations so it doesn't fight with Rnd resizing/moving
        // Unless they explicitly clicked "Preview Animasi" (which updates previewKey)
        const isPreviewing = layer.animation?.config?.previewKey && (Date.now() - layer.animation.config.previewKey < 2000);
        
        if (isActive && !isPreviewing) {
            import('gsap').then(gsap => {
                if (elementRef.current) gsap.default.set(elementRef.current, { clearProps: "all" });
            });
            return;
        }

        if (layer.animation && elementRef.current) {
            // isBuilder = true prevents ScrollTrigger and plays immediately
            const startAt = window.__BUILDER_PLAYHEAD_POS__ || 0;
            const styleForAnimation = layer.type === 'shape' ? { ...layer.style, opacity: 1 } : layer.style;
            animationInstance = applyAnimation(elementRef.current, layer.animation, true, styleForAnimation, startAt, false, isChildOfGroup);
            
            if (isPreviewing) {
                if (animationInstance && typeof animationInstance.play === 'function') {
                    animationInstance.play(0);
                }
            } else if (window.__BUILDER_IS_PLAYING__ === false && animationInstance && typeof animationInstance.pause === 'function') {
                animationInstance.pause();
            }
        }
        
        const handlePlayAll = () => {
            if (visibilityRef.current) {
                visibilityRef.current.style.opacity = '1';
                visibilityRef.current.style.pointerEvents = 'auto';
            }
            if (layer.animation && elementRef.current) {
                import('gsap').then(gsap => {
                    gsap.default.set(elementRef.current, { clearProps: "all" });
                    if (animationInstance) {
                        animationInstance.kill();
                        if (animationInstance.scrollTrigger) animationInstance.scrollTrigger.kill();
                    }
                    const startAt = window.__BUILDER_PLAYHEAD_POS__ || 0;
                    const styleForAnimation = layer.type === 'shape' ? { ...layer.style, opacity: 1 } : layer.style;
                    animationInstance = applyAnimation(elementRef.current, layer.animation, true, styleForAnimation, startAt, false, isChildOfGroup);
                    if (window.__BUILDER_IS_PLAYING__ === false && animationInstance && typeof animationInstance.pause === 'function') {
                        animationInstance.pause();
                    }
                });
            }
        };

        const handleStopAll = () => {
            if (animationInstance) {
                animationInstance.kill();
                if (animationInstance.scrollTrigger) animationInstance.scrollTrigger.kill();
            }
            import('gsap').then(gsap => {
                if (elementRef.current) gsap.default.set(elementRef.current, { clearProps: "all" });
            });
        };

        window.addEventListener('builder:play_all_animations', handlePlayAll);
        window.addEventListener('builder:stop_all_animations', handleStopAll);

        // Cleanup yang krusial agar memori tidak bocor saat layer dihapus/update
        return () => {
            window.removeEventListener('builder:play_all_animations', handlePlayAll);
            window.removeEventListener('builder:stop_all_animations', handleStopAll);
            if (animationInstance) {
                animationInstance.kill();
                if (animationInstance.scrollTrigger) {
                    animationInstance.scrollTrigger.kill();
                }
            }
            import('gsap').then(gsap => {
                if (elementRef.current) gsap.default.set(elementRef.current, { clearProps: "all" });
            });
        };
    }, [layer.animation, isActive, isDragging]);

    // Sinkronisasi Visibilitas Elemen terhadap Playhead Timeline
    useEffect(() => {
        const handleTimeUpdate = (e) => {
            if (!visibilityRef.current) return;
            const time = e.detail.time;
            const delay = layer.animation?.config?.delay || 0;
            
            if (isActive) {
                // Selalu tampilkan elemen yang sedang aktif/dipilih untuk mempermudah edit
                visibilityRef.current.style.opacity = '1';
                visibilityRef.current.style.pointerEvents = 'auto';
            } else if (time < delay) {
                // Sembunyikan elemen jika playhead belum mencapai titik mulainya
                visibilityRef.current.style.opacity = '0';
                visibilityRef.current.style.pointerEvents = 'none';
            } else {
                // Tampilkan kembali jika playhead sudah melewatinya
                visibilityRef.current.style.opacity = '1';
                visibilityRef.current.style.pointerEvents = 'auto';
            }
        };

        window.addEventListener('builder:time_update', handleTimeUpdate);
        
        // Panggil sekali saat mount untuk setup state awal (jika playhead di-0)
        handleTimeUpdate({ detail: { time: 0 } });
        
        return () => window.removeEventListener('builder:time_update', handleTimeUpdate);
    }, [layer.animation?.config?.delay, layer.style?.opacity, isActive]);

    const hasMockupRef = useRef(false);

    // Mouse rotation logic
    const handleRotateStart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const rect = elementRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const handleMouseMove = (moveEvent) => {
            const dx = moveEvent.clientX - centerX;
            const dy = moveEvent.clientY - centerY;
            const angle = Math.atan2(dy, dx) * (180 / Math.PI);
            const rotation = (angle + 90 + 360) % 360; // Offset by 90 deg so top is 0
            useCanvasStore.getState().updateLayerStyle(layer.id, { rotation: Math.round(rotation) });
        };

        const handleMouseUp = () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };

        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };



    // Load font if it's a text layer
    if (layer.type === 'text' || layer.type === 'dynamic_guest_name' || layer.type === 'interactive_copy' || layer.type === 'interactive_countdown') {
        loadFont(layer.style?.fontFamily);
    }
    if (layer.type === 'polaroid') {
        loadFont('Caveat');
    }

    const computedBorderRadius = (() => {
        if (layer.style?.borderRadius === undefined) return '0px';
        const r = `${layer.style.borderRadius}px`;
        switch(layer.style.borderRadiusType) {
            case 'top': return `${r} ${r} 0 0`;
            case 'bottom': return `0 0 ${r} ${r}`;
            case 'left': return `${r} 0 0 ${r}`;
            case 'right': return `0 ${r} ${r} 0`;
            case 'top-left': return `${r} 0 0 0`;
            case 'top-right': return `0 ${r} 0 0`;
            case 'bottom-right': return `0 0 ${r} 0`;
            case 'bottom-left': return `0 0 0 ${r}`;
            default: return r;
        }
    })();

    const innerStructure = (
        <div className="w-full h-full relative" style={{ transform: `rotate(${layer.style?.rotation || 0}deg)` }}>
                
                {/* Rotator Handle - Only visible when active */}
                {isActive && !(layer.isLocked) && !isChildOfGroup && (
                    <div 
                        className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-auto z-[9999]"
                        style={{ top: `-${40 / Math.max(0.1, zoom)}px` }}
                    >
                        <div 
                            onMouseDown={handleRotateStart}
                            className="w-5 h-5 bg-white border-2 border-primary-500 rounded-full cursor-grab active:cursor-grabbing flex items-center justify-center shadow hover:bg-primary-50 transition-colors"
                            style={{ transform: `scale(${1 / Math.max(0.1, zoom)})` }}
                        >
                            <svg className="w-3 h-3 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>
                        </div>
                        <div className="w-[1.5px] bg-primary-500" style={{ height: `${20 / Math.max(0.1, zoom)}px` }}></div>
                    </div>
                )}
                
                {/* Visibility Wrapper to isolate from GSAP clearProps */}
                <div ref={visibilityRef} className="w-full h-full transition-opacity duration-150">
                    {/* GSAP Animation Wrapper */}
                    <div ref={elementRef} className="w-full h-full relative">
                        {/* Content Wrapper */}
                        <div 
                            className={`w-full h-full relative z-10`}
                            style={{
                                transform: `scale(${layer.style?.flipX ? -1 : 1}, ${layer.style?.flipY ? -1 : 1})`,
                                borderRadius: computedBorderRadius,
                                overflow: layer.style?.borderRadius ? 'hidden' : 'visible',
                                filter: getShadowCss(layer.style),
                                background: (layer.type === 'image' || layer.type === 'text' || layer.type === 'dynamic_guest_name' || layer.type === 'shape') ? 'transparent' : getGradientCss(layer.style),
                                opacity: layer.type === 'shape' ? 1 : (layer.style?.opacity ?? 1),
                                boxSizing: 'border-box'
                            }}
                        >
                            {/* Visualizer Konten */}
                            {(layer.type === 'text' || layer.type === 'dynamic_guest_name') && (
                                <div 
                                    className={`w-full h-full overflow-visible flex outline-none border-none ${isEditing ? 'no-drag !select-text !pointer-events-auto' : ''}`}
                                    style={{
                                        color: layer.style?.color || '#000000',
                                        fontSize: layer.style?.fontSize ? (String(layer.style.fontSize).includes('px') || String(layer.style.fontSize).includes('rem') || String(layer.style.fontSize).includes('em') ? layer.style.fontSize : `${layer.style.fontSize}px`) : '16px',
                                        fontFamily: layer.style?.fontFamily || 'sans-serif',
                                        fontWeight: layer.style?.fontWeight || 'normal',
                                        textAlign: layer.style?.textAlign || 'left',
                                        justifyContent: layer.style?.textAlign === 'center' ? 'center' : layer.style?.textAlign === 'right' ? 'flex-end' : 'flex-start',
                                        alignItems: 'center',
                                        textDecoration: layer.style?.textDecoration,
                                        fontStyle: layer.style?.fontStyle,
                                        letterSpacing: layer.style?.letterSpacing,
                                        lineHeight: layer.style?.lineHeight,
                                        textShadow: layer.style?.textShadow,
                                        cursor: isEditing ? 'text' : (layer.isLocked ? 'default' : 'move'),
                                        userSelect: isEditing ? 'text' : 'none',
                                        WebkitUserSelect: isEditing ? 'text' : 'none'
                                    }}
                                    contentEditable={isEditing}
                                    suppressContentEditableWarning={true}
                                    onDoubleClick={(e) => {
                                        e.stopPropagation();
                                        setIsEditing(true);
                                        const target = e.target;
                                        setTimeout(() => {
                                            target.focus();
                                            const range = document.createRange();
                                            range.selectNodeContents(target);
                                            const sel = window.getSelection();
                                            sel.removeAllRanges();
                                            sel.addRange(range);
                                        }, 50);
                                    }}
                                    onBlur={(e) => {
                                        setIsEditing(false);
                                        useCanvasStore.getState().updateLayerContent(layer.id, e.target.innerText);
                                    }}
                                >
                                    {layer.content}
                                </div>
                            )}
                            
                            {layer.type === 'shape' && (
                                ShapePaths[layer.content] ? (
                                    <svg 
                                        viewBox={ShapePaths[layer.content].viewBox} 
                                        className="w-full h-full pointer-events-none" 
                                        preserveAspectRatio="none"
                                        style={{ 
                                            color: layer.style?.backgroundColor || '#cbd5e1',
                                            overflow: 'visible'
                                        }}
                                    >
                                        {(layer.style?.backgroundType === 'linear-gradient' || layer.style?.backgroundType === 'radial-gradient') && (
                                            <defs>
                                                {layer.style.backgroundType === 'linear-gradient' ? (
                                                    <linearGradient id={`grad-${layer.id}`} x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform={`rotate(${layer.style.gradientAngle || 90} 0.5 0.5)`}>
                                                        <stop offset="0%" stopColor={hexToRgba(layer.style.gradientStart || '#ffffff', layer.style.gradientStartOpacity ?? 100)} />
                                                        <stop offset="100%" stopColor={hexToRgba(layer.style.gradientEnd || '#000000', layer.style.gradientEndOpacity ?? 100)} />
                                                    </linearGradient>
                                                ) : (
                                                    <radialGradient id={`grad-${layer.id}`}>
                                                        <stop offset="0%" stopColor={hexToRgba(layer.style.gradientStart || '#ffffff', layer.style.gradientStartOpacity ?? 100)} />
                                                        <stop offset="100%" stopColor={hexToRgba(layer.style.gradientEnd || '#000000', layer.style.gradientEndOpacity ?? 100)} />
                                                    </radialGradient>
                                                )}
                                            </defs>
                                        )}
                                        <path 
                                            d={ShapePaths[layer.content].path} 
                                            fill={(layer.style?.backgroundType === 'linear-gradient' || layer.style?.backgroundType === 'radial-gradient') ? `url(#grad-${layer.id})` : "currentColor"} 
                                            fillOpacity={layer.style?.opacity ?? 1}
                                            fillRule={ShapePaths[layer.content].fillRule || 'nonzero'} 
                                            stroke={layer.style?.borderWidth > 0 ? hexToRgba(layer.style.borderColor || '#000000', (layer.style.borderOpacity ?? 1) * 100) : undefined}
                                            strokeWidth={layer.style?.borderWidth > 0 ? layer.style.borderWidth : undefined}
                                            strokeDasharray={layer.style?.borderStyle === 'dashed' ? '8 8' : layer.style?.borderStyle === 'dotted' ? '2 4' : undefined}
                                            vectorEffect="non-scaling-stroke"
                                        />
                                    </svg>
                                ) : (
                                    <div 
                                        className="w-full h-full relative pointer-events-none"
                                        style={{
                                            background: (!layer.style?.backgroundType || layer.style?.backgroundType === 'solid') ? (layer.style?.backgroundColor || '#cbd5e1') : getGradientCss(layer.style),
                                            borderRadius: computedBorderRadius,
                                            borderWidth: layer.style?.borderWidth ? `${layer.style.borderWidth}px` : undefined,
                                            borderColor: layer.style?.borderWidth > 0 ? hexToRgba(layer.style.borderColor || '#000000', (layer.style.borderOpacity ?? 1) * 100) : undefined,
                                            borderStyle: layer.style?.borderWidth > 0 ? (layer.style.borderStyle || 'solid') : undefined,
                                            opacity: layer.style?.opacity ?? 1
                                        }}
                                    ></div>
                                )
                            )}

                            {/* Lottie Upload Fix */}
                            {(() => {
                                if (layer.type === 'lottie') {
                                    let lottieData = layer.lottieJsonObj || layer.animationData;
                                    if (typeof lottieData === 'string') {
                                        try { lottieData = JSON.parse(lottieData); } catch(e) {}
                                    } else if (lottieData && typeof lottieData === 'object') {
                                        // Deep clone to prevent lottie-web from mutating the Zustand state object
                                        lottieData = JSON.parse(JSON.stringify(lottieData));
                                    }
                                    if (lottieData) {
                                        return (
                                            <div className="w-full h-full relative pointer-events-none">
                                                <Player 
                                                    src={lottieData}
                                                    loop={layer.animation?.loop !== false} 
                                                    autoplay={true}
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                            </div>
                                        );
                                    }
                                }
                                return null;
                            })()}

                            {layer.type === 'image' && (
                                <div className="w-full h-full relative pointer-events-none">
                                    {isActive && (
                                        <button 
                                            onClick={() => {
                                                useUIStore.getState().setAssetSelectionTarget({
                                                    layerId: layer.id,
                                                    layerType: 'image',
                                                    multiple: false
                                                });
                                            }}
                                            className="absolute top-2 right-2 bg-primary-600 text-white p-2 rounded-full shadow-lg z-50 pointer-events-auto hover:bg-primary-700 transition"
                                            title="Ubah Gambar"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        </button>
                                    )}
                                    <img 
                                        id={`layer-img-${layer.id}`}
                                        src={layer.style?.url || layer.url} 
                                        alt="asset" 
                                        draggable={false}
                                        onPointerDown={handleCropPointerDown}
                                        onPointerMove={handleCropPointerMove}
                                        onPointerUp={handleCropPointerUp}
                                        className={`w-full h-full object-cover pointer-events-none ${isCropMode ? 'cursor-move pointer-events-auto no-drag' : ''}`}
                                        style={{
                                            objectPosition: `${layer.style?.cropX || 50}% ${layer.style?.cropY || 50}%`,
                                            filter: `${layer.style?.imageFilter && layer.style.imageFilter !== 'none' ? getFilterById(layer.style.imageFilter).getCss(layer.style.imageFilterIntensity ?? 100) + ' ' : ''}brightness(${layer.style?.brightness ?? 1}) contrast(${layer.style?.contrast ?? 1}) saturate(${layer.style?.saturate ?? 1}) blur(${layer.style?.blur ?? 0}px) grayscale(${layer.style?.grayscale ?? 0})`.trim()
                                        }}
                                    />
                                    {/* Overlay effects for grain or vignette */}
                                    {layer.style?.imageFilter && getFilterById(layer.style.imageFilter).getOverlay && (
                                        <div dangerouslySetInnerHTML={{ __html: getFilterById(layer.style.imageFilter).getOverlay(layer.style.imageFilterIntensity ?? 100, layer) }} />
                                    )}
                                </div>
                            )}

                            {layer.type === 'frame' && (
                                <div className="w-full h-full relative pointer-events-none flex items-center justify-center overflow-hidden">
                                    {isActive && (
                                        <button 
                                            onClick={() => {
                                                useUIStore.getState().setAssetSelectionTarget({
                                                    layerId: layer.id,
                                                    layerType: 'frame',
                                                    multiple: true
                                                });
                                            }}
                                            className="absolute top-2 right-2 bg-primary-600 text-white p-2 rounded-full shadow-lg z-50 pointer-events-auto hover:bg-primary-700 transition"
                                            title="Isi Wadah Bingkai"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                        </button>
                                    )}
                                    
                                    {layer.style?.mediaUrls && layer.style.mediaUrls.length > 0 ? (
                                        layer.style.mediaUrls[0].startsWith('data:video') || layer.style.mediaUrls[0].endsWith('.mp4') ? (
                                            <video 
                                                src={layer.style.mediaUrls[0]}
                                                autoPlay muted loop playsInline
                                                className="w-full h-full object-cover pointer-events-none"
                                            />
                                        ) : layer.style.mediaUrls.length > 1 ? (
                                            <div className="w-full h-full relative">
                                                <img src={layer.style.mediaUrls[0]} className="w-full h-full object-cover pointer-events-none" alt="Frame"/>
                                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] bg-black/60 text-white px-2 py-1 rounded-full whitespace-nowrap">
                                                    Album ({layer.style.mediaUrls.length} Foto)
                                                </div>
                                            </div>
                                        ) : (
                                            <img 
                                                src={layer.style.mediaUrls[0]} 
                                                alt="Frame Media" 
                                                className="w-full h-full object-cover pointer-events-none"
                                            />
                                        )
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        </div>
                                    )}
                                </div>
                            )}
                    {layer.type === 'polaroid' && (
                        <div className="w-full h-full relative pointer-events-none bg-white flex flex-col p-3" style={{ 
                            paddingBottom: '3.5rem',
                            transform: layer.style?.polaroidData?.type === 'tilted' ? 'rotate(-3deg)' : 'none',
                            boxShadow: layer.style?.isShadowActive ? 'none' : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                        }}>
                            {layer.style?.polaroidData?.type === 'taped' && (
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-8 bg-amber-100/60 rotate-2 z-10" style={{ backdropFilter: 'blur(2px)' }}></div>
                            )}
                            <div className="w-full flex-1 relative overflow-hidden bg-gray-100 border border-gray-200">
                                {isActive && (
                                    <button 
                                        onClick={() => {
                                            useUIStore.getState().setAssetSelectionTarget({
                                                layerId: layer.id,
                                                layerType: 'polaroid',
                                                multiple: false
                                            });
                                        }}
                                        className="absolute top-2 right-2 bg-primary-600 text-white p-2 rounded-full shadow-lg z-50 pointer-events-auto hover:bg-primary-700 transition"
                                        title="Ubah Foto Polaroid"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </button>
                                )}
                                {layer.style?.polaroidData?.image ? (
                                    <>
                                        <img 
                                            src={layer.style.polaroidData.image} 
                                            alt="Polaroid" 
                                            draggable={false}
                                            onPointerDown={handleCropPointerDown}
                                            onPointerMove={handleCropPointerMove}
                                            onPointerUp={handleCropPointerUp}
                                            className={`w-full h-full object-cover ${isCropMode ? 'cursor-move pointer-events-auto no-drag' : ''}`}
                                            style={{
                                                objectPosition: `${layer.style?.cropX || 50}% ${layer.style?.cropY || 50}%`,
                                                filter: `${layer.style?.polaroidData?.filterId && layer.style.polaroidData.filterId !== 'none' ? getFilterById(layer.style.polaroidData.filterId).getCss(100) + ' ' : ''}${layer.style?.brightness ? `brightness(${layer.style.brightness}) ` : ''}${layer.style?.contrast ? `contrast(${layer.style.contrast}) ` : ''}${layer.style?.saturate ? `saturate(${layer.style.saturate}) ` : ''}${layer.style?.blur ? `blur(${layer.style.blur}px) ` : ''}`.trim() || 'none'
                                            }}
                                        />
                                        {layer.style?.polaroidData?.filterId && layer.style.polaroidData.filterId !== 'none' && (
                                            <div dangerouslySetInnerHTML={{ __html: getFilterById(layer.style.polaroidData.filterId)?.getOverlay(100, { type: 'polaroid', style: layer.style }) || '' }} />
                                        )}
                                    </>
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                )}
                            </div>
                            {layer.style?.polaroidData?.caption && (
                                <div className="absolute bottom-3 left-0 w-full text-center text-gray-800 text-[18px] font-bold" style={{ fontFamily: "'Caveat', cursive", lineHeight: 1 }}>
                                    {layer.style.polaroidData.caption}
                                </div>
                            )}
                        </div>
                    )}

                    {layer.type === 'video' && (
                        <div className="w-full h-full relative pointer-events-none">
                            <video 
                                src={layer.url} 
                                autoPlay 
                                loop 
                                muted 
                                playsInline 
                                className="w-full h-full object-cover pointer-events-none" 
                                style={{
                                    filter: `brightness(${layer.style?.brightness ?? 1}) contrast(${layer.style?.contrast ?? 1}) saturate(${layer.style?.saturate ?? 1}) blur(${layer.style?.blur ?? 0}px) grayscale(${layer.style?.grayscale ?? 0})`
                                }}
                            />
                        </div>
                    )}

                            {layer.type === 'custom_code' && (
                                <div 
                                    className="w-full h-full relative"
                                    style={{ pointerEvents: layer.isLocked ? 'none' : 'auto' }}
                                >
                                    {layer.content && (
                                        <div className="w-full h-full" dangerouslySetInnerHTML={{ __html: layer.content }} />
                                    )}
                                </div>
                            )}

                            {layer.type === 'custom_path' && (
                                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" className="pointer-events-none" style={{ overflow: 'visible' }}>
                                    <path 
                                        id={layer.id + '_path'}
                                        d="M 10 90 Q 30 10 70 50 T 90 10" 
                                        fill="transparent" 
                                        stroke={isActive ? "#ec4899" : "rgba(99,102,241,0.2)"} 
                                        strokeWidth="2" 
                                        strokeDasharray="4 4" 
                                    />
                                </svg>
                            )}
                            {layer.type === 'interactive_countdown' && (
                                <CountdownDisplay 
                                    targetDate={layer.style?.countdownTarget}
                                    textColor={layer.style?.countdownColor}
                                    bgColor={layer.style?.countdownBgColor}
                                    bgImage={layer.style?.countdownBgImage}
                                    fontFamily={layer.style?.fontFamily}
                                    bgOpacity={layer.style?.countdownBgOpacity}
                                    gap={layer.style?.countdownGap}
                                    showSeconds={layer.style?.countdownShowSeconds}
                                    bgStyle={layer.style?.countdownBgStyle}
                                />
                            )}

                            {layer.type === 'photo_album' && (
                                <div className="w-full h-full pointer-events-none relative flex items-center justify-center overflow-hidden">
                                    {isActive && (
                                        <button 
                                            onClick={() => {
                                                useUIStore.getState().setAssetSelectionTarget({
                                                    layerId: layer.id,
                                                    layerType: 'photo_album',
                                                    multiple: true
                                                });
                                            }}
                                            className="absolute top-2 right-2 bg-primary-600 text-white p-2 rounded-full shadow-lg z-50 pointer-events-auto hover:bg-primary-700 transition"
                                            title="Isi Wadah Album"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path></svg>
                                        </button>
                                    )}
                                    {(!layer.style?.albumData?.images || layer.style.albumData.images.length === 0) ? (
                                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 rounded-xl border-2 border-dashed border-gray-300 overflow-hidden" style={{ borderRadius: layer.style?.albumData?.shape === 'circle' ? '50%' : layer.style?.albumData?.shape === 'rounded' ? '1rem' : layer.style?.albumData?.shape === 'pill' ? '9999px' : layer.style?.albumData?.shape === 'arch' ? '10rem 10rem 0 0' : '0' }}>
                                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                            <span className="text-[10px] font-bold text-gray-400">Wadah Album Kosong</span>
                                        </div>
                                    ) : (
                                        <Swiper
                                            key={`${layer.style?.albumData?.animationStyle || 'slide'}-${layer.style?.albumData?.direction || 'horizontal'}-${layer.style?.albumData?.speed || 500}-${layer.style?.albumData?.autoplayDelay || 2500}`}
                                            modules={[Autoplay, EffectCards, EffectCoverflow, EffectFade]}
                                            effect={layer.style?.albumData?.animationStyle || 'slide'}
                                            direction={layer.style?.albumData?.direction || 'horizontal'}
                                            speed={layer.style?.albumData?.speed || 500}
                                            observer={true}
                                            observeParents={true}
                                            grabCursor={false}
                                            centeredSlides={true}
                                            slidesPerView={1}
                                            loop={layer.style?.albumData?.animationStyle === 'cards' ? false : (layer.style?.albumData?.images?.length || 0) > 2}
                                            autoplay={{ delay: layer.style?.albumData?.autoplayDelay || 2500, disableOnInteraction: false }}
                                            coverflowEffect={layer.style?.albumData?.animationStyle === 'coverflow' ? {
                                                rotate: 50, stretch: 0, depth: 100, modifier: 1, slideShadows: false,
                                            } : undefined}
                                            fadeEffect={layer.style?.albumData?.animationStyle === 'fade' ? { crossFade: true } : undefined}
                                            cardsEffect={layer.style?.albumData?.animationStyle === 'cards' ? { slideShadows: false } : undefined}
                                            style={{ width: '100%', height: '100%' }}
                                        >
                                              {(layer.style?.albumData?.images || []).map((img, idx) => {
                                                  const polaroidTheme = layer.style?.albumData?.polaroidTheme;
                                                  const isPolaroid = polaroidTheme && polaroidTheme !== 'none';

                                                  return (
                                                      <SwiperSlide key={idx} style={{ width: '100%', height: '100%' }}>
                                                          {isPolaroid ? (
                                                              <div className={`polaroid-wrapper polaroid-${polaroidTheme}`}>
                                                                  <div className="polaroid-image-container" style={{ 
                                                                      borderRadius: layer.style?.albumData?.shape === 'circle' ? '50%' : layer.style?.albumData?.shape === 'rounded' ? '1rem' : layer.style?.albumData?.shape === 'pill' ? '9999px' : layer.style?.albumData?.shape === 'arch' ? '10rem 10rem 0 0' : '0' 
                                                                  }}>
                                                                      <img 
                                                                          src={img.url} 
                                                                          alt={img.caption || `Slide ${idx+1}`} 
                                                                          style={{ 
                                                                              width: '100%', height: '100%', objectFit: 'cover',
                                                                              filter: `${img.filterId && img.filterId !== 'none' ? getFilterById(img.filterId).getCss(img.filterIntensity ?? 100) + ' ' : ''}brightness(${img.brightness ?? 1}) contrast(${img.contrast ?? 1}) saturate(${img.saturate ?? 1}) blur(${img.blur ?? 0}px)`.trim()
                                                                          }} 
                                                                      />
                                                                  </div>
                                                                  {img.caption && (
                                                                      <div className="polaroid-caption">{img.caption}</div>
                                                                  )}
                                                              </div>
                                                          ) : (
                                                              <div style={{ 
                                                                  position: 'relative', width: '100%', height: '100%', overflow: 'hidden',
                                                                  borderRadius: layer.style?.albumData?.shape === 'circle' ? '50%' : layer.style?.albumData?.shape === 'rounded' ? '1rem' : layer.style?.albumData?.shape === 'pill' ? '9999px' : layer.style?.albumData?.shape === 'arch' ? '10rem 10rem 0 0' : '0'
                                                              }}>
                                                                  <img 
                                                                      src={img.url} 
                                                                      alt={img.caption || `Slide ${idx+1}`} 
                                                                      style={{ 
                                                                          width: '100%', height: '100%', objectFit: 'cover',
                                                                          filter: getFilterById(img.filterId) || 'none'
                                                                      }} 
                                                                  />
                                                              </div>
                                                          )}
                                                      </SwiperSlide>
                                                  );
                                              })}
                                        </Swiper>
                                    )}
                                </div>
                            )}

                            {layer.type === 'interactive_rsvp' && (() => {
                                const theme = layer.style?.rsvpTheme || 'solid';
                                let containerStyle = {
                                    backgroundColor: layer.style?.backgroundColor || '#ffffff',
                                    backgroundImage: layer.style?.backgroundImageUrl ? `url(${layer.style.backgroundImageUrl})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: layer.style?.borderRadius || '0.75rem',
                                    borderWidth: layer.style?.borderWidth,
                                    borderColor: layer.style?.borderColor,
                                    borderStyle: layer.style?.borderWidth ? 'solid' : 'none',
                                    color: layer.style?.textColor || '#1f2937',
                                };
                                const hexToRgba = (hex, alpha) => {
                                    if (!hex || !hex.startsWith('#')) return hex;
                                    const r = parseInt(hex.slice(1, 3), 16) || 0;
                                    const g = parseInt(hex.slice(3, 5), 16) || 0;
                                    const b = parseInt(hex.slice(5, 7), 16) || 0;
                                    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                                };

                                const defaultInputBg = layer.style?.inputBackgroundColor || '#f3f4f6';
                                const opacity = layer.style?.inputBackgroundOpacity ?? 1;
                                const finalInputBg = hexToRgba(defaultInputBg, opacity);

                                let inputStyle = { backgroundColor: finalInputBg, color: layer.style?.textColor || '#9ca3af', border: 'none', borderRadius: '0.5rem' };
                                let buttonStyle = { backgroundColor: layer.style?.buttonColor || '#db2777', color: layer.style?.buttonTextColor || '#ffffff', borderRadius: '0.5rem' };
                                let wrapperClass = "w-full h-full flex flex-col items-center justify-center pointer-events-none p-4 space-y-3 relative";

                                if (theme === 'glass') {
                                    containerStyle.backgroundColor = layer.style?.backgroundColor ? layer.style.backgroundColor : 'rgba(255, 255, 255, 0.2)';
                                    containerStyle.backdropFilter = 'blur(10px)';
                                    containerStyle.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                                    inputStyle.backgroundColor = layer.style?.inputBackgroundColor ? finalInputBg : 'rgba(255, 255, 255, 0.5)';
                                    inputStyle.backdropFilter = 'blur(4px)';
                                } else if (theme === 'classic') {
                                    containerStyle.borderStyle = 'double';
                                    containerStyle.borderWidth = layer.style?.borderWidth || '6px';
                                    containerStyle.borderColor = layer.style?.borderColor || '#d97706';
                                    containerStyle.borderRadius = '0';
                                    inputStyle.border = '1px solid ' + (layer.style?.borderColor || '#d97706');
                                    inputStyle.backgroundColor = layer.style?.inputBackgroundColor ? finalInputBg : 'transparent';
                                    buttonStyle.borderRadius = '0';
                                } else if (theme === 'romance') {
                                    containerStyle.borderRadius = '2rem';
                                    containerStyle.boxShadow = '0 10px 25px -5px rgba(225,29,72,0.1), 0 8px 10px -6px rgba(225,29,72,0.1)';
                                    inputStyle.borderRadius = '1rem';
                                    buttonStyle.borderRadius = '1rem';
                                } else if (theme === 'adat') {
                                    containerStyle.borderRadius = '3rem 3rem 0 0';
                                    containerStyle.borderTop = `8px solid ${layer.style?.borderColor || '#8b5a2b'}`;
                                    containerStyle.borderBottom = `8px solid ${layer.style?.borderColor || '#8b5a2b'}`;
                                    inputStyle.borderBottom = '2px solid ' + (layer.style?.borderColor || '#8b5a2b');
                                    inputStyle.borderRadius = '0';
                                    inputStyle.backgroundColor = layer.style?.inputBackgroundColor ? finalInputBg : 'transparent';
                                } else if (theme === 'minimalist') {
                                    containerStyle.borderStyle = 'dashed';
                                    containerStyle.borderWidth = '1px';
                                    containerStyle.borderColor = layer.style?.borderColor || '#9ca3af';
                                    inputStyle.borderBottom = '1px solid #d1d5db';
                                    inputStyle.borderRadius = '0';
                                    inputStyle.backgroundColor = layer.style?.inputBackgroundColor ? finalInputBg : 'transparent';
                                } else if (theme === 'rustic') {
                                    containerStyle.borderStyle = 'solid';
                                    containerStyle.borderWidth = '4px';
                                    containerStyle.borderColor = layer.style?.borderColor || '#78716c';
                                    containerStyle.outline = '2px dashed ' + (layer.style?.borderColor || '#78716c');
                                    containerStyle.outlineOffset = '-8px';
                                }

                                return (
                                    <div className={wrapperClass} style={containerStyle}>
                                        <h3 className="font-serif text-center z-10" style={{ fontSize: layer.style?.fontSize || '1.25rem', color: layer.style?.textColor || '#1f2937', marginBottom: '4px' }}>Kehadiran Anda</h3>
                                        <div className="w-full flex-1 flex flex-col gap-2 z-10">
                                            <div className="h-10 w-full flex items-center px-3 text-sm shrink-0" style={inputStyle}>Nama Lengkap...</div>
                                            <div className="h-10 w-full flex items-center px-3 text-sm shrink-0" style={inputStyle}>Pilih Kehadiran...</div>
                                            <div className="flex-1 w-full flex items-start p-3 text-sm min-h-[3rem]" style={inputStyle}>Pesan/Doa...</div>
                                            <div className="h-10 w-full flex items-center justify-center font-bold mt-1 shrink-0" style={buttonStyle}>Kirim RSVP</div>
                                        </div>
                                    </div>
                                );
                            })()}

                            {layer.type === 'interactive_map' && (() => {
                                const mapOpacity = layer.style?.mapOpacity ?? 1;
                                const isButtonOnly = layer.style?.mapDisplayType === 'button_only';
                                const buttonText = layer.style?.mapButtonText || 'Buka Google Maps';
                                const buttonColor = layer.style?.mapButtonColor || '#ef4444'; // default red
                                const buttonTextColor = layer.style?.mapButtonTextColor || '#ffffff';

                                return (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-xl border border-gray-300 pointer-events-none relative overflow-hidden" style={{ opacity: mapOpacity, background: isButtonOnly ? 'transparent' : undefined, borderColor: isButtonOnly ? 'transparent' : undefined }}>
                                        {!isButtonOnly && (
                                            layer.content && layer.content.includes('<iframe') ? (
                                                <div className="w-full h-full pointer-events-none [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0" dangerouslySetInnerHTML={{ __html: layer.content }}></div>
                                            ) : (
                                                <div className="absolute inset-0 w-full h-full" style={{ backgroundImage: 'url(/map_placeholder.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                                            )
                                        )}
                                        
                                        {(!layer.content?.includes('<iframe') || isButtonOnly) && (
                                            <div 
                                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur px-5 py-2.5 rounded-full shadow-md flex items-center gap-2.5 text-sm font-bold z-10 pointer-events-none"
                                                style={{ backgroundColor: isButtonOnly ? buttonColor : 'rgba(255, 255, 255, 0.95)', color: isButtonOnly ? buttonTextColor : '#1f2937' }}
                                            >
                                                <svg className="w-5 h-5" style={{ color: isButtonOnly ? buttonTextColor : '#ef4444' }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                                {buttonText}
                                            </div>
                                        )}
                                    </div>
                                );
                            })()}

                            {layer.type === 'interactive_copy' && (() => {
                                const bgOpacity = layer.style?.bgOpacity ?? 1;
                                const textOpacity = layer.style?.textOpacity ?? 1;

                                const hexToRgba = (hex, opacity = 1) => {
                                    hex = (hex || '#ffffff').replace('#', '');
                                    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
                                    const r = parseInt(hex.substring(0, 2), 16) || 0;
                                    const g = parseInt(hex.substring(2, 4), 16) || 0;
                                    const b = parseInt(hex.substring(4, 6), 16) || 0;
                                    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
                                };

                                const bgColor = layer.style?.backgroundColor || '#ffffff';
                                const textColor = layer.style?.textColor || '#1f2937';

                                if (layer.style?.useCardTheme) {
                                    return (
                                        <div 
                                            className="w-full h-full flex flex-col justify-between shadow-md relative overflow-hidden pointer-events-none p-4"
                                            style={{
                                                background: layer.style.paymentType === 'ewallet' 
                                                    ? `linear-gradient(135deg, ${hexToRgba(bgColor, bgOpacity)}, ${hexToRgba(bgColor, bgOpacity - 0.15)})` 
                                                    : `linear-gradient(135deg, ${hexToRgba(bgColor, bgOpacity)}, ${hexToRgba(bgColor, Math.max(0, bgOpacity - 0.4))})`,
                                                borderRadius: layer.style?.borderRadius || '1rem',
                                                borderWidth: layer.style?.borderWidth || '1px',
                                                borderColor: layer.style?.borderColor || '#e5e7eb',
                                                borderStyle: layer.style?.borderWidth ? 'solid' : (layer.style?.borderColor ? 'solid' : 'none'),
                                                boxShadow: layer.style?.isShadowActive ? `0px ${layer.style?.shadowY || 6}px 12px -2px rgba(0, 0, 0, 0.15)` : 'none',
                                            }}
                                        >
                                            {/* Decorative Background Pattern */}
                                            <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-white/20 rounded-full blur-2xl pointer-events-none"></div>
                                            <div className="absolute -left-8 -top-8 w-24 h-24 bg-white/20 rounded-full blur-xl pointer-events-none"></div>
                                            <div className="absolute right-10 top-10 w-40 h-40 bg-black/5 rounded-full blur-3xl pointer-events-none mix-blend-overlay"></div>
                                            
                                            {/* Top Row: Chip & Logo */}
                                            <div className="flex justify-between items-start w-full relative z-10">
                                                <div className="flex-1">
                                                    {layer.style?.paymentType !== 'ewallet' && (
                                                        <ChipIcon className="w-10 h-8 opacity-90 drop-shadow-sm" />
                                                    )}
                                                </div>
                                                <div className="shrink-0 h-8 flex items-center justify-end">
                                                    <PaymentLogo provider={layer.style?.providerId || layer.style?.bankName} className="h-full drop-shadow-sm max-w-[100px]" />
                                                </div>
                                            </div>

                                            {/* Bottom Row: Number, Name, Copy Button */}
                                            <div className="flex justify-between items-end w-full relative z-10 mt-2">
                                                <div className="flex flex-col min-w-0 pr-2">
                                                    <span 
                                                        className="font-mono font-bold tracking-widest truncate w-full drop-shadow-sm"
                                                        style={{ 
                                                            color: hexToRgba(textColor, textOpacity),
                                                            fontSize: layer.style?.fontSize ? `${layer.style.fontSize}px` : '18px'
                                                        }}
                                                    >
                                                        {layer.content || '0000 0000 0000'}
                                                    </span>
                                                    <span 
                                                        className="font-bold uppercase tracking-widest mt-1.5 truncate w-full opacity-90 drop-shadow-sm"
                                                        style={{ 
                                                            color: hexToRgba(textColor, textOpacity),
                                                            fontFamily: 'monospace',
                                                            fontSize: layer.style?.fontSize ? `${Math.max(10, Math.round(layer.style.fontSize * 0.55))}px` : '10px'
                                                        }}
                                                    >
                                                        {layer.style?.accountName || 'ATAS NAMA'}
                                                    </span>
                                                </div>
                                                <div 
                                                    className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm border border-white/20 backdrop-blur-sm"
                                                    style={{ 
                                                        backgroundColor: layer.style?.iconBgColor || 'rgba(255,255,255,0.2)',
                                                        color: layer.style?.iconColor || textColor
                                                    }}
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                }

                                return (
                                    <div 
                                        className="w-full h-full flex items-center justify-between shadow-sm pointer-events-none px-4"
                                        style={{
                                            backgroundColor: hexToRgba(bgColor, bgOpacity),
                                            borderRadius: layer.style?.borderRadius || '0.75rem',
                                            borderWidth: layer.style?.borderWidth || '1px',
                                            borderColor: layer.style?.borderColor || '#e5e7eb',
                                            borderStyle: layer.style?.borderWidth ? 'solid' : (layer.style?.borderColor ? 'solid' : 'none'),
                                            boxShadow: layer.style?.isShadowActive ? `0px ${layer.style?.shadowY || 4}px 6px -1px rgba(0, 0, 0, 0.1)` : 'none',
                                        }}
                                    >
                                        <div className="flex flex-col flex-1 min-w-0 pr-2">
                                            {layer.style?.bankName && (
                                                <span 
                                                    className="font-bold uppercase tracking-wider mb-0.5 truncate w-full"
                                                    style={{ 
                                                        color: hexToRgba(textColor, Math.max(0.2, textOpacity - 0.3)),
                                                        fontFamily: layer.style?.fontFamily || 'monospace',
                                                        fontSize: layer.style?.fontSize ? `${Math.max(8, Math.round(layer.style.fontSize * 0.65))}px` : '10px'
                                                    }}
                                                >
                                                    {layer.style.bankName}
                                                </span>
                                            )}
                                            <span 
                                                className="font-mono font-bold truncate w-full"
                                                style={{ 
                                                    color: hexToRgba(textColor, textOpacity),
                                                    fontFamily: layer.style?.fontFamily || 'monospace',
                                                    fontSize: layer.style?.fontSize ? `${layer.style.fontSize}px` : '16px'
                                                }}
                                            >
                                                {layer.content || ''}
                                            </span>
                                        </div>
                                        <div 
                                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ml-2"
                                            style={{ 
                                                backgroundColor: layer.style?.iconBgColor || '#e0e7ff',
                                                color: layer.style?.iconColor || '#db2777'
                                            }}
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                                        </div>
                                    </div>
                                );
                            })()}

                            {layer.type === 'interactive_calendar' && (() => {
                                const bgOpacity = layer.style?.opacity ?? 1;
                                
                                const hexToRgba = (hex, opacity = 1) => {
                                    hex = (hex || '#ffffff').replace('#', '');
                                    if (hex.length === 3) hex = hex.split('').map(x => x + x).join('');
                                    const r = parseInt(hex.substring(0, 2), 16) || 0;
                                    const g = parseInt(hex.substring(2, 4), 16) || 0;
                                    const b = parseInt(hex.substring(4, 6), 16) || 0;
                                    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
                                };

                                const bgColor = layer.style?.backgroundColor || '#db2777';
                                const textColor = layer.style?.textColor || '#ffffff';

                                return (
                                    <div 
                                        className="w-full h-full flex items-center justify-center gap-2 shadow-sm pointer-events-none px-4"
                                        style={{
                                            backgroundColor: hexToRgba(bgColor, bgOpacity),
                                            color: textColor,
                                            borderRadius: layer.style?.borderRadius || 8,
                                            borderWidth: layer.style?.borderWidth || 0,
                                            borderColor: layer.style?.borderColor || 'transparent',
                                            borderStyle: layer.style?.borderWidth ? 'solid' : 'none',
                                        }}
                                    >
                                        {layer.style?.showIcon !== false && (
                                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        )}
                                        <span className="font-semibold text-sm">
                                            {layer.content || 'Simpan Tanggal'}
                                        </span>
                                    </div>
                                );
                            })()}

                            {layer.type === 'interactive_comments' && (() => {
                                const theme = layer.style?.rsvpTheme || 'solid';
                                let containerStyle = {
                                    width: '100%', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden',
                                    backgroundColor: layer.style?.backgroundColor || '#f8fafc',
                                    backgroundImage: layer.style?.backgroundImageUrl ? `url(${layer.style.backgroundImageUrl})` : 'none',
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    borderRadius: layer.style?.borderRadius || '1rem',
                                    borderWidth: layer.style?.borderWidth || 0,
                                    borderColor: layer.style?.borderColor || '#e2e8f0',
                                    borderStyle: layer.style?.borderWidth ? 'solid' : 'none',
                                    padding: layer.style?.padding || '1rem', boxSizing: 'border-box'
                                };
                                const hexToRgba = (hex, alpha) => {
                                    if (!hex || !hex.startsWith('#')) return hex;
                                    const r = parseInt(hex.slice(1, 3), 16) || 0;
                                    const g = parseInt(hex.slice(3, 5), 16) || 0;
                                    const b = parseInt(hex.slice(5, 7), 16) || 0;
                                    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                                };

                                if (theme === 'glass') {
                                    containerStyle.backgroundColor = layer.style?.backgroundColor ? layer.style.backgroundColor : 'rgba(255, 255, 255, 0.2)';
                                    containerStyle.backdropFilter = 'blur(10px)';
                                    containerStyle.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
                                } else if (theme === 'classic') {
                                    containerStyle.borderStyle = 'double';
                                    containerStyle.borderWidth = layer.style?.borderWidth || '6px';
                                    containerStyle.borderColor = layer.style?.borderColor || '#d97706';
                                    containerStyle.borderRadius = '0';
                                } else if (theme === 'romance') {
                                    containerStyle.borderRadius = '2rem';
                                    containerStyle.boxShadow = '0 10px 25px -5px rgba(225,29,72,0.1), 0 8px 10px -6px rgba(225,29,72,0.1)';
                                } else if (theme === 'adat') {
                                    containerStyle.borderRadius = '3rem 3rem 0 0';
                                    containerStyle.borderTop = `8px solid ${layer.style?.borderColor || '#8b5a2b'}`;
                                    containerStyle.borderBottom = `8px solid ${layer.style?.borderColor || '#8b5a2b'}`;
                                } else if (theme === 'minimalist') {
                                    containerStyle.borderStyle = 'dashed';
                                    containerStyle.borderWidth = '1px';
                                    containerStyle.borderColor = layer.style?.borderColor || '#9ca3af';
                                } else if (theme === 'rustic') {
                                    containerStyle.borderStyle = 'solid';
                                    containerStyle.borderWidth = '4px';
                                    containerStyle.borderColor = layer.style?.borderColor || '#78716c';
                                    containerStyle.outline = '2px dashed ' + (layer.style?.borderColor || '#78716c');
                                    containerStyle.outlineOffset = '-8px';
                                }

                                return (
                                    <div 
                                        className="pointer-events-none"
                                        style={containerStyle}
                                    >
                                        <h3 className="text-sm font-bold mb-3 border-b border-gray-200 pb-2 z-10" style={{ color: layer.style?.textColor || '#333333', borderColor: layer.style?.textColor ? hexToRgba(layer.style.textColor, 0.2) : '#e2e8f0' }}>
                                            Ucapan & Doa
                                        </h3>
                                        <div className="flex-1 overflow-hidden opacity-50 flex flex-col items-center justify-center z-10">
                                            <span className="text-[10px] text-center" style={{ color: layer.style?.textColor || '#9ca3af' }}>(Daftar komentar akan muncul di sini saat tamu mengisi form RSVP)</span>
                                        </div>
                                    </div>
                                );
                            })()}

                            {layer.type === 'canvas_group' && (
                                <div className="w-full h-full relative" style={{ pointerEvents: 'none' }}>
                                    {layer.children?.map(child => (
                                        <div key={child.id} style={{ 
                                            position: 'absolute', 
                                            left: `${child.style?.x || 0}px`, 
                                            top: `${child.style?.y || 0}px`,
                                            width: typeof child.style?.width === 'number' ? `${child.style.width}px` : child.style?.width,
                                            height: typeof child.style?.height === 'number' ? `${child.style.height}px` : child.style?.height,
                                            pointerEvents: 'auto'
                                        }}>
                                            <LayerElement layer={child} isChildOfGroup={true} sectionId={sectionId} isActiveParent={isActive} />
                                        </div>
                                    ))}
                                </div>
                            )}

                        </div> {/* End Content Wrapper */}

                        {/* Border Overlay (Independent of background opacity) */}
                        {layer.style?.borderWidth > 0 && !(layer.type === 'shape' && ShapePaths[layer.content]) && (
                            <div 
                                className="absolute inset-0 pointer-events-none z-20"
                                style={{
                                    borderRadius: computedBorderRadius,
                                    borderWidth: `${layer.style.borderWidth}px`,
                                    borderStyle: layer.style.borderStyle || 'solid',
                                    borderColor: hexToRgba(layer.style.borderColor || '#000000', (layer.style.borderOpacity ?? 1) * 100),
                                    boxSizing: 'border-box'
                                }}
                            ></div>
                        )}

                    </div> {/* End GSAP Animation Wrapper */}
                </div> {/* End Visibility Wrapper */}
        </div>
    );

    const snapTargetsRef = useRef([]);
    const pathRecordingRef = useRef([]);

    if (isChildOfGroup) {
        return innerStructure;
    }

    return (
        <Rnd
            key={`rnd-${layer.id}`}
            ref={rndRef}
            size={{ width: localSize.width, height: localSize.height }}
            position={{ x: localPos.x, y: localPos.y }}
            enableResizing={!isDrawingPath}
            onDrag={(e, d) => {
                let newX = d.x;
                let newY = d.y;
                let activeLines = [];
                const SNAP_THRESHOLD = 5;

                const store = useCanvasStore.getState();
                const isDesktop = sectionId === 'desktop';
                const section = isDesktop ? { layout: { height: 720 } } : store.sections.find(s => s.id === sectionId);
                const sectionWidth = isDesktop ? 1280 : 375;
                const sectionHeight = parseInt(section?.layout?.height || 844);

                let elWidth = typeof localSize.width === 'string' ? parseFloat(localSize.width) : localSize.width;
                let elHeight = typeof localSize.height === 'string' ? parseFloat(localSize.height) : localSize.height;
                
                // Fallback if width/height is 'auto' or NaN
                if (isNaN(elWidth) || isNaN(elHeight)) {
                    if (d.node) {
                        if (isNaN(elWidth)) elWidth = d.node.offsetWidth;
                        if (isNaN(elHeight)) elHeight = d.node.offsetHeight;
                    }
                }

                const elCenterX = newX + elWidth / 2;
                const elCenterY = newY + elHeight / 2;

                if (!e.shiftKey && !isDrawingPath) {
                    let snappedX = false;
                    let snappedY = false;

                    // 1. CANVAS CENTER
                    const centerX = sectionWidth / 2;
                    if (Math.abs(elCenterX - centerX) < SNAP_THRESHOLD) { 
                        newX = centerX - elWidth / 2; 
                        activeLines.push({ axis: 'x', position: centerX, type: 'center' }); 
                        snappedX = true;
                    }
                    const centerY = sectionHeight / 2;
                    if (Math.abs(elCenterY - centerY) < SNAP_THRESHOLD) { 
                        newY = centerY - elHeight / 2; 
                        activeLines.push({ axis: 'y', position: centerY, type: 'center' }); 
                        snappedY = true;
                    }

                    // 2. OTHER LAYERS
                    if (!snappedX || !snappedY) {
                        for (const { ox, oy, ow, oh } of snapTargetsRef.current) {
                            if (!snappedX) {
                                if (Math.abs(newX - ox) < SNAP_THRESHOLD) { 
                                    newX = ox; activeLines.push({ axis: 'x', position: ox }); snappedX = true; 
                                } else if (Math.abs((newX + elWidth) - (ox + ow)) < SNAP_THRESHOLD) { 
                                    newX = (ox + ow) - elWidth; activeLines.push({ axis: 'x', position: ox + ow }); snappedX = true; 
                                }
                            }
                            if (!snappedY) {
                                if (Math.abs(newY - oy) < SNAP_THRESHOLD) { 
                                    newY = oy; activeLines.push({ axis: 'y', position: oy }); snappedY = true; 
                                } else if (Math.abs((newY + elHeight) - (oy + oh)) < SNAP_THRESHOLD) { 
                                    newY = (oy + oh) - elHeight; activeLines.push({ axis: 'y', position: oy + oh }); snappedY = true; 
                                }
                            }
                            if (snappedX && snappedY) break;
                        }
                    }

                    // 3. CANVAS EDGES
                    if (!snappedY) {
                        if (Math.abs(newY) < SNAP_THRESHOLD) { newY = 0; activeLines.push({ axis: 'y', position: 0, type: 'edge' }); snappedY = true; }
                        else if (Math.abs((newY + elHeight) - sectionHeight) < SNAP_THRESHOLD) { newY = sectionHeight - elHeight; activeLines.push({ axis: 'y', position: sectionHeight, type: 'edge' }); snappedY = true; }
                    }
                    if (!snappedX) {
                        if (Math.abs(newX) < SNAP_THRESHOLD) { newX = 0; activeLines.push({ axis: 'x', position: 0, type: 'edge' }); snappedX = true; }
                        else if (Math.abs((newX + elWidth) - sectionWidth) < SNAP_THRESHOLD) { newX = sectionWidth - elWidth; activeLines.push({ axis: 'x', position: sectionWidth, type: 'edge' }); snappedX = true; }
                    }

                    // 4. GRID LINES (Long sections)
                    const isGridSnapEnabled = useUIStore.getState().showGridLines ?? true;
                    if (!snappedY && isGridSnapEnabled && sectionId !== 'desktop') {
                        let maxY = 0;
                        const checkLayer = (layer) => {
                            const bottom = (parseFloat(layer.style?.y) || 0) + (parseFloat(layer.style?.height) || 0);
                            if (bottom > maxY) maxY = bottom;
                            if (layer.children) layer.children.forEach(checkLayer);
                        };
                        section?.layers?.forEach(checkLayer);
                        
                        let sectionH = 844;
                        if (section?.layout?.minHeight && section.layout.minHeight !== '844px' && section.layout.minHeight !== '100vh') {
                            sectionH = parseFloat(section.layout.minHeight);
                        } else if (maxY > 0) {
                            sectionH = maxY;
                        }

                        if (sectionH > 844) {
                            for (let i = 844; i < sectionH; i += 844) {
                                if (!snappedY) {
                                    if (Math.abs(newY - i) < SNAP_THRESHOLD) { newY = i; activeLines.push({ axis: 'y', position: i, type: 'edge' }); snappedY = true; }
                                    else if (Math.abs((newY + elHeight) - i) < SNAP_THRESHOLD) { newY = i - elHeight; activeLines.push({ axis: 'y', position: i, type: 'edge' }); snappedY = true; }
                                    else if (Math.abs(elCenterY - i) < SNAP_THRESHOLD) { newY = i - elHeight / 2; activeLines.push({ axis: 'y', position: i, type: 'center' }); snappedY = true; }
                                }
                            }
                        }
                    }
                }

                setLocalPos({ x: newX, y: newY });
                localPosRef.current = { x: newX, y: newY };
                
                if (isDrawingPath) {
                    const last = pathRecordingRef.current[pathRecordingRef.current.length - 1];
                    // Rekam pusat elemen. Sensitivitas jarak > 10 untuk kurva lebih mulus dan mencegah lag
                    if (!last || Math.hypot(elCenterX - last.x, elCenterY - last.y) > 10) {
                        pathRecordingRef.current.push({ x: elCenterX, y: elCenterY });
                        // Update UI Store periodically
                        if (pathRecordingRef.current.length % 2 === 0 || !last) {
                            useUIStore.getState().setCurrentPathPoints([...pathRecordingRef.current]);
                        }
                    }
                } else {
                    useUIStore.getState().setSnapLines(activeLines);
                }
            }}
            onDragStart={() => {
                setIsDragging(true);
                if (sectionId !== 'desktop') {
                    useCanvasStore.getState().setActiveSection(sectionId);
                }

                if (useUIStore.getState().isDrawingPath) {
                    pathRecordingRef.current = [];
                    const elWidth = typeof localSize.width === 'string' ? parseFloat(localSize.width) : localSize.width;
                    const elHeight = typeof localSize.height === 'string' ? parseFloat(localSize.height) : localSize.height;
                    const startPoint = {
                        x: localPos.x + elWidth / 2,
                        y: localPos.y + elHeight / 2
                    };
                    pathRecordingRef.current.push(startPoint);
                    useUIStore.getState().setCurrentPathPoints([startPoint]);
                }
                
                // Precalculate snap targets for better performance
                const store = useCanvasStore.getState();
                const isDesktop = sectionId === 'desktop';
                
                let otherLayers = [];
                if (isDesktop) {
                    otherLayers = (store.global_settings?.desktop_layers || []).filter(l => l.id !== layer.id);
                } else {
                    otherLayers = store.sections.reduce((acc, s) => {
                        if (s.id !== sectionId) return acc;
                        let layers = [];
                        s.layers.forEach(l => {
                            if (l.id !== layer.id) layers.push(l);
                            if (l.children) l.children.forEach(c => { if (c.id !== layer.id) layers.push(c); });
                        });
                        return acc.concat(layers);
                    }, []);
                }
                
                snapTargetsRef.current = otherLayers.map(other => ({
                    ox: parseFloat(other.style?.x || 0),
                    oy: parseFloat(other.style?.y || 0),
                    ow: parseFloat(other.style?.width || 100),
                    oh: parseFloat(other.style?.height || 100)
                }));
            }}
            onDragStop={(e, d) => {
                setIsDragging(false);
                useUIStore.getState().setSnapLines([]);
                
                let wasDrawing = false;
                if (useUIStore.getState().isDrawingPath) {
                    wasDrawing = true;
                    useUIStore.getState().setIsDrawingPath(false);
                    // Pastikan titik terakhir dirender
                    useUIStore.getState().setCurrentPathPoints([...pathRecordingRef.current]);
                    
                    const points = pathRecordingRef.current;
                    if (points.length > 2) {
                        const svgPath = pointsToSmoothedSvgPath(points);
                        useCanvasStore.getState().updateLayerAnimation(layer.id, {
                            idle: 'custom_path',
                            custom_path_data: {
                                svgPath: svgPath,
                                ease: 'power1.inOut',
                                duration: 5,
                                autoRotate: false
                            },
                            config: {
                                ...(layer.animation?.config || {}),
                                previewKey: Date.now()
                            }
                        });
                    }
                    
                    // Bersihkan SVG garis putus-putus setelah 500ms agar user bisa melihat hasil akhir sebentar
                    setTimeout(() => {
                        useUIStore.getState().setCurrentPathPoints([]);
                    }, 500);
                    
                    pathRecordingRef.current = [];
                }

                if (!wasDrawing) {
                    const finalPos = localPosRef.current;
                    if (finalPos.x !== layer.style?.x || finalPos.y !== layer.style?.y) {
                        useCanvasStore.getState().updateLayerStyle(layer.id, { x: finalPos.x, y: finalPos.y });
                    }
                } else {
                    // Kembalikan elemen ke posisi semula (titik A) agar animasi mulai dari titik awal
                    const originalX = parseFloat(layer.style?.x || 0);
                    const originalY = parseFloat(layer.style?.y || 0);
                    setLocalPos({ x: originalX, y: originalY });
                    localPosRef.current = { x: originalX, y: originalY };
                }
            }}
            onResize={(e, direction, ref, delta, position) => {
                setLocalSize({ width: ref.style.width, height: ref.style.height });
                setLocalPos(position);
            }}
            onResizeStop={(e, direction, ref, delta, position) => {
                const currentWidth = typeof layer.style?.width === 'number' ? `${layer.style.width}px` : layer.style?.width;
                const currentHeight = typeof layer.style?.height === 'number' ? `${layer.style.height}px` : layer.style?.height;
                
                if (position.x !== layer.style?.x || position.y !== layer.style?.y || ref.style.width !== currentWidth || ref.style.height !== currentHeight) {
                    useCanvasStore.getState().updateLayerStyle(layer.id, { 
                        x: position.x, 
                        y: position.y, 
                        width: ref.style.width, 
                        height: ref.style.height 
                    });
                }
            }}
            disableDragging={layer.isLocked || isEditing}
            enableResizing={isActive && !layer.isLocked && !isEditing}
            cancel=".no-drag"
            scale={zoom}
            style={{
                zIndex: layer.style?.zIndex || 1,
            }}
            resizeHandleComponent={(isActive && !layer.isLocked) ? {
                topLeft: <ResizeHandle />,
                topRight: <ResizeHandle />,
                bottomLeft: <ResizeHandle />,
                bottomRight: <ResizeHandle />
            } : {
                topLeft: <React.Fragment />,
                topRight: <React.Fragment />,
                bottomLeft: <React.Fragment />,
                bottomRight: <React.Fragment />
            }}
            className={`layer-wrapper ${layer.isLocked ? (isActive ? 'pointer-events-auto cursor-default' : 'pointer-events-none') : 'pointer-events-auto hover:cursor-move'} ${isActive ? 'active-layer outline outline-1 outline-primary-500 rounded' : ''}`}
            onClick={(e) => {
                if (layer.isLocked && !isActive) return;
                e.stopPropagation();
                if (sectionId !== 'desktop') {
                    useCanvasStore.getState().setActiveSection(sectionId);
                }
                useCanvasStore.getState().setActiveLayer(layer.id, e.shiftKey || e.ctrlKey || e.metaKey);
            }}
            onMouseDown={(e) => {
                e.stopPropagation(); // Cegah panzoom mengambil alih saat element di-klik
            }}
        >

            {/* Floating Quick Actions (Canva-style bubble) */}
            {isActive && !layer.isLocked && (
                <div 
                    className="absolute -top-10 right-0 flex items-center bg-white rounded shadow-md border border-gray-200 z-50 pointer-events-auto overflow-hidden"
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    {(layer.type === 'text' || layer.type === 'dynamic_guest_name') && !isEditing && (
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                                setTimeout(() => {
                                    if (elementRef.current) {
                                        const target = elementRef.current.querySelector('[contenteditable]');
                                        if (target) {
                                            target.focus();
                                            const range = document.createRange();
                                            range.selectNodeContents(target);
                                            const sel = window.getSelection();
                                            sel.removeAllRanges();
                                            sel.addRange(range);
                                        }
                                    }
                                }, 50);
                            }}
                            className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-primary-600 hover:bg-primary-50 transition-colors border-r border-gray-100"
                            title="Edit Teks"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </button>
                    )}
                    <button 
                        onClick={(e) => {
                            e.stopPropagation();
                            useCanvasStore.getState().toggleLayerLock(layer.id);
                            // Set aktif layer ke null agar selection hilang
                            useCanvasStore.getState().setActiveLayer(null);
                        }}
                        className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                        title="Kunci Elemen"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"></path></svg>
                    </button>
                </div>
            )}

            {innerStructure}
        </Rnd>
    );
};

export default LayerElement;
