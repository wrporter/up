# @wesp-up/metrics

This package provides convenient metrics. For Node.js applications, we recommend the following.

1. Use [prom-client](https://www.npmjs.com/package/prom-client) for all metrics.
2. Use [express-prom-bundle](https://www.npmjs.com/package/express-prom-bundle) to collect default Node metrics and HTTP metrics. [@wesp-up/express](../express) does this for you.
3. Use `@wesp-up/metrics` (this package) for other common metrics.
4. Use a common dashboard for common metrics. Create your own dashboard for custom service metrics.

## Installation

```shell
npm install --save prom-client @wesp-up/metrics
```

## Usage

```typescript
import { Time, metrics } from '@wesp-up/metrics';

const baseUrl = 'https://cat-service.domain';

export class CatServiceClient {
  // Use the convenient class method decorator
  @Time('cat_service', 'get_cats')
  getCats() {
    return fetch(`${baseUrl}/cats`);
  }

  // Or use the dependency metric directly
  async getCat(catId: string) {
    const endTimer = metrics.dependency.startTimer({
      dependency: 'cat_service',
      operation: 'get_cat',
    });

    try {
      const response = fetch(`${baseUrl}/cats/${catId}`);
      let status = 'pass';
      if (response.status >= 400) {
        status = 'fail';
      }

      endTimer({ status });
    } catch (error) {
      endTimer({ status: 'fail' });
    }
  }
}
```

If you need custom histogram buckets, you may configure those for your needs. Be sure to do this before the service starts up so all collected metrics are consistent.

```typescript
import { metrics } from '@wesp-up/metrics';

metrics.configureDependencyHistogram({
  buckets: [0.003, 0.03, 0.1, 0.3, 0.6, 1, 2.5, 5, 10, 30],
});
```

### Server Example

Below is an end to end example with a server.

```typescript
import { createServer } from '@wesp-up/express';
import { Time } from '@wesp-up/metrics';
import { Router } from 'express';

class TodoServiceClient {
  @Time('todo_service', 'get_todos')
  async getTodos() {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    return response.json();
  }
}

const pathPrefix = '/my-service';
const router = Router();
const service = new TodoServiceClient();

router.get('/todos', async (req, res) => {
  res.json({
    todos: await service.getTodos(),
  });
});

createServer({
  pathPrefix,
  mountApp(app) {
    app.use(pathPrefix, router);
  },
}).start(3000);
```

Which produces the following metrics.

```
# HELP dependency_duration_seconds Time elapsed for a dependency to perform an operation.
# TYPE dependency_duration_seconds histogram
dependency_duration_seconds_bucket{le="0.003",dependency="todo_service",operation="get_todos",status="pass"} 0
dependency_duration_seconds_bucket{le="0.03",dependency="todo_service",operation="get_todos",status="pass"} 0
dependency_duration_seconds_bucket{le="0.1",dependency="todo_service",operation="get_todos",status="pass"} 3
dependency_duration_seconds_bucket{le="0.3",dependency="todo_service",operation="get_todos",status="pass"} 3
dependency_duration_seconds_bucket{le="0.6",dependency="todo_service",operation="get_todos",status="pass"} 4
dependency_duration_seconds_bucket{le="1",dependency="todo_service",operation="get_todos",status="pass"} 4
dependency_duration_seconds_bucket{le="2.5",dependency="todo_service",operation="get_todos",status="pass"} 4
dependency_duration_seconds_bucket{le="5",dependency="todo_service",operation="get_todos",status="pass"} 4
dependency_duration_seconds_bucket{le="10",dependency="todo_service",operation="get_todos",status="pass"} 4
dependency_duration_seconds_bucket{le="30",dependency="todo_service",operation="get_todos",status="pass"} 4
dependency_duration_seconds_bucket{le="+Inf",dependency="todo_service",operation="get_todos",status="pass"} 4
dependency_duration_seconds_sum{dependency="todo_service",operation="get_todos",status="pass"} 0.59820275
dependency_duration_seconds_count{dependency="todo_service",operation="get_todos"} 4
```

## Documentation

For documentation on each exported member, see the [docs](docs).
