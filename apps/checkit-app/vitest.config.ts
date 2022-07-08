/* eslint-disable import/no-extraneous-dependencies */
/// <reference types="vitest" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: ['./test/setup-test-env.ts'],
        include: [
            './{app,server}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        ],
        watchExclude: ['.*\\/node_modules\\/.*', '.*\\/build\\/.*'],
        coverage: {
            reporter: ['text', 'lcov', 'cobertura'],
            exclude: ['server/**/*.ts', 'test'],
            clean: true,
            lines: 10,
            functions: 10,
            branches: 10,
            statements: 10,
        },
        reporters: ['default', 'junit'],
        outputFile: 'junit.xml',
    },
});
