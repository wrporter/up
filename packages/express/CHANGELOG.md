# @wesp-up/express

## 2.1.0 (2024-08-20)

### Minor Changes

- Added: The ability to skip access logs for specific routes.
- Added: Default to format success status codes (2xx, and 3xx) in metrics.
- Changed: Normalizing the request path in metrics uses the URL path rather than the Express route path. This allows for more accurate reporting when Express middleware or parent routes are used. For example, `app.use('*', myMiddleware)` would result in `*` as the path.
- Changed: Completely removed the deprecated request context from the response locals object.

## 2.0.1 (2024-08-20)

### Patch Changes

- Fixed: Allowed support for any express version after 4.18.2 rather than only 4.18.2 in peer dependencies.

## 2.0.0 (2024-07-28)

### Major Changes

- Changed: Moved context to req.context rather than res.locals.requestContext. Added a request logger. Excluding 404s from metrics. Added a custom 500 error handler.

## 1.0.1 (2023-11-25)

### Patch Changes

- Added: Allow `prom-client` v14.2.0 and v15.

## 1.0.0 (2023-11-25)

### Major Changes

- Initial release
