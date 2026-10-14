import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Investverse/',
  build: {
    chunkSizeWarningLimit: 1100,
    rollupOptions: { output: { manualChunks: {
      'three-engine': ['three'],
      'react-three': ['@react-three/fiber', '@react-three/drei'],
    } } },
  },
});
