const reactRules = require('./rules/react');

/**
 * @see https://github.com/eslint/eslint/issues/3458
 * @see https://www.npmjs.com/package/@rushstack/eslint-patch
 */
require('@rushstack/eslint-patch/modern-module-resolution');

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    parserOptions: {
        ecmaFeatures: {
            jsx: true,
        },
    },
    extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
    plugins: ['react', 'testing-library'],
    env: {
        browser: true,
    },
    settings: {
        react: {
            version: 'detect',
        },
    },
    overrides: [
        {
            // Specifying overrides allows us to provide default file extensions.
            // See https://github.com/eslint/eslint/issues/2274
            files: ['**/*.js?(x)', '**/*.ts?(x)'],
            rules: {
                ...reactRules,
            },
        },
    ],
};
