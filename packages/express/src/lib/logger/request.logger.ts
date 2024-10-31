import type { Entry, Level, Options } from '@wesp-up/logger';

import { ServerLogger } from './server.logger.js';

/**
 * Metadata to be included with logs.
 */
export interface Meta extends Record<string, unknown> {}

/**
 * Scope metadata can be applied to.
 */
export type Scope = 'global' | 'access' | 'event';

interface ScopedMeta extends Record<Scope, Meta> {}

/**
 * A contextual logger that decorates logs with metadata.
 * @example
 * ```typescript
 * function route(req, res, next) {
 *     req.context.log.addGlobalMeta({ myProp: 'my-prop' });
 *     log.info({ message: 'power-up' });
 *     // ->
 *     // {
 *     //   "message": "power-up",
 *     //   "myProp": "my-prop"
 *     // }
 * }
 * ```
 */
export class RequestLogger extends ServerLogger {
  private meta: ScopedMeta = { global: {}, access: {}, event: {} };

  constructor(options?: Options) {
    super(options);
  }

  /**
   * Add global metadata to all logs, stored under the `meta` property.
   * Consecutive calls to this method shallowly merge the metadata.
   * @param meta - Metadata to include with logs.
   */
  addGlobalMeta(meta: Meta) {
    this.addScopedMeta('global', meta);
  }

  /**
   * Add metadata only to access logs, stored under the `meta` property.
   * Consecutive calls to this method shallowly merge the metadata.
   * @param meta - Metadata to include with logs.
   */
  addAccessMeta(meta: Meta) {
    this.addScopedMeta('access', meta);
  }

  /**
   * Add metadata only to event logs (all logs that are not access logs),
   * stored under the `meta` property. Consecutive calls to this method
   * shallowly merge the metadata.
   * @param meta - Metadata to include with logs.
   */
  addEventMeta(meta: Meta) {
    this.addScopedMeta('event', meta);
  }

  /**
   * Adds scoped metadata to logs. Consecutive calls to this method
   * shallowly merge the metadata.
   * @param scope - The scope to apply the metadata to.
   * @param meta - Metadata to include with logs.
   * @protected
   */
  protected addScopedMeta(scope: Scope, meta: Meta) {
    this.meta[scope] = { ...this.meta[scope], ...meta };
  }

  protected commit(level: Level, entry: Entry): void {
    let meta = this.meta.global;
    if (level === 'access') {
      meta = { ...meta, ...this.meta.access };
    } else {
      meta = { ...meta, ...this.meta.event };
    }

    const data: Entry = {
      ...entry,
      ...meta,
    };

    super.commit(level, data);
  }
}
