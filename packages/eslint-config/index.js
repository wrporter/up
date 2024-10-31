import jsEslint from '@eslint/js';
import pluginVitest from '@vitest/eslint-plugin';
import pluginImportX from 'eslint-plugin-import-x';
import pluginJsdoc from 'eslint-plugin-jsdoc';
import pluginUnusedImports from 'eslint-plugin-unused-imports';
import globals from 'globals';
import tsEslint from 'typescript-eslint';

import pluginRequireExtensions from './plugins/require-extensions.js';

/** @type {import("eslint").Linter.Config} */
export default tsEslint.config(
  {
    ignores: [
      '**/.cache/**',
      '**/node_modules/**',
      '**/build/**',
      '**/public/build/**',
      '**/playwright-report/**',
      '**/coverage/**',
      '**/results/**',
      '**/server-build/**',
      '**/dist/**',
    ],
  },

  jsEslint.configs.recommended,
  ...tsEslint.configs.recommendedTypeCheckedOnly,

  {
    name: 'typescript',
    languageOptions: {
      parser: tsEslint.parser,
      parserOptions: {
        project: true,
      },
    },
    rules: {
      'no-unused-vars': 'off',
      'no-unused-expressions': 'off',
      'no-useless-constructor': 'off',
      '@typescript-eslint/no-redundant-type-constituents': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },

  {
    name: 'require-extensions',
    plugins: { 'require-extensions': pluginRequireExtensions },
    rules: pluginRequireExtensions.configs.recommended.rules,
  },

  {
    name: 'import-x',
    plugins: { 'import-x': pluginImportX },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    rules: {
      'import-x/no-extraneous-dependencies': [
        'error',
        { devDependencies: ['**/*.{test,config,build}.*'] },
      ],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', ['sibling', 'parent'], 'index', 'unknown'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true, // use eslint-plugin-import-x for this instead
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],
    },
  },

  {
    name: 'unused-imports',
    plugins: { 'unused-imports': pluginUnusedImports },
    rules: { 'unused-imports/no-unused-imports': 'error' },
  },

  pluginVitest.configs.recommended,
  {
    name: 'vitest',
    files: ['**/*.test.*'],
    rules: {
      // allow for custom expect functions
      'vitest/expect-expect': ['error', { assertFunctionNames: ['expect*'] }],
    },
  },

  pluginJsdoc.configs['flat/recommended'],
  {
    name: 'jsdoc',
    plugins: { jsdoc: pluginJsdoc },
    rules: {
      // Do not require by default, only in libraries
      'jsdoc/require-jsdoc': 'off',
      // Ignore types because we infer this from TypeScript
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-property-type': 'off',
      'jsdoc/require-returns-type': 'off',
      'jsdoc/require-param': 'off',
      'jsdoc/require-returns': 'off',
    },
  },

  {
    name: 'overrides',
    files: ['**/*.test.*', '**/*.{js,cjs,mjs,jsx}'],
    rules: {
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/unbound-method': 'off',
    },
  },
);
