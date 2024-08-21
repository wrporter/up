import type { Request, Response } from 'express';
import promBundle from 'express-prom-bundle';

import { formatStatusCode, normalizePath } from './metrics.middleware.js';

import { metricsMiddleware } from './index.js';

vi.mock('express-prom-bundle');

describe('metricsMiddleware', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('implements promBundle with default options selected', () => {
    metricsMiddleware();

    expect(promBundle).toHaveBeenCalledOnce();
    expect(promBundle).toHaveBeenCalledWith({
      includeMethod: true,
      includePath: true,
      includeStatusCode: true,
      includeUp: true,
      promClient: {
        collectDefaultMetrics: {},
      },
      normalizePath,
      formatStatusCode,
    });
  });

  it('implements promBundle with optional overrides', () => {
    metricsMiddleware({
      includePath: false,
      includeUp: false,
    });

    expect(promBundle).toHaveBeenCalledOnce();
    expect(promBundle).toHaveBeenCalledWith({
      includeMethod: true,
      includePath: false,
      includeStatusCode: true,
      includeUp: false,
      promClient: {
        collectDefaultMetrics: {},
      },
      normalizePath,
      formatStatusCode,
    });
  });

  it.each([
    { status: 201, want: '2xx' },
    { status: 302, want: '3xx' },
    { status: 404, want: 404 },
    { status: 500, want: 500 },
  ])(`formats status code $status to $want`, ({ status, want }) => {
    const res = { statusCode: status } as Response;
    expect(formatStatusCode(res)).toEqual(want);
  });

  it('maps requests without a route (static assets, 404s, 401s, etc...) to "no-route-applied"', () => {
    const req = {
      res: {
        statusCode: 404,
      },
    } as Request;
    const opts = {};
    const path = normalizePath(req, opts);
    expect(path).toEqual('no-route-applied');
  });
});
