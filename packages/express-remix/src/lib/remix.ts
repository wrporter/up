import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

import { createRequestHandler } from '@remix-run/express';
import type { ServerBuild } from '@remix-run/node';
import { broadcastDevReady } from '@remix-run/node';
import type { Application, RequestHandler } from 'express';
import express from 'express';

/**
 * Remix options.
 */
export interface RemixOptions {
    /**
     * The build path for the backend server.
     * @default `${PWD}/build`
     */
    serverBuildPath: string;
    /**
     * The root folder for public assets.
     * @default `public`
     */
    assetsRoot: string;
    /**
     * The build directory for remix assets, should be a child of
     * {@link RemixOptions.assetsRoot}.
     * @default `public/build`
     */
    assetsBuildDirectory: string;
    /**
     * The route path for public assets.
     * @default `/build/`
     */
    publicPath: string;
}

/**
 * Smart defaults for Remix. You normally shouldn't have to change these.
 */
export const defaultRemixOptions: RemixOptions = {
    serverBuildPath: path.join(process.cwd(), 'build'),
    assetsBuildDirectory: 'public/build',
    publicPath: '/build/',
    assetsRoot: 'public',
};

/**
 * Apply Remix middleware and assets to an Express application. This should be
 * applied towards the end of an application since control will be given to
 * Remix at this point. Any custom Express routes and middleware should be
 * applied previous to using this.
 * @param app - Express app to apply Remix middleware to.
 * @param options - Options for configuring Remix assets and middleware.
 */
export async function useRemix(app: Application, options?: Partial<RemixOptions>) {
    const BUILD_PATH = path.resolve('build/index.js');
    const VERSION_PATH = path.resolve('build/version.txt');
    const initialBuild = await reimportServer();
    const remixHandler =
        process.env.NODE_ENV === 'development'
            ? await createDevRequestHandler(initialBuild)
            : createRequestHandler({
                  build: initialBuild,
                  mode: initialBuild.mode,
              });

    const opts = {
        ...defaultRemixOptions,
        ...options,
    };
    const { publicPath, assetsBuildDirectory, assetsRoot } = opts;

    /* -------------------------- Middleware ---------------------------- */
    // Do not allow trailing slashes in URLs
    app.use((req, res, next) => {
        if (req.path.endsWith('/') && req.path.length > 1) {
            const query = req.url.slice(req.path.length);
            const safePath = req.path.slice(0, -1).replace(/\/+/g, '/');
            res.redirect(301, safePath + query);
            return;
        }
        next();
    });

    /* -------------------------- Static Assets ------------------------- */
    // Remix fingerprints its assets so we can cache forever.
    app.use(
        publicPath,
        express.static(assetsBuildDirectory, {
            immutable: true,
            maxAge: '1y',
        }),
    );

    // Everything else (like favicon.ico) is cached for an hour. You may
    // want to be more aggressive with this caching.
    app.use(express.static(assetsRoot, { maxAge: '1h' }));

    /* -------------------------- Remix Routes -------------------------- */
    app.all('*', remixHandler);

    async function reimportServer(): Promise<ServerBuild> {
        // cjs: manually remove the server build from the require cache
        Object.keys(require.cache).forEach((key) => {
            if (key.startsWith(BUILD_PATH)) {
                delete require.cache[key];
            }
        });

        const stat = fs.statSync(BUILD_PATH);

        // convert build path to URL for Windows compatibility with dynamic `import`
        const BUILD_URL = url.pathToFileURL(BUILD_PATH).href;

        // use a timestamp query parameter to bust the import cache
        return import(`${BUILD_URL}?t=${stat.mtimeMs}`);
    }

    async function createDevRequestHandler(initialBuild: ServerBuild): Promise<RequestHandler> {
        let build = initialBuild;
        async function handleServerUpdate() {
            // 1. re-import the server build
            build = await reimportServer();
            // 2. tell Remix that this app server is now up-to-date and ready
            broadcastDevReady(build);
        }
        const chokidar = await import('chokidar');
        chokidar
            .watch(VERSION_PATH, { ignoreInitial: true })
            .on('add', handleServerUpdate)
            .on('change', handleServerUpdate);

        // wrap request handler to make sure its recreated with the latest build for every request
        return async (req, res, next) => {
            try {
                return await createRequestHandler({
                    build,
                    mode: 'development',
                })(req, res, next);
            } catch (error) {
                return next(error);
            }
        };
    }

    return initialBuild;
}
