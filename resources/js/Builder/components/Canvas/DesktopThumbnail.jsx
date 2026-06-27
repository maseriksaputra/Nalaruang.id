import React, { useEffect, useState } from 'react';
import useCanvasStore from '../../stores/useCanvasStore';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards, EffectCoverflow, EffectFade } from 'swiper/modules';

// Make sure styles are imported (they might already be in LayerElement, but good to include)
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-fade';

import LayerElement from './LayerElement';

const DesktopThumbnail = ({ settings }) => {
    const desktopThumbnail = settings?.desktop_thumbnail || {};

    const {
        enabled,
        media = [],
        video_loop = true,
        album_duration = 3000,
        transition_speed = 1000,
        transition_effect = 'fade',
        overlay_text = '',
        text_animation = 'fade-up',
        background_color = '#1a1a1a'
    } = desktopThumbnail;

    if (!enabled) return null;

    const desktopLayers = settings?.desktop_layers || [];

    const [scale, setScale] = useState(1);
    const [translate, setTranslate] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (desktopLayers.length === 0) return;

        const handleResize = () => {
            const screenW = window.innerWidth;
            const screenH = window.innerHeight;
            const canvasW = 1280;
            const canvasH = 720;
            
            const scaleX = screenW / canvasW;
            const scaleY = screenH / canvasH;
            const scaleToCover = Math.max(scaleX, scaleY);
            
            const scaledW = canvasW * scaleToCover;
            const scaledH = canvasH * scaleToCover;
            const translateX = (screenW - scaledW) / 2;
            const translateY = (screenH - scaledH) / 2;

            setScale(scaleToCover);
            setTranslate({ x: translateX, y: translateY });
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [desktopLayers.length]);

    // Determine the type for single media
    const getMediaInfo = (item) => {
        if (!item) return { url: '', type: 'image' };
        if (typeof item === 'object' && item.url) {
            return { url: item.url, type: item.type || 'image' };
        }
        if (typeof item === 'string') {
            return { url: item, type: 'image' };
        }
        return { url: '', type: 'image' };
    };

    const renderSingleMedia = (mediaItem) => {
        const { url, type } = getMediaInfo(mediaItem);
        
        if (!url) {
            return <div className="w-full h-full absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400">Media tidak valid</div>;
        }

        if (type === 'video') {
            return (
                <video 
                    src={url} 
                    autoPlay 
                    muted 
                    loop={video_loop} 
                    className="w-full h-full object-cover absolute inset-0"
                    playsInline
                />
            );
        }

        return (
            <img 
                src={url} 
                alt="Desktop Thumbnail" 
                className="w-full h-full object-cover absolute inset-0"
            />
        );
    };

    const renderMedia = () => {
        if (!media || media.length === 0) {
            return (
                <div className="w-full h-full flex items-center justify-center text-gray-500 opacity-50 text-sm italic">
                    Belum ada media Thumbnail
                </div>
            );
        }

        if (media.length === 1) {
            return renderSingleMedia(media[0]);
        }

        // Album Mode (Multiple Media)
        const swiperModules = [Autoplay];
        if (transition_effect === 'cards') swiperModules.push(EffectCards);
        if (transition_effect === 'coverflow') swiperModules.push(EffectCoverflow);
        if (transition_effect === 'fade') swiperModules.push(EffectFade);

        return (
            <Swiper
                modules={swiperModules}
                effect={transition_effect === 'slide' ? undefined : transition_effect}
                speed={transition_speed}
                autoplay={{
                    delay: album_duration,
                    disableOnInteraction: false,
                }}
                loop={true}
                observer={true}
                observeParents={true}
                resizeObserver={true}
                className="w-full h-full absolute inset-0"
                style={{ width: '100%', height: '100%' }}
            >
                {media.map((item, idx) => {
                    const { url, type } = getMediaInfo(item);
                    if (!url) return null;
                    return (
                        <SwiperSlide key={idx} className="w-full h-full">
                            {type === 'video' ? (
                                <video 
                                    src={url} 
                                    autoPlay 
                                    muted 
                                    loop={true} 
                                    className="w-full h-full object-cover"
                                    playsInline
                                />
                            ) : (
                                <img 
                                    src={url} 
                                    alt={`Thumbnail ${idx}`} 
                                    className="w-full h-full object-cover"
                                />
                            )}
                        </SwiperSlide>
                    );
                })}
            </Swiper>
        );
    };

    return (
        <div 
            className="w-full h-full relative overflow-hidden flex items-end justify-start"
            style={{ backgroundColor: background_color }}
        >
            {desktopLayers.length > 0 ? (
                <div className="absolute inset-0 w-full h-full z-0 overflow-hidden bg-black">
                    {/* Dynamic Desktop Editor Canvas */}
                    <div 
                        style={{ 
                            position: 'absolute', 
                            top: 0, 
                            left: 0, 
                            width: '1280px', 
                            height: '720px', 
                            transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                            transformOrigin: '0 0'
                        }}
                    >
                        {desktopLayers.map((layer) => (
                            <div key={layer.id} style={{ zIndex: layer.style?.zIndex || 1, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                                {!layer.isHidden && layer.children?.map(child => (
                                    <div key={child.id} style={{ pointerEvents: 'auto' }}>
                                        <LayerElement layer={child} sectionId="desktop" isViewer={true} />
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <>
                    <div className="absolute inset-0 z-0 w-full h-full">
                        {renderMedia()}
                    </div>
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none z-[1]"></div>

                    {overlay_text && (
                        <div className={`relative z-10 text-left text-white max-w-3xl pb-12 p-12 lg:p-24`}>
                            <h1 
                                className={`font-serif whitespace-pre-line leading-tight drop-shadow-2xl ${text_animation !== 'none' ? 'animate-' + text_animation : ''}`}
                                style={{ fontSize: '4rem', fontFamily: "'Playfair Display', serif" }}
                            >
                                {overlay_text}
                            </h1>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DesktopThumbnail;
