# @wesp-up/health-reporter

This package provides a consistent health reporter, commonly used for deep health check routes on services.

The health reporter follows [this health RFC](https://inadarei.github.io/rfc-healthcheck/) and is intended to be used as a deep health check of a service to gather a fast report on the health of downstream dependencies. Most useful during an outage or degraded service. Recommended to also be used with API tests and canary tests.

**What it is not:**

- Do not use for a standard health check route for load balancing purposes. Generating health reports is more intensive. Standard health check routes are meant to be as fast as possible and are used to determine whether a node should be pulled out of the pool.
- Not intended to be used as a diagnostic tool, as shown in the RFC for metrics such as database connections, CPU and memory usage. Prefer to use standard tooling such as Grafana for those purposes. Because this health reporter is intended to be used as a publicly accessible deep health check route, you should be careful about what information you expose.

## Installation

```shell
npm install --save @wesp-up/health-reporter
```

## Usage

### Express

```typescript
import assert from 'node:assert';

import { HealthReporter, ResponseTimeHttpHealthChecker } from '@wesp-up/health-reporter';
import mongoose from 'mongoose';

async function bootstrap() {
  const connection = mongoose.createConnection('mongodb://127.0.0.1/dbname');

  const health = new HealthReporter()
    .add(
      new ResponseTimeComponentChecker({
        componentName: 'Mongo',
        check: () => connection.getClient().db('dbname').command({ ping: 1 }),
      }),
    )
    .add(
      new ResponseTimeHttpHealthChecker({
        componentName: 'ComponentServiceA',
        url: 'https://internal-lb.b1-prv.qops.net/service-a/healthcheck',
      }),
    );

  httpAdapter.get('/deepHealthcheck', async (req, res) => {
    const report = await this.health.report();
    if (report.status !== 'pass') {
      req.context.log.addAccessMeta({ report });
    }
    res.status(500);
    res.send(report);
  });
}

bootstrap();
```

### Nest

```typescript
import assert from 'node:assert';

import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { HealthReporter, ResponseTimeHttpHealthChecker } from '@wesp-up/health-reporter';
import { Connection } from 'mongoose';

@Controller()
export class AppController {
  private health: HealthReporter;

  constructor(@InjectConnection() connection: Connection) {
    this.health = new HealthReporter()
      .add(
        new ResponseTimeComponentChecker({
          componentName: 'Mongo',
          check: () => connection.getClient().db('dbname').command({ ping: 1 }),
        }),
      )
      .add(
        new ResponseTimeHttpHealthChecker({
          componentName: 'ComponentServiceA',
          url: 'https://internal-lb.b1-prv.qops.net/service-a/healthcheck',
        }),
      );
  }

  @Get('/deepHealthcheck')
  async deepHealthcheck(@ReqContext() context: RequestContext) {
    const report = await this.health.report();
    if (report.status !== 'pass') {
      context.log.addAccessMeta({ report });
      throw new InternalServerErrorException(report);
    }
    return report;
  }
}
```

### Example Response

Following is what a response might look like for the above example usage.

```json
{
  "status": "pass",
  "serviceId": "service-x",
  "releaseId": "5b7e2fe6803260c76903994362d273d6f3d2ba23",
  "checks": {
    "Mongo:responseTime": [
      {
        "status": "pass",
        "observedValue": 20,
        "observedUnit": "ms"
      }
    ],
    "DownstreamServiceA:responseTime": [
      {
        "status": "pass",
        "observedValue": 272,
        "observedUnit": "ms"
      }
    ]
  }
}
```

## Documentation

For documentation on each exported member, see the [docs](docs).
