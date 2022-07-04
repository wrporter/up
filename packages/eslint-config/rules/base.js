module.exports = {
    'prettier/prettier': [
        'error',
        {
            trailingComma: 'all',
            tabWidth: 4,
            singleQuote: true,
        },
    ],
    'import/extensions': [
        'error',
        'ignorePackages',
        {
            js: 'never',
            jsx: 'never',
            ts: 'never',
            tsx: 'never',
        },
    ],
    'import/no-extraneous-dependencies': [
        'error',
        {
            devDependencies: ['**/*.test.*'],
        },
    ],
    'no-restricted-exports': 'off',
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
    'no-shadow': 'off',
    '@typescript-eslint/no-shadow': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    'unused-imports/no-unused-imports': 'error',
};
