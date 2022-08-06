import type { NextFunction, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

export interface TransactionContext {
    transactionId: string;
    requestId: string;
    parentRequestId?: string;
}

export type TransactionContextRequest = Request & {
    transactionContext: TransactionContext;
};

export const headerKeyTransactionId = 'X-Transaction-ID';
export const headerKeyParentRequestId = 'X-Parent-Request-ID';
export const headerKeyRequestId = 'X-Request-ID';

/**
 * Request middleware that implements conventions for request
 * tracing, tracking the `transactionId`, `parentRequestId`, and `requestId`.
 */
export const requestTransactionMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction,
): void => {
    const transactionId = req.header(headerKeyTransactionId) || uuidv4();
    const parentRequestId = req.header(headerKeyParentRequestId);
    const requestId = uuidv4();

    (req as TransactionContextRequest).transactionContext = {
        transactionId,
        requestId,
        parentRequestId,
    };

    res.setHeader(headerKeyTransactionId, transactionId);
    res.setHeader(headerKeyRequestId, requestId);

    next();
};
