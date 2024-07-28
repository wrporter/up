# @wesp-up/logger

A standardized logger that outputs logs to the console. Also comes with support for logging to multiple locations by extending the `Logger` interface.

## Installation

```shell
npm install --save @wesp-up/logger
```

## Usage

```typescript
import { log } from '@wesp-up/logger';

log.info('Hello, World!');

try {
  processThatMightFail();
} catch (error) {
  log.error({
    message: 'A failure occurred in a most important system',
    error,
  });
}
```

## Documentation

For documentation on each exported member, see the [docs](docs).

## Best Practices

- Avoid logging entire request or response objects in production or any other objects containing sensitive information, such as credentials, secrets, and personally identifiable information (PII).
- Use `NODE_ENV=production` when running the service anywhere other than a local machine. Note that if you use `NODE_ENV=development`, you can enable a more human-readable logger for local development.
  ![Pretty Log Format](readme/pretty-format.png 'Pretty Log Format')
- Modify the `LOG_LEVEL` environment variable on a production node if you need more debug information. Possible values are `silent`, `error`, `warn`, `access`, `info`, `debug`.
  - **Silent:** When you don't want any output at all. Useful in test
    environments.
  - **Error:** When a failure occurred in an expected scenario, such as an
    HTTP request failing.
  - **Warn:** When an undesirable path has been taken, but an error has not
    occurred, such as a call to a deprecated procedure.
  - **Access:** When an HTTP call was made to the receiving service and has
    finished.
  - **Info:** When key performance indicator (KPI) events have occurred, such
    as a new survey has been created.
  - **Debug:** When verbose development information should be shown, such as
    additional metadata on fields or information about various branches in code
    taken.
- Silence logs for tests for cleaner output. The default logger (the `log` variable) does this automatically.
