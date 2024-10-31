[**@wesp-up/health-reporter**](../README.md) • **Docs**

***

# Interface: ComponentCheckReport

## Extends

- `Pick`\<[`HealthReport`](HealthReport.md), `"status"`\>

## Properties

### observedValue

> **observedValue**: `unknown`

Value returned from the check.

***

### observedUnit

> **observedUnit**: `string`

Unit of the `observedValue`.

***

### status

> **status**: `string`

Overall health status. If the status of a check fails, so does the
overall status.

#### Inherited from

`Pick.status`

***

### output?

> `optional` **output**: `unknown`

Failure output when the `status` is `"fail"`. Is usually the result of
an error message.
