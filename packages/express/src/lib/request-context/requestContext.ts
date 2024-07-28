/**
 * Fields containing information about the request currently being processed. @wesp-up/express with its default configuration will
 * set these fields.
 */
export interface BaseRequestContext {
  transactionId: string;
  requestId: string;
  parentRequestId?: string;
}

/**
 * Open-ended request context interface including default fields and any project-specific extensions.
 */
export interface RequestContext extends BaseRequestContext {}

declare global {
  namespace Express {
    interface Locals {
      requestContext: RequestContext;
    }
  }
}
