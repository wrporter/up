import http from 'http';
import type { AddressInfo } from 'net';

import compression from 'compression';
import type { ErrorRequestHandler } from 'express';
import express from 'express';
import type { Opts as PrometheusOptions } from 'express-prom-bundle';

import { AccessLogOptions } from './access/access-log.middleware.js';
import { accessLogMiddleware, responseContentMiddleware } from './access/index.js';
import { notFoundHandler } from './error-handler/error-handler.middleware.js';
import { errorHandler } from './error-handler/index.js';
import { ServerLogger } from './logger/index.js';
import type { VersionMeta } from './meta/index.js';
import { metaRouter } from './meta/index.js';
import { metricsMiddleware } from './metrics/index.js';
import { requestContextMiddleware } from './request-context/index.js';
import { requestTransactionMiddleware } from './request-transaction/index.js';
import { gracefulShutdown, gracefulShutdownWithSignals } from './shutdown/index.js';

export const log = new ServerLogger();

/**
 * Creates a base server that can be customized for any service.
 * @example
 * ```typescript
 * const server = createServer({ pathPrefix: '/my-service' });
 * server.start(3000);
 * ```
 * @param options - {@link Options}
 */
export function createServer(options: Options = {}) {
  const server = new Server(options);
  server.init();
  return server;
}

/** Default options for the server when not provided. */
export const defaultServerOptions: Partial<Options> = {
  gracefulShutdownTimeout: 5000,
  pathPrefix: '',
};

/** Server that manages Express applications. */
export class Server {
  public app: express.Application;

  public httpServer: http.Server;

  public metricsHttpServer: http.Server;

  protected options: Options;

  private shutdown?: () => void;

  constructor(options: Options = {}) {
    this.options = { ...defaultServerOptions, ...options };
    this.app = express();
    this.httpServer = http.createServer();
    this.metricsHttpServer = http.createServer();
  }

  public init() {
    /* --------------------- Performance & Security --------------------- */
    // http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
    this.app.disable('x-powered-by');
    this.app.use(compression());

    /* --------------------- Performance & Security --------------------- */
    this.app.use(
      metaRouter({
        pathPrefix: this.options.pathPrefix,
        versionMeta: this.options.versionMeta,
      }),
    );

    /* ------------------------- Request Lifecycle ------------------------- */
    this.app.use(requestContextMiddleware);
    this.app.use(requestTransactionMiddleware);
    this.app.use(accessLogMiddleware(this.options.accessLogs));
    this.app.use(responseContentMiddleware);

    /* -------------------------- Setup Metrics ------------------------- */
    const metrics = metricsMiddleware({
      ...this.options.metricsOptions,
      // Do not override autoregister because we want metrics collection
      // to be on a separate port.
      autoregister: false,
    });
    this.app.use(metrics);
    const metricsApp = express();
    metricsApp.use(metrics.metricsMiddleware);

    /* ------------------------- Customization ------------------------- */
    this.preMountApp?.(this.app);
    this.options.mountApp?.(this.app);
    this.postMountApp?.(this.app);

    /* ------------------------- Error Handling ------------------------- */
    this.app.use(notFoundHandler);
    this.app.use(errorHandler(this.options.error500Handler));

    /* ------------------------- Server Creation ------------------------ */
    this.httpServer.on('request', this.app);
    this.metricsHttpServer.on('request', metricsApp);

    this.httpServer.on('listening', () => {
      this.app.set('status', 'ok');
      const { port } = this.httpServer.address() as AddressInfo;
      log.info(`Server listening at http://localhost:${port}`);
    });

    this.metricsHttpServer.on('listening', () => {
      const { port } = this.metricsHttpServer.address() as AddressInfo;
      log.info(`Metrics Server listening at http://localhost:${port}`);
    });
  }

  /**
   * Function to customize the Express application **before** it is mounted by
   * consumers.
   * @param app - Express application.
   */
  protected preMountApp?(app: express.Application): void;

  /**
   * Function to customize the Express application **after** it is mounted by
   * consumers.
   * @param app - Express application.
   */
  protected postMountApp?(app: express.Application): void;

  /**
   * Starts the main and metrics HTTP servers.
   * @param port - The port to start the main app (default 80).
   * @param metricsPort - The port to start the metrics app (default 22500).
   */
  start(port = 80, metricsPort = 22500) {
    this.httpServer.listen(port);
    this.metricsHttpServer.listen(metricsPort);

    const metricsShutdown = gracefulShutdown({
      server: this.metricsHttpServer,
      log,
      timeout: 3000,
      onShutdown() {
        log.info('Service stopped');
        process.exit(0); // do not wait for other processes to finish
      },
    });

    this.shutdown = gracefulShutdownWithSignals({
      server: this.httpServer,
      log,
      timeout: this.options?.gracefulShutdownTimeout,
      onInit: () => this.app.set('status', 'shutdown'),
      onShutdown: () => metricsShutdown(),
    });
  }

  /**
   * Gracefully stops the main and metrics HTTP servers.
   *
   * The health check route is modified to return a shutdown status to make
   * sure the load balancer takes the node out of the pool so no new requests
   * will be made to the server.
   *
   * The server will wait to completely shutdown until all in-flight requests
   * are complete. However, if they exceed the
   * {@link Options.gracefulShutdownTimeout} they will be terminated.
   */
  stop() {
    this.shutdown?.();
  }
}

/** Options to configure the server. */
export interface Options {
  /**
   * Time in milliseconds to allow connections to stay open before
   * terminating them and stopping the server. If no active connections
   * exist, the server will stop immediately.
   * @default 5000
   * @see {@link Server.stop}
   */
  gracefulShutdownTimeout?: number;
  /**
   * Mount and customize the Express application. Useful for adding custom
   * middleware, routes, etc.
   */
  mountApp?: (app: express.Application) => void;
  /**
   * Service prefix to be used on routes such as the healthcheck.
   */
  pathPrefix?: string;
  versionMeta?: VersionMeta;
  /**
   * Options for configuring the Prometheus metrics exports. Straight
   * pass-through to
   * [express-prom-bundle](https://www.npmjs.com/package/express-prom-bundle).
   */
  metricsOptions?: PrometheusOptions;
  /**
   * Options for configuring access logs.
   */
  accessLogs?: AccessLogOptions;
  /**
   * Custom error handler for 500 errors. Use for customizing the default
   * JSON error handler; for example, respond with an HTML page.
   */
  error500Handler?: ErrorRequestHandler;
}
