import { defineConfig } from 'vitest/config';
import swc from 'unplugin-swc';

export default defineConfig({
  plugins: [
    swc.vite({
      // esbuild (vitest default) does not emit decorator metadata; Nest DI needs it.
      jsc: {
        parser: { syntax: 'typescript', decorators: true },
        transform: {
          legacyDecorator: true,
          decoratorMetadata: true,
        },
      },
    }),
  ],
  test: {
    root: './',
    include: ['test/**/*.spec.ts', 'test/**/*.e2e-spec.ts'],
    testTimeout: 30000,
    environment: 'node',
    globals: true,
  },
});
