import type { RequestHandler } from 'express';
import { v4 as uuidV4 } from 'uuid';

/** The name of the request header for the transaction ID */
export const HEADER_TRANSACTION_ID = 'X-Transaction-ID';
/** The name of the request header for the parent request ID */
export const HEADER_PARENT_REQUEST_ID = 'X-Parent-Request-ID';
/** The name of the request header for the request ID */
export const HEADER_REQUEST_ID = 'X-Request-ID';

/**
 * Middleware to apply request transaction trace identifiers to the request
 * context.
 */
export const requestTransactionMiddleware: RequestHandler = (
    req,
    res,
    next,
) => {
    const transactionId = req.header(HEADER_TRANSACTION_ID) ?? uuidV4();
    const parentRequestId = req.header(HEADER_PARENT_REQUEST_ID);
    const requestId = uuidV4();

    res.setHeader(HEADER_TRANSACTION_ID, transactionId);
    res.setHeader(HEADER_REQUEST_ID, requestId);
    if (parentRequestId) {
        res.setHeader(HEADER_PARENT_REQUEST_ID, parentRequestId);
    }

    res.locals.requestContext = {
        ...res.locals.requestContext,
        transactionId,
        requestId,
        parentRequestId,
    };

    next();
};
