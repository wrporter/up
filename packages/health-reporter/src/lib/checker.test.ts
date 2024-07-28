import { describe } from 'vitest';

import {
  ComponentChecker,
  ResponseTimeComponentChecker,
  ResponseTimeHttpHealthChecker,
} from './checker.js';

global.fetch = vi.fn();

const mockConfig = {
  componentName: 'MockComponent',
  measurementName: 'time',
  observedUnit: 'ms',
  check: () => Promise.resolve(),
};

it.each([
  {
    name: 'throws an assertion error for an invalid componentName format',
    create: () => new ComponentChecker({ ...mockConfig, componentName: '$pecial' }),
  },
  {
    name: 'throws an assertion error for an invalid measurementName format',
    create: () =>
      new ComponentChecker({
        ...mockConfig,
        measurementName: '$pecial',
      }),
  },
  {
    name: 'throws an assertion error for an invalid observedUnit format',
    create: () => new ComponentChecker({ ...mockConfig, observedUnit: '$pecial' }),
  },
])('ComponentChecker.constructor - $name', ({ create }) => {
  expect(create).toThrow();
});

it.each([
  {
    name: 'returns passing output for success',
    check: new ComponentChecker({
      ...mockConfig,
      check: () => Promise.resolve(5),
    }),
    want: {
      status: 'pass',
      observedUnit: 'ms',
      observedValue: 5,
    },
  },
  {
    name: 'returns failure output for a thrown error',
    check: new ComponentChecker({
      ...mockConfig,
      check: () => Promise.reject(new Error('Failed')),
    }),
    want: {
      status: 'fail',
      observedUnit: 'ms',
      output: 'Failed',
    },
  },
  {
    name: 'returns failure output from a non-error being thrown',
    check: new ComponentChecker({
      ...mockConfig,
      // eslint-disable-next-line @typescript-eslint/prefer-promise-reject-errors
      check: () => Promise.reject({ some: 'object' }),
    }),
    want: {
      status: 'fail',
      observedUnit: 'ms',
      output: { some: 'object' },
    },
  },
  {
    name: 'returns failure output for a timeout',
    check: new ComponentChecker({
      ...mockConfig,
      timeoutMilliseconds: 1,
      check: () =>
        new Promise((resolve) => {
          setTimeout(resolve, 10);
        }),
    }),
    want: {
      status: 'fail',
      observedUnit: 'ms',
      output: 'timeout of 1ms reached',
    },
  },
])('ComponentChecker.report - $name', async ({ check, want }) => {
  await expect(check.report()).resolves.toEqual(want);
});

it.each([
  {
    name: 'returns passing output for success',
    check: new ResponseTimeComponentChecker({
      ...mockConfig,
    }),
    want: {
      status: 'pass',
      observedUnit: 'ms',
      observedValue: expect.any(Number),
    },
  },
])('ResponseTimeComponentChecker.report - $name', async ({ check, want }) => {
  await expect(check.report()).resolves.toEqual(want);
});

describe('ResponseTimeHttpHealthChecker', () => {
  const url = 'https://internal-lb.test/healthcheck';

  it('sends the x-client-id header', async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ status: 'ok' })));
    const checker = new ResponseTimeHttpHealthChecker({
      ...mockConfig,
      url,
    });

    await checker.report({ serviceId: 'mock-service-id' });

    const request = vi.mocked(fetch).mock.calls[0][0] as Request;
    expect(request.headers.get('x-client-id')).toEqual('mock-service-id');
  });

  it.each([
    {
      name: 'returns passing output for success',
      setup: () => {
        vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({ status: 'ok' })));
      },
      check: new ResponseTimeHttpHealthChecker({
        ...mockConfig,
        url,
      }),
      want: {
        status: 'pass',
        observedUnit: 'ms',
        observedValue: expect.any(Number),
      },
    },
    {
      name: 'retries once on failures',
      setup: () => {
        vi.mocked(fetch)
          .mockResolvedValueOnce(new Response(null, { status: 502 }))
          .mockResolvedValueOnce(new Response(JSON.stringify({ status: 'ok' })));
      },
      check: new ResponseTimeHttpHealthChecker({
        ...mockConfig,
        url,
      }),
      want: {
        status: 'pass',
        observedUnit: 'ms',
        observedValue: expect.any(Number),
      },
    },
    {
      name: 'percolates network failures',
      setup: () => {
        vi.mocked(fetch).mockRejectedValue(new Error('connection error'));
      },
      check: new ResponseTimeHttpHealthChecker({
        ...mockConfig,
        url,
      }),
      want: {
        status: 'fail',
        observedUnit: 'ms',
        observedValue: expect.any(Number),
        output: 'connection error',
      },
    },
    {
      name: 'percolates persistent response failures',
      setup: () => {
        vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 502 }));
      },
      check: new ResponseTimeHttpHealthChecker({
        ...mockConfig,
        url,
      }),
      want: {
        status: 'fail',
        observedUnit: 'ms',
        observedValue: expect.any(Number),
        output: 'expected status to equal 200, but got 502',
      },
    },
  ])('report - $name', async ({ setup, check, want }) => {
    setup();

    await expect(check.report()).resolves.toEqual(want);
  });
});
