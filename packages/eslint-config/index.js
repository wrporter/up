const baseRules = require('./rules/base');

/**
 * @see https://github.com/eslint/eslint/issues/3458
 * @see https://www.npmjs.com/package/@rushstack/eslint-patch
 */
require('@rushstack/eslint-patch/modern-module-resolution');

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    ignorePatterns: ['dist'],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
    },
    env: {
        es2021: true,
    },
    extends: [
        'eslint:recommended',
        'prettier',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
    ],
    plugins: ['@typescript-eslint', 'prettier', 'import', 'unused-imports'],
    settings: {
        'import/resolver': {
            typescript: {},
        },
    },
    overrides: [
        {
            // Specifying overrides allows us to provide default file extensions.
            // See https://github.com/eslint/eslint/issues/2274
            files: ['**/*.js?(x)', '**/*.ts?(x)'],
            rules: {
                ...baseRules,
            },
        },
    ],
};
