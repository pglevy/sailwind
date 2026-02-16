import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Library build configuration
  if (mode === 'library') {
    return {
      plugins: [
        react(),
        dts({
          tsconfigPath: './tsconfig.lib.json',
        }),
      ],
      build: {
        lib: {
          entry: resolve(__dirname, 'src/index.ts'),
          formats: ['es'],
          fileName: 'index',
        },
        rollupOptions: {
          external: [
            'react',
            'react-dom',
            'react/jsx-runtime',
            /^@radix-ui\/.*/,
            'lucide-react',
            'wouter',
          ],
          output: {
            preserveModules: true,
            preserveModulesRoot: 'src',
            entryFileNames: '[name].js',
            assetFileNames: '[name][extname]',
          },
        },
        outDir: 'dist',
        copyPublicDir: false,
      },
    }
  }

  // Development/demo app configuration
  return {
    plugins: [react()],
    base: './',
    build: {
      chunkSizeWarningLimit: 1500, // Increase from default 500 KB
    },
  }
})
