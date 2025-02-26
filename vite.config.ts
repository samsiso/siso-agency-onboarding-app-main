
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// [Analysis] Adding path alias configuration to resolve @/ imports
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // [Analysis] This maps @/ to the src directory to support imports like @/pages
      '@': path.resolve(__dirname, './src'),
    },
  },
});
