const RAW_ANIMATION_STYLES = `
/* CSS Keyframes untuk animasi elemen di panel & canvas */
@keyframes b-fade-in { 0% { opacity: 0 } 50% { opacity: 1 } 100% { opacity: 0 } }
@keyframes b-slide-up { 0% { transform: translateY(15px); opacity: 0 } 40% { transform: translateY(0); opacity: 1 } 80% { transform: translateY(0); opacity: 1 } 100% { transform: translateY(-15px); opacity: 0 } }
@keyframes b-slide-down { 0% { transform: translateY(-15px); opacity: 0 } 40% { transform: translateY(0); opacity: 1 } 80% { transform: translateY(0); opacity: 1 } 100% { transform: translateY(15px); opacity: 0 } }
@keyframes b-slide-left { 0% { transform: translateX(15px); opacity: 0 } 40% { transform: translateX(0); opacity: 1 } 80% { transform: translateX(0); opacity: 1 } 100% { transform: translateX(-15px); opacity: 0 } }
@keyframes b-slide-right { 0% { transform: translateX(-15px); opacity: 0 } 40% { transform: translateX(0); opacity: 1 } 80% { transform: translateX(0); opacity: 1 } 100% { transform: translateX(15px); opacity: 0 } }
@keyframes b-pop { 0% { transform: scale(0.5); opacity: 0 } 40% { transform: scale(1.1); opacity: 1 } 50% { transform: scale(1); opacity: 1 } 80% { transform: scale(1); opacity: 1 } 100% { transform: scale(0.5); opacity: 0 } }
@keyframes b-zoom-in { 0% { transform: scale(0.2); opacity: 0 } 40% { transform: scale(1); opacity: 1 } 80% { transform: scale(1); opacity: 1 } 100% { transform: scale(1.5); opacity: 0 } }
@keyframes b-zoom-out { 0% { transform: scale(1.5); opacity: 0 } 40% { transform: scale(1); opacity: 1 } 80% { transform: scale(1); opacity: 1 } 100% { transform: scale(0.2); opacity: 0 } }
@keyframes b-typewriter { 0% { clip-path: inset(0 100% 0 0) } 50% { clip-path: inset(0 0 0 0) } 100% { clip-path: inset(0 100% 0 0) } }
@keyframes b-ascend { 0% { transform: translateY(10px) rotate(5deg); opacity: 0 } 50% { transform: translateY(0) rotate(0); opacity: 1 } 100% { transform: translateY(-10px) rotate(-5deg); opacity: 0 } }
@keyframes b-shift { 0% { transform: skewX(-20deg) translateX(10px); opacity: 0 } 50% { transform: skewX(0) translateX(0); opacity: 1 } 100% { transform: skewX(20deg) translateX(-10px); opacity: 0 } }
@keyframes b-merge { 0% { letter-spacing: 15px; opacity: 0 } 50% { letter-spacing: 2px; opacity: 1 } 100% { letter-spacing: 15px; opacity: 0 } }
@keyframes b-bounce-text { 0%, 20%, 50%, 80%, 100% { transform: translateY(0) } 40% { transform: translateY(-10px) } 60% { transform: translateY(-5px) } }
@keyframes b-pulse { 0% { transform: scale(1) } 50% { transform: scale(1.1) } 100% { transform: scale(1) } }
@keyframes b-wiggle { 0% { transform: rotate(0deg) } 25% { transform: rotate(-10deg) } 50% { transform: rotate(10deg) } 75% { transform: rotate(-10deg) } 100% { transform: rotate(0deg) } }
@keyframes b-spin { 0% { transform: rotate(0deg) } 100% { transform: rotate(360deg) } }
@keyframes b-flicker { 0% { opacity: 1 } 20% { opacity: 0.2 } 40% { opacity: 1 } 60% { opacity: 0.2 } 80% { opacity: 1 } 100% { opacity: 1 } }
@keyframes b-float { 0% { transform: translateY(0) } 50% { transform: translateY(-10px) } 100% { transform: translateY(0) } }
@keyframes b-roll { 0% { transform: translateX(-20px) rotate(-180deg); opacity: 0 } 50% { transform: translateX(0) rotate(0deg); opacity: 1 } 100% { transform: translateX(20px) rotate(180deg); opacity: 0 } }
@keyframes b-skate { 0% { transform: translateX(-15px) skewX(20deg); opacity: 0 } 50% { transform: translateX(0) skewX(0); opacity: 1 } 100% { transform: translateX(15px) skewX(-20deg); opacity: 0 } }
@keyframes b-stretch { 0% { transform: scaleX(0.2); opacity: 0 } 50% { transform: scaleX(1); opacity: 1 } 100% { transform: scaleX(0.2); opacity: 0 } }
@keyframes b-blur { 0% { filter: blur(10px); opacity: 0 } 50% { filter: blur(0px); opacity: 1 } 100% { filter: blur(10px); opacity: 0 } }
@keyframes b-breathe { 0% { transform: scale(0.9); opacity: 0.7 } 50% { transform: scale(1.05); opacity: 1 } 100% { transform: scale(0.9); opacity: 0.7 } }
@keyframes b-drift { 0% { transform: translate(-10px, 10px); opacity: 0 } 50% { transform: translate(0, 0); opacity: 1 } 100% { transform: translate(10px, -10px); opacity: 0 } }
@keyframes b-tumble { 0% { transform: perspective(400px) rotateX(-90deg); opacity: 0 } 50% { transform: perspective(400px) rotateX(0deg); opacity: 1 } 100% { transform: perspective(400px) rotateX(90deg); opacity: 0 } }
@keyframes b-stomp { 0% { transform: scale(1.5); opacity: 0 } 20% { transform: scale(0.9); opacity: 1 } 30% { transform: scale(1.05); opacity: 1 } 50% { transform: scale(1); opacity: 1 } 100% { transform: scale(1.5); opacity: 0 } }
@keyframes b-neon { 0%, 100% { text-shadow: 0 0 5px #fff, 0 0 10px #fff, 0 0 20px #e11d48, 0 0 40px #e11d48; } 50% { text-shadow: 0 0 2px #fff, 0 0 5px #fff, 0 0 10px #e11d48, 0 0 20px #e11d48; } }
@keyframes b-scrapbook { 0% { transform: rotate(10deg) scale(0.8); opacity: 0 } 50% { transform: rotate(0deg) scale(1); opacity: 1 } 100% { transform: rotate(-10deg) scale(0.8); opacity: 0 } }
@keyframes b-wave { 0% { transform: translateY(0); } 25% { transform: translateY(-5px); } 50% { transform: translateY(0); } 75% { transform: translateY(5px); } 100% { transform: translateY(0); } }
@keyframes b-drop { 0% { transform: translateY(-30px); opacity: 0 } 30% { transform: translateY(0); opacity: 1 } 50% { transform: translateY(-10px); } 70% { transform: translateY(0); } 100% { transform: translateY(0); opacity: 1 } }
@keyframes b-swing { 0% { transform: rotate(-10deg); } 50% { transform: rotate(10deg); } 100% { transform: rotate(-10deg); } }
@keyframes b-float-sway { 0% { transform: translateY(0) rotate(-3deg); } 50% { transform: translateY(-10px) rotate(3deg); } 100% { transform: translateY(0) rotate(-3deg); } }
@keyframes b-heartbeat { 0% { transform: scale(1); } 14% { transform: scale(1.3); } 28% { transform: scale(1); } 42% { transform: scale(1.3); } 70% { transform: scale(1); } }
@keyframes b-jello { 11.1% { transform: none } 22.2% { transform: skewX(-12.5deg) skewY(-12.5deg) } 33.3% { transform: skewX(6.25deg) skewY(6.25deg) } 44.4% { transform: skewX(-3.125deg) skewY(-3.125deg) } 55.5% { transform: skewX(1.5625deg) skewY(1.5625deg) } 66.6% { transform: skewX(-0.78125deg) skewY(-0.78125deg) } 77.7% { transform: skewX(0.390625deg) skewY(0.390625deg) } 88.8% { transform: skewX(-0.1953125deg) skewY(-0.1953125deg) } 100% { transform: none } }

/* CSS Keyframes murni (1 putaran saja untuk di canvas, tanpa infinite, kecuali looping dinyalakan) */
@keyframes c-fade-in { 0% { opacity: 0 } 100% { opacity: 1 } }
@keyframes c-slide-up { 0% { transform: translateY(20px); opacity: 0 } 100% { transform: translateY(0); opacity: 1 } }
@keyframes c-slide-down { 0% { transform: translateY(-20px); opacity: 0 } 100% { transform: translateY(0); opacity: 1 } }
@keyframes c-slide-left { 0% { transform: translateX(20px); opacity: 0 } 100% { transform: translateX(0); opacity: 1 } }
@keyframes c-slide-right { 0% { transform: translateX(-20px); opacity: 0 } 100% { transform: translateX(0); opacity: 1 } }
@keyframes c-pop { 0% { transform: scale(0.5); opacity: 0 } 70% { transform: scale(1.1); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }
@keyframes c-zoom-in { 0% { transform: scale(0.5); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
@keyframes c-zoom-out { 0% { transform: scale(1.5); opacity: 0 } 100% { transform: scale(1); opacity: 1 } }
@keyframes c-typewriter { 0% { clip-path: inset(0 100% 0 0) } 100% { clip-path: inset(0 0 0 0) } }
@keyframes c-ascend { 0% { transform: translateY(20px) rotate(5deg); opacity: 0 } 100% { transform: translateY(0) rotate(0); opacity: 1 } }
@keyframes c-shift { 0% { transform: skewX(-20deg) translateX(20px); opacity: 0 } 100% { transform: skewX(0) translateX(0); opacity: 1 } }
@keyframes c-merge { 0% { letter-spacing: 15px; opacity: 0 } 100% { letter-spacing: normal; opacity: 1 } }
@keyframes c-bounce-text { 0%, 20%, 50%, 80%, 100% { transform: translateY(0) } 40% { transform: translateY(-15px) } 60% { transform: translateY(-7px) } }
@keyframes c-roll { 0% { transform: translateX(-40px) rotate(-180deg); opacity: 0 } 100% { transform: translateX(0) rotate(0deg); opacity: 1 } }
@keyframes c-skate { 0% { transform: translateX(-30px) skewX(20deg); opacity: 0 } 100% { transform: translateX(0) skewX(0); opacity: 1 } }
@keyframes c-stretch { 0% { transform: scaleX(0.2); opacity: 0 } 100% { transform: scaleX(1); opacity: 1 } }
@keyframes c-blur { 0% { filter: blur(10px); opacity: 0 } 100% { filter: blur(0px); opacity: 1 } }
@keyframes c-breathe { 0% { transform: scale(0.9); opacity: 0.7 } 100% { transform: scale(1); opacity: 1 } }
@keyframes c-drift { 0% { transform: translate(-10px, 10px); opacity: 0 } 100% { transform: translate(0, 0); opacity: 1 } }
@keyframes c-tumble { 0% { transform: perspective(400px) rotateX(-90deg); opacity: 0 } 100% { transform: perspective(400px) rotateX(0deg); opacity: 1 } }
@keyframes c-stomp { 0% { transform: scale(1.5); opacity: 0 } 50% { transform: scale(0.9); opacity: 1 } 70% { transform: scale(1.05); opacity: 1 } 100% { transform: scale(1); opacity: 1 } }
@keyframes c-scrapbook { 0% { transform: rotate(10deg) scale(0.8); opacity: 0 } 100% { transform: rotate(0deg) scale(1); opacity: 1 } }
@keyframes c-drop { 0% { transform: translateY(-50px); opacity: 0 } 50% { transform: translateY(0); opacity: 1 } 70% { transform: translateY(-10px); } 90% { transform: translateY(0); } 100% { transform: translateY(0); opacity: 1 } }
@keyframes b-plant-grow { 0% { transform: scale(0.2) rotate(-10deg); opacity: 0; transform-origin: bottom center; } 40% { transform: scale(1.1) rotate(5deg); opacity: 1; transform-origin: bottom center; } 80% { transform: scale(1) rotate(0deg); opacity: 1; transform-origin: bottom center; } 100% { transform: scale(0.2) rotate(10deg); opacity: 0; transform-origin: bottom center; } }
@keyframes c-plant-grow { 0% { transform: scale(0.2) rotate(-10deg); opacity: 0; transform-origin: bottom center; } 70% { transform: scale(1.1) rotate(5deg); opacity: 1; transform-origin: bottom center; } 100% { transform: scale(1) rotate(0deg); opacity: 1; transform-origin: bottom center; } }
`;

export const ANIMATION_CATEGORIES = [
    {
        name: 'Disarankan',
        items: [
            { id: 'typewriter', label: 'Mesin Tik', anim: 'b-typewriter 3s steps(3, end) infinite', canvasAnim: 'c-typewriter' },
            { id: 'ascend', label: 'Naik', anim: 'b-ascend 2s infinite', canvasAnim: 'c-ascend' },
            { id: 'shift', label: 'Geser', anim: 'b-shift 2s infinite', canvasAnim: 'c-shift' },
            { id: 'merge', label: 'Gabungkan', anim: 'b-merge 2s infinite', canvasAnim: 'c-merge' },
            { id: 'block-reveal', label: 'Balok Lewat', anim: 'b-typewriter 2s infinite', canvasAnim: 'c-typewriter' },
            { id: 'pop', label: 'Meletup', anim: 'b-pop 2.5s infinite', canvasAnim: 'c-pop' },
            { id: 'bounce-text', label: 'Bounce', anim: 'b-bounce-text 2s infinite', canvasAnim: 'c-bounce-text' },
            { id: 'roll', label: 'Bergulung', anim: 'b-roll 2.5s infinite', canvasAnim: 'c-roll' },
            { id: 'skate', label: 'Luncur', anim: 'b-skate 2.5s infinite', canvasAnim: 'c-skate' },
            { id: 'stretch', label: 'Membentang', anim: 'b-stretch 2.5s infinite', canvasAnim: 'c-stretch' },
            { id: 'clarify', label: 'Perjelas', anim: 'b-blur 2.5s infinite', canvasAnim: 'c-blur' }
        ]
    },
    {
        name: 'Umum',
        items: [
            { id: 'slide-up', label: 'Terbit', anim: 'b-slide-up 2s infinite', canvasAnim: 'c-slide-up' },
            { id: 'slide-down', label: 'Turun', anim: 'b-slide-down 2s infinite', canvasAnim: 'c-slide-down' },
            { id: 'slide-left', label: 'Geser Kiri', anim: 'b-slide-left 2s infinite', canvasAnim: 'c-slide-left' },
            { id: 'slide-right', label: 'Geser Kanan', anim: 'b-slide-right 2s infinite', canvasAnim: 'c-slide-right' },
            { id: 'fade-in', label: 'Pudar', anim: 'b-fade-in 2s infinite', canvasAnim: 'c-fade-in' },
            { id: 'zoom-in', label: 'Zoom In', anim: 'b-zoom-in 2s infinite', canvasAnim: 'c-zoom-in' },
            { id: 'zoom-out', label: 'Zoom Out', anim: 'b-zoom-out 2s infinite', canvasAnim: 'c-zoom-out' },
            { id: 'wipe', label: 'Usap', anim: 'b-typewriter 2s infinite', canvasAnim: 'c-typewriter' },
            { id: 'breathe', label: 'Tarik Napas', anim: 'b-breathe 2.5s infinite', canvasAnim: 'c-breathe' },
            { id: 'stomp', label: 'Hentak', anim: 'b-stomp 2s infinite', canvasAnim: 'c-stomp' },
            { id: 'drift', label: 'Hanyut', anim: 'b-drift 3s infinite', canvasAnim: 'c-drift' },
            { id: 'tumble', label: 'Terhuyung', anim: 'b-tumble 3s infinite', canvasAnim: 'c-tumble' },
            { id: 'scrapbook', label: 'Kliping', anim: 'b-scrapbook 2.5s infinite', canvasAnim: 'c-scrapbook' },
            { id: 'drop', label: 'Jatuh', anim: 'b-drop 2s infinite', canvasAnim: 'c-drop' },
            { id: 'plant-grow', label: 'Tumbuh', anim: 'b-plant-grow 2.5s infinite', canvasAnim: 'c-plant-grow' }
        ]
    },
    {
        name: 'Efek Tambahan (Berkelanjutan)',
        isContinuous: true,
        items: [
            { id: 'wiggle', label: 'Goyang', anim: 'b-wiggle 1s infinite', canvasAnim: 'b-wiggle' },
            { id: 'spin', label: 'Putar', anim: 'b-spin 3s linear infinite', canvasAnim: 'b-spin' },
            { id: 'flicker', label: 'Kedip', anim: 'b-flicker 0.8s infinite', canvasAnim: 'b-flicker' },
            { id: 'pulse', label: 'Denyut', anim: 'b-pulse 1.5s infinite', canvasAnim: 'b-pulse' },
            { id: 'neon', label: 'Neon', anim: 'b-neon 1.5s infinite', canvasAnim: 'b-neon' },
            { id: 'float', label: 'Melayang', anim: 'b-float 3s ease-in-out infinite', canvasAnim: 'b-float' },
            { id: 'wave', label: 'Gelombang', anim: 'b-wave 2s infinite', canvasAnim: 'b-wave' },
            { id: 'swing', label: 'Ayun', anim: 'b-swing 2s infinite', canvasAnim: 'b-swing' },
            { id: 'heartbeat', label: 'Detak Jantung', anim: 'b-heartbeat 1.5s infinite', canvasAnim: 'b-heartbeat' },
            { id: 'jello', label: 'Jeli', anim: 'b-jello 2s infinite', canvasAnim: 'b-jello' },
            { id: 'float-sway', label: 'Melayang & Ayun', anim: 'b-float-sway 4s ease-in-out infinite', canvasAnim: 'b-float-sway' },
            { id: 'wind-sway', label: 'Ayun Fisika', anim: 'b-swing 2s infinite', canvasAnim: 'b-swing' }
        ]
    }
];

// Automatically generate CSS classes mapping to canvasAnim or anim based on isContinuous
export const ANIMATION_STYLES = RAW_ANIMATION_STYLES + '\n' + ANIMATION_CATEGORIES.flatMap(cat => 
    cat.items.map(anim => {
        // Use c-* for non-continuous (forwards), or b-* for continuous (infinite)
        if (cat.isContinuous) {
            return `.animate-${anim.id} { animation: ${anim.anim}; }`;
        } else {
            return `.animate-${anim.id} { animation: ${anim.canvasAnim} 2s forwards; }`;
        }
    })
).join('\n');
