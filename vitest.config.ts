import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    env: {
      DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/kaarigar_test?schema=public',
      NODE_ENV: 'test',
      ALLOW_DEV_AUTH_BYPASS: 'true',
      PAYMENT_WEBHOOK_SECRET: 'sample_webhook_secret',
    },
    include: ['tests/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/**', 'dist/**', 'tests/**'],
    },
    testTimeout: 10000,
  },
});
