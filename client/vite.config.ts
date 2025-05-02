import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: './',
  plugins: [react()],
  build: {
    outDir: 'dist', // Default output directory for Vite builds
    emptyOutDir: true, // Ensure the directory is emptied before building
  },
});