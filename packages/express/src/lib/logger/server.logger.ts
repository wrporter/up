import type { Entry, Level, Options } from '@wesp-up/logger';
import { Logger, log } from '@wesp-up/logger';
import { metrics } from '@wesp-up/metrics';

/**
 * A logger class that can be used by consumers of @wesp-up/express. Emits counter metrics for log
 * levels. Useful for alerting on high error rates.
 */
export class ServerLogger extends Logger {
  protected commit(level: Level, entry: Entry): void {
    metrics.logCount.labels({ level }).inc();
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
