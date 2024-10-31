[**@wesp-up/health-reporter**](../README.md) • **Docs**

***

# Interface: ComponentCheckerConfig

## Properties

### componentName

> **componentName**: `string`

Name of the component being evaluated. Must match the pattern
`^[a-zA-Z-_]{1,50}$`.

***

### measurementName

> **measurementName**: `string`

Name of the measurement being evaluated. Example: `responseTime`. Must
match the pattern `^[a-zA-Z-_]{1,50}$`.

***

### observedUnit

> **observedUnit**: `string`

Unit of the `observedValue`. Must match the pattern `^[a-zA-Z]{1,25}$`.

***

### check()

> **check**: (`options`?) => `Promise`\<`unknown`\>

The check to perform and returns the `observedValue`. Checks fail
whenever an error is thrown. Consumers may use this to provide
additional assertions on the result of a check. For example, throw
an error if a Component HTTP service does not respond with a 200
status code.

#### Parameters

• **options?**: `CheckOptions`

#### Returns

`Promise`\<`unknown`\>

***

### timeoutMilliseconds?

> `optional` **timeoutMilliseconds**: `number`

Maximum timeout to wait for the check to complete. Reaching this
timeout results in a `fail` status for the check.

#### Default

```ts
5000
```
