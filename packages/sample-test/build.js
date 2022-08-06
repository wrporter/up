/* eslint-disable */
const { build } = require('esbuild');
const { nodeExternalsPlugin } = require('esbuild-node-externals');

const shared = {
    entryPoints: ['src/index.ts'],
    bundle: true,
    minify: true,
    sourcemap: true,
    platform: 'node',
    plugins: [nodeExternalsPlugin()],
};

build({
    ...shared,
    format: 'cjs',
    outfile: 'dist/index.cjs.js',
});

build({
    ...shared,
    format: 'esm',
    outfile: 'dist/index.esm.js',
});
