/**
 * @see https://github.com/eslint/eslint/issues/3458
 * @see https://www.npmjs.com/package/@rushstack/eslint-patch
 */
require('@rushstack/eslint-patch/modern-module-resolution');

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    plugins: ['eslint-plugin-tsdoc'],
    overrides: [
        {
            files: '**/*.ts?(x)',
            rules: {
                'tsdoc/syntax': 'warn',
            },
        },
    ],
};
