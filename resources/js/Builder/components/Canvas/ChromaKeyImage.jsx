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

    useEffect(() => {
        if (!src) return;

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.onload = () => {
            const canvas = canvasRef.current;
            if (!canvas) return;

            const ctx = canvas.getContext('2d', { willReadFrequently: true });
            
            // Set canvas size to match image
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;

            // Draw image to canvas
            ctx.drawImage(img, 0, 0);

            // Process image data
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;
            const targetColor = hexToRgb(targetColorHex);

            // A tolerance of 0 means exact match. 
            // We multiply tolerance to make the 0-100 range more usable
            // Distance max is roughly 441 (sqrt(255^2 * 3)), so tolerance up to 100 
            // should map to a reasonable distance threshold.
            const threshold = tolerance * 2.5; 

            for (let i = 0; i < data.length; i += 4) {
                const r = data[i];
                const g = data[i + 1];
                const b = data[i + 2];
                const a = data[i + 3];

                if (a === 0) continue; // Already transparent

                // Euclidean distance in RGB space
                const distance = Math.sqrt(
                    Math.pow(r - targetColor.r, 2) +
                    Math.pow(g - targetColor.g, 2) +
                    Math.pow(b - targetColor.b, 2)
                );

                if (distance <= threshold) {
                    // It's part of the background, make it transparent
                    data[i + 3] = 0;
                } else if (distance <= threshold + 20) {
                    // Soft edge transition (anti-aliasing)
                    const alpha = ((distance - threshold) / 20) * 255;
                    data[i + 3] = Math.min(255, Math.max(0, alpha));
                }
            }

            ctx.putImageData(imageData, 0, 0);
            setIsLoaded(true);
        };
        img.src = src;
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
                objectFit: 'contain'
            }}
            title={alt}
        />
    );
};

export default ChromaKeyImage;
