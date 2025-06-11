import { defineConfig } from 'vite';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  if (command === 'build') {
    // Library build configuration
    return {
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          formats: ['es'],
          fileName: 'index'
        },
        rollupOptions: {
          external: ['mural-browser-sdk'],
          output: {
            globals: {
              'mural-browser-sdk': 'MuralBrowserSDK'
            }
          }
        }
      }
    };
  }

  // Development server configuration
  return {
    root: 'test',
    publicDir: '../dist',
    server: {
      port: 5174
    },
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src')
      }
    },
    optimizeDeps: {
      include: ['mural-browser-sdk'],
      force: true,
      esbuildOptions: {
        target: 'es2020'
      }
    },
    define: {
      global: 'globalThis'
    }
  };
});