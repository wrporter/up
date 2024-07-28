import type { ErrorRequestHandler, RequestHandler } from 'express';
import type { HttpError } from 'http-errors';
import createHttpError, { isHttpError } from 'http-errors';
import statuses from 'statuses';

/**
 * Creates an error handling middleware using the provided logger. Meant to be
 * the final middleware applied as a fallback to catch errors.
 * @returns A connect compatible (Express) error handling middleware
 */
export function errorHandler(
  /**
   * Custom error handler to overwrite the default JSON response.
   */
  error500Handler?: ErrorRequestHandler,
): ErrorRequestHandler {
  return (err: HttpError, req, res, next) => {
    // Check for URIError due to Express throwing it with the message
    // "Failed to decode param" when there is a malformed URL path.
    if (err.status !== 404 && !(err instanceof URIError)) {
      req.context?.log.error({
        message: 'Failed request',
        error: err,
      });
    }

    if (res.headersSent) {
      return next(err);
    }
    if (!isHttpError(err)) {
      err = createHttpError(500, err);
    }

    // use the custom handler and return if supplied
    if (err.status === 500 && error500Handler) {
      return error500Handler(err, req, res, next);
    }
    let { message } = err;
    // Expose is automatically set to false for 500 errors unless explicitly specified
    if (!err.expose) {
      message = statuses.message[err.status] ?? 'Internal Server Error';
    }

    // return a default response
    res.status(err.status).send({
      status: err.status,
      message,
      time: new Date().toISOString(),
    });
  };
}

/**
 * A simple middleware to generate 404 errors. Should be the final middleware
 * just before the errorHandler middleware.
 * @example
 * ```typescript
 * app.use(notFoundHandler)
 * app.use(errorHandler(logger));
 * ```
 */
export const notFoundHandler: RequestHandler = (req, res, next) => {
  return next(createHttpError(404));
};
