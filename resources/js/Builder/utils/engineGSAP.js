import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, TextPlugin);

const getAnimationProps = (type, isExit = false, config = {}, layerStyle = null) => {
    const duration = config.speed || 1.5;
    const direction = config.direction || 'default';
    const delay = config.delay || 0;
    
    let props = { opacity: 0, duration, delay, ease: "power2.out" };

    const dirVal = (val) => {
        if (direction === 'up') return { y: isExit ? -val : val, x: 0 };
        if (direction === 'down') return { y: isExit ? val : -val, x: 0 };
        if (direction === 'left') return { x: isExit ? -val : val, y: 0 };
        if (direction === 'right') return { x: isExit ? val : -val, y: 0 };
        return null;
    };

    switch (type) {
        case 'fade-in': 
        case 'fade-out':
            break;
        case 'slide-up':
        case 'slide-down':
        case 'slide-left':
        case 'slide-right':
            if (direction !== 'default') {
                Object.assign(props, dirVal(30));
            } else {
                if (type === 'slide-up') props.y = isExit ? -30 : 30;
                if (type === 'slide-down') props.y = isExit ? 30 : -30;
                if (type === 'slide-left') props.x = isExit ? -50 : 50;
                if (type === 'slide-right') props.x = isExit ? 50 : -50;
            }
            break;
        case 'pop': props.scale = 0.5; props.ease = "back.out(1.7)"; break;
        case 'zoom-in': props.scale = 0.5; break;
        case 'zoom-out': props.scale = 1.2; break;
        case 'ascend': 
            Object.assign(props, direction !== 'default' ? dirVal(30) : { y: 30 });
            props.rotation = 3;
            props.ease = "back.out(1.2)"; 
            break;
        case 'shift': 
            Object.assign(props, direction !== 'default' ? dirVal(20) : { x: 20 });
            props.skewX = -10;
            break;
        case 'bounce-text': 
            Object.assign(props, direction !== 'default' ? dirVal(20) : { y: -20 });
            props.ease = "bounce.out"; 
            break;
        case 'merge': props.letterSpacing = "15px"; break;
        case 'tracking-out': props.letterSpacing = "15px"; props.opacity = 0; break;
        case 'typewriter':
        case 'block-reveal': 
        case 'wipe':
            if (direction === 'right' || direction === 'default') props.clipPath = "inset(0 100% 0 0)";
            if (direction === 'left') props.clipPath = "inset(0 0 0 100%)";
            if (direction === 'down') props.clipPath = "inset(0 0 100% 0)";
            if (direction === 'up') props.clipPath = "inset(100% 0 0 0)";
            props.ease = "power1.inOut"; 
            break;
        case 'roll': props.rotationX = -90; props.x = -50; break;
        case 'skate': props.skewX = 20; props.x = -50; break;
        case 'stretch': props.scaleX = 0.2; break;
        case 'clarify':
        case 'blur': props.filter = "blur(10px)"; break;
        case 'breathe': props.scale = 0.95; props.opacity = 0.7; break;
        case 'drift': 
            if (direction !== 'default') Object.assign(props, dirVal(20));
            else { props.x = -15; props.y = 15; }
            break;
        case 'tumble': props.rotationX = -45; props.transformPerspective = 400; break;
        case 'stomp': props.scale = 1.2; props.ease = "power3.in"; break;
        case 'neon': props.textShadow = "0 0 10px #e11d48, 0 0 20px #e11d48"; break;
        case 'scrapbook': props.rotation = 5; props.scale = 0.9; break;
        case 'drop': props.y = -30; props.ease = "bounce.out"; break;
        case 'plant-grow': 
            props.scale = 0.2; 
            props.rotation = -10; 
            props.transformOrigin = "bottom center"; 
            props.ease = "back.out(1.5)"; 
            break;
        case 'custom_keyframe':
            delete props.opacity;
            if (layerStyle && config.startX !== undefined && config.startY !== undefined) {
                props.x = isExit ? -(config.startX - layerStyle.x) : (config.startX - layerStyle.x);
                props.y = isExit ? -(config.startY - layerStyle.y) : (config.startY - layerStyle.y);
                if (config.startWidth !== undefined) props.width = config.startWidth;
                if (config.startHeight !== undefined) props.height = config.startHeight;
            } else {
                props.x = isExit ? -(config.offsetX || 0) : (config.offsetX || 0);
                props.y = isExit ? -(config.offsetY || 0) : (config.offsetY || 0);
            }
            break;
        default: break;
    }
    return props;
};

const getIdleProps = (type, config = {}) => {
    const speed = config.speed || 1;
    switch(type) {
        case 'pulse': return { scale: 1.1, duration: speed, yoyo: true, repeat: -1, ease: "sine.inOut" };
        case 'bounce': return { y: -10, duration: speed * 0.6, yoyo: true, repeat: -1, ease: "power1.inOut" };
        case 'spin': return { rotation: 360, duration: speed * 3, repeat: -1, ease: "none" };
        case 'wiggle': return { rotation: 10, duration: speed * 0.15, yoyo: true, repeat: -1, ease: "sine.inOut" };
        case 'float': return { y: -10, duration: speed * 2, yoyo: true, repeat: -1, ease: "sine.inOut" };
        case 'float-sway': return { y: -10, rotation: 3, duration: speed * 3, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "center center" };
        case 'flicker': return { opacity: 0.2, duration: speed * 0.8, yoyo: true, repeat: -1, ease: "steps(2)" };
        case 'wave': return { y: -5, duration: speed, yoyo: true, repeat: -1, ease: "sine.inOut" };
        case 'swing': return { rotation: 5, duration: speed * 3, yoyo: true, repeat: -1, ease: "sine.inOut", transformOrigin: "top center" };
        case 'heartbeat': return { scale: 1.3, duration: speed, yoyo: true, repeat: -1, ease: "back.inOut(1.7)" };
        case 'jello': return { skewX: -12.5, skewY: -12.5, duration: speed * 2, yoyo: true, repeat: -1, ease: "elastic.out(1, 0.3)" };
        case 'neon': return { textShadow: "0 0 20px #e11d48", duration: speed * 1.5, yoyo: true, repeat: -1, ease: "sine.inOut" };
        case 'wind-sway': {
            const windStrength = config.windStrength ?? 70;
            const stiffness = config.stiffness ?? 60;
            const damping = config.damping ?? 40;
            const isRandomize = config.randomize ?? true;
            
            const maxRotation = 2 + (windStrength / 100 * 15);
            const duration = 6 - (stiffness / 100 * 5);
            const ease = damping < 50 ? "elastic.out(1, 0.5)" : "sine.inOut";
            
            return { 
                rotation: isRandomize ? `random(-${maxRotation}, ${maxRotation})` : maxRotation, 
                transformOrigin: "bottom center",
                duration: duration, 
                yoyo: true, 
                repeat: -1, 
                repeatRefresh: isRandomize,
                ease: ease 
            };
        }
        default: return null;
    }
};

export const applyAnimation = (elementRef, layerAnimation, isBuilder = false, layerStyle = null, startAtTime = 0) => {
    if (!elementRef || !layerAnimation) return null;

    const isLooping = layerAnimation.isLooping || false;
    const repeatConfig = isLooping ? { repeat: -1, yoyo: true } : {};
    const activeTweens = [];
    
    // Temukan scroll container untuk Preview Modal. Jika tidak ada, gunakan default window
    const scrollScroller = !isBuilder && document.getElementById('viewer-scroll-container') 
                            ? document.getElementById('viewer-scroll-container') 
                            : undefined;

    const config = layerAnimation.config || { mode: 'enter', speed: 1.5, direction: 'up', trigger: 'onScroll' };
    const trigger = config.trigger || 'onScroll';
    const hasEntryAnimation = !!layerAnimation.entry;
    const globalDelay = parseFloat(config.delay) || 0;

    // Custom GSAP Code
    if (layerAnimation.custom) {
        try {
            const customObj = new Function(`return ${layerAnimation.custom}`)();
            const triggerElement = !isBuilder ? (elementRef.closest('section') || elementRef) : elementRef;

            const tween = gsap.from(elementRef, {
                ...customObj,
                ...repeatConfig,
                scrollTrigger: isBuilder ? null : { 
                    trigger: triggerElement, 
                    start: "top 80%", 
                    scroller: scrollScroller,
                    toggleActions: "play none none reverse" 
                }
            });
            activeTweens.push(tween);
            return { kill: () => activeTweens.forEach(t => t.kill()) };
        } catch (e) {
            console.error('Invalid custom GSAP config', e);
        }
    }

    // -- 1. CUSTOM TIMELINE (Keyframes) LOGIC --
    // We handle this entirely separately to mimic CapCut/Canva absolute timelines
    if (layerAnimation.idle === 'custom_timeline' && layerAnimation.custom_keyframes && layerAnimation.custom_keyframes.length > 0) {
        const triggerElement = !isBuilder ? (elementRef.closest('section') || elementRef) : elementRef;
        const keyframes = layerAnimation.custom_keyframes;
        
        const baseX = parseFloat(layerStyle?.x) || 0;
        const baseY = parseFloat(layerStyle?.y) || 0;
        const getValidNum = (val, fallback) => {
            if (val === undefined || val === null || val === '') return fallback;
            const parsed = parseFloat(val);
            return isNaN(parsed) ? fallback : parsed;
        };

        const firstKf = keyframes[0];
        
        // Setup initial state: HIDE element entirely during global delay if there is no entry animation overriding it
        if (!hasEntryAnimation) {
            gsap.set(elementRef, {
                x: getValidNum(firstKf.x, baseX) - baseX,
                y: getValidNum(firstKf.y, baseY) - baseY,
                scale: getValidNum(firstKf.scale, layerStyle?.scale ?? 1),
                rotation: getValidNum(firstKf.rotation, layerStyle?.rotation ?? 0),
                opacity: globalDelay > 0 ? 0 : getValidNum(firstKf.opacity, layerStyle?.opacity ?? 1),
                ...(firstKf.width !== undefined && { width: firstKf.width }),
                ...(firstKf.height !== undefined && { height: firstKf.height })
            });
        }

        const tl = gsap.timeline({
            repeat: (isLooping && !isBuilder) ? -1 : 0,
            delay: globalDelay,
            scrollTrigger: (!isBuilder && trigger === 'onScroll') ? {
                trigger: triggerElement,
                start: "top 85%",
                scroller: scrollScroller,
                toggleActions: isLooping ? "play pause resume pause" : "play none none reverse"
            } : null
        });

        // Waktu absolut timeline dimulai dari 0 (yang mana aslinya sudah ter-delay oleh globalDelay)
        if (!hasEntryAnimation && globalDelay > 0) {
            tl.set(elementRef, { opacity: getValidNum(firstKf.opacity, layerStyle?.opacity ?? 1), immediateRender: false, overwrite: false }, 0);
        }

        // Loop titik pergerakan keyframe (K1 ke K2 ke K3 dst)
        // Format CapCut: kf.delay adalah jeda SEBELUM bergerak ke titik ini, kf.duration adalah LAMA PERJALANAN ke titik ini.
        let absoluteTime = 0;
        for (let i = 0; i < keyframes.length; i++) {
            const kf = keyframes[i];
            const kfDelay = parseFloat(kf.delay) || 0;
            const kfDuration = parseFloat(kf.duration) || 1;
            
            absoluteTime += kfDelay; // Wait before action

            if (i === 0) {
                // Keyframe pertama adalah STARTING POINT. Di CapCut, elemen langsung berada di K1.
                tl.set(elementRef, {
                    x: getValidNum(kf.x, baseX) - baseX,
                    y: getValidNum(kf.y, baseY) - baseY,
                    opacity: getValidNum(kf.opacity, layerStyle?.opacity ?? 1),
                    scale: getValidNum(kf.scale, layerStyle?.scale ?? 1),
                    rotation: getValidNum(kf.rotation, layerStyle?.rotation ?? 0),
                    ...(kf.width !== undefined && { width: kf.width }),
                    ...(kf.height !== undefined && { height: kf.height }),
                    immediateRender: false,
                    overwrite: false
                }, absoluteTime);
            } else {
                // Keyframe selanjutnya adalah TUJUAN PERGERAKAN (ANIMASI)
                tl.to(elementRef, {
                    x: getValidNum(kf.x, baseX) - baseX,
                    y: getValidNum(kf.y, baseY) - baseY,
                    opacity: getValidNum(kf.opacity, layerStyle?.opacity ?? 1),
                    scale: getValidNum(kf.scale, layerStyle?.scale ?? 1),
                    rotation: getValidNum(kf.rotation, layerStyle?.rotation ?? 0),
                    ...(kf.width !== undefined && { width: kf.width }),
                    ...(kf.height !== undefined && { height: kf.height }),
                    duration: kfDuration,
                    ease: kf.ease || "power1.inOut",
                    force3D: true,
                    autoRound: false,
                    immediateRender: false
                }, absoluteTime);
                
                absoluteTime += kfDuration; // Advance timeline playhead by movement duration
            }
        }
        
        activeTweens.push(tl);
    } 
    // -- 2. STANDARD IDLE ANIMATIONS --
    else if (layerAnimation.idle) {
        if (layerAnimation.idle === 'custom_path' && layerAnimation.custom_path_data) {
            const { svgPath, ease = "power2.inOut", duration = 5, autoRotate = false } = layerAnimation.custom_path_data;
            if (svgPath && svgPath.trim() !== '') {
                const tween = gsap.to(elementRef, {
                    duration: duration,
                    ease: ease, 
                    repeat: isLooping ? -1 : 0,
                    yoyo: false,
                    delay: globalDelay,
                    motionPath: {
                        path: svgPath,
                        align: "self", 
                        alignOrigin: [0.5, 0.5],
                        autoRotate: autoRotate
                    }
                });
                activeTweens.push(tween);
            }
        } else {
            const configIdle = layerAnimation.configIdle || { speed: 1 };
            const idleProps = getIdleProps(layerAnimation.idle, configIdle);
            if (idleProps) {
                // Jika digabung dengan Entry Animation, delay-nya adalah GlobalDelay + EntryDuration
                const finalDelay = hasEntryAnimation ? (config.speed || 1.5) + globalDelay : globalDelay;
                const tween = gsap.to(elementRef, {
                    ...idleProps,
                    delay: finalDelay,
                    force3D: true,
                    autoRound: false
                });
                if (!isBuilder && trigger === 'onScroll') {
                    const triggerElement = elementRef.closest('section') || elementRef;
                    tween.scrollTrigger = ScrollTrigger.create({
                        trigger: triggerElement,
                        start: "top 85%",
                        scroller: scrollScroller,
                        animation: tween,
                        toggleActions: "play pause resume pause"
                    });
                }
                activeTweens.push(tween);
            }
        }
    }

    // -- 3. ENTRY ANIMATION (Bawaan) --
    if (hasEntryAnimation) {
        const hasEntry = config.mode === 'enter' || config.mode === 'both' || !config.mode;
        const hasExit = config.mode === 'exit' || config.mode === 'both';
        const entryProps = getAnimationProps(layerAnimation.entry, false, config, layerStyle);
            
        if (hasEntry) {
            if (config.scale !== undefined && config.scale !== 1) {
                entryProps.scale = config.scale;
            }
            const toggleActionStr = (hasExit || config.autoReverse) ? "play reverse play reverse" : "play none none reverse";
            const triggerElement = !isBuilder ? (elementRef.closest('section') || elementRef) : elementRef;

            // Pastikan delay diterapkan secara eksplisit
            entryProps.delay = globalDelay;

            const tween = gsap.from(elementRef, {
                ...entryProps,
                ...repeatConfig,
                force3D: true,
                autoRound: false,
                scrollTrigger: (!isBuilder && trigger === 'onScroll') && trigger !== 'onLoad' ? { 
                    trigger: triggerElement, 
                    start: "top 85%", 
                    scroller: scrollScroller,
                    toggleActions: toggleActionStr 
                } : null
            });
            activeTweens.push(tween);
        }
    } else if (!hasEntryAnimation && layerAnimation.idle !== 'custom_timeline' && globalDelay > 0) {
        // Fallback: Elemen yang hanya punya delay tapi tidak punya Entry dan Timeline,
        // akan disembunyikan secara harfiah, lalu dimunculkan setelah delay.
        const tween = gsap.fromTo(elementRef, 
            { opacity: 0 }, 
            { opacity: layerStyle?.opacity ?? 1, duration: 0.01, delay: globalDelay, immediateRender: true }
        );
        activeTweens.push(tween);
    }

    // Pastikan di Builder animasi sinkron sempurna dengan playhead
    if (isBuilder) {
        activeTweens.forEach(t => {
            if (t && typeof t.totalTime === 'function') {
                t.totalTime(startAtTime || 0);
            }
        });
    }

    return {
        kill: () => {
            activeTweens.forEach(t => {
                if (t.scrollTrigger) t.scrollTrigger.kill();
                t.kill();
            });
            gsap.set(elementRef, { clearProps: "all" });
        }
    };
};

export const applyExitAnimation = (elementRef, layerAnimation, layerStyle = null) => {
    return new Promise((resolve) => {
        if (!elementRef || !layerAnimation || !layerAnimation.exit) {
            resolve();
            return;
        }

        const config = layerAnimation.configExit || { speed: 1.5, direction: 'up', delay: 0 };
        const exitProps = getAnimationProps(layerAnimation.exit, true, config, layerStyle);
        
        if (config.scale !== undefined && config.scale !== 1) {
            exitProps.scale = config.scale;
        }

        // We use gsap.to for exit animations (from current to target)
        // Ensure onComplete resolves the promise
        gsap.to(elementRef, {
            ...exitProps,
            force3D: true,
            autoRound: false,
            onComplete: resolve
        });
    });
};
