import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/aat.js'),
      name: 'aat',
      fileName: (format) => `aat.${format === 'es' ? 'js' : 'min.js'}`
    }
  }
})
