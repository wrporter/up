import { performance } from 'perf_hooks';
import { TextEncoder } from 'util';

import type { Request, RequestHandler, Response } from 'express';
import onFinished from 'on-finished';

const textEncoder = new TextEncoder();

/**
 * Options to configure access logs.
 */
export interface AccessLogOptions {
  /** Skip logging for specific paths. */
  skip?: (req: Request, res: Response) => boolean;
}

/**
 * Access log middleware to keep track of requests made to the service.
 */
export function accessLogMiddleware({ skip }: AccessLogOptions = {}): RequestHandler {
  return (req, res, next) => {
    if (skip?.(req, res)) {
      next();
      return;
    }

    const startTime = performance.now();

    next();

    const logAccess = () => {
      const elapsedTime = Math.trunc(performance.now() - startTime);
      const responseSize = textEncoder.encode(res.content || '').length;
      const context = req.context;

      context.log.access({
        // -- Required
        url: req.originalUrl || req.url,
        status: getStatus(res),
        time: elapsedTime,

        // -- Recommended
        clientIp: getIp(req),
        method: req.method,
        userAgent: req.headers['user-agent'],

        // -- Optional
        bytes: responseSize,
        bytesIn: req.headers['content-length'],
        httpVersion: `${req.httpVersionMajor}.${req.httpVersionMinor}`,
        referer: req.headers.referer || req.headers.referrer,
        xForwardedFor: req.headers['x-forwarded-for'],
      });
    };

    onFinished(res, logAccess);
  };
}

function getIp(req: Request) {
  return req.ip || req.connection?.remoteAddress;
}

function getStatus(res: Response) {
  if (headersSent(res)) {
    return res.statusCode;
  }
  return 499; // Client Closed Request
}

function headersSent(res: Response) {
  return (
    (typeof res.headersSent !== 'boolean' &&
      Boolean((res as Response & { _header: unknown })._header)) ||
    res.headersSent
  );
}
