import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '~': fileURLToPath(new URL('./src', import.meta.url)),
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
            '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
            '@hooks': fileURLToPath(new URL('./src/hooks', import.meta.url)),
            '@services': fileURLToPath(new URL('./src/services', import.meta.url)),
            '@utils': fileURLToPath(new URL('./src/utils', import.meta.url)),
        },
    },
    css: {
        postcss: './postcss.config.js',
    },
    build: {
        // Optimize bundle size
        rollupOptions: {
            output: {
                manualChunks: {
                    vendor: ['react', 'react-dom'],
                    router: ['react-router-dom'],
                    ui: ['react-toastify', 'react-window'],
                    utils: ['date-fns', 'lodash.debounce', 'uuid'],
                },
            },
        },
        // Enable source maps for production debugging
        sourcemap: true,
        // Optimize chunk size
        chunkSizeWarningLimit: 1000,
        // Enable minification
        minify: 'esbuild',
        esbuild: {
            drop: ['console', 'debugger'],
        },
    },
    server: {
        port: 5173,
        host: true,
        proxy: {
            '/api': {
                target: 'http://localhost:5000',
                changeOrigin: true,
                secure: false,
            },
        },
    },
    preview: {
        port: 4173,
        host: true,
    },
});
