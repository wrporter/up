[**@wesp-up/logger**](../README.md) • **Docs**

---

# Variable: log

> `const` **log**: [`MultiLogger`](../classes/MultiLogger.md)

Singleton instance of the multi logger. The following default configuration is applied.

- The log level is applied in order of precedence:
  - Log level is `process.env.LOG_LEVEL` when it is set to a valid log
    level.
  - Log level is `silent` when `process.env.NODE_ENV` is `test`.
  - Default log level is `info`.
- The log mode is defined by `process.env.NODE_ENV`:
  - `development` - a pretty logger is used.
  - `test` - logs are silenced.
  - Defaults to a production JSON logger.
- Registers a [WinstonLogger](../classes/WinstonLogger.md) instance.
