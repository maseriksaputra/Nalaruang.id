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

export const applyAnimation = (elementRef, layerAnimation, isBuilder = false, layerStyle = null) => {
    if (!elementRef || !layerAnimation) return null;

    const isLooping = layerAnimation.isLooping || false;
    const repeatConfig = isLooping ? { repeat: -1, yoyo: true } : {};
    
    const activeTweens = [];

    // Get config without mutating state
    const config = layerAnimation.config || { mode: 'enter', speed: 1.5, direction: 'up', trigger: 'onLoad' };

    // Custom GSAP Code
    if (layerAnimation.custom) {
        try {
            const customObj = new Function(`return ${layerAnimation.custom}`)();
            const tween = gsap.from(elementRef, {
                ...customObj,
                ...repeatConfig,
                scrollTrigger: isBuilder ? null : { trigger: elementRef, start: "top 80%", toggleActions: "play none none reverse" }
            });
            activeTweens.push(tween);
            return { kill: () => activeTweens.forEach(t => t.kill()) };
        } catch (e) {
            console.error('Invalid custom GSAP config', e);
        }
    }

    // Main Animation (Entry / Exit / Both)
    if (layerAnimation.entry) {
        const hasEntry = config.mode === 'enter' || config.mode === 'both' || !config.mode;
        const hasExit = config.mode === 'exit' || config.mode === 'both';
        
        const entryProps = getAnimationProps(layerAnimation.entry, false, config, layerStyle);
            
        if (hasEntry) {
            if (config.scale !== undefined && config.scale !== 1) {
                entryProps.scale = config.scale;
            }
            const toggleActionStr = (hasExit || config.autoReverse) ? "play reverse play reverse" : "play none none reverse";
            const tween = gsap.from(elementRef, {
                ...entryProps,
                ...repeatConfig,
                force3D: true,
                autoRound: false,
                scrollTrigger: (!isBuilder || config.trigger === 'onScroll') && config.trigger !== 'onLoad' ? { 
                    trigger: elementRef, 
                    start: "top 85%", 
                    toggleActions: toggleActionStr 
                } : null
            });
            activeTweens.push(tween);
        }
    } else if (!isBuilder && config.delay && config.delay > 0) {
        // Fallback: If no entry animation but it has a timeline delay, hide it until delay
        const tween = gsap.fromTo(elementRef, 
            { opacity: 0 }, 
            { opacity: 1, duration: 0.01, delay: config.delay, immediateRender: true }
        );
        activeTweens.push(tween);
    }

    // Idle Animation (Continuous)
    if (layerAnimation.idle) {
        if (layerAnimation.idle === 'custom_path' && layerAnimation.custom_path_data) {
            const { 
                svgPath, 
                ease = "power2.inOut",
                duration = 5,
                autoRotate = false
            } = layerAnimation.custom_path_data;

            if (svgPath && svgPath.trim() !== '') {
                const tween = gsap.to(elementRef, {
                    duration: duration,
                    ease: ease, 
                    repeat: isLooping ? -1 : 0,
                    yoyo: false,
                    motionPath: {
                        path: svgPath,
                        align: "self", 
                        alignOrigin: [0.5, 0.5], // Tumpuan animasi persis di tengah elemen
                        autoRotate: autoRotate
                    }
                });
                activeTweens.push(tween);
            }
        } else if (layerAnimation.idle === 'custom_timeline' && layerAnimation.custom_keyframes && layerAnimation.custom_keyframes.length > 0) {
            const tl = gsap.timeline({
                repeat: isLooping ? -1 : 0,
                scrollTrigger: (!isBuilder && config.trigger === 'onScroll') ? {
                    trigger: elementRef,
                    start: "top 85%",
                    toggleActions: isLooping ? "play pause resume pause" : "play none none reverse"
                } : null
            });
            
            const baseX = layerStyle?.x || 0;
            const baseY = layerStyle?.y || 0;
            
            // GSAP already starts from current transform matrix applied by React.
            // We only need to reset opacity/scale/rotation if they were overridden, 
            // but for a timeline it's safer to just animate 'to' from the current state.
            gsap.set(elementRef, {
                opacity: layerStyle?.opacity ?? 1,
            });
            
            // Loop dari titik 1 ke seterusnya
            for (let i = 0; i < layerAnimation.custom_keyframes.length; i++) {
                const kf = layerAnimation.custom_keyframes[i];
                if (i === 0) {
                    tl.set(elementRef, {
                        x: kf.x - baseX,
                        y: kf.y - baseY,
                        opacity: kf.opacity ?? 1,
                        scale: kf.scale ?? 1,
                        rotation: kf.rotation ?? 0,
                    });
                } else {
                    tl.to(elementRef, {
                        x: kf.x - baseX,
                        y: kf.y - baseY,
                        opacity: kf.opacity ?? 1,
                        scale: kf.scale ?? 1,
                        rotation: kf.rotation ?? 0,
                        duration: kf.duration || 1,
                        ease: kf.ease || "sine.inOut",
                        force3D: true,
                        autoRound: false
                    });
                }
            }
            
            activeTweens.push(tl);
        } else {
            const configIdle = layerAnimation.configIdle || { speed: 1 };
            const idleProps = getIdleProps(layerAnimation.idle, configIdle);
            if (idleProps) {
                const delay = layerAnimation.entry ? (config.speed || 1.5) + (config.delay || 0) : (config.delay || 0);
                const tween = gsap.to(elementRef, {
                    ...idleProps,
                    delay: delay,
                    force3D: true,
                    autoRound: false
                });
                if (!isBuilder && config.trigger === 'onScroll') {
                    tween.scrollTrigger = ScrollTrigger.create({
                        trigger: elementRef,
                        start: "top 85%",
                        animation: tween,
                        toggleActions: "play pause resume pause"
                    });
                }
                activeTweens.push(tween);
            }
        }
    }


    return {
        kill: () => {
            activeTweens.forEach(t => {
                if (t.scrollTrigger) t.scrollTrigger.kill();
                t.kill();
            });
            // Reset transforms
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
