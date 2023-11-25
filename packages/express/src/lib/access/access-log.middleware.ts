import { performance } from 'perf_hooks';
import { TextEncoder } from 'util';

import type { Logger } from '@wesp-up/logger';
import type { Request, RequestHandler, Response } from 'express';
import onFinished from 'on-finished';

import type { BaseRequestContext } from '../request-context';

const textEncoder = new TextEncoder();

/**
 * Access log middleware to keep track of requests made to the service.
 * @param log - Logger instance to be used to send logs to.
 */
export function accessLogMiddleware(log: Logger): RequestHandler {
    return (req, res, next) => {
        const startTime = performance.now();

        next();

        const logAccess = () => {
            const elapsedTime = Math.trunc(performance.now() - startTime);
            const responseSize = textEncoder.encode(res.content || '').length;

            const requestContext: BaseRequestContext = res.locals.requestContext ?? {};

            log.access({
                // -- Required
                url: req.originalUrl || req.url,
                status: getStatus(res),
                time: elapsedTime,

                // -- Recommended
                clientIp: getIp(req),
                method: req.method,
                requestId: requestContext.requestId,
                parentRequestId: requestContext.parentRequestId,
                transactionId: requestContext.transactionId,
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
            // eslint-disable-next-line no-underscore-dangle
            Boolean((res as Response & { _header: unknown })._header)) ||
        res.headersSent
    );
}
