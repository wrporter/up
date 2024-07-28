import config from '@wesp-up/eslint-config';
import pluginJestDom from 'eslint-plugin-jest-dom';
// TODO: Add once jsx-a11y supports eslint 9 / flat configs
// import pluginJsxA11y from 'eslint-plugin-jsx-a11y';
import pluginReact from 'eslint-plugin-react';
// TODO: Add once react-hooks supports eslint 9 / flat configs
// import pluginReactHooks from 'eslint-plugin-react-hooks';
// import pluginTestingLibrary from 'eslint-plugin-testing-library';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  pluginReact.configs.flat.recommended,
  pluginJestDom.configs['flat/recommended'],

  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
    },
  },
];
