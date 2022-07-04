module.exports = {
    'prettier/prettier': [
        'error',
        {
            trailingComma: 'all',
            tabWidth: 4,
            singleQuote: true,
            plugins: [require('prettier-plugin-tailwindcss')],
        },
    ],
};
