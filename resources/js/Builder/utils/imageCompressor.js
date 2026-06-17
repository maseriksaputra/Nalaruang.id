export const compressImageToWebp = async (file) => {
    // Only compress standard images, skip SVGs, GIFs and already WebPs
    if (!file.type.startsWith('image/') || file.type === 'image/svg+xml' || file.type === 'image/webp' || file.type === 'image/gif') {
        return file;
    }
    
    return new Promise((resolve) => {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            canvas.toBlob((blob) => {
                if (!blob) { resolve(file); return; } // fallback
                const newFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", {
                    type: 'image/webp',
                    lastModified: Date.now()
                });
                URL.revokeObjectURL(img.src);
                resolve(newFile);
            }, 'image/webp', 0.8);
        };
        img.onerror = () => resolve(file); // fallback if error
    });
};
