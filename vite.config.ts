import path from 'path';

import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
console.log()
export default defineConfig(({mode}) => {
  require('dotenv').config({ path: `./.env.${mode}` })

  return {
    base: process.env.VUE_APP_BASE_URL,
    plugins: [vue(), ],
    resolve: {
      alias: {
        '@/': `${path.resolve(__dirname, 'src')}/`,
        '~@/': `${path.resolve(__dirname, 'src')}/`,
      },
    },
  }
});
