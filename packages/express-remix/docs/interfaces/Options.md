[**@wesp-up/express-remix**](../README.md) • **Docs**

***

# Interface: Options

Options to configure the server.

## Properties

### gracefulShutdownTimeout?

> `optional` **gracefulShutdownTimeout**: `number`

Time in milliseconds to allow connections to stay open before
terminating them and stopping the server. If no active connections
exist, the server will stop immediately.

#### Default

```ts
5000
```

#### See

[Server.stop](../classes/Server.md#stop)

***

### mountApp()?

> `optional` **mountApp**: (`app`) => `void`

Mount and customize the Express application. Useful for adding custom
middleware, routes, etc.

#### Parameters

• **app**: `Application`

#### Returns

`void`

***

### pathPrefix?

> `optional` **pathPrefix**: `string`

Service prefix to be used on routes such as the healthcheck.

***

### versionMeta?

> `optional` **versionMeta**: [`VersionMeta`](VersionMeta.md)

***

### metricsOptions?

> `optional` **metricsOptions**: `BaseOptions`

Options for configuring the Prometheus metrics exports. Straight
pass-through to
[express-prom-bundle](https://www.npmjs.com/package/express-prom-bundle).

***

### accessLogs?

> `optional` **accessLogs**: [`AccessLogOptions`](AccessLogOptions.md)

Options for configuring access logs.

***

### error500Handler?

> `optional` **error500Handler**: `ErrorRequestHandler`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\>

Custom error handler for 500 errors. Use for customizing the default
JSON error handler; for example, respond with an HTML page.
