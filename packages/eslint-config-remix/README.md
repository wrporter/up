# @wesp-up/eslint-config

This project maintains base ESLint configuration for various TypeScript projects. Each file may be extended and custom configuration may be added. This package provides a convenience of not having to copy and paste the same configs for every new project.

## Installation

```shell
npm install --save-dev @wesp-up/eslint-config-remix
```

## Usage

In your `.eslintrc.js` (or alternative config entry), extend the config files that suit your project. For example:

```javascript
module.exports = {
    extends: [
        '@wesp-up/eslint-config-remix/remix',
    ],
};
```

In your `tsconfig.json`, include all TypeScript and JavaScript files via the following, including dot files, such as `.eslintrc.js`.

```json
{
  "include": ["**/*", ".*"]
}
```

Be sure to also `exclude` any files from your `tsconfig` now that it is being used for both linting and transpiling.

## API

Below are each of the configuration files available and their explanations. Each config is composable and can be included with the other configs. Extend any configs that fit your project.

- [`remix.js`](./remix.js): Config for a Remix application.
- [`cypress.js`](./cypress.js): Config for an integration or E2E test project using [Cypress](https://www.cypress.io/).
