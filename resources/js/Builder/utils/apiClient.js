import axios from 'axios';

const apiClient = axios.create({
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json'
    },
    // Sangat krusial agar cookie session Laravel dikirim (SPA Embedded)
    withCredentials: true 
});

// Otomatis mencari tag <meta name="csrf-token" content="..."> di Blade
const token = document.head.querySelector('meta[name="csrf-token"]');

if (token) {
    apiClient.defaults.headers.common['X-CSRF-TOKEN'] = token.content;
} else {
    console.error('CSRF token tidak ditemukan di Blade layout.');
}

export default apiClient;
