import { log } from '@wesp-up/logger';

import { ServerLogger } from './logger.js';

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
vi.mock('../request-context', () => ({ requestContext: vi.fn() }));

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
