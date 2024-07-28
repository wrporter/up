import type { AccessEntry } from '@wesp-up/logger';
import { log } from '@wesp-up/logger';
import type { Request } from 'express';

import { RequestLogger } from './request.logger.js';
import type { RequestContext } from '../request-context/index.js';

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
let req: Request;

beforeEach(() => {
  req = {
    context: {} as RequestContext,
  } as Request;
  logger = new RequestLogger(req);
  logger.configure({ level: 'info' });
  vi.mocked(log.getLevel).mockClear();
  vi.mocked(log.configure).mockClear();
});

it('logs trace IDs', () => {
  req.context.requestId = 'request-id';
  req.context.transactionId = 'transaction-id';

  logger.info('Zap!');

  expect(log.log).toHaveBeenCalledOnce();
  expect(log.log).toHaveBeenCalledWith('info', {
    message: 'Zap!',
    requestId: 'request-id',
    transactionId: 'transaction-id',
  });
});

it('logs global metadata', () => {
  logger.addGlobalMeta({ prop: 'test-meta' });

  logger.info('Zap!');
  expect(log.log).toHaveBeenCalledWith('info', {
    message: 'Zap!',
    meta: { prop: 'test-meta' },
  });

  logger.error('Zap!');
  expect(log.log).toHaveBeenCalledWith('error', {
    message: 'Zap!',
    meta: { prop: 'test-meta' },
  });

  logger.access({ method: 'GET' } as AccessEntry);
  expect(log.log).toHaveBeenCalledWith('access', {
    method: 'GET',
    meta: { prop: 'test-meta' },
  });
});

it('logs event metadata', () => {
  logger.addEventMeta({ prop: 'test-meta' });

  logger.info('Zap!');
  expect(log.log).toHaveBeenCalledWith('info', {
    message: 'Zap!',
    meta: { prop: 'test-meta' },
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
    meta: { prop: 'test-meta' },
  });
});

it('merges metadata', () => {
  logger.addGlobalMeta({ prop1: 'test-meta1' });
  logger.addGlobalMeta({ prop1: 'overwrite-meta1', prop2: 'test-meta2' });

  logger.info({ message: 'Zap!' });

  expect(log.log).toHaveBeenCalledWith('info', {
    message: 'Zap!',
    meta: { prop1: 'overwrite-meta1', prop2: 'test-meta2' },
  });
});
