[**@wesp-up/health-reporter**](../README.md) • **Docs**

---

# Class: ResponseTimeComponentChecker

Convenience health check that reports on the time taken to obtain a response
from the check in the `observedValue`.

## Extends

- [`ComponentChecker`](ComponentChecker.md)

## Extended by

- [`ResponseTimeHttpHealthChecker`](ResponseTimeHttpHealthChecker.md)

## Constructors

### new ResponseTimeComponentChecker()

> **new ResponseTimeComponentChecker**(`config`): [`ResponseTimeComponentChecker`](ResponseTimeComponentChecker.md)

#### Parameters

• **config**: [`ResponseTimeComponentCheckerConfig`](../interfaces/ResponseTimeComponentCheckerConfig.md)

#### Returns

[`ResponseTimeComponentChecker`](ResponseTimeComponentChecker.md)

#### Overrides

[`ComponentChecker`](ComponentChecker.md).[`constructor`](ComponentChecker.md#constructors)

## Properties

### config

> **config**: `Required`\<[`ComponentCheckerConfig`](../interfaces/ComponentCheckerConfig.md)\>

#### Inherited from

[`ComponentChecker`](ComponentChecker.md).[`config`](ComponentChecker.md#config)

## Methods

### report()

> **report**(`options`?): `Promise`\<[`ComponentCheckReport`](../interfaces/ComponentCheckReport.md)\>

Evaluates the result of the health check.

#### Parameters

• **options?**: `CheckOptions`

#### Returns

`Promise`\<[`ComponentCheckReport`](../interfaces/ComponentCheckReport.md)\>

#### Overrides

[`ComponentChecker`](ComponentChecker.md).[`report`](ComponentChecker.md#report)
