import type { IRouter } from 'express';
import { Router } from 'express';

import { healthHandler } from './health.handler.js';
import type { VersionMeta } from './version.handler.js';
import { createVersionHandler } from './version.handler.js';

/** Options for the {@link metaRouter}. */
export interface MetaOptions {
  /** Path prefix for the router. Defaults to `''`. */
  pathPrefix?: string;
  /** Version information. Defaults to environment variables. */
  versionMeta?: VersionMeta;
}

/**
 * Router for meta routes, such as version and healthcheck.
 * @param options - {@link MetaOptions}
 */
export function metaRouter(options: MetaOptions): IRouter {
  const { pathPrefix = '', versionMeta } = options;
  const router = Router();

  router.get(`${pathPrefix}/healthcheck`, healthHandler);
  router.get(`${pathPrefix}/version`, createVersionHandler(versionMeta));

  return router;
}
