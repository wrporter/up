import { log } from '@wesp-up/logger';
import { metrics } from '@wesp-up/metrics';

import { ServerLogger } from './server.logger.js';

const { mockMetricsInc } = vi.hoisted(() => ({ mockMetricsInc: vi.fn() }));

vi.mock('@wesp-up/metrics', () => ({
  metrics: { logCount: { labels: vi.fn(() => ({ inc: mockMetricsInc })) } },
}));

vi.mock('@wesp-up/logger', async () => {
  const actual = await vi.importActual<typeof import('@wesp-up/logger')>('@wesp-up/logger');
  return {
    ...actual,
    log: {
      log: vi.fn(),
      getLevel: vi.fn(),
      configure: vi.fn(),
    },
  };
});

let logger: ServerLogger;

beforeEach(() => {
  logger = new ServerLogger();
  logger.configure({ level: 'info' });
  vi.mocked(log.getLevel).mockClear();
  vi.mocked(log.configure).mockClear();
});

it('configures with the level of the default logger if one is not provided', () => {
  vi.mocked(log.getLevel).mockReturnValue('access');

  logger.configure({});

  expect(logger.getLevel()).toEqual('access');
});

it('configures with the provided level', () => {
  logger.configure({ level: 'warn' });

  expect(log.getLevel).not.toHaveBeenCalled();
  expect(logger.getLevel()).toEqual('warn');
});

it('passes data to the underlying logger', () => {
  logger.info({ message: 'Zap!' });

  expect(log.log).toHaveBeenCalledWith('info', {
    message: 'Zap!',
  });
});

it('counts log levels', () => {
  logger.info('test metrics');
  logger.error('test metrics');

  expect(metrics.logCount.labels).toHaveBeenCalledWith({ level: 'info' });
  expect(metrics.logCount.labels).toHaveBeenCalledWith({ level: 'error' });
  expect(mockMetricsInc).toHaveBeenCalledTimes(2);
});
