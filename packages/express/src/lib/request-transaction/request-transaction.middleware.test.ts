import type { NextFunction, Request, Response } from 'express';
import { v4 } from 'uuid';

import {
  HEADER_PARENT_REQUEST_ID,
  HEADER_REQUEST_ID,
  HEADER_TRANSACTION_ID,
  requestTransactionMiddleware,
} from './request-transaction.middleware.js';

vi.mock('uuid', () => ({
  v4: vi.fn(),
}));

let req: Request;
let res: Response;
const next = vi.fn() as unknown as NextFunction;

beforeEach(() => {
  req = {
    header: vi.fn(),
  } as unknown as Request;
  res = {
    setHeader: vi.fn(),
  } as unknown as Response;
});

it('calls next', () => {
  requestTransactionMiddleware(req, res, next);

  expect(next).toHaveBeenCalled();
});

it('sets transaction headers on the response', () => {
  vi.mocked(req.header).mockReturnValueOnce('transaction-id');
  vi.mocked(v4).mockReturnValue('request-id');

  requestTransactionMiddleware(req, res, next);

  expect(res.setHeader).toHaveBeenCalledWith(HEADER_TRANSACTION_ID, 'transaction-id');
  expect(res.setHeader).toHaveBeenCalledWith(HEADER_REQUEST_ID, 'request-id');
  expect(res.setHeader).not.toHaveBeenCalledWith(HEADER_PARENT_REQUEST_ID, expect.anything());
});

it('sets the parent request id when present', () => {
  vi.mocked(req.header)
    .mockReturnValueOnce('transaction-id')
    .mockReturnValueOnce('parent-request-id');
  vi.mocked(v4).mockReturnValue('request-id');

  requestTransactionMiddleware(req, res, next);

  expect(res.setHeader).toHaveBeenCalledWith(HEADER_TRANSACTION_ID, 'transaction-id');
  expect(res.setHeader).toHaveBeenCalledWith(HEADER_REQUEST_ID, 'request-id');
  expect(res.setHeader).toHaveBeenCalledWith(HEADER_PARENT_REQUEST_ID, 'parent-request-id');
});

it('sets transaction ids on the request context', () => {
  vi.mocked(req.header)
    .mockReturnValueOnce('transaction-id')
    .mockReturnValueOnce('parent-request-id');
  vi.mocked(v4).mockReturnValue('request-id');

  requestTransactionMiddleware(req, res, next);

  expect(req.context).toEqual({
    transactionId: 'transaction-id',
    requestId: 'request-id',
    parentRequestId: 'parent-request-id',
  });
});
