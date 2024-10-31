import type { AccessEntry } from '@wesp-up/logger';
import { log } from '@wesp-up/logger';

import { RequestLogger } from './request.logger.js';

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

let logger: RequestLogger;

beforeEach(() => {
  logger = new RequestLogger();
  logger.configure({ level: 'info' });
  vi.mocked(log.getLevel).mockClear();
  vi.mocked(log.configure).mockClear();
});

it('logs global metadata', () => {
  logger.addGlobalMeta({ prop: 'test-meta' });

  logger.info('Zap!');
  expect(log.log).toHaveBeenCalledWith('info', {
    message: 'Zap!',
    prop: 'test-meta',
  });

  logger.error('Zap!');
  expect(log.log).toHaveBeenCalledWith('error', {
    message: 'Zap!',
    prop: 'test-meta',
  });

  logger.access({ method: 'GET' } as AccessEntry);
  expect(log.log).toHaveBeenCalledWith('access', {
    method: 'GET',
    prop: 'test-meta',
  });
});

it('logs event metadata', () => {
  logger.addEventMeta({ prop: 'test-meta' });

  logger.info('Zap!');
  expect(log.log).toHaveBeenCalledWith('info', {
    message: 'Zap!',
    prop: 'test-meta',
  });

  logger.access({ method: 'GET' } as AccessEntry);
  expect(log.log).toHaveBeenCalledWith('access', {
    method: 'GET',
  });
});

it('logs access metadata', () => {
  logger.addAccessMeta({ prop: 'test-meta' });

  logger.info('Zap!');
  expect(log.log).toHaveBeenCalledWith('info', {
    message: 'Zap!',
  });

  logger.access({ method: 'GET' } as AccessEntry);
  expect(log.log).toHaveBeenCalledWith('access', {
    method: 'GET',
    prop: 'test-meta',
  });
});

it('merges metadata', () => {
  logger.addGlobalMeta({ prop1: 'test-meta1' });
  logger.addGlobalMeta({ prop1: 'overwrite-meta1', prop2: 'test-meta2' });

  logger.info({ message: 'Zap!' });

  expect(log.log).toHaveBeenCalledWith('info', {
    message: 'Zap!',
    prop1: 'overwrite-meta1',
    prop2: 'test-meta2',
  });
});
