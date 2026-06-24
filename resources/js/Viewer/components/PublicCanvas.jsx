import React, { useEffect, useState, useRef } from 'react';
import PublicLayer from './PublicLayer';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Particles from "@tsparticles/react";
import { tsParticles } from "@tsparticles/engine";
import { loadFireflyPreset } from "@tsparticles/preset-firefly";
import { loadSnowPreset } from "@tsparticles/preset-snow";
import IframePreview from '../../Builder/components/Canvas/IframePreview';

const PublicCanvas = ({ config }) => {
    const { sections = [], global_settings = {} } = config;
    const [init, setInit] = useState(false);
    const [scale, setScale] = useState(1);
    const [scaledHeight, setScaledHeight] = useState('auto');
    const [isOpened, setIsOpened] = useState(false);

    useEffect(() => {
        if (isOpened) {
            // Biarkan DOM selesai me-render display:block dari section yang tersembunyi
            // Cukup panggil refresh sekali setelah animasi selesai agar tidak memberatkan memori
            const timer = setTimeout(() => {
                ScrollTrigger.refresh(true);
            }, 1250); // Waktu yang cukup setelah transisi slide-up selesai
            
            return () => clearTimeout(timer);
        }
    }, [isOpened]);
    const [transitionType, setTransitionType] = useState('slide_up');
    const containerRef = useRef(null);
    const innerRef = useRef(null);

    useEffect(() => {
        const handleOpenInvitation = async (e) => {
            const trans = e.detail?.transition || 'slide_up';
            
            // Check if there are any exit animations in the cover section
            let maxExitDuration = 0;
            const checkExit = (layer) => {
                if (layer.animation?.exit) {
                    const dur = (layer.animation.configExit?.speed || 1.5) * 1000;
                    const del = (layer.animation.configExit?.delay || 0) * 1000;
                    maxExitDuration = Math.max(maxExitDuration, dur + del);
                }
                if (layer.children) layer.children.forEach(checkExit);
            };
            if (sections[0] && sections[0].layers) {
                sections[0].layers.forEach(checkExit);
            }

            if (maxExitDuration > 0) {
                window.dispatchEvent(new CustomEvent('builder:play_exit_animations'));
                // Wait for animations to finish before sliding up cover
                await new Promise(r => setTimeout(r, maxExitDuration + 100));
            }

            setTransitionType(trans);
            setIsOpened(true);
            
            // Auto play audio if exists logic can be added here
            window.dispatchEvent(new CustomEvent('builder:play_background_audio'));
        };
        window.addEventListener('builder:open_invitation', handleOpenInvitation);
        return () => window.removeEventListener('builder:open_invitation', handleOpenInvitation);
    }, [sections]);

    useEffect(() => {
        let hasOpenButton = false;
        sections.forEach(s => {
            s.layers?.forEach(l => {
                if (l.interaction?.action === 'open_invitation') hasOpenButton = true;
                if (l.children) {
                    l.children.forEach(c => {
                        if (c.interaction?.action === 'open_invitation') hasOpenButton = true;
                    });
                }
            });
        });

        if (hasOpenButton && !isOpened) {
            document.body.style.overflow = 'hidden';
            document.documentElement.style.overflow = 'hidden';
            
            // Prevent touch scrolling on iOS Safari
            const preventScroll = (e) => {
                // Allow scrolling if target is inside a scrollable element, but generally for cover we lock it
                if (e.target.closest('.overflow-y-auto')) return;
                e.preventDefault();
            };
            window.addEventListener('touchmove', preventScroll, { passive: false });
            
            return () => {
                document.body.style.overflow = '';
                document.documentElement.style.overflow = '';
                window.removeEventListener('touchmove', preventScroll);
            };
        } else {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    }, [sections, isOpened]);

    useEffect(() => {
        const initEngine = async () => {
            await loadFireflyPreset(tsParticles);
            await loadSnowPreset(tsParticles);
            window.tsParticles = tsParticles;
            
            // Tunda efek partikel agar tidak mencekik CPU saat animasi masuk (entrance) Cover sedang berjalan
            setTimeout(() => {
                setInit(true);
            }, 800);
        };
        initEngine();

        // Calculate scale for responsive view
        const handleResize = () => {
            if (!containerRef.current) return;
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            const baseWidth = 414;
            let newScale = 1;
            
            const isPreview = new URLSearchParams(window.location.search).get('preview') === '1';
            const hasDesktopThumbnail = config?.global_settings?.desktop_thumbnail?.enabled;

            if (isPreview) {
                newScale = screenWidth / baseWidth;
            } else if (screenWidth < baseWidth || screenWidth < 1024) {
                // Mobile and Tablet: fit the screen to prevent white space
                const widthRatio = screenWidth / baseWidth;
                const heightRatio = screenHeight / 844;
                newScale = Math.max(widthRatio, heightRatio);
            } else {
                // Desktop (>= 1024px)
                if (hasDesktopThumbnail) {
                    newScale = screenHeight / 844;
                } else {
                    newScale = 1;
                }
            }

            setScale(newScale);
            setScaledHeight(844 * newScale);
        };
        
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [global_settings?.desktop_thumbnail?.enabled]);

    useEffect(() => {
        if (!innerRef.current) return;
        const resizeObserver = new ResizeObserver((entries) => {
            for (let entry of entries) {
                setScaledHeight(entry.contentRect.height * scale);
            }
        });
        resizeObserver.observe(innerRef.current);
        return () => resizeObserver.disconnect();
    }, [scale, sections]);

    const hasAnyLayers = sections.some(s => s.layers && s.layers.length > 0);
    const hideEmptySections = global_settings?.custom_code && !hasAnyLayers;

    return (
        <div ref={containerRef} style={{ width: '100%', height: (!isOpened && hasAnyLayers) ? '100vh' : (scaledHeight === 'auto' ? 'auto' : `${scaledHeight}px`), overflow: 'hidden', position: 'relative' }}>
            <div ref={innerRef} style={{ 
                width: '414px', 
                maxWidth: '414px', 
                position: 'absolute',
                left: '50%',
                overflowX: 'hidden', 
                transform: `translateX(-50%) scale(${scale})`,
                transformOrigin: 'top center',
                backgroundColor: 'transparent'
            }}>
                {global_settings?.custom_code && (
                    <IframePreview 
                        htmlContent={global_settings.custom_code} 
                        style={{ position: 'relative', zIndex: 9999 }}
                    />
                )}

                {init && global_settings?.particleEffect && (
                    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none' }}>
                        <Particles 
                            id="tsparticles-viewer" 
                            options={{ preset: global_settings.particleEffect, background: { opacity: 0 } }} 
                        />
                    </div>
                )}
                
                {!hideEmptySections && sections.map((section, index) => {
                    
                    let hasOpenButton = false;
                    const checkInteraction = (layers) => {
                        if (!layers) return;
                        layers.forEach(l => {
                            if (l.interaction?.action === 'open_invitation') hasOpenButton = true;
                            if (l.children) checkInteraction(l.children);
                        });
                    };
                    sections.forEach(s => checkInteraction(s.layers));

                    let maxY = 0;
                    const checkLayer = (layer, parentY = 0) => {
                        const currentY = parentY + (parseFloat(layer.style?.y) || 0);
                        const bottom = currentY + (parseFloat(layer.style?.height) || 0);
                        if (bottom > maxY) maxY = bottom;
                        if (layer.children) {
                            layer.children.forEach(child => checkLayer(child, (layer.type === 'canvas_group' || layer.type === 'group') ? currentY : parentY));
                        }
                    };
                    section.layers?.forEach(l => checkLayer(l, 0));

                    const sectionHeight = (() => {
                        if (section.layout?.height && section.layout.height !== 'auto' && section.layout.height !== '100vh') {
                            return section.layout.height;
                        }
                        if (index === 0) {
                            return '844px';
                        }
                        if (section.layout?.minHeight && section.layout.minHeight !== '844px' && section.layout.minHeight !== '100vh') {
                            return section.layout.minHeight;
                        }
                        return maxY > 0 ? `${maxY}px` : (section.layout?.height || '844px');
                    })();

                    return (
                    <section 
                        key={section.id} 
                        id={section.id}
                        className={`public-section-${index}`}
                        style={{
                            position: 'relative',
                            height: sectionHeight,
                            background: section.layout?.background_value || '#ffffff',
                            overflow: 'hidden',
                            display: 'block',
                            visibility: (!isOpened && hasOpenButton && index > 0) ? 'hidden' : 'visible',
                            zIndex: index === 0 ? 50 : 1,
                            ...(index === 0 ? (() => {
                                let isSlideUp = transitionType === 'slide_up' || !transitionType;
                                let transStyle = {
                                    transition: 'all 1.2s cubic-bezier(0.85, 0, 0.15, 1)',
                                    pointerEvents: isOpened ? 'none' : 'auto',
                                    willChange: 'transform, opacity, filter'
                                };
                                
                                // Jika ada tombol buka dan lebih dari 1 seksi, paksa absolut sedari awal 
                                // agar tidak memicu recalculate style yang berat (jank/patah) saat isOpened berubah
                                if (hasOpenButton && sections.length > 1) {
                                    transStyle.position = 'absolute';
                                    transStyle.top = '0';
                                    transStyle.left = '0';
                                    transStyle.width = '100%';
                                    transStyle.zIndex = 50;
                                } else if (isOpened) {
                                    transStyle.position = 'absolute';
                                    transStyle.top = '0';
                                    transStyle.left = '0';
                                    transStyle.width = '100%';
                                    transStyle.zIndex = 50;
                                }
                                
                                if (isOpened) {
                                    if (isSlideUp) {
                                        transStyle.transform = `translateY(calc(-1 * max(100vh, ${maxY > 0 ? maxY : 0}px)))`;
                                    } else {
                                        switch(transitionType) {
                                            case 'slide_down': transStyle.transform = 'translateY(100vh)'; transStyle.opacity = 0; break;
                                            case 'slide_left': transStyle.transform = 'translateX(-100vw)'; transStyle.opacity = 0; break;
                                            case 'slide_right': transStyle.transform = 'translateX(100vw)'; transStyle.opacity = 0; break;
                                            case 'fade_out': transStyle.opacity = 0; break;
                                            case 'zoom_out': transStyle.transform = 'scale(0.2)'; transStyle.opacity = 0; break;
                                            case 'zoom_in': transStyle.transform = 'scale(2)'; transStyle.opacity = 0; break;
                                            case 'blur_out': transStyle.filter = 'blur(20px)'; transStyle.opacity = 0; break;
                                            case 'split_horizontal': transStyle.transform = 'scaleY(0)'; transStyle.opacity = 0; break;
                                        }
                                    }
                                }
                                return transStyle;
                            })() : {})
                        }}
                    >
                        {section.layers?.map((layer) => (
                            <div key={layer.id} style={{ zIndex: layer.style?.zIndex || 1, position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
                                {!layer.isHidden && layer.children?.map(child => (
                                    <PublicLayer key={child.id} layer={child} isOpened={isOpened} isCoverPage={index === 0} />
                                ))}
                            </div>
                        ))}
                    </section>
                    );
                })}
            </div>
        </div>
    );
};

export default PublicCanvas;
