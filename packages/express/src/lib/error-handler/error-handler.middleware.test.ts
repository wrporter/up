import type { Logger } from '@wesp-up/logger';
import type { Request, Response } from 'express';
import type { HttpError } from 'http-errors';
import createHttpError from 'http-errors';

import { errorHandler, notFoundHandler } from './error-handler.middleware';
import type { RequestContext } from '../request-context';

describe('errorHandler', () => {
    let err: HttpError | Error;
    let req: Partial<Request>;
    let res: Partial<Response>;
    const next = vi.fn();
    const logger = {
        error: vi.fn(),
    };
    const mockTime = '2022-07-14T12:40:00.000Z';

    beforeAll(() => {
        vi.useFakeTimers();
        vi.setSystemTime(new Date(Date.UTC(2022, 6, 14, 12, 40)));
    });

    beforeEach(() => {
        err = createHttpError(418);
        req = {};
        res = {
            headersSent: false,
            status: vi.fn().mockReturnThis(),
            send: vi.fn(),
            locals: {} as Express.Locals,
        };
    });

    afterEach(() => {
        vi.resetAllMocks();
    });

    afterAll(() => {
        vi.restoreAllMocks();
        vi.useRealTimers();
    });

    test('should log the error and return the error via res', () => {
        errorHandler(logger as unknown as Logger)(err, req as Request, res as Response, next);

        expect(logger.error).toHaveBeenCalledOnce();
        expect(logger.error).toHaveBeenCalledWith({
            message: 'Failed request',
            error: err,
        });
        expect(res.status).toHaveBeenCalledWith(418);
        expect(res.send).toHaveBeenCalledWith({
            status: 418,
            message: "I'm a Teapot",
            time: mockTime,
        });
        expect(next).not.toHaveBeenCalled();
    });

    it('should log transactionId if available', () => {
        res.locals!.requestContext = {
            transactionId: 'someTransaction',
        } as RequestContext;
        errorHandler(logger as unknown as Logger)(err, req as Request, res as Response, next);

        expect(logger.error).toHaveBeenCalledOnce();
        expect(logger.error).toHaveBeenCalledWith({
            message: 'Failed request',
            transactionId: 'someTransaction',
            error: err,
        });
    });

    it('does not log for URI encoding issues', () => {
        const error = new URIError('failed to decode param') satisfies Error;
        // @ts-ignore
        error.status = 400;
        errorHandler(logger as unknown as Logger)(error, req as Request, res as Response, next);

        expect(logger.error).not.toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith({
            status: 400,
            message: 'failed to decode param',
            time: mockTime,
        });
        expect(next).not.toHaveBeenCalled();
    });

    test('default to 500 error if an httpError is not passed', () => {
        err = new Error('Catastrophic Error');

        errorHandler(logger as unknown as Logger)(err, req as Request, res as Response, next);

        expect(logger.error).toHaveBeenCalledOnce();
        expect(logger.error).toHaveBeenCalledWith({
            message: 'Failed request',
            error: err,
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: 500,
            message: 'Internal Server Error',
            time: mockTime,
        });
        expect(next).not.toHaveBeenCalled();
    });

    test('should pass on the error message if expose set to true', () => {
        err = createHttpError(500, new Error('Catastrophic Error'), {
            expose: true,
        });

        errorHandler(logger as unknown as Logger)(err, req as Request, res as Response, next);

        expect(logger.error).toHaveBeenCalledOnce();
        expect(logger.error).toHaveBeenCalledWith({
            message: 'Failed request',
            error: err,
        });
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.send).toHaveBeenCalledWith({
            status: 500,
            message: 'Catastrophic Error',
            time: mockTime,
        });
        expect(next).not.toHaveBeenCalled();
    });

    test('should pass default error if expose set to false', () => {
        err = createHttpError(418, new Error('Catastrophic Error'), {
            expose: false,
        });

        errorHandler(logger as unknown as Logger)(err, req as Request, res as Response, next);

        expect(logger.error).toHaveBeenCalledOnce();
        expect(logger.error).toHaveBeenCalledWith({
            message: 'Failed request',
            error: err,
        });
        expect(res.status).toHaveBeenCalledWith(418);
        expect(res.send).toHaveBeenCalledWith({
            status: 418,
            message: "I'm a Teapot",
            time: mockTime,
        });
        expect(next).not.toHaveBeenCalled();
    });

    test('should pass default 500 message if status is not standard and expose is false', () => {
        err = createHttpError(499, new Error('Catastrophic Error'), {
            expose: false,
        });

        errorHandler(logger as unknown as Logger)(err, req as Request, res as Response, next);

        expect(logger.error).toHaveBeenCalledOnce();
        expect(logger.error).toHaveBeenCalledWith({
            message: 'Failed request',
            error: err,
        });
        expect(res.status).toHaveBeenCalledWith(499);
        expect(res.send).toHaveBeenCalledWith({
            status: 499,
            message: 'Internal Server Error',
            time: mockTime,
        });
        expect(next).not.toHaveBeenCalled();
    });

    test('should pass to default express error handler if headers have been sent', () => {
        res.headersSent = true;
        err = createHttpError(418, new Error('Catastrophic Error'), {
            expose: false,
        });

        errorHandler(logger as unknown as Logger)(err, req as Request, res as Response, next);

        expect(logger.error).toHaveBeenCalledOnce();
        expect(logger.error).toHaveBeenCalledWith({
            message: 'Failed request',
            error: err,
        });
        expect(res.status).not.toHaveBeenCalled();
        expect(res.send).not.toHaveBeenCalled();
        expect(next).toHaveBeenCalledWith(err);
    });
});

describe('notFoundHandler', () => {
    const next = vi.fn();

    test('should pass 404 to next', () => {
        notFoundHandler({} as Request, {} as Response, next);

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({
                status: 404,
                message: 'Not Found',
            }),
        );
    });
});
