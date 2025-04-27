import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@utils': path.resolve(__dirname, './src/utils'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
  build: {
    outDir: 'dist', // Default output directory for Vite builds
    emptyOutDir: true, // Ensure the directory is emptied before building
  },
});