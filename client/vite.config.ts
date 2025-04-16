import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // Frontend development server runs on port 3000
    open: true, // Automatically open the browser when the server starts
    proxy: {
      '/api': {
        target: 'http://localhost:3001', // Proxy requests to the backend server
        secure: false, // Disable SSL verification for local development
        changeOrigin: true, // Change the origin of the request to match the target
      },
    },
  },
});