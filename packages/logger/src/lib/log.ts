import type { Level } from './Level';
import { severity } from './Level';
import { MultiLogger } from './MultiLogger';
import { WinstonLogger } from './WinstonLogger';
import type { Mode } from './WinstonLogger';

/**
 * Singleton instance of the multi logger. The following default configuration is applied.
 *
 * - The log level is applied in order of precedence:
 *     - Log level is `process.env.LOG_LEVEL` when it is set to a valid log
 *     level.
 *     - Log level is `silent` when `process.env.NODE_ENV` is `test`.
 *     - Default log level is `info`.
 * - The log mode is defined by `process.env.NODE_ENV`:
 *     - `development` - a pretty logger is used.
 *     - `test` - logs are silenced.
 *     - Defaults to a production JSON logger.
 * - Registers a {@link WinstonLogger} instance.
 */
export const log = createDefaultLogger();

/**
 * Creates a logger with smart defaults.
 */
export function createDefaultLogger() {
    let level: Level = 'info';
    const levelFromEnv = process.env.LOG_LEVEL as Level;
    const mode = process.env.NODE_ENV;

    if (severity[levelFromEnv] !== undefined) {
        level = levelFromEnv;
    } else if (mode === 'test') {
        level = 'silent';
    }

    const logger = new MultiLogger();
    logger.register(new WinstonLogger({ mode: mode as Mode }));
    logger.configure({ level });

    return logger;
}
