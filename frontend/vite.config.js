import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,

    proxy: {
      '/api': 'http://localhost:3090'
    }
  },

  plugins: [ vue() ],

  build: {
    sourcemap: true,
    emptyOutDir: true,
    outDir: '../frontend-dist',
    target: [ 'es2021', 'chrome110', 'edge110', 'firefox110', 'safari15' ],
    chunkSizeWarningLimit: '2000k'
  }
});
