module.exports = {
    extends: ['@wesp-up/eslint-config-remix/remix'],
    overrides: [
        {
            files: ['**/routes/**/*', '**/app/{entry,root}.*'],
            rules: {
                'import/no-default-export': 'off',
            },
        },
    ],
};
