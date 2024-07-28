import type { Level } from './Level.js';
import { toSeverity } from './Level.js';

/**
 * Options for the base Logger.
 */
export interface Options {
  /**
   * Level to respect in the logger. Messages of a lower level will not be
   * logged.
   * @default "info"
   */
  level?: Level;
}

/**
 * Log entry. Can be a string or an object for additional metadata.
 */
export interface Entry {
  message?: string;
  error?: Error;
  [key: string]: unknown;
}

/**
 * Log entry. Can be a string or an object for additional metadata.
 */
export interface AccessEntry {
  url: string;
  method: string;
  status: number;
  time: number;
  transactionId?: string;
  [key: string]: unknown;
}

/**
 * Base logger object.
 */
export abstract class Logger {
  // Ignored because the level is always specified in the constructor via the
  // configure function. The field should not be optional.
  // @ts-ignore
  protected level: Level;

  constructor(options: Options = {}) {
    this.configure(options);
  }

  /**
   * Returns the current logging level set in the logger.
   */
  getLevel() {
    return this.level;
  }

  /**
   * Sends log data to the {@link Logger.commit} function only if the level meets
   * the configured maximum.
   * @param level - Level of the data to log.
   * @param data - Data to be logged. Can be of any type.
   */
  log(level: Level, data: string | Error | Entry | AccessEntry): void {
    if (this.level !== 'silent' && toSeverity(level) <= toSeverity(this.level)) {
      let entry: Entry;
      if (data instanceof Error) {
        entry = { error: data };
      } else if (typeof data === 'string') {
        entry = { message: data };
      } else {
        entry = { ...data };
      }

      this.commit(level, entry);
    }
  }

  /**
   * Sets options on the logger.
   * @param options - Options to set.
   */
  configure(options: Options) {
    this.level = options.level ?? 'info';
  }

  /**
   * Function for processing log data when the level is allowed.
   * @param level - Level of the data to log.
   * @param entry - The entry to be logged.
   * @protected
   */
  protected abstract commit(level: Level, entry: Entry): void;

  /**
   * Logs debug messages.
   * @param data - Data to be logged.
   */
  debug(data: string | Entry): void {
    this.log('debug', data);
  }

  /**
   * Logs info messages.
   * @param data - Data to be logged.
   */
  info(data: string | Entry): void {
    this.log('info', data);
  }

  /**
   * Log HTTP access messages.
   * @param entry - Entry to be logged.
   */
  access(entry: AccessEntry): void {
    this.log('access', entry);
  }

  /**
   * Logs warn messages.
   * @param data - Data to be logged.
   */
  warn(data: string | Entry): void {
    this.log('warn', data);
  }

  /**
   * Logs error messages.
   * @param data - Data to be logged.
   */
  error(data: string | Entry): void {
    this.log('error', data);
  }
}
