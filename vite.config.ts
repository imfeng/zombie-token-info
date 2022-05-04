import path from 'path';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/zombie-token-info/',
  plugins: [vue(), ],
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
      '~@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
});
