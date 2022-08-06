// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    sourcemap: true,
    clean: true,
    external: ['react'],
    dts: true,
});
