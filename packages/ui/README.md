# @wesp-up/ui

This package provides reusable UI components that are styled with Tailwind CSS.

## Installation

```shell
npm install @wesp-ui/up
```

## Usage

### With Tailwind

Any package within this monorepo will need to include the references from the root of the project. Include the package source in the `tailwind.config.js` content.

```javascript
module.exports = {
    content: [
        '../../node_modules/@wesp-up/ui/dist/**/*.js',
    ],
};
```

Otherwise, it will just look like this:

```javascript
module.exports = {
    content: [
        './node_modules/@wesp-up/ui/dist/**/*.js',
    ],
};
```

### Without Tailwind

Import and serve the CSS stylesheet.

```javascript
import '@wesp-up/ui/dist/index.css';
```

### With Remix

In order to get live updates when developing in a Remix project, the following needs to be added to `remix.config.js`:

```javascript
module.exports = {
    serverDependenciesToBundle: ['@wesp-up/ui'],
    watchPaths: ['../../node_modules/@wesp-up/ui/**/*.js'],
};
```

## Contributing
