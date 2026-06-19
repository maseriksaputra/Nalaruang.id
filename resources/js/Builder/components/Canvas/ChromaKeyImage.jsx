import React, { useRef, useEffect, useState } from 'react';

const hexToRgb = (hex) => {
    let c = (hex || '#ffffff').replace('#', '');
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    return {
        r: parseInt(c.substring(0, 2), 16) || 0,
        g: parseInt(c.substring(2, 4), 16) || 0,
        b: parseInt(c.substring(4, 6), 16) || 0
    };
};

const ChromaKeyImage = ({ src, targetColorHex = '#ffffff', tolerance = 50, className, style, alt }) => {
    const canvasRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);
    const [aspectRatio, setAspectRatio] = useState('auto');

    useEffect(() => {
        if (!src) return;

        // Normalize URL to relative if hostname matches current host
        // This prevents CORS issues when accessing http:// vs https:// on the same domain
        let finalSrc = src;
        let isSameOrigin = false;
        
        if (finalSrc.startsWith('data:')) {
            isSameOrigin = true;
        } else if (finalSrc.startsWith('/')) {
            isSameOrigin = true;
        } else {
            try {
                const urlObj = new URL(finalSrc);
                if (urlObj.hostname === window.location.hostname) {
                    finalSrc = urlObj.pathname + urlObj.search;
                    isSameOrigin = true;
                } else if (urlObj.origin === window.location.origin) {
                    isSameOrigin = true;
                }
            } catch (e) {}
        }

        const img = new Image();
        if (!isSameOrigin) {
            img.crossOrigin = 'Anonymous';
        }

        const processImage = (imageElement, retryWithoutCors = false) => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            setAspectRatio(`${imageElement.naturalWidth} / ${imageElement.naturalHeight}`);

            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            canvas.width = imageElement.naturalWidth;
            canvas.height = imageElement.naturalHeight;
            ctx.drawImage(imageElement, 0, 0);

            try {
                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data = imageData.data;
                const targetColor = hexToRgb(targetColorHex);
                const threshold = tolerance * 2.5; 

                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    const a = data[i + 3];

                    if (a === 0) continue; 

                    const distance = Math.sqrt(
                        Math.pow(r - targetColor.r, 2) +
                        Math.pow(g - targetColor.g, 2) +
                        Math.pow(b - targetColor.b, 2)
                    );

                    if (distance <= threshold) {
                        data[i + 3] = 0;
                    } else if (distance <= threshold + 20) {
                        const alpha = ((distance - threshold) / 20) * 255;
                        data[i + 3] = Math.min(255, Math.max(0, alpha));
                    }
                }
                ctx.putImageData(imageData, 0, 0);
            } catch (err) {
                console.warn('Canvas ChromaKey error (possibly CORS):', err);
            }
            
            setIsLoaded(true);
        };

        img.onload = () => processImage(img);
        img.onerror = () => {
            console.warn('Image failed to load with crossOrigin Anonymous. Retrying without it...');
            const fallbackImg = new Image();
            fallbackImg.onload = () => processImage(fallbackImg, true);
            fallbackImg.onerror = () => {
                console.error('Image failed to load entirely.');
                setIsLoaded(true); // Biarkan tetap dirender (kosong) agar tidak error state
            };
            fallbackImg.src = finalSrc;
        };
        
        img.src = finalSrc;
    }, [src, targetColorHex, tolerance]);

    return (
        <canvas
            ref={canvasRef}
            className={className}
            style={{ 
                ...style, 
                opacity: isLoaded ? (style?.opacity ?? 1) : 0, 
                transition: 'opacity 0.2s',
                width: '100%',
                height: '100%',
                aspectRatio: aspectRatio,
                objectFit: 'cover'
            }}
            title={alt}
        />
    );
};

export default ChromaKeyImage;
