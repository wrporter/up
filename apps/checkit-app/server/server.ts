import path from 'path';
import type { Request } from 'express';
import express from 'express';
import compression from 'compression';
import { createRequestHandler } from '@remix-run/express';
import { accessLogMiddleware } from './access-logs';
import { metricsMiddleware } from './metrics';
import type { TransactionContextRequest } from './transaction';
import { requestTransactionMiddleware } from './transaction';
import logger from './logger';

const BUILD_DIR = path.join(process.cwd(), 'build');
logger.info(`build dir: ${BUILD_DIR}`);

export const app = express();

app.use(compression());

// Custom middleware
app.use(metricsMiddleware);
app.use(requestTransactionMiddleware);
app.use(accessLogMiddleware);

// http://expressjs.com/en/advanced/best-practice-security.html#at-a-minimum-disable-x-powered-by-header
app.disable('x-powered-by');

// Remix fingerprints its assets so we can cache forever.
app.use(
    '/build',
    express.static('public/build', { immutable: true, maxAge: '1y' }),
);

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Everything else (like favicon.ico) is cached for an hour. You may want to be
// more aggressive with this caching.
app.use(express.static('public', { maxAge: '1h' }));

function purgeRequireCache() {
    // purge require cache on requests for "server side HMR" this won't let
    // you have in-memory objects between requests in development,
    // alternatively you can set up nodemon/pm2-dev to restart the server on
    // file changes, but then you'll have to reconnect to databases/etc on each
    // change. We prefer the DX of this, so we've included it for you by default
    for (const key in require.cache) {
        if (key.startsWith(BUILD_DIR)) {
            delete require.cache[key];
        }
    }
}

app.all(
    '*',
    process.env.NODE_ENV === 'development'
        ? (req, res, next) => {
              purgeRequireCache();

              return createRequestHandler({
                  getLoadContext(req: Request) {
                      return {
                          transactionContext: (req as TransactionContextRequest)
                              .transactionContext,
                      };
                  },
                  build: require(BUILD_DIR),
                  mode: process.env.NODE_ENV,
              })(req, res, next);
          }
        : createRequestHandler({
              getLoadContext(req: Request) {
                  return {
                      transactionContext: (req as TransactionContextRequest)
                          .transactionContext,
                  };
              },
              build: require(BUILD_DIR),
              mode: process.env.NODE_ENV,
          }),
);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    logger.info(`Express server listening on port ${port}`);
});
