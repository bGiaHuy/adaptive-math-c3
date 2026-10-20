import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
 const env = loadEnv(mode, process.cwd(), '');
 const apiTarget = process.env.API_PROXY_TARGET || env.API_PROXY_TARGET || 'http://localhost:4000';
 return {
  plugins: [react()],
  // The shared curriculum is CommonJS for the API and is linked as a workspace.
  // Prebundle it explicitly so the development browser receives ESM exports.
  optimizeDeps: { include: ['@adaptivemath/contracts/curriculum.js'] },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          const normalized = id.replace(/\\/g, '/');
          if (normalized.includes('node_modules/katex')) {
            return 'vendor-katex';
          }
          if (normalized.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
          if (normalized.includes('node_modules/react') || normalized.includes('node_modules/react-dom') || normalized.includes('node_modules/scheduler')) {
            return 'vendor-react';
          }
        }
      }
    }
  },
  server: {
    fs: { deny: ['.env', '.env.*', '*.{crt,pem}', '**/.git/**', '**/content/**', '**/outputs/**', '**/tmp/**', '**/.cache/**', '**/docs/evidence/**', '**/apps/api/**'] },
    port: 3000,
    strictPort: true,
    open: false,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        timeout: 330000,
        proxyTimeout: 330000
      }
    }
  },
  preview: {
    port: 3000,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        timeout: 330000,
        proxyTimeout: 330000
      }
    }
  }
};
});
