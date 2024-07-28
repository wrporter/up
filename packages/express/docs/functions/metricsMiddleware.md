[**@wesp-up/express**](../README.md) • **Docs**

---

# Function: metricsMiddleware()

> **metricsMiddleware**(`options`): `promBundle.Middleware`

Metrics middleware that exposes metrics about the Node process and HTTP
service.

This also generates a route that has a default path of `/metrics`. Default
options may be overridden by passing in options specified by
`express-prom-bundle`.

## Parameters

• **options**: `Opts` = `{}`

Options to override defaults.

## Returns

`promBundle.Middleware`

## Example

```typescript
const metrics = metricsMiddleware();
app.use(metrics);

// Run a separate express server hosting the metrics endpoint
const metricsApp = express();
metricsApp.use(metrics.metricsMiddleware);
metricsApp.listen(22500, () => {
  logger.info(`Metrics server listening at http://localhost:22500`);
});
```
