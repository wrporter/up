import promBundle from 'express-prom-bundle';

import { metricsMiddleware } from '.';

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
        });
    });
});
