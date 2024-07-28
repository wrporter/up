import configLib from '@wesp-up/eslint-config/lib';
import config from '@wesp-up/eslint-config-react';

export default [
  ...config,
  ...configLib,
  {
    languageOptions: {
      parserOptions: {
        project: './tsconfig.eslint.json',
      },
    },
  },
];
