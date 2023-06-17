import type { Entry, Level, Options } from '@wesp-up/logger';
import { Logger, log } from '@wesp-up/logger';

/**
 * A logger class that can be used by consumers of @wesp-up/express. Does not currently do anything unique, but may in the future.
 */
export class ServerLogger extends Logger {
    // eslint-disable-next-line class-methods-use-this
    protected commit(level: Level, entry: Entry): void {
        log.log(level, entry);
    }

    configure(options: Options) {
        if (options.level) {
            this.level = options.level;
            log.configure(options);
        } else {
            this.level = log.getLevel();
        }
    }
}
