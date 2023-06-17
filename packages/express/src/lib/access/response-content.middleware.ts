/* eslint-disable prefer-rest-params */
import type { RequestHandler } from 'express';

type WriteArgs = [
    chunk: any,
    encoding: BufferEncoding,
    cb?: ((error: Error | null | undefined) => void) | undefined,
];
type EndArgs = [
    chunk: any,
    encoding: BufferEncoding,
    cb?: (() => void) | undefined,
];

/**
 * Records the response body to provide the byte size in access logs.
 */
export const responseContentMiddleware: RequestHandler = (req, res, next) => {
    const oldWrite = res.write;
    const oldEnd = res.end;
    const chunks: any[] = [];

    res.write = function write(chunk: any) {
        chunks.push(Buffer.from(chunk));
        return oldWrite.apply(res, arguments as unknown as WriteArgs);
    };

    res.end = function end(chunk: any) {
        if (chunk) {
            chunks.push(Buffer.from(chunk));
        }
        res.content = Buffer.concat(chunks).toString('utf8');

        oldEnd.apply(res, arguments as unknown as EndArgs);
        return this;
    };

    next();
};
