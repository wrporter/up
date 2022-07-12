/* eslint-disable @typescript-eslint/no-var-requires,import/no-extraneous-dependencies */
const plugin = require('tailwindcss/plugin');

module.exports = {
    content: [
        './app/**/*.{ts,tsx,jsx,js}',
        '../../node_modules/@wesp-up/ui/dist/**/*.js',
    ],
    theme: {
        extend: {},
    },
    plugins: [
        plugin(function ({ addVariant }) {
            addVariant('data-selected', '&[data-selected]');
        }),
    ],
};
