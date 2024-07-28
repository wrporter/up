import type { Request } from 'express';
import promBundle from 'express-prom-bundle';

import { NormalizeExpressPath } from './metrics.middleware.js';

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
      normalizePath: NormalizeExpressPath,
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
      normalizePath: NormalizeExpressPath,
    });
  });

  describe('when normalizing paths through the default normalization', () => {
    it('maps the path based on the express router value, e.g. values like "/journeys/:journeyId"', () => {
      const req = {
        path: '/targetaudience/api/v1/directories/POOL_1i832Jf78xt6NRB/segments/SG_3PjyKfTVIYN70Ou',
        route: {
          path: '/targetaudience/api/v1/directories/:directoryId/segments/:segmentId',
        },
      } as Request;
      const opts = {};
      const path = NormalizeExpressPath(req, opts);
      expect(path).toEqual('/targetaudience/api/v1/directories/:directoryId/segments/:segmentId');
    });
    it('maps requests without a route (static assets, 404s, 401s, etc...) to "no-route-applied"', () => {
      const req = {
        path: '/not-a-real-path',
        route: undefined,
        res: {
          statusCode: 404,
        },
      } as Request;
      const opts = {};
      const path = NormalizeExpressPath(req, opts);
      expect(path).toEqual('no-route-applied');
    });
  });
});
