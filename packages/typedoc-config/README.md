# @wesp-up/typedoc-config

This project maintains base [TypeDoc](https://typedoc.org/) config files for TypeScript projects that use [TSDoc](https://tsdoc.org/) comments. This package provides a convenience of not having to copy and paste the same configs for every new project, providing consistency in documentation style.

## Installation

```shell
npm install --save-dev @wesp-up/typedoc-config
```

## Usage

Extend the config file in your `typedoc.json`. For example:

```json
{
  "$schema": "https://typedoc.org/schema.json",
  "extends": ["node_modules/@wesp-up/typedoc-config/typedoc.json"],
  "entryPoints": ["src/index.ts"],
  "out": "docs"
}
```

If you are using npm workspaces, the `node_modules` folder is at the root of the project (e.g. `
"extends": ["../../node_modules/@wesp-up/typedoc-config/typedoc.json"]`).

**Note:** All configuration options that use relative paths, such as `entryPoints` and `out`, etc. are relative to the location of the typedoc config file itself. Therefore, the package configs do not provide those configuration options. They must be configured by the consuming project itself.
