import type { RequestLogger } from '../logger/index.js';

/**
 * Fields containing information about the request currently being processed.
 * `@wesp-up/express` with its default configuration will set these fields.
 *
 * Open-ended request context interface including default fields and any
 * project-specific extensions.
 */
export interface RequestContext {
  transactionId: string;
  requestId: string;
  parentRequestId?: string;
  log: RequestLogger;
}

declare global {
  namespace Express {
    interface Request {
      context: RequestContext;
    }
  }
}
