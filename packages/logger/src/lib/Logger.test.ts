import type { Mock } from 'vitest';
import { vi } from 'vitest';

import type { Level } from './Level.js';
import type { Entry, Options } from './Logger.js';
import { Logger } from './Logger.js';

class TestLogger extends Logger {
  private readonly mock: Mock;

  constructor(mock: Mock, options?: Options) {
    super(options);
    this.mock = mock;
  }

  protected commit(level: Level, ...data: Entry[]): void {
    this.mock(level, ...data);
  }
}

describe('Logger', () => {
  let logger: Logger;
  let mockLog: Mock;

  beforeEach(() => {
    mockLog = vi.fn();
    logger = new TestLogger(mockLog, { level: 'debug' });
  });

  it('retrieves the current logging level', () => {
    logger = new TestLogger(mockLog);
    expect(logger.getLevel()).toEqual('info');
  });

  it('defaults to info level when no options are provided', () => {
    logger = new TestLogger(mockLog);
    logger.debug('one');
    expect(mockLog).not.toHaveBeenCalled();

    logger.info('two');
    expect(mockLog).toHaveBeenCalledWith('info', { message: 'two' });
  });

  it('defaults to info level when no level is provided', () => {
    logger = new TestLogger(mockLog, {});
    logger.debug('one');
    expect(mockLog).not.toHaveBeenCalled();

    logger.info('two');
    expect(mockLog).toHaveBeenCalledWith('info', { message: 'two' });
  });

  it('uses straight object values', () => {
    logger.debug({ message: 'object message' });

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith('debug', {
      message: 'object message',
    });
  });

  it('passes error objects', () => {
    const error = new Error('fail');
    logger.log('error', error);

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith('error', {
      error,
    });
  });

  it('includes additional fields', () => {
    logger.debug({ message: 'object message', other: 'field' });

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith('debug', {
      message: 'object message',
      other: 'field',
    });
  });

  it('calls debug', () => {
    logger.debug('jello');

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith('debug', { message: 'jello' });
  });

  it('calls info', () => {
    logger.info('jello');

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith('info', { message: 'jello' });
  });

  it('calls access', () => {
    logger.access({
      url: '/service/path',
      method: 'GET',
      status: 200,
      time: 103,
    });

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith('access', {
      url: '/service/path',
      method: 'GET',
      status: 200,
      time: 103,
    });
  });

  it('calls warn', () => {
    logger.warn('jello');

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith('warn', { message: 'jello' });
  });

  it('calls error', () => {
    logger.error('jello');

    expect(mockLog).toHaveBeenCalledTimes(1);
    expect(mockLog).toHaveBeenCalledWith('error', { message: 'jello' });
  });

  it('does not call error when silent', () => {
    logger.configure({ level: 'silent' });
    logger.error('jello');

    expect(mockLog).not.toHaveBeenCalled();
  });
});
