[**@wesp-up/express-remix**](../README.md) • **Docs**

***

# Class: RemixServer

An Express server integrated with Remix. Inherits from the server from
@wesp-up/express.

## Extends

- [`Server`](Server.md)

## Constructors

### new RemixServer()

> **new RemixServer**(`options`?): [`RemixServer`](RemixServer.md)

#### Parameters

• **options?**: `Partial`\<[`RemixOptions`](../interfaces/RemixOptions.md) & [`Options`](../interfaces/Options.md)\>

#### Returns

[`RemixServer`](RemixServer.md)

#### Overrides

[`Server`](Server.md).[`constructor`](Server.md#constructors)

## Properties

### app

> **app**: `Application`

#### Inherited from

[`Server`](Server.md).[`app`](Server.md#app)

***

### httpServer

> **httpServer**: `Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

#### Inherited from

[`Server`](Server.md).[`httpServer`](Server.md#httpserver)

***

### metricsHttpServer

> **metricsHttpServer**: `Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

#### Inherited from

[`Server`](Server.md).[`metricsHttpServer`](Server.md#metricshttpserver)

***

### options

> `protected` **options**: [`Options`](../interfaces/Options.md)

#### Inherited from

[`Server`](Server.md).[`options`](Server.md#options)

## Methods

### postMountApp()

> `protected` **postMountApp**(`app`): `void`

Function to customize the Express application **after** it is mounted by
consumers.

#### Parameters

• **app**: `Application`

Express application.

#### Returns

`void`

#### Overrides

[`Server`](Server.md).[`postMountApp`](Server.md#postmountapp)

***

### init()

> **init**(): `void`

#### Returns

`void`

#### Inherited from

[`Server`](Server.md).[`init`](Server.md#init)

***

### start()

> **start**(`port`?, `metricsPort`?): `void`

Starts the main and metrics HTTP servers.

#### Parameters

• **port?**: `number`

The port to start the main app (default 80).

• **metricsPort?**: `number`

The port to start the metrics app (default 22500).

#### Returns

`void`

#### Inherited from

[`Server`](Server.md).[`start`](Server.md#start)

***

### stop()

> **stop**(): `void`

Gracefully stops the main and metrics HTTP servers.

The health check route is modified to return a shutdown status to make
sure the load balancer takes the node out of the pool so no new requests
will be made to the server.

The server will wait to completely shutdown until all in-flight requests
are complete. However, if they exceed the
[Options.gracefulShutdownTimeout](../interfaces/Options.md#gracefulshutdowntimeout) they will be terminated.

#### Returns

`void`

#### Inherited from

[`Server`](Server.md).[`stop`](Server.md#stop)

***

### preMountApp()?

> `protected` `optional` **preMountApp**(`app`): `void`

Function to customize the Express application **before** it is mounted by
consumers.

#### Parameters

• **app**: `Application`

Express application.

#### Returns

`void`

#### Inherited from

[`Server`](Server.md).[`preMountApp`](Server.md#premountapp)
