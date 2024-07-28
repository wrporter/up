[**@wesp-up/health-reporter**](../README.md) • **Docs**

---

# Class: ResponseTimeHttpHealthChecker

Check the standard healthcheck route. Expects a 200 status and a JSON
response body of `{ "status": "ok" }`. Retries only one time with a
500-millisecond delay on connection failures and status codes 500, 502, 503,
and 504.

## Extends

- [`ResponseTimeComponentChecker`](ResponseTimeComponentChecker.md)

## Constructors

### new ResponseTimeHttpHealthChecker()

> **new ResponseTimeHttpHealthChecker**(`__namedParameters`): [`ResponseTimeHttpHealthChecker`](ResponseTimeHttpHealthChecker.md)

#### Parameters

• **\_\_namedParameters**: [`ResponseTimeHttpHealthCheckerConfig`](../interfaces/ResponseTimeHttpHealthCheckerConfig.md)

#### Returns

[`ResponseTimeHttpHealthChecker`](ResponseTimeHttpHealthChecker.md)

#### Overrides

[`ResponseTimeComponentChecker`](ResponseTimeComponentChecker.md).[`constructor`](ResponseTimeComponentChecker.md#constructors)

## Properties

### config

> **config**: `Required`\<[`ComponentCheckerConfig`](../interfaces/ComponentCheckerConfig.md)\>

#### Inherited from

[`ResponseTimeComponentChecker`](ResponseTimeComponentChecker.md).[`config`](ResponseTimeComponentChecker.md#config)

## Methods

### report()

> **report**(`options`?): `Promise`\<[`ComponentCheckReport`](../interfaces/ComponentCheckReport.md)\>

Evaluates the result of the health check.

#### Parameters

• **options?**: `CheckOptions`

#### Returns

`Promise`\<[`ComponentCheckReport`](../interfaces/ComponentCheckReport.md)\>

#### Inherited from

[`ResponseTimeComponentChecker`](ResponseTimeComponentChecker.md).[`report`](ResponseTimeComponentChecker.md#report)
