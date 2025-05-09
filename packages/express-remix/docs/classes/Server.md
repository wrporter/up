[**@wesp-up/express-remix**](../README.md) • **Docs**

***

# Class: Server

Server that manages Express applications.

## Extended by

- [`RemixServer`](RemixServer.md)

## Constructors

### new Server()

> **new Server**(`options`?): [`Server`](Server.md)

#### Parameters

• **options?**: [`Options`](../interfaces/Options.md)

#### Returns

[`Server`](Server.md)

## Properties

### app

> **app**: `Application`

***

### httpServer

> **httpServer**: `Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

***

### metricsHttpServer

> **metricsHttpServer**: `Server`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`\>

***

### options

> `protected` **options**: [`Options`](../interfaces/Options.md)

## Methods

### init()

> **init**(): `void`

#### Returns

`void`

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

***

### postMountApp()?

> `protected` `optional` **postMountApp**(`app`): `void`

Function to customize the Express application **after** it is mounted by
consumers.

#### Parameters

• **app**: `Application`

Express application.

#### Returns

`void`
