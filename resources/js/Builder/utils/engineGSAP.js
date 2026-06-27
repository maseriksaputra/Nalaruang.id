import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin, TextPlugin);
ScrollTrigger.config({ ignoreMobileResize: true });

const getAnimationProps = (type, isExit = false, config = {}, layerStyle = null) => {
    const duration = parseFloat(config.speed) || 1.5;
    const direction = config.direction || 'default';
    const delay = parseFloat(config.delay) || 0;
    
    let fromProps = { opacity: 0 };
    let toProps = { opacity: layerStyle?.opacity !== undefined ? parseFloat(layerStyle.opacity) : 1, duration, delay, ease: "power2.out" };

    const dirVal = (val) => {
        if (direction === 'top') return { y: isExit ? -val : val };
        if (direction === 'bottom') return { y: isExit ? val : -val };
        if (direction === 'left') return { x: isExit ? -val : val };
        if (direction === 'right') return { x: isExit ? val : -val };
        return { y: val };
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
                Object.assign(fromProps, dirVal(30));
                toProps.x = 0; toProps.y = 0;
            } else {
                if (type === 'slide-up') { fromProps.y = isExit ? -30 : 30; toProps.y = 0; }
                if (type === 'slide-down') { fromProps.y = isExit ? 30 : -30; toProps.y = 0; }
                if (type === 'slide-left') { fromProps.x = isExit ? -50 : 50; toProps.x = 0; }
                if (type === 'slide-right') { fromProps.x = isExit ? 50 : -50; toProps.x = 0; }
            }
            break;
        case 'pop': fromProps.scale = 0.5; toProps.scale = 1; toProps.ease = "back.out(1.7)"; break;
        case 'zoom-in': fromProps.scale = 0.5; toProps.scale = 1; break;
        case 'zoom-out': fromProps.scale = 1.2; toProps.scale = 1; break;
        case 'ascend': 
            Object.assign(fromProps, direction !== 'default' ? dirVal(30) : { y: 30 });
            toProps.y = 0; toProps.x = 0;
            fromProps.rotation = 3; toProps.rotation = 0;
            toProps.ease = "back.out(1.2)"; 
            break;
        case 'shift': 
            Object.assign(fromProps, direction !== 'default' ? dirVal(20) : { x: 20 });
            toProps.x = 0; toProps.y = 0;
            fromProps.skewX = -10; toProps.skewX = 0;
            break;
        case 'bounce-text': 
            Object.assign(fromProps, direction !== 'default' ? dirVal(20) : { y: -20 });
            toProps.y = 0; toProps.x = 0;
            toProps.ease = "bounce.out"; 
            break;
        case 'merge': fromProps.letterSpacing = "15px"; toProps.letterSpacing = "normal"; break;
        case 'tracking-out': fromProps.letterSpacing = "15px"; fromProps.opacity = 0; toProps.letterSpacing = "normal"; toProps.opacity = 1; break;
        case 'typewriter':
        case 'block-reveal': 
        case 'wipe':
            if (direction === 'right' || direction === 'default') fromProps.clipPath = "inset(0 100% 0 0)";
            if (direction === 'left') fromProps.clipPath = "inset(0 0 0 100%)";
            if (direction === 'down') fromProps.clipPath = "inset(0 0 100% 0)";
            if (direction === 'up') fromProps.clipPath = "inset(100% 0 0 0)";
            toProps.clipPath = "inset(0% 0% 0% 0%)";
            toProps.ease = "power1.inOut"; 
            break;
        case 'roll': fromProps.rotationX = -90; fromProps.x = -50; toProps.rotationX = 0; toProps.x = 0; break;
        case 'skate': fromProps.skewX = 20; fromProps.x = -50; toProps.skewX = 0; toProps.x = 0; break;
        case 'stretch': fromProps.scaleX = 0.2; toProps.scaleX = 1; break;
        case 'clarify':
        case 'blur': fromProps.filter = "blur(10px)"; toProps.filter = "blur(0px)"; break;
        case 'breathe': fromProps.scale = 0.95; fromProps.opacity = 0.7; toProps.scale = 1; toProps.opacity = 1; break;
        case 'drift': 
            if (direction !== 'default') Object.assign(fromProps, dirVal(20));
            else { fromProps.x = -15; fromProps.y = 15; }
            toProps.x = 0; toProps.y = 0;
            break;
        case 'tumble': fromProps.rotationX = -45; fromProps.transformPerspective = 400; toProps.rotationX = 0; break;
        case 'stomp': fromProps.scale = 1.2; toProps.scale = 1; toProps.ease = "power3.in"; break;
        case 'neon': fromProps.textShadow = "0 0 10px #e11d48, 0 0 20px #e11d48"; toProps.textShadow = "none"; break;
        case 'scrapbook': fromProps.rotation = 5; fromProps.scale = 0.9; toProps.rotation = 0; toProps.scale = 1; break;
        case 'drop': fromProps.y = -30; toProps.y = 0; toProps.ease = "bounce.out"; break;
        case 'plant-grow': 
            fromProps.scale = 0.2; toProps.scale = 1;
            fromProps.rotation = -10; toProps.rotation = 0;
            toProps.transformOrigin = "bottom center"; 
            toProps.ease = "back.out(1.5)"; 
            break;
        case 'custom_keyframe':
            delete fromProps.opacity;
            if (layerStyle && config.startX !== undefined && config.startY !== undefined) {
                fromProps.x = isExit ? -(config.startX - layerStyle.x) : (config.startX - layerStyle.x);
                fromProps.y = isExit ? -(config.startY - layerStyle.y) : (config.startY - layerStyle.y);
                if (config.startWidth !== undefined) fromProps.width = config.startWidth;
                if (config.startHeight !== undefined) fromProps.height = config.startHeight;
                toProps.x = 0; toProps.y = 0;
            } else {
                fromProps.x = isExit ? -(config.offsetX || 0) : (config.offsetX || 0);
                fromProps.y = isExit ? -(config.offsetY || 0) : (config.offsetY || 0);
                toProps.x = 0; toProps.y = 0;
            }
            break;
        default: break;
    }
    return { fromProps, toProps };
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
            const swingSpeed = config.swingSpeed ?? 50;
            
            const maxRotation = 2 + (windStrength / 100 * 15);
            const speedFactor = Math.max(0.1, swingSpeed / 50);
            const duration = (6 - (stiffness / 100 * 5)) / speedFactor;
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

export const applyAnimation = (elementRef, layerAnimation, isBuilder = false, styleParams = {}, playheadStart = 0, isCoverPage = false, isChildOfGroup = false) => {
    if (!elementRef || !layerAnimation) return;
    
    const activeTweens = [];
    const scrollTriggerTimeouts = [];
    const { isLooping = false } = layerAnimation;
    const repeatConfig = isLooping ? { repeat: -1, yoyo: true } : {};
    
    // Temukan scroll container untuk Preview Modal. Jika tidak ada, gunakan default window
    const scrollScroller = !isBuilder && document.getElementById('viewer-scroll-container') 
                            ? document.getElementById('viewer-scroll-container') 
                            : undefined;

    const config = layerAnimation.config || { mode: 'enter', speed: 1.5, direction: 'up', trigger: 'onScroll' };
    
    // FORCE onLoad for elements ON the cover page, FORCE onScroll for elements NOT on the cover page!
    const trigger = (!isBuilder && isCoverPage) ? 'onLoad' : (!isBuilder ? 'onScroll' : (config.trigger || 'onLoad'));
    const isScrollTriggered = (!isBuilder && trigger === 'onScroll' && trigger !== 'onLoad');
    
    // Disable entry animation if element is a child of a canvas_group (parent will animate it)
    const hasEntryAnimation = !!layerAnimation.entry;
    
    // PERF FIX: Beri nafas (jeda) 800ms khusus untuk halaman cover agar:
    // 1. Browser selesai melakukan Initial Paint (merender gambar & font).
    // 2. Animasi modal Preview/Demo selesai (transisi fade/slide in), sehingga user bisa melihat animasinya dari awal.
    const baseDelay = (!isBuilder && isCoverPage) ? 0.8 : 0;
    const globalDelay = (parseFloat(config.delay) || 0) + baseDelay;

    console.log(`[engineGSAP] Applying to element`, elementRef, {
        isBuilder, trigger, isScrollTriggered, hasEntryAnimation, globalDelay, config
    });

    // Custom GSAP Code
    if (layerAnimation.custom) {
        try {
            const customObj = new Function(`return ${layerAnimation.custom}`)();
            const triggerElement = elementRef;
            const isScrollTriggered = !isBuilder;

            const tween = gsap.from(elementRef, {
                ...customObj,
                ...repeatConfig,
                paused: isScrollTriggered
            });
            activeTweens.push(tween);

            if (isScrollTriggered) {
                ScrollTrigger.create({
                    trigger: triggerElement,
                    start: "top bottom",
                    scroller: scrollScroller,
                    animation: tween,
                    toggleActions: "play none none none",
                    once: true
                });
            }
            
            return { kill: () => {
                scrollTriggerTimeouts.forEach(t => clearTimeout(t));
                activeTweens.forEach(t => {
                    if (t.scrollTrigger) t.scrollTrigger.kill();
                    t.kill();
                });
            }};
        } catch (e) {
            console.error('Invalid custom GSAP config', e);
        }
    }

    // -- 1. CUSTOM TIMELINE (Keyframes) LOGIC --
    // We handle this entirely separately to mimic CapCut/Canva absolute timelines
    if (layerAnimation.idle === 'custom_timeline' && layerAnimation.custom_keyframes && layerAnimation.custom_keyframes.length > 0) {
        const triggerElement = elementRef;
        const keyframes = layerAnimation.custom_keyframes;
        
        const baseX = parseFloat(styleParams?.x) || 0;
        const baseY = parseFloat(styleParams?.y) || 0;
        const getValidNum = (val, fallback) => {
            if (val === undefined || val === null || val === '') return fallback;
            const parsed = parseFloat(val);
            return isNaN(parsed) ? fallback : parsed;
        };

        const firstKf = keyframes[0];
        
        // Setup initial state: HIDE element entirely during global delay if there is no entry animation overriding it
        // FIX: Remove 'globalDelay > 0 ? 0 :' to ensure element stays at first keyframe state during delay
        if (!hasEntryAnimation) {
            gsap.set(elementRef, {
                x: getValidNum(firstKf.x, baseX) - baseX,
                y: getValidNum(firstKf.y, baseY) - baseY,
                scale: getValidNum(firstKf.scale, styleParams?.scale ?? 1),
                rotation: getValidNum(firstKf.rotation, styleParams?.rotation ?? 0),
                opacity: getValidNum(firstKf.opacity, styleParams?.opacity ?? 1),
                ...(firstKf.width !== undefined && { width: firstKf.width }),
                ...(firstKf.height !== undefined && { height: firstKf.height })
            });
        }

        const tl = gsap.timeline({
            repeat: (isLooping && !isBuilder) ? -1 : 0,
            delay: globalDelay,
            paused: (!isBuilder && trigger === 'onScroll')
        });

        // Waktu absolut timeline dimulai dari 0 (yang mana aslinya sudah ter-delay oleh globalDelay)
        if (!hasEntryAnimation && globalDelay > 0) {
            tl.set(elementRef, { opacity: getValidNum(firstKf.opacity, styleParams?.opacity ?? 1), immediateRender: false, overwrite: false }, 0);
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
                    opacity: getValidNum(kf.opacity, styleParams?.opacity ?? 1),
                    scale: getValidNum(kf.scale, styleParams?.scale ?? 1),
                    rotation: getValidNum(kf.rotation, styleParams?.rotation ?? 0),
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
                    opacity: getValidNum(kf.opacity, styleParams?.opacity ?? 1),
                    scale: getValidNum(kf.scale, styleParams?.scale ?? 1),
                    rotation: getValidNum(kf.rotation, styleParams?.rotation ?? 0),
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

        if (!isBuilder && trigger === 'onScroll') {
            ScrollTrigger.create({
                trigger: triggerElement,
                start: "top 95%",
                scroller: scrollScroller,
                animation: tl,
                // If looping (pulse, swing, etc), pause when out of view and resume when in view.
                // If not looping (fade in, slide in), play ONCE and never reverse or reset.
                toggleActions: isLooping ? "play pause resume pause" : "play none none none",
                once: !isLooping
            });
        }
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
                    immediateRender: true,
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
                const isScrollTriggered = (!isBuilder && trigger === 'onScroll');
                const tween = gsap.to(elementRef, {
                    ...idleProps,
                    delay: finalDelay,
                    force3D: true,
                    autoRound: false,
                    paused: isScrollTriggered,
                    immediateRender: true
                });
                activeTweens.push(tween);
                
                if (isScrollTriggered) {
                    ScrollTrigger.create({
                        trigger: elementRef,
                        start: "top 95%",
                        scroller: scrollScroller,
                        animation: tween,
                        toggleActions: "play pause resume pause"
                    });
                }
            }
        }
    }

    // -- 3. ENTRY ANIMATION (Bawaan) --
    if (hasEntryAnimation) {
        const hasEntry = config.mode === 'enter' || config.mode === 'both' || !config.mode;
        const hasExit = config.mode === 'exit' || config.mode === 'both';
        const { fromProps, toProps } = getAnimationProps(layerAnimation.entry, false, config, styleParams);
            
        if (hasEntry) {
            if (config.scale !== undefined && config.scale !== 1) {
                fromProps.scale = config.scale;
                toProps.scale = 1;
            }
            const isOnce = !(hasExit || config.autoReverse);
            const toggleActionStr = (hasExit || config.autoReverse) ? "play reverse play reverse" : "play none none none";
            const triggerElement = elementRef;


            const isScrollTriggered = (!isBuilder && trigger === 'onScroll' && trigger !== 'onLoad');

            // Set start state immediately and animate ke tujuan setelah delay
            // Menggunakan timeline menjamin konsistensi mutlak selama delay
            const tl = gsap.timeline({ paused: isScrollTriggered });
            
            // Set starting values
            tl.set(elementRef, { ...fromProps, force3D: true, immediateRender: true });
            
            // Animate to end values after delay
            tl.to(elementRef, {
                ...toProps,
                ...repeatConfig,
                duration: toProps.duration || 1.5,
                force3D: true,
                autoRound: false,
                ease: toProps.ease || "power2.out"
            }, globalDelay > 0 ? `+=${globalDelay}` : "<");

            activeTweens.push(tl);
            
            // PENTING: Paksa timeline untuk render frame ke-0 secara instan.
            // Ini mencegah efek lompat (flashing) akibat React me-render elemen pada opacity 1 sebelum GSAP sempat menindihnya.
            tl.progress(0);

            if (isScrollTriggered) {
                if (!elementRef) return;
                
                const toggleActionStr = isLooping ? "play pause resume pause" : "play none none none";
                const isOnce = !isLooping;

                ScrollTrigger.create({
                    trigger: triggerElement,
                    start: "top 95%",
                    scroller: scrollScroller,
                    animation: tl,
                    toggleActions: toggleActionStr,
                    once: isOnce
                });
            }
        }
    } else if (!hasEntryAnimation && layerAnimation.idle !== 'custom_timeline' && globalDelay > 0) {
        // Fallback: Elemen yang hanya punya delay tapi tidak punya Entry dan Timeline,
        // akan disembunyikan secara harfiah, lalu dimunculkan setelah delay.
        const tweenProps = { opacity: styleParams?.opacity ?? 1, duration: 0.01, delay: globalDelay, immediateRender: true };
        
        const isScrollTriggered = (!isBuilder && trigger === 'onScroll');
        if (isScrollTriggered) {
            tweenProps.paused = true;
        }

        const tween = gsap.fromTo(elementRef, 
            { opacity: 0 }, 
            tweenProps
        );
        activeTweens.push(tween);

        if (isScrollTriggered) {
            ScrollTrigger.create({
                trigger: elementRef,
                start: "top bottom",
                scroller: scrollScroller,
                animation: tween,
                toggleActions: "play none none none",
                once: true
            });
        }
    }

    // Pastikan di Builder animasi sinkron sempurna dengan playhead
    if (isBuilder) {
        // Balik urutan agar Entry dievaluasi duluan, baru ditimpa oleh Idle jika Idle sedang aktif
        [...activeTweens].reverse().forEach(t => {
            if (t && typeof t.totalTime === 'function') {
                t.totalTime(playheadStart || 0);
            }
        });
    }

    return {
        kill: () => {
            scrollTriggerTimeouts.forEach(t => clearTimeout(t));
            activeTweens.forEach(t => {
                if (t.scrollTrigger) t.scrollTrigger.kill();
                t.kill();
            });
            gsap.set(elementRef, { clearProps: "all" });
        },
        pause: () => {
            activeTweens.forEach(t => {
                if (t && typeof t.pause === 'function') t.pause();
            });
        },
        play: () => {
            activeTweens.forEach(t => {
                if (t && typeof t.play === 'function') t.play();
            });
        }
    };
};

export const applyExitAnimation = (elementRef, layerAnimation, layerStyle = null, isChildOfGroup = false) => {
    return new Promise((resolve) => {
        if (!elementRef || !layerAnimation || !layerAnimation.exit || isChildOfGroup) {
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
