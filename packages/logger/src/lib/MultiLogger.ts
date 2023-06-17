import type { Level } from './Level';
import type { Entry, Options } from './Logger';
import { Logger } from './Logger';

/**
 * Multi logger that contains a collection of other loggers. Alone, this logger
 * does not log any data and is intended to be used with other loggers.
 */
export class MultiLogger extends Logger {
    private loggers: Logger[] = [];

    /**
     * Adds the provided loggers to the underlying logger collection.
     * @param loggers - Loggers to add.
     */
    register(...loggers: Logger[]): void {
        loggers.forEach((logger) => {
            this.loggers.push(logger);
        });
    }

    configure(options: Options) {
        super.configure(options);
        this.loggers?.forEach((logger) => logger.configure(options));
    }

    protected commit(level: Level, data: Entry): void {
        this.loggers.forEach((logger) => logger.log(level, data));
    }
}
