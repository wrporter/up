[**@wesp-up/health-reporter**](../README.md) • **Docs**

***

# Class: ComponentChecker

The most generic health checker to support most use cases.

## Extended by

- [`ResponseTimeComponentChecker`](ResponseTimeComponentChecker.md)

## Constructors

### new ComponentChecker()

> **new ComponentChecker**(`config`): [`ComponentChecker`](ComponentChecker.md)

#### Parameters

• **config**: [`ComponentCheckerConfig`](../interfaces/ComponentCheckerConfig.md)

#### Returns

[`ComponentChecker`](ComponentChecker.md)

## Properties

### config

> **config**: `Required`\<[`ComponentCheckerConfig`](../interfaces/ComponentCheckerConfig.md)\>

## Methods

### report()

> **report**(`options`?): `Promise`\<[`ComponentCheckReport`](../interfaces/ComponentCheckReport.md)\>

Evaluates the result of the health check.

#### Parameters

• **options?**: `CheckOptions`

#### Returns

`Promise`\<[`ComponentCheckReport`](../interfaces/ComponentCheckReport.md)\>
