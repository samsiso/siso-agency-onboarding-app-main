
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// [Analysis] Implementing granular code splitting for optimal chunk sizes
// [Plan] Monitor performance impact and adjust splits if needed
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
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
      output: {
        manualChunks: {
          // Core vendor bundles - split by functionality
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          
          // UI Components bundles - split by feature
          'ui-core': ['@radix-ui/react-slot'],
          'ui-navigation': ['@radix-ui/react-navigation-menu'],
          'ui-overlay': ['@radix-ui/react-dialog', '@radix-ui/react-popover'],
          'ui-tooltip': ['@radix-ui/react-tooltip'],
          'ui-forms': ['@radix-ui/react-label', '@radix-ui/react-select'],
          'ui-data': ['@radix-ui/react-avatar', '@radix-ui/react-progress'],
          'ui-tabs': ['@radix-ui/react-tabs'],
          'ui-switch': ['@radix-ui/react-switch'],
          'ui-checkbox': ['@radix-ui/react-checkbox'],
          
          // Landing page chunks - split by section
          'landing-hero': ['@/components/ui/animated-hero'],
          'landing-features': ['@/components/blocks/feature-section-with-hover-effects'],
          'landing-testimonials': ['@/components/landing/TestimonialSection'],
          'landing-pricing': ['@/components/ui/pricing-card'],
          
          // Chat components - split by functionality
          'chat-messages': ['@/components/chat/ChatMessage'],
          'chat-input': ['@/components/chat/ChatInput'],
          'chat-thread': ['@/components/ui/chat-message-list'],
          
          // Modal variants
          'modal-dialog': ['@/components/ui/dialog'],
          'modal-drawer': ['@/components/ui/drawer'],
          'modal-sheet': ['@/components/ui/sheet'],
          
          // Animation bundles
          'animation-transitions': ['framer-motion'],
          'animation-loading': ['@/components/ui/message-loading'],
          
          // Utility bundles
          'utils-styling': ['clsx', 'tailwind-merge'],
          'utils-icons': ['lucide-react'],
          'utils-date': ['date-fns'],
          
          // Form handling bundle
          'form-core': ['react-hook-form'],
          'form-validation': ['zod'],
          
          // Data management bundles
          'data-query': ['@tanstack/react-query'],
          'data-charts': ['recharts'],
          
          // Auth bundles
          'auth-supabase': ['@supabase/auth-helpers-react'],
          'auth-ui': ['@supabase/auth-ui-react'],
          
          // Blockchain bundles
          'blockchain-solana': ['@solana/web3.js'],
          'blockchain-moralis': ['moralis'],
          
          // State management
          'state-auth': ['@/hooks/useAuthSession'],
          'state-preferences': ['@/hooks/use-mobile'],
          'state-app': ['@/hooks/usePoints'],
          
          // Index route specific bundles
          'index-components': [
            '@/components/Hero',
            '@/components/ui/expandable-chat',
            '@/components/Footer',
            '@/components/effects/FloatingOrbs'
          ],
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
      'lucide-react'
    ],
    exclude: ['moralis']
  },
  
  experimental: {
    renderBuiltUrl(filename: string, { hostType }: { hostType: 'js' | 'css' | 'html' }) {
      if (hostType === 'html') {
        return { relative: true };
      }
      return { relative: true };
    },
  }
}));
