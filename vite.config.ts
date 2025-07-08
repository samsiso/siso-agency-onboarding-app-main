import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc"; // Using plugin-react-swc which is already in the project
import path from "path";

// [Analysis] Implementing granular code splitting for optimal chunk sizes
// [Plan] Monitor performance impact and adjust splits if needed
export default defineConfig(({ mode }) => ({
  server: {
    host: true, // Allow network access
    port: 2222,
    strictPort: true, // Don't try other ports
    open: false, // Don't auto-open browser
    hmr: {
      overlay: false // Disable overlay for faster updates
    },
    fs: {
      strict: false // Allow serving files from outside root
    }
  },
  plugins: [react()],
  
  // M4 Mac Mini Optimizations
  esbuild: {
    target: 'es2022',
    platform: 'neutral',
    keepNames: true
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    cssCodeSplit: true,
    modulePreload: {
      polyfill: true
    },
    reportCompressedSize: true,
    rollupOptions: {
      external: ['child_process', 'fs', 'path', 'os'],
      output: {
        manualChunks: {
          // Safe code splitting - less aggressive
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-ui': ['@radix-ui/react-dialog', '@radix-ui/react-select', '@radix-ui/react-tabs'],
          'vendor-utils': ['clsx', 'tailwind-merge', 'lucide-react'],
          'vendor-forms': ['react-hook-form', 'zod'],
          'vendor-supabase': ['@supabase/supabase-js', '@supabase/auth-helpers-react'],
          'vendor-charts': ['recharts', 'reaviz'],
          'vendor-animation': ['framer-motion'],
        },
        
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return 'assets/[name]-[hash][extname]';
          
          const extType = assetInfo.name.split('.').pop() || '';
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
            return `assets/img/[name]-[hash][extname]`;
          }
          return `assets/${extType}/[name]-[hash][extname]`;
        },
        
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
    },
    sourcemap: mode === 'development',
    commonjsOptions: {
      include: [
        /node_modules/,
        'src/components/ui/sonner.tsx',
        'clsx',
        'tailwind-merge',
        'lucide-react',
      ],
      exclude: ['moralis']
    }
  },
  
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      '@radix-ui/react-tabs',
      'clsx',
      'tailwind-merge',
      'lucide-react',
    ],
    exclude: ['moralis'],
    // M4 Optimizations
    esbuildOptions: {
      target: 'es2022',
      platform: 'neutral',
      keepNames: true
    },
    // Pre-bundle heavy dependencies
    force: mode === 'development'
  },
  
  // Enhanced caching for M4 performance
  cacheDir: './.vite-cache',
  
  experimental: {
    renderBuiltUrl(filename: string, { hostType }: { hostType: 'js' | 'css' | 'html' }) {
      if (hostType === 'html') {
        return { relative: true };
      }
      return { relative: true };
    },
  }
}));
