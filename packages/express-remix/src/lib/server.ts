import type { Options as ServerOptions } from '@wesp-up/express';
import { Server } from '@wesp-up/express';
import type { Application } from 'express';

import type { RemixOptions } from './remix.js';
import { useRemix } from './remix.js';

/**
 * Creates an Express server integrated with Remix and ready for production.
 */
export function createRemixServer(options: Partial<RemixOptions & ServerOptions> = {}) {
  const server = new RemixServer(options);
  server.init();
  return server;
}

/**
 * An Express server integrated with Remix. Inherits from the server from
 * \@wesp-up/express.
 */
export class RemixServer extends Server {
  private readonly remixOptions?: Partial<RemixOptions>;

  constructor(options?: Partial<RemixOptions & ServerOptions>) {
    super(options as ServerOptions);
    this.remixOptions = options;
  }

  protected postMountApp(app: Application): void {
    useRemix(app, this.remixOptions);
  }
}
