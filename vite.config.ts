import { resolve } from 'node:path'
/*
 * @Author: zhangyang
 * @Date: 2025-09-19 10:44:53
 * @LastEditTime: 2025-09-19 14:47:13
 * @Description:
 */
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [
    dts(),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'AppLancher',
      formats: ['es', 'umd'],
      fileName: format => `app-lancher.${format}.js`,
    },
    rollupOptions: {
      external: [],
      output: {
        globals: {},
      },
    },
    target: 'es2015',
    minify: 'terser',
    sourcemap: true,
  },
  esbuild: {
    target: 'es2015',
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
})
