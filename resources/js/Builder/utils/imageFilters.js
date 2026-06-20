// resources/js/Builder/utils/imageFilters.js

const lerp = (start, end, intensity) => start + (end - start) * (intensity / 100);

export const IMAGE_FILTERS = [
    // Dasar
    { 
        id: 'none', name: 'Normal', category: 'Dasar', 
        getCss: () => '',
        getOverlay: () => null
    },

    // A. Efek Warna & Toning (Color Grading & Toning)
    { 
        id: 'teal_orange', name: 'Teal & Orange', category: 'Warna & Toning', 
        getCss: (i) => `contrast(${lerp(1, 1.3, i)}) saturate(${lerp(1, 1.4, i)}) hue-rotate(${lerp(0, -15, i)}deg) sepia(${lerp(0, 0.2, i)})`
    },
    { 
        id: 'bleach_bypass', name: 'Bleach Bypass', category: 'Warna & Toning', 
        getCss: (i) => `contrast(${lerp(1, 1.6, i)}) saturate(${lerp(1, 0.4, i)}) brightness(${lerp(1, 0.9, i)})`
    },
    { 
        id: 'split_tone', name: 'Split Tone', category: 'Warna & Toning', 
        getCss: (i) => `sepia(${lerp(0, 0.5, i)}) hue-rotate(${lerp(0, 200, i)}deg) saturate(${lerp(1, 1.5, i)}) contrast(${lerp(1, 1.1, i)})`
    },
    { 
        id: 'color_splash', name: 'Color Splash', category: 'Warna & Toning', 
        getCss: (i) => `saturate(${lerp(1, 3, i)}) contrast(${lerp(1, 1.2, i)})`
    },
    { 
        id: 'technicolor', name: 'Technicolor', category: 'Warna & Toning', 
        getCss: (i) => `contrast(${lerp(1, 1.4, i)}) saturate(${lerp(1, 1.8, i)}) sepia(${lerp(0, 0.2, i)}) hue-rotate(${lerp(0, -5, i)}deg)`
    },
    { 
        id: 'kodachrome', name: 'Kodachrome', category: 'Warna & Toning', 
        getCss: (i) => `contrast(${lerp(1, 1.3, i)}) saturate(${lerp(1, 1.2, i)}) sepia(${lerp(0, 0.1, i)}) brightness(${lerp(1, 1.05, i)})`
    },
    { 
        id: 'polaroid', name: 'Polaroid', category: 'Warna & Toning', 
        getCss: (i) => `sepia(${lerp(0, 0.4, i)}) contrast(${lerp(1, 1.1, i)}) brightness(${lerp(1, 1.2, i)}) saturate(${lerp(1, 0.9, i)}) hue-rotate(${lerp(0, -10, i)}deg)`
    },
    { 
        id: 'cross_process', name: 'Cross Process', category: 'Warna & Toning', 
        getCss: (i) => `sepia(${lerp(0, 0.3, i)}) contrast(${lerp(1, 1.4, i)}) saturate(${lerp(1, 1.5, i)}) hue-rotate(${lerp(0, 20, i)}deg)`
    },
    { 
        id: 'tritone', name: 'Tritone', category: 'Warna & Toning', 
        getCss: (i) => `sepia(${lerp(0, 1, i)}) hue-rotate(${lerp(0, 240, i)}deg) saturate(${lerp(1, 2, i)}) contrast(${lerp(1, 1.1, i)})`
    },
    { 
        id: 'hue_shift', name: 'Hue Shift', category: 'Warna & Toning', 
        getCss: (i) => `hue-rotate(${lerp(0, 90, i)}deg) saturate(${lerp(1, 1.2, i)})`
    },
    { 
        id: 'pastel_wash', name: 'Pastel Wash', category: 'Warna & Toning', 
        getCss: (i) => `contrast(${lerp(1, 0.8, i)}) saturate(${lerp(1, 0.6, i)}) brightness(${lerp(1, 1.1, i)}) sepia(${lerp(0, 0.1, i)})`
    },
    { 
        id: 'high_key', name: 'High Key Color', category: 'Warna & Toning', 
        getCss: (i) => `brightness(${lerp(1, 1.3, i)}) contrast(${lerp(1, 0.9, i)}) saturate(${lerp(1, 1.1, i)})`
    },
    { 
        id: 'low_key', name: 'Low Key Color', category: 'Warna & Toning', 
        getCss: (i) => `brightness(${lerp(1, 0.7, i)}) contrast(${lerp(1, 1.3, i)}) saturate(${lerp(1, 0.8, i)})`
    },
    { 
        id: 'cyanotype', name: 'Cyanotype', category: 'Warna & Toning', 
        getCss: (i) => `grayscale(${lerp(0, 1, i)}) sepia(${lerp(0, 1, i)}) hue-rotate(${lerp(0, 190, i)}deg) saturate(${lerp(1, 3, i)}) contrast(${lerp(1, 1.2, i)})`
    },
    { 
        id: 'infrared', name: 'Infrared Color', category: 'Warna & Toning', 
        getCss: (i) => `invert(${lerp(0, 1, i)}) hue-rotate(${lerp(0, 180, i)}deg) saturate(${lerp(1, 2, i)})`
    },
    { 
        id: 'day_for_night', name: 'Day for Night', category: 'Warna & Toning', 
        getCss: (i) => `brightness(${lerp(1, 0.6, i)}) contrast(${lerp(1, 1.2, i)}) sepia(${lerp(0, 0.5, i)}) hue-rotate(${lerp(0, 180, i)}deg) saturate(${lerp(1, 1.2, i)})`
    },
    { 
        id: 'desaturate', name: 'Desaturate', category: 'Warna & Toning', 
        getCss: (i) => `saturate(${lerp(1, 0.2, i)}) contrast(${lerp(1, 1.1, i)})`
    },

    // B. Efek Cahaya & Eksposur (Lighting & Exposure)
    { 
        id: 'high_contrast', name: 'High Contrast', category: 'Cahaya & Eksposur', 
        getCss: (i) => `contrast(${lerp(1, 1.6, i)}) saturate(${lerp(1, 1.1, i)})`
    },
    { 
        id: 'fade', name: 'Faded Shadow', category: 'Cahaya & Eksposur', 
        getCss: (i) => `contrast(${lerp(1, 0.8, i)}) brightness(${lerp(1, 1.2, i)})`
    },
    { 
        id: 'overexpose', name: 'Overexpose', category: 'Cahaya & Eksposur', 
        getCss: (i) => `brightness(${lerp(1, 1.5, i)}) contrast(${lerp(1, 0.9, i)})`
    },
    { 
        id: 'underexpose', name: 'Underexpose', category: 'Cahaya & Eksposur', 
        getCss: (i) => `brightness(${lerp(1, 0.6, i)}) contrast(${lerp(1, 1.2, i)})`
    },
    { 
        id: 'glow_bloom', name: 'Glow / Bloom', category: 'Cahaya & Eksposur', 
        getCss: (i) => `brightness(${lerp(1, 1.2, i)}) saturate(${lerp(1, 1.2, i)}) contrast(${lerp(1, 0.9, i)}) blur(${lerp(0, 1, i)}px)`
    },
    { 
        id: 'solarize', name: 'Solarize', category: 'Cahaya & Eksposur', 
        getCss: (i) => `invert(${lerp(0, 0.6, i)}) contrast(${lerp(1, 1.5, i)}) hue-rotate(${lerp(0, 180, i)}deg)`
    },
    { 
        id: 'light_leak', name: 'Light Leak', category: 'Cahaya & Eksposur', 
        getCss: (i) => `contrast(${lerp(1, 1.1, i)})`,
        getOverlay: (i) => `<div class="absolute inset-0 pointer-events-none mix-blend-screen" style="opacity: ${lerp(0, 0.7, i)}; background: radial-gradient(circle at 10% 20%, rgba(255,100,50,0.8) 0%, transparent 50%), radial-gradient(circle at 90% 80%, rgba(255,50,150,0.5) 0%, transparent 50%);"></div>`
    },
    { 
        id: 'halation', name: 'Halation', category: 'Cahaya & Eksposur', 
        getCss: (i) => `contrast(${lerp(1, 1.05, i)})`,
        getOverlay: (i) => `<div class="absolute inset-0 pointer-events-none mix-blend-screen" style="opacity: ${lerp(0, 0.6, i)}; box-shadow: inset 0 0 40px rgba(255,50,0,0.4);"></div>`
    },

    // C. Efek Lensa & Optik (Lens & Optics)
    { 
        id: 'chromatic', name: 'RGB Shift', category: 'Lensa & Optik', 
        getCss: (i) => ``,
        getOverlay: (i) => `<div class="absolute inset-0 pointer-events-none mix-blend-screen" style="box-shadow: ${lerp(0, 3, i)}px 0 0 rgba(255,0,0,0.5), ${lerp(0, -3, i)}px 0 0 rgba(0,255,255,0.5);"></div>`
    },
    { 
        id: 'lens_flare', name: 'Lens Flare', category: 'Lensa & Optik', 
        getCss: (i) => ``,
        getOverlay: (i) => `<div class="absolute inset-0 pointer-events-none mix-blend-screen" style="opacity: ${lerp(0, 0.8, i)}; background: radial-gradient(circle at 20% 30%, rgba(255,255,255,0.8) 0%, rgba(255,255,255,0) 20%), radial-gradient(circle at 40% 50%, rgba(100,200,255,0.3) 0%, transparent 40%);"></div>`
    },
    { 
        id: 'anamorphic', name: 'Anamorphic Flare', category: 'Lensa & Optik', 
        getCss: (i) => ``,
        getOverlay: (i) => `<div class="absolute inset-0 pointer-events-none mix-blend-screen" style="opacity: ${lerp(0, 0.8, i)}; background: linear-gradient(to bottom, transparent 48%, rgba(50,150,255,0.8) 50%, transparent 52%);"></div>`
    },
    { 
        id: 'tilt_shift', name: 'Tilt-Shift', category: 'Lensa & Optik', 
        getCss: (i) => ``,
        getOverlay: (i) => `<div class="absolute inset-0 pointer-events-none backdrop-blur-md" style="opacity: ${lerp(0, 1, i)}; mask-image: linear-gradient(to bottom, black 0%, transparent 40%, transparent 60%, black 100%); -webkit-mask-image: linear-gradient(to bottom, black 0%, transparent 40%, transparent 60%, black 100%);"></div>`
    },
    { 
        id: 'radial_blur', name: 'Radial Blur', category: 'Lensa & Optik', 
        getCss: (i) => `blur(${lerp(0, 2, i)}px) contrast(${lerp(1, 1.2, i)})` // Approximation
    },
    { 
        id: 'lens_blur', name: 'Depth of Field', category: 'Lensa & Optik', 
        getCss: (i) => `blur(${lerp(0, 4, i)}px)`
    },
    { 
        id: 'kaleidoscope', name: 'Prism / Kaleidoscope', category: 'Lensa & Optik', 
        getCss: (i) => `saturate(${lerp(1, 1.5, i)})`,
        getOverlay: (i) => `<div class="absolute inset-0 pointer-events-none mix-blend-overlay backdrop-blur-sm" style="opacity: ${lerp(0, 0.8, i)}; background: repeating-conic-gradient(from 0deg, transparent 0deg 30deg, rgba(255,255,255,0.2) 30deg 60deg);"></div>`
    },

    // D. Efek Tekstur & Overlay (Texture & Overlay)
    { 
        id: 'film_grain', name: 'Film Grain', category: 'Tekstur & Overlay', 
        getCss: (i) => `contrast(${lerp(1, 1.1, i)})`,
        getOverlay: (i) => `<div class="absolute inset-0 pointer-events-none mix-blend-overlay" style="opacity: ${lerp(0, 0.5, i)}; background-image: url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.9\\' numOctaves=\\'3\\' stitchTiles=\\'stitch\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noise)\\'/%3E%3C/svg%3E');"></div>`
    },
    { 
        id: 'dust_scratches', name: 'Dust & Scratches', category: 'Tekstur & Overlay', 
        getCss: (i) => ``,
        getOverlay: (i) => `<div class="absolute inset-0 pointer-events-none mix-blend-screen" style="opacity: ${lerp(0, 0.4, i)}; background-image: url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.05 0.9\\' numOctaves=\\'1\\' stitchTiles=\\'stitch\\'/%3E%3CfeColorMatrix type=\\'matrix\\' values=\\'1 0 0 0 0, 0 1 0 0 0, 0 0 1 0 0, 0 0 0 20 -10\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noise)\\'/%3E%3C/svg%3E');"></div>`
    },
    { 
        id: 'halftone', name: 'Halftone Print', category: 'Tekstur & Overlay', 
        getCss: (i) => `contrast(${lerp(1, 1.2, i)})`,
        getOverlay: (i) => `<div class="absolute inset-0 pointer-events-none mix-blend-multiply" style="opacity: ${lerp(0, 0.6, i)}; background-image: radial-gradient(circle, black 2px, transparent 2.5px); background-size: 8px 8px;"></div>`
    },
    { 
        id: 'crt_scanline', name: 'CRT Scanline', category: 'Tekstur & Overlay', 
        getCss: (i) => `contrast(${lerp(1, 1.2, i)}) saturate(${lerp(1, 1.5, i)})`,
        getOverlay: (i) => `<div class="absolute inset-0 pointer-events-none mix-blend-overlay" style="opacity: ${lerp(0, 0.4, i)}; background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06)); background-size: 100% 4px, 6px 100%;"></div>`
    },
    { 
        id: 'vhs_tracking', name: 'VHS Tracking', category: 'Tekstur & Overlay', 
        getCss: (i) => `saturate(${lerp(1, 1.8, i)}) contrast(${lerp(1, 1.2, i)}) blur(${lerp(0, 0.5, i)}px)`,
        getOverlay: (i) => `<div class="absolute inset-0 pointer-events-none mix-blend-screen" style="opacity: ${lerp(0, 0.5, i)}; background: repeating-linear-gradient(to bottom, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 12px); box-shadow: 2px 0 0 rgba(255,0,0,0.5), -2px 0 0 rgba(0,0,255,0.5);"></div>`
    },
    { 
        id: 'paper_texture', name: 'Paper Canvas', category: 'Tekstur & Overlay', 
        getCss: (i) => ``,
        getOverlay: (i) => `<div class="absolute inset-0 pointer-events-none mix-blend-multiply" style="opacity: ${lerp(0, 0.5, i)}; background-image: url('data:image/svg+xml,%3Csvg viewBox=\\'0 0 200 200\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cfilter id=\\'noise\\'%3E%3CfeTurbulence type=\\'fractalNoise\\' baseFrequency=\\'0.02\\' numOctaves=\\'5\\' stitchTiles=\\'stitch\\'/%3E%3CfeColorMatrix type=\\'matrix\\' values=\\'1 0 0 0 0.8, 0 1 0 0 0.8, 0 0 1 0 0.7, 0 0 0 1 0\\'/%3E%3C/filter%3E%3Crect width=\\'100%25\\' height=\\'100%25\\' filter=\\'url(%23noise)\\'/%3E%3C/svg%3E');"></div>`
    },

    // E. Efek Distorsi & Artistik (Distortion & Artistic)
    { 
        id: 'glitch', name: 'Glitch', category: 'Distorsi & Artistik', 
        getCss: (i) => `saturate(${lerp(1, 1.5, i)}) contrast(${lerp(1, 1.2, i)}) hue-rotate(${lerp(0, 45, i)}deg)`,
        getOverlay: (i) => `<div class="absolute inset-0 pointer-events-none mix-blend-exclusion" style="opacity: ${lerp(0, 0.8, i)}; background: linear-gradient(transparent 20%, rgba(0,255,0,0.2) 20%, rgba(0,255,0,0.2) 25%, transparent 25%, transparent 60%, rgba(255,0,0,0.2) 60%, rgba(255,0,0,0.2) 65%, transparent 65%); transform: translateX(${lerp(0, 5, i)}px);"></div>`
    },
    { 
        id: 'pixelate', name: '8-Bit Pixelate', category: 'Distorsi & Artistik', 
        getCss: (i) => `contrast(${lerp(1, 1.4, i)}) saturate(${lerp(1, 1.5, i)})`,
        getOverlay: (i) => `<div class="absolute inset-0 pointer-events-none backdrop-blur-sm" style="opacity: ${lerp(0, 1, i)}; image-rendering: pixelated; mask-image: repeating-linear-gradient(to right, black, black 4px, transparent 4px, transparent 8px), repeating-linear-gradient(to bottom, black, black 4px, transparent 4px, transparent 8px); -webkit-mask-image: repeating-linear-gradient(to right, black, black 4px, transparent 4px, transparent 8px), repeating-linear-gradient(to bottom, black, black 4px, transparent 4px, transparent 8px);"></div>`
    },
    { 
        id: 'posterize', name: 'Posterize', category: 'Distorsi & Artistik', 
        getCss: (i) => `contrast(${lerp(1, 2, i)}) saturate(${lerp(1, 2, i)}) brightness(${lerp(1, 0.9, i)})`
    },
    { 
        id: 'sketch', name: 'Pencil Sketch', category: 'Distorsi & Artistik', 
        getCss: (i) => `grayscale(${lerp(0, 1, i)}) contrast(${lerp(1, 1.5, i)}) brightness(${lerp(1, 1.2, i)})`
    },
    { 
        id: 'cel_shading', name: 'Comic Cel Shading', category: 'Distorsi & Artistik', 
        getCss: (i) => `contrast(${lerp(1, 1.5, i)}) saturate(${lerp(1, 1.5, i)}) brightness(${lerp(1, 1.1, i)})`
    },
    { 
        id: 'edge_detect', name: 'Find Edges', category: 'Distorsi & Artistik', 
        getCss: (i) => `invert(${lerp(0, 1, i)}) grayscale(${lerp(0, 1, i)}) contrast(${lerp(1, 2, i)})`
    },
    { 
        id: 'engraving', name: 'Engraving (Toile de Jouy)', category: 'Distorsi & Artistik', 
        getCss: (i) => `grayscale(1) contrast(${lerp(1.5, 3, i)}) brightness(${lerp(1, 1.2, i)})`,
        getOverlay: (i, layer) => {
            let maskCss = '';
            if (layer) {
                const imgUrl = layer.type === 'polaroid' ? layer.style?.polaroidData?.image : (layer.style?.url || layer.url);
                if (imgUrl) {
                    const cropX = layer.style?.cropX ?? 50;
                    const cropY = layer.style?.cropY ?? 50;
                    maskCss = `mask-image: url('${imgUrl}'); mask-size: cover; mask-position: ${cropX}% ${cropY}%; mask-repeat: no-repeat; -webkit-mask-image: url('${imgUrl}'); -webkit-mask-size: cover; -webkit-mask-position: ${cropX}% ${cropY}%; -webkit-mask-repeat: no-repeat;`;
                }
            }
            return `
            <div class="absolute inset-0 pointer-events-none mix-blend-hard-light" style="opacity: ${lerp(0.3, 0.85, i)}; background-image: url('data:image/svg+xml,%3Csvg width=\\'6\\' height=\\'6\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cpath d=\\'M-1 7L7 -1M-1 1L1 -1M5 7L7 5\\' stroke=\\'%23666\\' stroke-width=\\'1\\'/%3E%3C/svg%3E'); background-size: 3px 3px; ${maskCss}"></div>
            <div class="absolute inset-0 pointer-events-none mix-blend-lighten" style="background-color: var(--engraving-line, #7b3131); opacity: ${lerp(0.5, 1, i)}; ${maskCss}"></div>
            <div class="absolute inset-0 pointer-events-none mix-blend-multiply" style="background-color: var(--engraving-bg, #fdf5e6); opacity: ${lerp(0.5, 1, i)}; ${maskCss}"></div>
            `;
        }
    }
];

export const getFilterById = (id) => IMAGE_FILTERS.find(f => f.id === id) || IMAGE_FILTERS[0];
