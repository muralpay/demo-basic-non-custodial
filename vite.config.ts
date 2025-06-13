import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const base = {
    plugins: [react()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    server: {
      port: 5174
    }
  };

  if (command === 'build') {
    // Library build configuration for SDK wrapper
    return {
      ...base,
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          formats: ['es'],
          fileName: 'index'
        },
        rollupOptions: {
          external: ['react', 'react-dom', '@muralpay/browser-sdk'],
          output: {
            globals: {
              'react': 'React',
              'react-dom': 'ReactDOM',
              '@muralpay/browser-sdk': 'MuralBrowserSDK'
            }
          }
        }
      }
    };
  }

  // Development server configuration for React demo
  return {
    ...base,
    define: {
      global: 'globalThis'
    },
    optimizeDeps: {
      include: ['@muralpay/browser-sdk'],
      force: true,
      esbuildOptions: {
        target: 'es2020'
      }
    }
  };
});