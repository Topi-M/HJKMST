import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,                 // so you can use describe, it, expect without imports
    environment: 'jsdom',          // needed for React components
    setupFiles: './setupTests.js', // optional: global setup
    include: ['src/components/**/*.test.jsx'], // your test files
    coverage: {
      reporter: ['text', 'html', 'json']
    }
  }
});