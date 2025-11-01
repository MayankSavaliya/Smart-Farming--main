import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import  tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  
  build: {
    // Enable CSS code splitting
    cssCodeSplit: true,
    
    // Optimize chunks
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['react-hot-toast'],
          'vendor-http': ['axios'],
        },
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 500,
    
    // Minification
    minify: 'esbuild',
    
    // Source maps (disable for production)
    sourcemap: false,
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
  },
})
