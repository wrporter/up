# @wesp-up/express

## 2.0.0 (2024-07-28)

### Major Changes

- Moved context to req.context rather than res.locals.requestContext. Added a request logger. Excluding 404s from metrics. Added a custom 500 error handler.

## 1.0.1 (2023-11-25)

### Patch Changes

- Added: Allow `prom-client` v14.2.0 and v15.

## 1.0.0 (2023-11-25)

### Major Changes

- Initial release
