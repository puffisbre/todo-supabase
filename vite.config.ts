import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext',
  },
  server: {
    open: true,  // Open the browser automatically when the dev server starts
  },
});
