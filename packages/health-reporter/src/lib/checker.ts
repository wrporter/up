import assert from 'node:assert';

import type { ComponentCheckReport, HealthReporterConfig } from './health.schema.js';
import { STATUS } from './status.js';

const namePattern = /^[a-zA-Z-_]{1,50}$/;
const unitPattern = /^[a-zA-Z]{1,25}$/;

export interface ComponentCheckerConfig {
  /**
   * Name of the component being evaluated. Must match the pattern
   * `^[a-zA-Z-_]{1,50}$`.
   */
  componentName: string;
  /**
   * Name of the measurement being evaluated. Example: `responseTime`. Must
   * match the pattern `^[a-zA-Z-_]{1,50}$`.
   */
  measurementName: string;
  /**
   * Unit of the `observedValue`. Must match the pattern `^[a-zA-Z]{1,25}$`.
   */
  observedUnit: string;
  /**
   * The check to perform and returns the `observedValue`. Checks fail
   * whenever an error is thrown. Consumers may use this to provide
   * additional assertions on the result of a check. For example, throw
   * an error if a Component HTTP service does not respond with a 200
   * status code.
   */
  check: (options?: CheckOptions) => Promise<ComponentCheckReport['observedValue']>;
  /**
   * Maximum timeout to wait for the check to complete. Reaching this
   * timeout results in a `fail` status for the check.
   * @default 5000
   */
  timeoutMilliseconds?: number;
}

export interface CheckOptions extends Pick<HealthReporterConfig, 'serviceId'> {}

/**
 * The most generic health checker to support most use cases.
 */
export class ComponentChecker {
  public config: Required<ComponentCheckerConfig>;

  public constructor(config: ComponentCheckerConfig) {
    this.config = {
      ...config,
      timeoutMilliseconds: config.timeoutMilliseconds ?? 5000,
    };
    const { componentName, measurementName, observedUnit } = config;

    assert.match(
      componentName,
      namePattern,
      `componentName (${componentName}) does not match acceptable pattern ${namePattern}`,
    );
    assert.match(
      measurementName,
      namePattern,
      `measurementName (${measurementName}) does not match acceptable pattern ${namePattern}`,
    );
    assert.match(
      observedUnit,
      unitPattern,
      `observedUnit (${observedUnit}) does not match acceptable pattern ${unitPattern}`,
    );
  }

  /**
   * Evaluates the result of the health check.
   */
  async report(options?: CheckOptions): Promise<ComponentCheckReport> {
    let status = STATUS.PASS;
    let output: ComponentCheckReport['output'];
    let observedValue: ComponentCheckReport['observedValue'];

    try {
      observedValue = await timeout(this.config.check(options), this.config.timeoutMilliseconds);
    } catch (error) {
      status = STATUS.FAIL;
      if (error instanceof Error) {
        output = error.message;
      } else {
        output = error;
      }
    }

    return {
      status,
      observedValue,
      observedUnit: this.config.observedUnit,
      output,
    };
  }
}

export interface ResponseTimeComponentCheckerConfig
  extends Pick<ComponentCheckerConfig, 'componentName' | 'timeoutMilliseconds' | 'check'> {}

/**
 * Convenience health check that reports on the time taken to obtain a response
 * from the check in the `observedValue`.
 */
export class ResponseTimeComponentChecker extends ComponentChecker {
  constructor(config: ResponseTimeComponentCheckerConfig) {
    super({
      ...config,
      measurementName: 'responseTime',
      observedUnit: 'ms',
    });
  }

  async report(options?: CheckOptions): Promise<ComponentCheckReport> {
    const startTime = performance.now();
    const result = await super.report(options);
    const endTime = performance.now();
    const responseTime = Math.trunc(endTime - startTime);

    return {
      ...result,
      observedValue: responseTime,
    };
  }
}

export interface ResponseTimeHttpHealthCheckerConfig
  extends Pick<ResponseTimeComponentCheckerConfig, 'componentName' | 'timeoutMilliseconds'> {
  /** The URL to perform the check against. */
  url: string;
}

/**
 * Check the standard healthcheck route. Expects a 200 status and a JSON
 * response body of `{ "status": "ok" }`. Retries only one time with a
 * 500-millisecond delay on connection failures and status codes 500, 502, 503,
 * and 504.
 */
export class ResponseTimeHttpHealthChecker extends ResponseTimeComponentChecker {
  constructor({
    componentName,
    url,
    timeoutMilliseconds = 5000,
  }: ResponseTimeHttpHealthCheckerConfig) {
    super({
      componentName,
      check: async (options?: CheckOptions) => {
        const request = new Request(url);
        if (options?.serviceId) {
          request.headers.set('x-client-id', options.serviceId);
        }

        const response = await fetchRetry(request, 2);

        assert.equal(
          response.status,
          200,
          `expected status to equal 200, but got ${response.status}`,
        );

        const body = (await response.json()) as { status: string };
        assert.equal(
          body.status.toLowerCase(),
          'ok',
          `expected ok status, but got ${JSON.stringify(body)}`,
        );
      },
      timeoutMilliseconds,
    });
  }
}

function wait(delayMillis: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, process.env.NODE_ENV === 'test' ? 0 : delayMillis);
  });
}

const retryStatuses = [500, 502, 503, 504];

async function fetchRetry(request: Request, tries: number): Promise<Response> {
  async function onError(error: Error | Response | unknown): Promise<Response> {
    const triesLeft = tries - 1;
    if (triesLeft <= 0) {
      if (error instanceof Response) {
        return error;
      }
      throw error;
    }

    await wait(500);
    return fetchRetry(request, triesLeft);
  }

  try {
    const response = await fetch(request);
    if (retryStatuses.includes(response.status)) {
      return await onError(response);
    }
    return response;
  } catch (error) {
    return onError(error);
  }
}

/**
 * Utility function that will reject the provided promise if the timeout is
 * reached.
 * @param promise - Promise to timeout.
 * @param timeout - Timeout in milliseconds.
 */
async function timeout(promise: Promise<ComponentCheckReport['observedValue']>, timeout: number) {
  let timer;

  try {
    return await Promise.race([
      promise,
      new Promise((_resolve, reject) => {
        timer = setTimeout(() => reject(new Error(`timeout of ${timeout}ms reached`)), timeout);
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}
