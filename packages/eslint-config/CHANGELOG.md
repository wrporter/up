# @wesp-up/eslint-config

## 2.0.0 (2024-07-27)

### Major Changes

Update ESLint to v9

- This required a lot of changes and some configs/plugins still haven't updated yet, so will have to wait until they do (e.g. eslint-plugin-jsx-a11y).
- Removed airbnb configs in favor of using default recommended rules to greatly simplify. Recommended rule sets have also gotten really good over time.
- Removed prettier plugin and config in favor of using prettier directly, which is their recommendation.
- Added a plugin that automatically adds the `.js` file extension to relative imports in modules. Disable these rules when not in a module project.

## 1.0.1 (2024-02-14)

### Patch Changes

- Removed `imports` from `plugins` due to it already being included by `airbnb-base`. This caused a conflict with an error that looks like this: `ESLint couldn't determine the plugin "import" uniquely.`

## 1.0.0 (2023-11-25)

### Major Changes

- Initial release
