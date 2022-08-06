/**
 * @see https://github.com/eslint/eslint/issues/3458
 * @see https://www.npmjs.com/package/@rushstack/eslint-patch
 */
require('@rushstack/eslint-patch/modern-module-resolution');

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    extends: ['plugin:jest/recommended', 'plugin:jest-dom/recommended'],
    plugins: ['jest', 'jest-dom'],
    settings: {
        jest: {
            version: 27,
        },
    },
    rules: {
        'jest/expect-expect': [
            'error',
            {
                assertFunctionNames: ['expect*'],
            },
        ],
    },
};
