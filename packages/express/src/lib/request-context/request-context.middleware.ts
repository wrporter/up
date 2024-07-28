import type { RequestHandler } from 'express';

import { RequestLogger } from '../logger/index.js';

/**
 * Middleware to set up context on the request. Context is accessed via
 * `req.context`.
 * @example
 * ```typescript
 * app.use(requestContextMiddleware);
 * app.use((req, res, next) => {
 *     const { userId, brandId } = authenticate(req);
 *     req.context.userId = userId;
 *     req.context.brandId = brandId;
 *     req.context.log.info({ message: 'Authenticated!' });
 * });
 * ```
 */
export const requestContextMiddleware: RequestHandler = (req, res, next) => {
  req.context = {
    ...req.context,
    log: new RequestLogger(req),
  };
  res.locals.requestContext = req.context;

  next();
};
