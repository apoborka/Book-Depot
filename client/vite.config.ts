import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Default output directory for Vite builds
    emptyOutDir: true, // Ensure the directory is emptied before building
  },
});