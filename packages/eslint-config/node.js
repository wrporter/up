/**
 * @see https://github.com/eslint/eslint/issues/3458
 * @see https://www.npmjs.com/package/@rushstack/eslint-patch
 */
require('@rushstack/eslint-patch/modern-module-resolution');

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    plugins: ['node'],
    env: {
        node: true,
    },
    overrides: [
        {
            files: '**/*.js',
            rules: {
                '@typescript-eslint/no-var-requires': 'off',
            },
        },
    ],
};
