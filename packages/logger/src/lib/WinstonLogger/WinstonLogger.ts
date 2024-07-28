import type { Logger as Winston } from 'winston';
import { createLogger, transports } from 'winston';

import { devFormat } from './dev.js';
import { prodFormat } from './prod.js';
import type { Level } from '../Level.js';
import { severity } from '../Level.js';
import type { Options as BaseOptions, Entry } from '../Logger.js';
import { Logger } from '../Logger.js';

/**
 * Mode to put the logger in. When `development`, a pretty logger is used,
 * otherwise a production JSON logger is used.
 */
export type Mode = 'test' | 'development' | 'production';

/**
 * Options for the Winston Logger.
 */
export interface Options extends BaseOptions {
  mode?: Mode;
}

/**
 * A production-ready logger for application and HTTP access logs. Uses
 * [Winston](https://github.com/winstonjs/winston) for logging. Merges
 * consecutive parameters passed to its logging functions. For example,
 *
 * ```typescript
 * log.info('Fancy message', { other: 'info' });
 * ```
 *
 * Will output a log message with the following fields included.
 *
 * ```json
 * {"message":"Fancy message","other":"info"}
 * ```
 *
 * This means that consecutive parameters that match previous ones will
 * override them.
 */
export class WinstonLogger extends Logger {
  public logger: Winston;

  constructor(options?: Options) {
    super(options);
    const silent = this.level === 'silent';
    const format = this.getFormat(options?.mode);

    this.logger = createLogger({
      silent,
      levels: severity,
      level: this.level,
      format,
      transports: [new transports.Console()],
    });
  }

  protected commit(level: Level, data: Entry): void {
    this.logger.log(level, data);
  }

  configure(options: Options) {
    super.configure(options);
    if (this.logger && options.level) {
      this.logger.level = options.level;
    }
  }

  private getFormat(mode?: Mode) {
    if (mode === 'development') {
      return devFormat;
    }
    return prodFormat;
  }
}
