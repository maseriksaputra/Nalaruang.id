import React, { useEffect, useRef, useState } from 'react';
import Lottie from 'lottie-react';
import { applyAnimation, applyExitAnimation } from '../../Builder/utils/engineGSAP';
import axios from 'axios';
import gsap from 'gsap';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectCards, EffectCoverflow, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-cards';
import 'swiper/css/effect-coverflow';
import 'swiper/css/effect-fade';

import { getFilterById } from '../../Builder/utils/imageFilters';
import { loadFont } from '../../Builder/utils/fonts';

const CountdownDisplay = ({ targetDate, textColor, bgColor, bgImage, fontFamily, bgOpacity, gap, showSeconds, bgStyle }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    
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
            style={{ 
                width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', 
                backgroundColor: bgImage ? 'transparent' : getBgColorWithOpacity(bgColor || '#111827', bgOpacity), 
                borderRadius: '0.75rem', border: 'none',
                backdropFilter: (!bgStyle || bgStyle === 'glass') ? 'blur(4px)' : 'none', 
                position: 'relative', overflow: 'hidden'
            }}
        >
            {bgImage && (
                <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', backgroundImage: `url(${bgImage})`, backgroundSize: 'cover', backgroundPosition: 'center', opacity: bgOpacity !== undefined ? bgOpacity : 0.8 }} />
            )}
            <div style={{ display: 'flex', gap: `${gap !== undefined ? gap : 16}px`, textAlign: 'center', color: textColor || 'white', fontFamily: fontFamily || 'monospace', position: 'relative', zIndex: 10 }}>
                <div><span style={{ display: 'block', fontSize: '1.875rem', fontWeight: 'bold' }}>{String(timeLeft.days).padStart(2, '0')}</span><span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7 }}>Hari</span></div>
                <span style={{ fontSize: '1.875rem', fontWeight: 'bold', opacity: 0.8 }}>:</span>
                <div><span style={{ display: 'block', fontSize: '1.875rem', fontWeight: 'bold' }}>{String(timeLeft.hours).padStart(2, '0')}</span><span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7 }}>Jam</span></div>
                <span style={{ fontSize: '1.875rem', fontWeight: 'bold', opacity: 0.8 }}>:</span>
                <div><span style={{ display: 'block', fontSize: '1.875rem', fontWeight: 'bold' }}>{String(timeLeft.minutes).padStart(2, '0')}</span><span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7 }}>Mnt</span></div>
                {showSeconds && (
                    <>
                    <span style={{ fontSize: '1.875rem', fontWeight: 'bold', opacity: 0.8 }}>:</span>
                    <div><span style={{ display: 'block', fontSize: '1.875rem', fontWeight: 'bold' }}>{String(timeLeft.seconds).padStart(2, '0')}</span><span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7 }}>Dtk</span></div>
                    </>
                )}
            </div>
        </div>
    );
};

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
    const rgbaColor = hexToRgba(style.shadowColor || '#000000', (style.shadowOpacity ?? 0.5) * 100);
    
    return `drop-shadow(${x}px ${y}px ${blur}px ${rgbaColor})`;
};

const PublicLayer = ({ layer }) => {
    if (layer.isHidden) return null;
    const elementRef = useRef(null);
    const [rsvpForm, setRsvpForm] = useState({ name: '', status: 'Hadir', message: '' });
    const [rsvpStatus, setRsvpStatus] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);

    // Load font if it's a text layer or countdown
    if (layer.type === 'text' || layer.type === 'dynamic_guest_name' || layer.type === 'interactive_countdown') {
        loadFont(layer.style?.fontFamily);
    }
    if (layer.type === 'polaroid') {
        loadFont('Caveat');
    }

    const submitRsvp = async (e) => {
        e.preventDefault();
        try {
            setRsvpStatus('loading');
            await axios.post(`/${window.__INVITATION_SLUG__}/rsvp`, rsvpForm);
            setRsvpStatus('success');
            // Jika ada event listener untuk submit rsvp di tempat lain, ini bisa dispatch
            window.dispatchEvent(new Event('rsvp_submitted'));
        } catch (error) {
            setRsvpStatus('error');
            console.error('RSVP Error:', error);
        }
    };

    useEffect(() => {
        if (layer.type === 'interactive_comments') {
            const fetchComments = async () => {
                try {
                    const res = await axios.get(`/${window.__INVITATION_SLUG__}/rsvps`);
                    if (res.data.success) {
                        setComments(res.data.data.filter(c => c.message && c.message.trim() !== ''));
                    }
                } catch (err) {
                    console.error('Failed to fetch RSVPs:', err);
                } finally {
                    setCommentsLoading(false);
                }
            };
            fetchComments();
            
            // Listen for newly submitted RSVP to refresh the list without full reload
            const handleRsvpSubmit = () => fetchComments();
            window.addEventListener('rsvp_submitted', handleRsvpSubmit);
            return () => window.removeEventListener('rsvp_submitted', handleRsvpSubmit);
        }
    }, [layer.type]);

    useEffect(() => {
        let animationInstance = null;
        if (layer.animation && elementRef.current) {
            animationInstance = applyAnimation(elementRef.current, layer.animation, false, layer.style);
        }
        
        const handlePlayExit = () => {
            if (layer.animation?.exit && elementRef.current) {
                applyExitAnimation(elementRef.current, layer.animation, layer.style);
            }
        };
        window.addEventListener('builder:play_exit_animations', handlePlayExit);

        return () => {
            window.removeEventListener('builder:play_exit_animations', handlePlayExit);
            if (animationInstance) {
                animationInstance.kill();
                if (animationInstance.scrollTrigger) {
                    animationInstance.scrollTrigger.kill();
                }
            }
        };
    }, [layer.animation]);

    const handleInteraction = (e) => {
        if (!layer.interaction || !layer.interaction.isButton) return;
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        const { action, targetId, url, transition } = layer.interaction;
        
        if (action === 'open_invitation') {
            window.dispatchEvent(new CustomEvent('builder:open_invitation', { 
                detail: { transition: transition || 'slide_up' } 
            }));
        } else if (action === 'navigate' && targetId) {
            const target = document.getElementById(targetId) || document.querySelector(`.${targetId}`);
            if (target) target.scrollIntoView({ behavior: 'smooth' });
        } else if (action === 'open_link' && url) {
            window.open(url, '_blank');
        } else if (action === 'trigger_animation' && targetId) {
            // Kita bisa mencari elemen target dan me-restart animasi GSAP-nya
            const target = document.getElementById(targetId);
            if (target) {
                // Hapus style hidden/opacity jika ada
                target.style.opacity = 1;
                target.style.pointerEvents = 'auto';
                // Trigger event khusus untuk engineGSAP atau langsung beri efek
                gsap.fromTo(target, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" });
            }
        }
    };

    const getPx = (val) => {
        if (val === undefined || val === null) return val;
        if (typeof val === 'number') return `${val}px`;
        if (typeof val === 'string' && val.trim() !== '' && !isNaN(val)) return `${val}px`;
        return val;
    };

    const wrapperStyle = {
        position: 'absolute',
        left: getPx(layer.style?.x ?? 0),
        top: getPx(layer.style?.y ?? 0),
        width: getPx(layer.style?.width ?? 100),
        height: getPx(layer.style?.height ?? 100),
        zIndex: layer.style?.zIndex || 1,
        pointerEvents: layer.type === 'canvas_group' ? 'none' : 'auto'
    };

    return (
        <div 
            id={layer.id}
            style={wrapperStyle} 
            className="public-layer-element"
            onClick={handleInteraction}
        >
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    transform: `rotate(${layer.style?.rotation || 0}deg)`,
                    opacity: layer.style?.opacity !== undefined ? layer.style.opacity : 1,
                }}
            >
                <div ref={elementRef} style={{ width: '100%', height: '100%' }}>
                    <div style={{
                        width: '100%',
                        height: '100%',
                        transform: `scale(${layer.style?.flipX ? -1 : 1}, ${layer.style?.flipY ? -1 : 1})`,
                        borderRadius: (() => {
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
                    })(),
                    overflow: layer.style?.borderRadius ? 'hidden' : 'visible',
                    filter: getShadowCss(layer.style),
                    background: (layer.type === 'image' || layer.type === 'text' || layer.type === 'dynamic_guest_name') ? 'transparent' : getGradientCss(layer.style),
                    borderWidth: layer.style?.borderWidth ? `${layer.style.borderWidth}px` : undefined,
                    borderStyle: layer.style?.borderStyle || (layer.style?.borderWidth ? 'solid' : undefined),
                    borderColor: layer.style?.borderColor,
                    boxSizing: 'border-box',
                    cursor: layer.interaction?.isButton ? 'pointer' : 'default',
                }}>
            {(layer.type === 'text' || layer.type === 'dynamic_guest_name') && (
                <div 
                    style={{
                        width: '100%',
                        height: '100%',
                        overflow: 'hidden',
                        display: 'flex',
                        outline: 'none',
                        border: 'none',
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
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word'
                    }}
                    dangerouslySetInnerHTML={{ __html: layer.type === 'dynamic_guest_name' ? layer.content.replace('[Nama Tamu]', new URLSearchParams(window.location.search).get('to') || 'Bapak/Ibu/Saudara/i') : layer.content }}
                />
            )}
            
            {layer.type === 'shape' && (
                <div 
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: layer.style?.backgroundColor || '#e0e7ff',
                        borderRadius: layer.style?.borderRadius || '0px',
                        borderWidth: layer.style?.borderWidth,
                        borderColor: layer.style?.borderColor,
                        borderStyle: layer.style?.borderWidth ? 'solid' : 'none',
                    }}
                ></div>
            )}

            {layer.type === 'image' && (
                <div className={`w-full h-full relative pointer-events-none`}>
                    <img 
                        src={layer.url || layer.content} 
                        alt="" 
                        loading="lazy"
                        decoding="async"
                        style={{ 
                            opacity: layer.style?.opacity !== undefined ? layer.style.opacity : 1,
                            width: '100%', 
                            height: '100%', 
                            objectFit: 'cover',
                            objectPosition: `${layer.style?.cropX || 50}% ${layer.style?.cropY || 50}%`,
                            transform: `scaleX(${layer.style?.flipX ? -1 : 1}) scaleY(${layer.style?.flipY ? -1 : 1})`,
                            filter: `${layer.style?.imageFilter && layer.style.imageFilter !== 'none' ? getFilterById(layer.style.imageFilter).getCss(layer.style.imageFilterIntensity ?? 100) + ' ' : ''}brightness(${layer.style?.brightness ?? 1}) contrast(${layer.style?.contrast ?? 1}) saturate(${layer.style?.saturate ?? 1}) blur(${layer.style?.blur ?? 0}px) grayscale(${layer.style?.grayscale ?? 0})`.trim()
                        }} 
                    />
                    {layer.style?.imageFilter && getFilterById(layer.style.imageFilter).getOverlay && (
                        <div dangerouslySetInnerHTML={{ __html: getFilterById(layer.style.imageFilter).getOverlay(layer.style.imageFilterIntensity ?? 100) }} />
                    )}
                </div>
            )}

            {layer.type === 'frame' && (
                <div className="w-full h-full relative pointer-events-none flex items-center justify-center overflow-hidden">
                    {layer.style?.mediaUrls && layer.style.mediaUrls.length > 0 ? (
                        layer.style.mediaUrls[0].startsWith('data:video') || layer.style.mediaUrls[0].endsWith('.mp4') ? (
                            <video 
                                src={layer.style.mediaUrls[0]}
                                autoPlay muted loop playsInline
                                className="w-full h-full object-cover pointer-events-none"
                            />
                        ) : layer.style.mediaUrls.length > 1 ? (
                            <Swiper
                                modules={[Autoplay, EffectFade]}
                                effect="fade"
                                fadeEffect={{ crossFade: true }}
                                speed={1000}
                                autoplay={{ delay: 2500, disableOnInteraction: false }}
                                loop={true}
                                allowTouchMove={false}
                                className="w-full h-full pointer-events-none"
                            >
                                {layer.style.mediaUrls.map((url, idx) => (
                                    <SwiperSlide key={idx} className="w-full h-full pointer-events-none">
                                        <img src={url} className="w-full h-full object-cover" alt="Frame Media"/>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        ) : (
                            <img 
                                src={layer.style.mediaUrls[0]} 
                                alt="Frame Media" 
                                className="w-full h-full object-cover pointer-events-none"
                            />
                        )
                    ) : null}
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
                        {layer.style?.polaroidData?.image ? (
                            <>
                                <img 
                                    src={layer.style.polaroidData.image} 
                                    alt="Polaroid" 
                                    className="w-full h-full object-cover"
                                    style={{
                                        objectPosition: `${layer.style?.cropX || 50}% ${layer.style?.cropY || 50}%`,
                                        transform: `scaleX(${layer.style?.flipX ? -1 : 1}) scaleY(${layer.style?.flipY ? -1 : 1})`,
                                        filter: `${layer.style?.brightness ? `brightness(${layer.style.brightness}) ` : ''}${layer.style?.contrast ? `contrast(${layer.style.contrast}) ` : ''}${layer.style?.saturate ? `saturate(${layer.style.saturate}) ` : ''}${layer.style?.blur ? `blur(${layer.style.blur}px) ` : ''}`.trim() || 'none'
                                    }}
                                />
                                {layer.style?.polaroidData?.filterId && layer.style.polaroidData.filterId !== 'none' && (
                                    <div dangerouslySetInnerHTML={{ __html: getFilterById(layer.style.polaroidData.filterId)?.getOverlay(100) || '' }} />
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
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <video 
                        src={layer.url} 
                        autoPlay 
                        loop 
                        muted 
                        playsInline 
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover', pointerEvents: 'none',
                            filter: `brightness(${layer.style?.brightness ?? 1}) contrast(${layer.style?.contrast ?? 1}) saturate(${layer.style?.saturate ?? 1}) blur(${layer.style?.blur ?? 0}px) grayscale(${layer.style?.grayscale ?? 0})`
                        }}
                    />
                </div>
            )}

            {layer.type === 'custom_code' && (
                <div 
                    style={{ width: '100%', height: '100%', position: 'relative', pointerEvents: 'auto' }} 
                    dangerouslySetInnerHTML={{ __html: layer.content }} 
                />
            )}
            
            {layer.type === 'lottie' && (
                (() => {
                    let lottieData = layer.lottieJsonObj || layer.animationData;
                    if (typeof lottieData === 'string') {
                        try { lottieData = JSON.parse(lottieData); } catch(e) {}
                    } else if (lottieData && typeof lottieData === 'object') {
                        lottieData = JSON.parse(JSON.stringify(lottieData));
                    }
                    if (lottieData) {
                        return (
                            <Lottie 
                                animationData={lottieData}
                                loop={layer.animation?.loop !== false} 
                                autoplay={true}
                                style={{ width: '100%', height: '100%', pointerEvents: 'none' }}
                            />
                        );
                    }
                    return null;
                })()
            )}

            {layer.type === 'custom_path' && (
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ pointerEvents: 'none', overflow: 'visible' }}>
                    <path 
                        id={layer.id + '_path'}
                        d="M 10 90 Q 30 10 70 50 T 90 10" 
                        fill="transparent" 
                        stroke="transparent" 
                        strokeWidth="2" 
                    />
                </svg>
            )}

            {layer.type === 'photo_album' && (
                <div style={{ width: '100%', height: '100%', pointerEvents: 'auto' }}>
                    <Swiper
                        key={`${layer.style?.albumData?.animationStyle || 'slide'}-${layer.style?.albumData?.direction || 'horizontal'}-${layer.style?.albumData?.speed || 500}-${layer.style?.albumData?.autoplayDelay || 2500}`}
                        modules={[Autoplay, EffectCards, EffectCoverflow, EffectFade]}
                        effect={layer.style?.albumData?.animationStyle || 'slide'}
                        direction={layer.style?.albumData?.direction || 'horizontal'}
                        speed={layer.style?.albumData?.speed || 500}
                        observer={true}
                        observeParents={true}
                        grabCursor={true}
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
                                                    filter: `${img.filterId && img.filterId !== 'none' ? getFilterById(img.filterId).getCss(img.filterIntensity ?? 100) + ' ' : ''}brightness(${img.brightness ?? 1}) contrast(${img.contrast ?? 1}) saturate(${img.saturate ?? 1}) blur(${img.blur ?? 0}px)`.trim()
                                                }} 
                                            />
                                        </div>
                                    )}
                                </SwiperSlide>
                            );
                        })}
                    </Swiper>
                </div>
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

            {layer.type === 'interactive_rsvp' && (() => {
                const theme = layer.style?.rsvpTheme || 'solid';
                let containerStyle = {
                    width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    backgroundColor: layer.style?.backgroundColor || '#ffffff',
                    backgroundImage: layer.style?.backgroundImageUrl ? `url(${layer.style.backgroundImageUrl})` : 'none',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    borderRadius: layer.style?.borderRadius || '0.75rem',
                    borderWidth: layer.style?.borderWidth,
                    borderColor: layer.style?.borderColor,
                    borderStyle: layer.style?.borderWidth ? 'solid' : 'none',
                    padding: '1.5rem', boxSizing: 'border-box'
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

                let inputStyle = { height: '2.5rem', backgroundColor: finalInputBg, color: layer.style?.textColor || '#1f2937', borderRadius: '0.5rem', width: '100%', padding: '0 0.75rem', fontSize: '0.875rem', border: 'none', outline: 'none', boxSizing: 'border-box' };
                let buttonStyle = { height: '2.5rem', backgroundColor: rsvpStatus === 'loading' ? '#9ca3af' : (layer.style?.buttonColor || '#4f46e5'), borderRadius: '0.5rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: layer.style?.buttonTextColor || 'white', fontWeight: 'bold', border: 'none', cursor: rsvpStatus === 'loading' ? 'not-allowed' : 'pointer', marginTop: '0.25rem' };

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
                    <div style={containerStyle}>
                        <h3 style={{ fontFamily: 'serif', fontSize: layer.style?.fontSize || '1.25rem', color: layer.style?.textColor || '#1f2937', marginBottom: '1rem', position: 'relative', zIndex: 10 }}>Kehadiran Anda</h3>
                        {rsvpStatus === 'success' ? (
                            <div style={{ textAlign: 'center', color: layer.style?.textColor || '#10b981', fontWeight: 'bold', position: 'relative', zIndex: 10 }}>Terima kasih atas konfirmasinya!</div>
                        ) : (
                            <form onSubmit={submitRsvp} style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, pointerEvents: 'auto', position: 'relative', zIndex: 10 }}>
                                <input 
                                    type="text" 
                                    placeholder="Nama Lengkap..." 
                                    required
                                    value={rsvpForm.name}
                                    onChange={e => setRsvpForm({...rsvpForm, name: e.target.value})}
                                    style={inputStyle} 
                                />
                                <select 
                                    value={rsvpForm.status}
                                    onChange={e => setRsvpForm({...rsvpForm, status: e.target.value})}
                                    style={inputStyle}
                                >
                                    <option value="Hadir">Hadir</option>
                                    <option value="Tidak Hadir">Tidak Hadir</option>
                                </select>
                                <textarea
                                    placeholder="Pesan/Doa (Opsional)"
                                    value={rsvpForm.message}
                                    onChange={e => setRsvpForm({...rsvpForm, message: e.target.value})}
                                    style={{ flex: 1, minHeight: '3rem', resize: 'none', ...inputStyle, height: 'auto' }}
                                ></textarea>
                                <button type="submit" disabled={rsvpStatus === 'loading'} style={buttonStyle}>
                                    {rsvpStatus === 'loading' ? 'Mengirim...' : 'Kirim RSVP'}
                                </button>
                            </form>
                        )}
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
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center rounded-xl border border-gray-300 relative overflow-hidden" style={{ opacity: mapOpacity, background: isButtonOnly ? 'transparent' : undefined, borderColor: isButtonOnly ? 'transparent' : undefined }}>
                        {!isButtonOnly && (
                            layer.content && layer.content.includes('<iframe') ? (
                                <div className="w-full h-full [&>iframe]:w-full [&>iframe]:h-full [&>iframe]:border-0" dangerouslySetInnerHTML={{ __html: layer.content }}></div>
                            ) : (
                                <div className="absolute inset-0 w-full h-full" style={{ backgroundImage: 'url(/map_placeholder.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                            )
                        )}
                        
                        {(!layer.content?.includes('<iframe') || isButtonOnly) && (
                            <a 
                                href={layer.content || '#'}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 backdrop-blur px-5 py-2.5 rounded-full shadow-md flex items-center gap-2.5 text-sm font-bold transition hover:scale-105 z-10"
                                style={{ backgroundColor: isButtonOnly ? buttonColor : 'rgba(255, 255, 255, 0.95)', color: isButtonOnly ? buttonTextColor : '#1f2937', textDecoration: 'none' }}
                            >
                                <svg className="w-5 h-5" style={{ color: isButtonOnly ? buttonTextColor : '#ef4444' }} fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
                                {buttonText}
                            </a>
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

                return (
                    <div 
                        className="w-full h-full flex items-center justify-between shadow-sm px-4 group hover:shadow-md transition-shadow cursor-pointer"
                        style={{
                            backgroundColor: hexToRgba(bgColor, bgOpacity),
                            borderRadius: layer.style?.borderRadius || '0.75rem',
                            borderWidth: layer.style?.borderWidth || '1px',
                            borderColor: layer.style?.borderColor || '#e5e7eb',
                            borderStyle: layer.style?.borderWidth ? 'solid' : (layer.style?.borderColor ? 'solid' : 'none'),
                            boxShadow: layer.style?.isShadowActive ? `0px ${layer.style?.shadowY || 4}px 6px -1px rgba(0, 0, 0, 0.1)` : 'none',
                        }}
                        onClick={() => {
                            if(layer.content) {
                                navigator.clipboard.writeText(layer.content);
                                alert('Teks berhasil disalin: ' + layer.content);
                            }
                        }}
                    >
                        <span 
                            className="text-base font-mono font-bold transition-colors w-full"
                            style={{ color: hexToRgba(textColor, textOpacity) }}
                        >
                            {layer.content || ''}
                        </span>
                        <div 
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 active:scale-95 ml-2"
                            style={{ 
                                backgroundColor: layer.style?.iconBgColor || '#e0e7ff',
                                color: layer.style?.iconColor || '#4f46e5'
                            }}
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        </div>
                    </div>
                );
            })()}

            {layer.type === 'interactive_comments' && (
                <div 
                    style={{
                        width: '100%', height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', pointerEvents: 'auto',
                        backgroundColor: layer.style?.backgroundColor || '#f8fafc',
                        borderRadius: layer.style?.borderRadius || '1rem',
                        padding: layer.style?.padding || '1rem',
                        color: layer.style?.color || '#333333',
                        borderWidth: layer.style?.borderWidth || 0,
                        borderColor: layer.style?.borderColor || '#e2e8f0',
                        borderStyle: layer.style?.borderWidth ? 'solid' : 'none',
                    }}
                >
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 'bold', marginBottom: '0.75rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem', color: layer.style?.color || '#333333' }}>
                        Ucapan & Doa ({comments.length})
                    </h3>
                    <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingRight: '0.25rem' }}>
                        {commentsLoading ? (
                            <div style={{ textAlign: 'center', fontSize: '0.75rem', color: '#9ca3af', padding: '1rem 0' }}>Memuat komentar...</div>
                        ) : comments.length === 0 ? null : (
                            comments.map((comment, idx) => (
                                <div key={idx} style={{ backgroundColor: 'white', padding: '0.625rem', borderRadius: '0.5rem', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>{comment.name}</span>
                                        {comment.status === 'Hadir' && (
                                            <span style={{ fontSize: '0.5625rem', backgroundColor: '#d1fae5', color: '#047857', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>Hadir</span>
                                        )}
                                        {comment.status === 'Tidak Hadir' && (
                                            <span style={{ fontSize: '0.5625rem', backgroundColor: '#fee2e2', color: '#b91c1c', padding: '0.125rem 0.375rem', borderRadius: '0.25rem' }}>Tidak Hadir</span>
                                        )}
                                    </div>
                                    <p style={{ fontSize: '0.625rem', color: '#4b5563', margin: 0, lineHeight: 1.4 }}>{comment.message}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
            
            {layer.type === 'canvas_group' && (
                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    {layer.children?.map(child => (
                        <PublicLayer key={child.id} layer={child} />
                    ))}
                </div>
            )}
            
            {layer.custom_injection && (
                <div dangerouslySetInnerHTML={{ __html: layer.custom_injection }} />
            )}
                </div>
            </div>
        </div>
        </div>
    );
};

export default PublicLayer;
