import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración optimizada para Vite + React + Vercel
export default defineConfig({
  plugins: [react()],

  // Base correcta para despliegue en Vercel
  base: '/',

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },

  // Configuración de desarrollo local (no afecta producción)
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
});

