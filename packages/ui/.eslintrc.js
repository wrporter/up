module.exports = {
    extends: ['@wesp-up/eslint-config-react', 'plugin:storybook/recommended'],
    rules: {
        'import/extensions': 'off',
    },
    overrides: [
        {
            files: ['.storybook/**/*.ts', '**/*.stories.{ts,tsx}'],
            rules: {
                'import/no-default-export': 'off',
            },
        },
        {
            files: ['.storybook/**/*.ts'],
            rules: {
                'import/no-extraneous-dependencies': [
                    'error',
                    {
                        devDependencies: ['.storybook/**/*.ts'],
                    },
                ],
            },
        },
    ],
};
