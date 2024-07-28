[**@wesp-up/health-reporter**](../README.md) • **Docs**

---

# Interface: ResponseTimeHttpHealthCheckerConfig

## Extends

- `Pick`\<[`ResponseTimeComponentCheckerConfig`](ResponseTimeComponentCheckerConfig.md), `"componentName"` \| `"timeoutMilliseconds"`\>

## Properties

### url

> **url**: `string`

The URL to perform the check against.

---

### componentName

> **componentName**: `string`

Name of the component being evaluated. Must match the pattern
`^[a-zA-Z-_]{1,50}$`.

#### Inherited from

`Pick.componentName`

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
