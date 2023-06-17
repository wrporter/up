import type { NextFunction, Request, Response } from 'express';

import { responseContentMiddleware } from './response-content.middleware';

const req = {} as Request;
const write = vi.fn();
const end = vi.fn();
let res: Response;
const next = vi.fn() as unknown as NextFunction;

beforeEach(() => {
    res = { write, end } as unknown as Response;
});

it('calls next', () => {
    responseContentMiddleware(req, res, next);

    expect(next).toHaveBeenCalled();
});

it('writes the response body to the response object', () => {
    responseContentMiddleware(req, res, next);

    res.write('data');
    res.end();

    expect(res.content).toEqual('data');
});

it('writes content on end', () => {
    responseContentMiddleware(req, res, next);

    res.write('start');
    res.end('end');

    expect(res.content).toEqual('startend');
});

it('calls the old write function', () => {
    responseContentMiddleware(req, res, next);

    res.write('data');

    expect(write).toHaveBeenCalledWith('data');
});

it('write returns result of the original write function', () => {
    write.mockReturnValue(true);

    responseContentMiddleware(req, res, next);

    expect(res.write('data')).toEqual(true);
});

it('end returns the response object so the response continues successfully', () => {
    responseContentMiddleware(req, res, next);

    expect(res.end()).toEqual(res);
});

it('calls the old end function', () => {
    responseContentMiddleware(req, res, next);

    res.end('data');

    expect(end).toHaveBeenCalledWith('data');
});
