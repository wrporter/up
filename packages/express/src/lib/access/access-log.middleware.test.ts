import EventEmitter from 'events';
import type { Socket } from 'net';

import type { Logger } from '@wesp-up/logger';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import express from 'express';
import supertest from 'supertest';

import { accessLogMiddleware } from './access-log.middleware';

vi.mock('on-finished', () => ({
    default(res: Response, callback: () => void) {
        callback();
    },
}));

const mockTransactionMiddleware: RequestHandler = (_req, res, next) => {
    res.locals.requestContext = {
        ...res.locals.requestContext,
        transactionId: 'someTransaction',
        requestId: 'someRequest',
        parentRequestId: 'someParentRequest',
    };
    next();
};

const logger = {
    access: vi.fn(),
} as unknown as Logger;

const next = vi.fn() as unknown as NextFunction;
let req: Request;
let res: Response;
let middleware: RequestHandler;

let app: express.Application;

beforeEach(async () => {
    middleware = accessLogMiddleware(logger);

    req = {
        headers: {},
    } as Request;
    res = new EventEmitter() as unknown as Response;
    res.locals = {} as Express.Locals;

    app = express();
    app.use(mockTransactionMiddleware);
    app.use(middleware);
});

it('calls next', async () => {
    middleware(req, res, next);

    expect(next).toHaveBeenCalled();
});

it('logs access on the finish event', async () => {
    await supertest(app).get('/');

    expect(logger.access).toHaveBeenCalled();
});

it('logs the original url', async () => {
    const router = express.Router();
    router.get('/sub-path', (_req, res) => res.status(200).end());

    app.use('/base-path', router);
    await supertest(app).get('/base-path/sub-path');

    expect(logger.access).toHaveBeenCalledWith(
        expect.objectContaining({ url: '/base-path/sub-path' }),
    );
});

it('logs the fallback url when the original url does not exist', async () => {
    await supertest(app).get('/fallback');

    expect(logger.access).toHaveBeenCalledWith(expect.objectContaining({ url: '/fallback' }));
});

it('logs the status code', async () => {
    app.use((_req, res) => res.status(400).end());
    await supertest(app).get('/');

    expect(logger.access).toHaveBeenCalledWith(expect.objectContaining({ status: 400 }));
});

it('logs the status code for responses with headers', async () => {
    app.use((_req, res) => {
        res.header('foo', 'bar');
        res.status(500).end();
    });
    await supertest(app).get('/');

    expect(logger.access).toHaveBeenCalledWith(expect.objectContaining({ status: 500 }));
});

it('logs a 499 status for requests that were canceled by the client', () => {
    res.headersSent = false;
    middleware(req, res, next);

    expect(logger.access).toHaveBeenCalledWith(expect.objectContaining({ status: 499 }));
});

it('logs the elapsed time', async () => {
    await supertest(app).get('/');

    expect(logger.access).toHaveBeenCalledWith(
        expect.objectContaining({ time: expect.any(Number) }),
    );
});

it('logs the client ip', async () => {
    req.ip = '10.10.10.10';
    middleware(req, res, next);

    expect(logger.access).toHaveBeenCalledWith(
        expect.objectContaining({ clientIp: '10.10.10.10' }),
    );
});

it('logs the fallback client ip', async () => {
    req.connection = { remoteAddress: '1.1.1.1' } as unknown as Socket;
    middleware(req, res, next);

    expect(logger.access).toHaveBeenCalledWith(expect.objectContaining({ clientIp: '1.1.1.1' }));
});

it('logs no client ip when it does not exist', async () => {
    middleware(req, res, next);

    expect(logger.access).toHaveBeenCalledWith(expect.objectContaining({ clientIp: undefined }));
});

it('logs the method', async () => {
    await supertest(app).get('/');

    expect(logger.access).toHaveBeenCalledWith(expect.objectContaining({ method: 'GET' }));
});

it('logs the user agent', async () => {
    await supertest(app).get('/').set('user-agent', 'test-agent');

    expect(logger.access).toHaveBeenCalledWith(
        expect.objectContaining({ userAgent: 'test-agent' }),
    );
});

it('logs the response size in bytes', async () => {
    res.content = '12345';
    middleware(req, res, next);

    expect(logger.access).toHaveBeenCalledWith(expect.objectContaining({ bytes: 5 }));
});

it('logs the response size in bytes even if it does not exist', async () => {
    await supertest(app).get('/');

    expect(logger.access).toHaveBeenCalledWith(expect.objectContaining({ bytes: 0 }));
});

it('logs the request body size', async () => {
    await supertest(app).post('/').send('1234567890');

    expect(logger.access).toHaveBeenCalledWith(expect.objectContaining({ bytesIn: '10' }));
});

it('logs the http version', async () => {
    app.use((req, _res, next) => {
        req.httpVersionMajor = 1;
        req.httpVersionMinor = 1;
        next();
    });

    await supertest(app).get('/');

    expect(logger.access).toHaveBeenCalledWith(expect.objectContaining({ httpVersion: '1.1' }));
});

it('logs the referrer url', async () => {
    await supertest(app).get('/').set('referer', 'referer');
    await supertest(app).get('/');

    expect(logger.access).toHaveBeenCalledWith(expect.objectContaining({ referer: 'referer' }));
});

it('logs the fallback referrer url', async () => {
    await supertest(app).get('/').set('referrer', 'referrer');

    expect(logger.access).toHaveBeenCalledWith(expect.objectContaining({ referer: 'referrer' }));
});

it('logs x forwarded for header', async () => {
    await supertest(app).get('/').set('x-forwarded-for', 'forward');

    expect(logger.access).toHaveBeenCalledWith(
        expect.objectContaining({ xForwardedFor: 'forward' }),
    );
});

it('logs transaction info', async () => {
    app.use(mockTransactionMiddleware);

    await supertest(app).get('/');

    expect(logger.access).toHaveBeenCalledWith(
        expect.objectContaining({
            transactionId: 'someTransaction',
            requestId: 'someRequest',
            parentRequestId: 'someParentRequest',
        }),
    );
});
