import { removeBackground } from '@imgly/background-removal';
import apiClient from './apiClient';

export const processAIBackgroundRemoval = async (originalUrl) => {
    // 1. Ambil gambar sebagai blob terlebih dahulu untuk mencegah error CORS di dalam imgly
    let imageBlob;
    try {
        const res = await fetch(originalUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        imageBlob = await res.blob();
    } catch (e) {
        throw new Error("Gagal mengunduh gambar sumber. " + e.message);
    }

    const config = {
        debug: true,
        device: 'cpu', // Menghindari kegagalan WebGPU tersembunyi
        model: 'isnet_fp16' // Model default yang paling stabil
    };

    // 3. Eksekusi AI
    let resultBlob;
    try {
        resultBlob = await removeBackground(imageBlob, config);
    } catch (e) {
        throw new Error("AI gagal memproses: " + e.message);
    }

    // 4. Unggah ke server
    const file = new File([resultBlob], `transparent_${Date.now()}.png`, { type: 'image/png' });
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await apiClient.post('/admin/builder/user-assets', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        
        if (response.data && response.data.url) {
            return response.data.url;
        }
        throw new Error("Format respons server tidak sesuai.");
    } catch (e) {
        throw new Error("Gagal menyimpan gambar transparan ke server.");
    }
};
