[**@wesp-up/health-reporter**](../README.md) • **Docs**

---

# Interface: ResponseTimeComponentCheckerConfig

## Extends

- `Pick`\<[`ComponentCheckerConfig`](ComponentCheckerConfig.md), `"componentName"` \| `"timeoutMilliseconds"` \| `"check"`\>

## Properties

### componentName

> **componentName**: `string`

Name of the component being evaluated. Must match the pattern
`^[a-zA-Z-_]{1,50}$`.

#### Inherited from

`Pick.componentName`

---

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

#### Inherited from

`Pick.check`

---

### timeoutMilliseconds?

> `optional` **timeoutMilliseconds**: `number`

Maximum timeout to wait for the check to complete. Reaching this
timeout results in a `fail` status for the check.

#### Default

```ts
5000;
```

#### Inherited from

`Pick.timeoutMilliseconds`
