import type { Mock } from 'vitest';

import { Time, defaultBuckets, metrics } from './metrics.js';

const { mockStartTimer, mockEndTimer } = vi.hoisted(() => {
  const mockEndTimer = vi.fn();
  const mockStartTimer = vi.fn(() => mockEndTimer);
  return { mockStartTimer, mockEndTimer };
});

const { mockHistogram, mockCounter } = vi.hoisted(() => {
  return { mockHistogram: vi.fn(), mockCounter: vi.fn() };
});

vi.mock('prom-client', () => ({
  default: {
    Histogram: vi.fn((options) => {
      mockHistogram(options);
      return { startTimer: mockStartTimer };
    }),
    Counter: vi.fn((options) => mockCounter(options)),
  },
}));

class MockClass {
  constructor(private mockTimedMethod: Function) {}

  @Time('mock_dependency', 'mock_sync_operation')
  timedSyncMethod(value: string) {
    return this.mockTimedMethod(value);
  }

  @Time('mock_dependency', 'mock_async_operation')
  async timedAsyncMethod(value: string) {
    return await Promise.resolve(this.mockTimedMethod(value));
  }
}

function getCallOrder(mock: Mock) {
  return mock.mock.invocationCallOrder[0];
}

it('sets up a log counter', () => {
  expect(metrics.logCount).not.toBeUndefined();
  expect(mockCounter).toHaveBeenCalledOnce();
});

it('uses default and custom bucket configurations', () => {
  expect(metrics.dependency).not.toBeUndefined();
  expect(mockHistogram).toHaveBeenCalledWith({
    buckets: defaultBuckets,
    help: expect.any(String),
    labelNames: expect.any(Array),
    name: 'dependency_duration_seconds',
  });

  metrics.configureDependencyHistogram({ buckets: [1, 2, 3] });

  expect(mockHistogram).toHaveBeenCalledWith({
    buckets: [1, 2, 3],
    help: expect.any(String),
    labelNames: expect.any(Array),
    name: 'dependency_duration_seconds',
  });
  expect(mockHistogram).toHaveBeenCalledTimes(2);
});

it('times sync operations', () => {
  const mockMethod = vi.fn().mockImplementation(() => 'sync_result');
  const instance = new MockClass(mockMethod);

  expect(instance.timedSyncMethod('mock_param')).toEqual('sync_result');

  expect(getCallOrder(mockStartTimer)).toBeLessThan(getCallOrder(mockMethod));
  expect(getCallOrder(mockMethod)).toBeLessThan(getCallOrder(mockEndTimer));
  expect(mockStartTimer).toHaveBeenNthCalledWith(1, {
    dependency: 'mock_dependency',
    operation: 'mock_sync_operation',
  });
  expect(mockMethod).toHaveBeenNthCalledWith(1, 'mock_param');
  expect(mockEndTimer).toHaveBeenNthCalledWith(1, { status: 'pass' });
});

it('times sync operations with fail status', () => {
  const mockMethod = vi.fn().mockImplementation(() => {
    throw new Error('mock fail');
  });
  const instance = new MockClass(mockMethod);

  expect(() => instance.timedSyncMethod('mock_param')).toThrow('mock fail');
  expect(getCallOrder(mockStartTimer)).toBeLessThan(getCallOrder(mockMethod));
  expect(getCallOrder(mockMethod)).toBeLessThan(getCallOrder(mockEndTimer));
  expect(mockStartTimer).toHaveBeenNthCalledWith(1, {
    dependency: 'mock_dependency',
    operation: 'mock_sync_operation',
  });
  expect(mockMethod).toHaveBeenNthCalledWith(1, 'mock_param');
  expect(mockEndTimer).toHaveBeenNthCalledWith(1, { status: 'fail' });
});

it('times async operations', async () => {
  const mockMethod = vi.fn().mockImplementation((value) => value);
  const instance = new MockClass(mockMethod);

  expect(await instance.timedAsyncMethod('mock_return')).toEqual('mock_return');

  expect(getCallOrder(mockStartTimer)).toBeLessThan(getCallOrder(mockMethod));
  expect(getCallOrder(mockMethod)).toBeLessThan(getCallOrder(mockEndTimer));
  expect(mockStartTimer).toHaveBeenNthCalledWith(1, {
    dependency: 'mock_dependency',
    operation: 'mock_async_operation',
  });
  expect(mockMethod).toHaveBeenNthCalledWith(1, 'mock_return');
  expect(mockEndTimer).toHaveBeenNthCalledWith(1, { status: 'pass' });
});

it('times async operations with fail status', async () => {
  const mockMethod = vi.fn().mockImplementation(() => Promise.reject(new Error('mock fail')));
  const instance = new MockClass(mockMethod);

  await expect(() => instance.timedAsyncMethod('mock_return')).rejects.toThrow('mock fail');

  expect(getCallOrder(mockStartTimer)).toBeLessThan(getCallOrder(mockMethod));
  expect(getCallOrder(mockMethod)).toBeLessThan(getCallOrder(mockEndTimer));
  expect(mockStartTimer).toHaveBeenNthCalledWith(1, {
    dependency: 'mock_dependency',
    operation: 'mock_async_operation',
  });
  expect(mockMethod).toHaveBeenNthCalledWith(1, 'mock_return');
  expect(mockEndTimer).toHaveBeenNthCalledWith(1, { status: 'fail' });
});
