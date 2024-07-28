import { vi } from 'vitest';

import type { Level } from './Level.js';
import type { Entry, Options } from './Logger.js';
import { Logger } from './Logger.js';
import { MultiLogger } from './MultiLogger.js';

class TestLogger1 extends Logger {
  public mockLog = vi.fn();

  public mockConfigure = vi.fn();

  configure(options: Options) {
    this.mockConfigure?.(options);
  }

  log(level: Level, data: Entry) {
    this.commit(level, data);
  }

  protected commit(level: Level, data: Entry): void {
    this.mockLog(level, data);
  }
}

class TestLogger2 extends Logger {
  public mockLog = vi.fn();

  public mockConfigure = vi.fn();

  configure(options: Options) {
    this.mockConfigure?.(options);
  }

  log(level: Level, data: Entry) {
    this.commit(level, data);
  }

  protected commit(level: Level, data: Entry): void {
    this.mockLog(level, data);
  }
}

describe('MultiLogger', () => {
  let logger1: TestLogger1;
  let logger2: TestLogger2;
  let log: MultiLogger;

  beforeEach(() => {
    log = new MultiLogger();
    logger1 = new TestLogger1();
    logger2 = new TestLogger2();
  });

  it('sends logs to all underlying loggers', () => {
    log.configure({ level: 'debug' });
    log.register(logger1, logger2);

    log.debug('check');

    expect(logger1.mockLog).toHaveBeenCalledWith('debug', {
      message: 'check',
    });
    expect(logger2.mockLog).toHaveBeenCalledWith('debug', {
      message: 'check',
    });
  });

  it('configures all underlying loggers', () => {
    log.register(logger1, logger2);
    const options: Options = { level: 'debug' };

    log.configure(options);

    expect(logger1.mockConfigure).toHaveBeenCalledWith(options);
    expect(logger2.mockConfigure).toHaveBeenCalledWith(options);
  });
});
