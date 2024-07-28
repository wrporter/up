# @wesp-up/express

This package offers a base Express server.

The server includes the following features:

- Access logs. (_**PLEASE NOTE**_ healthcheck and version routes are excluded from access logs.)
- Production logger that adds transaction trace information to logs during the lifecycle of a request.
- Meta health check and version routes.
- A Prometheus metrics server.
- Request context with transaction trace IDs added and allows for adding or consuming context in a custom application.
- Graceful shutdown with connection draining to allow for most requests to succeed during a new deployment.
- Default security and performance middleware.
- Fallback error handler and JSON 404 handler over the Express plain-text one.

## Installation

```shell
npm install --save @wesp-up/express express prom-client
```

Note that `express` and `prom-client` are required peer dependencies.

## Usage

```typescript
import { createServer, log } from '@wesp-up/express';
import { Router, Application } from 'express';
import promClient from 'prom-client';

const pathPrefix = '/my-service';

const router = Router();
router.get('/my-route', (req, res) => {
  log.info('Some interesting information');
  res.send({ sand: 'castle' });
});

const counter = new promClient.Counter({
  name: 'custom_counter',
  help: 'My custom counter',
});

const customRouter = Router();
customRouter.get('/my-counter-route', (req, res) => {
  counter.inc();
  res.send({ sand: 'box' });
});

const server = createServer({
  pathPrefix,
  metricsOptions: {
    includePath: true, // default true
    includeDefaultMetrics: false, // default true
  },
  mountApp(app: Application) {
    app.use(pathPrefix, router);
    app.use(pathPrefix, customRouter);
  },
});

server.start();
```

### Request context

This library stores context related to the current request on `res.locals.requestContext`. By default, this includes transaction
and request IDs. You can also extend it with fields relevant to your own application. If you provide authentication information
following a certain format, then the access logger in this repository will include it in logs.

The request context contains fields that are useful for making requests to other services, correlating logs together, and more.
You may often want to pass it between functions. It's recommended to include context when logging information:

```typescript
import { RequestContext, log } from '@wesp-up/express';

async function tryDeleteResource(context: RequestContext, resourceId: string) {
  try {
    await db.deleteResource(context.brandId, resourceId);
  } catch (error) {
    log.error({
      message: 'Failed to clean up resource',
      error,
      resourceId,
      context, // Or just log part of context, if it's large or contains sensitive data
    });
  }
}
```

#### Extending the request context type

The request context type is designed to be extended with fields that are relevant to your own application. You can do so by
using interface merging:

```typescript
declare module '@wesp-up/express' {
  interface RequestContext {
    myField: string;
  }
}
```

## Documentation

For documentation on each exported member, see the [docs](docs).

## TODO

- Add source map support by default. Perhaps with a way to opt out?
