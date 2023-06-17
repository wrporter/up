/**
 * @see https://github.com/eslint/eslint/issues/3458
 * @see https://www.npmjs.com/package/@rushstack/eslint-patch
 */
require('@rushstack/eslint-patch/modern-module-resolution');

/**
 * @type {import("eslint").Linter.Config}
 */
module.exports = {
    extends: [
        '@remix-run/eslint-config',
        '@wesp-up/eslint-config-react',
        '@wesp-up/eslint-config-react/jest-testing-library',
    ],
};
