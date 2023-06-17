import type { Opts } from 'express-prom-bundle';
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
// eslint-disable-next-line import/prefer-default-export
export function metricsMiddleware(options: Opts = {}) {
    return promBundle({
        includeMethod: true,
        includePath: true,
        includeStatusCode: true,
        includeUp: true,
        promClient: {
            collectDefaultMetrics: {},
        },

        // Allow consumers to override the previous defaults.
        ...options,
    });
}
