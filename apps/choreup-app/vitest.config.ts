import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
    plugins: [react(), tsconfigPaths()],
    test: {
        globals: true,
        environment: 'happy-dom',
        setupFiles: ['./test/setup-env.test.ts'],
        include: [
            './{app,server}/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
        ],
        watchExclude: ['.*\\/node_modules\\/.*', '.*\\/build\\/.*'],
        coverage: {
            reporter: ['text', 'lcov', 'cobertura'],
            include: ['{app,server}/**'],
            exclude: ['**/build', '**/*.{generated,test}.*'],
            clean: true,
            all: true,
            statements: 80,
            branches: 80,
            functions: 80,
            lines: 80,
        },
        reporters: ['default', 'junit'],
        outputFile: 'junit.xml',
    },
});