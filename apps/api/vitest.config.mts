import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: {
    target: 'node20',
    tsconfigRaw: {
      compilerOptions: {
        experimentalDecorators: true,
        emitDecoratorMetadata: true,
        useDefineForClassFields: false
      }
    }
  },
  test: {
    environment: 'node',
    globalSetup: ['test/global-setup.ts'],
    include: ['test/**/*.spec.ts'],
    fileParallelism: false,
    hookTimeout: 30_000,
    testTimeout: 30_000,
    env: {
      NODE_ENV: 'test',
      DATABASE_URL: process.env.ADAPTIVE_MATH_TEST_DATABASE_URL || 'postgresql://am:am_dev_password@localhost:5432/adaptivemath_test?schema=public',
      SESSION_SECRET: 'adaptivemath_test_session_secret_at_least_32_chars_long',
      REDIS_URL: 'redis://localhost:6379',
      INVITE_CODE_HMAC_SECRET: 'adaptivemath_test_invite_code_hmac_secret_key_32_chars'
    }
  }
});
