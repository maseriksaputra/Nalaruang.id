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
    resolve: {
        alias: {
            'onnxruntime-web/webgpu': 'onnxruntime-web'
        }
    },
    build: {
        minify: false,
        rollupOptions: {
            external: ['onnxruntime-web/webgpu', 'onnxruntime-web']
        }
    },
    optimizeDeps: {
        exclude: ['@imgly/background-removal']
    },
    define: {
        'process.env': {}
    }
});
