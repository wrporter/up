import type { Request } from 'express';
import type { NormalizePathFn, Opts } from 'express-prom-bundle';
import promBundle from 'express-prom-bundle';

/**
 * Metrics middleware that exposes metrics about the Node process and HTTP
 * service.
 *
 * This also generates a route that has a default path of `/metrics`. Default
 * options may be overridden by passing in options specified by
 * `express-prom-bundle`.
 * @param options - Options to override defaults.
 * @example
 * ```typescript
 * const metrics = metricsMiddleware();
 * app.use(metrics);
 *
 * // Run a separate express server hosting the metrics endpoint
 * const metricsApp = express();
 * metricsApp.use(metrics.metricsMiddleware);
 * metricsApp.listen(22500, () => {
 *   logger.info(`Metrics server listening at http://localhost:22500`);
 * });
 * ```
 */
export function metricsMiddleware(options: Opts = {}): promBundle.Middleware {
  return promBundle({
    includeMethod: true,
    includePath: true,
    includeStatusCode: true,
    includeUp: true,
    promClient: {
      collectDefaultMetrics: {},
    },
    normalizePath: NormalizeExpressPath,

    // Allow consumers to override the previous defaults.
    ...options,
  });
}

export const NormalizeExpressPath: NormalizePathFn = (req: Request): string => {
  if (req.route?.path) {
    return req.route.path;
  }
  // Some requests never get an express route applied. This occurs for static resources. This also often occurs for authentication middleware
  // as a failure in authentication middleware will often result in an immediate 401 response without the routing middleware ever occurring.
  //
  // Example (Route not applied on auth failure):
  //    app.use(authMiddleware)
  //    app.use(appRouter) // never applies for requests that fail the previous auth middleware
  //
  // Note that you can have a route and apply auth in express with code, though it's more tedious as applying the auth middleware is done per
  // request.
  //
  // Example (Route applied even on auth failure):
  //    appRouter.get('some-path', authMiddleware, someHandler);
  //    app.use(appRouter)
  return 'no-route-applied';
};
