import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'resources/css/app.css', 
                'resources/js/app.js',
                'resources/js/Builder/BuilderApp.jsx',
                'resources/js/Dashboard/PortalApp.jsx',
                'resources/js/Viewer/ViewerApp.jsx'
            ],
            refresh: true,
        }),
        react(),
        tailwindcss(),
    ],
    server: {
        watch: {
            ignored: ['**/storage/framework/views/**'],
        },
    },
    build: {
        minify: false
    },
    define: {
        'process.env': {}
    }
});
