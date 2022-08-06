/* eslint-disable @typescript-eslint/no-explicit-any,prefer-rest-params */

import type { FormatFn } from 'morgan';
import morgan from 'morgan';
import * as rfs from 'rotating-file-stream';
import path from 'path';
import type { TransactionContextRequest } from './transaction';
import type { NextFunction, Response, Request } from 'express';

type BodyReaderResponse = Response & { responseBodyReader: string };

const setResponseBodyMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks: any[] = [];

    res.write = function (chunk: any, ...rest) {
        chunks.push(Buffer.from(chunk));
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        oldWrite.apply(res, arguments);
        return true;
    };

    res.end = function (chunk: any) {
        if (chunk) {
            chunks.push(Buffer.from(chunk));
        }
        (res as BodyReaderResponse).responseBodyReader =
            Buffer.concat(chunks).toString('utf8');
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        oldEnd.apply(res, arguments);
        return this;
    };

    next();
};

const encoder = new TextEncoder();
morgan.token('responseBody', (req, res: BodyReaderResponse) => {
    return JSON.stringify(encoder.encode(res.responseBodyReader || '').length);
});
morgan.token('transactionId', (req: TransactionContextRequest) => {
    return req.transactionContext?.transactionId;
});
morgan.token('requestId', (req: TransactionContextRequest) => {
    return req.transactionContext?.requestId;
});
morgan.token('parentRequestId', (req: TransactionContextRequest) => {
    return req.transactionContext?.parentRequestId;
});

function toNumber(value: string | undefined): number {
    return Number.parseInt(value || '0');
}

const format: FormatFn = (tokens, req, res) => {
    const fields = {
        // Required
        url: tokens['url'](req, res),
        status: toNumber(tokens['status'](req, res)),
        time: toNumber(tokens['total-time'](req, res)),
        // Tracing
        requestId: tokens['requestId'](req, res),
        transactionId: tokens['transactionId'](req, res),
        parentRequestId: tokens['parentRequestId'](req, res),
        // Recommended
        clientIP: tokens['remote-addr'](req, res),
        method: tokens['method'](req, res),
        userAgent: tokens['user-agent'](req, res),
        // Optional, but useful
        bytes: toNumber(tokens['responseBody'](req, res)),
        bytesIn: toNumber(tokens.req(req, res, 'content-length')),
        httpVersion: tokens['http-version'](req, res),
        referer: tokens['referrer'](req, res),
        xForwardedFor: tokens.req(req, res, 'x-forwarded-for'),
    };

    return tokens.date(req, res, 'iso') + ' [access] ' + JSON.stringify(fields);
};

const accessLogStream = rfs.createStream('access.log', {
    teeToStdout: process.env.NODE_ENV === 'development',
    size: '10M',
    maxFiles: 5,
    path: process.env.LOG_PATH || path.join(process.cwd(), 'logs'),
});

/**
 * Access log middleware.
 *
 * The log file is saved at `${LOG_PATH}/access.log` or under `$(PWD)/logs/access.log` when `LOG_PATH` is not specified.
 *
 * Log files are rotated every 10 MB and any files after 5 are deleted, meaning there will not be more than 50 MB of
 * logs left on disk at once.
 */
export const accessLogMiddleware = [
    setResponseBodyMiddleware,
    morgan(format, {
        stream: accessLogStream,
    }),
];
