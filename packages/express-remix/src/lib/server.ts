import { broadcastDevReady } from '@remix-run/node';
import type { Options as ServerOptions } from '@wesp-up/express';
import { Server } from '@wesp-up/express';
import type { Application } from 'express';

import type { RemixOptions } from './remix';
import { useRemix } from './remix';

/**
 * Creates an Express server integrated with Remix and ready for production.
 */
export async function createRemixServer(options: Partial<RemixOptions & ServerOptions> = {}) {
    const server = new RemixServer(options);
    await server.init();
    return server;
}

/**
 * An Express server integrated with Remix. Inherits from the server from
 * \@wesp-up/express.
 */
export class RemixServer extends Server {
    private readonly remixOptions?: Partial<RemixOptions>;

    public initialBuild?: any;

    constructor(options?: Partial<RemixOptions & ServerOptions>) {
        super(options as ServerOptions);
        this.remixOptions = options;
    }

    protected async postMountApp(app: Application) {
        this.initialBuild = await useRemix(app, this.remixOptions);
    }

    protected appReady() {
        if (process.env.NODE_ENV === 'development') {
            broadcastDevReady(this.initialBuild);
        }
    }
}
