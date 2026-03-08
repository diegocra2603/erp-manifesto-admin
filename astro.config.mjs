// @ts-check
import { defineConfig, envField } from 'astro/config';
import react from '@astrojs/react';
import node from '@astrojs/node';

import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  output: 'server', // Enable server-side rendering for API routes
  adapter: node({ mode: 'standalone' }),
  security: { checkOrigin: false },
  integrations: [react()],
  env: {
    schema: {
      URL_API: envField.string({ context: 'server', access: 'secret', default: 'http://localhost:5004' }),
      PUBLIC_API_URL: envField.string({ context: 'client', access: 'public', default: 'http://localhost:5004' }),
    },
  },
  vite: {
    resolve: {
      alias: {
        '@': '/src',
      },
    },

    css: {
      transformer: 'postcss',
    },

    plugins: [tailwindcss()],
  },
});