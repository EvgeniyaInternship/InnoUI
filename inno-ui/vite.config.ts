import path from 'node:path';
import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const sourceRoot = fileURLToPath(new URL('./src', import.meta.url));

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(sourceRoot),
    },
  },
  server: {
    proxy: {
      '/profiles': {
        target: 'http://localhost:5082',
        changeOrigin: true,
        rewrite: (requestPath) => requestPath.replace(/^\/profiles/, ''),
      },
    },
  },
});
