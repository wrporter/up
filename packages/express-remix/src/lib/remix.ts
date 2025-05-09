/* eslint-disable @typescript-eslint/no-misused-promises */
import path from "path";

import { createRequestHandler } from "@remix-run/express";
import type { Application } from "express";
import express from "express";

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
  /**
   * Max age to cache assets specified in {@link RemixOptions.assetsRoot}.
   * For more information on the options, see
   * https://expressjs.com/en/4x/api.html#express.static. Defaults to 1 hour.
   */
  assetsRootMaxAge: string;
}

/**
 * Smart defaults for Remix. You normally shouldn't have to change these.
 */
export const defaultRemixOptions: RemixOptions = {
  serverBuildPath: path.join(process.cwd(), "build"),
  assetsBuildDirectory: "public/build",
  publicPath: "/build/",
  assetsRoot: "public",
  assetsRootMaxAge: "1h",
};

/**
 * Apply Remix middleware and assets to an Express application. This should be
 * applied towards the end of an application since control will be given to
 * Remix at this point. Any custom Express routes and middleware should be
 * applied previous to using this.
 * @param app - Express app to apply Remix middleware to.
 * @param options - Options for configuring Remix assets and middleware.
 */
export function useRemix(app: Application, options?: Partial<RemixOptions>) {
  const opts = {
    ...defaultRemixOptions,
    ...options,
  };
  const {
    publicPath,
    assetsBuildDirectory,
    assetsRoot,
    assetsRootMaxAge,
    serverBuildPath,
  } = opts;
  const env = process.env.NODE_ENV;

  /* -------------------------- Static Assets ------------------------- */
  // Remix fingerprints its assets so we can cache forever.
  app.use(
    publicPath,
    express.static(assetsBuildDirectory, {
      immutable: true,
      maxAge: "1y",
    }),
  );

  // Everything else (like favicon.ico) is cached for an hour. You may
  // want to be more aggressive with this caching.
  app.use(express.static(assetsRoot, { maxAge: assetsRootMaxAge }));

  /* -------------------------- Remix Routes -------------------------- */
  // ignoring as we are in a test environment
  /* c8 ignore next 29 */
  function purgeRequireCache() {
    // purge require cache on requests for "server side HMR" this won't let
    // you have in-memory objects between requests in development,
    // alternatively you can set up nodemon/pm2-dev to restart the server on
    // file changes, but then you'll have to reconnect to databases/etc on each
    // change. We prefer the DX of this, so we've included it for you by default
    Object.keys(require.cache).forEach((key) => {
      if (key.startsWith(serverBuildPath)) {
        delete require.cache[key];
      }
    });
  }

  if (env === "development") {
    app.all(
      "*",
      // @ts-ignore -- ignore until @remix-run/express supports express v5
      createRequestHandler({
        // ignoring as we are following direct instructions from remix
        /* c8 ignore next 6 */
        getLoadContext(req) {
          purgeRequireCache();
          return { ...req.context };
        },
        build: require(serverBuildPath),
        mode: env,
      }),
    );
  } else {
    app.all(
      "*",
      // @ts-ignore -- ignore until @remix-run/express supports express v5
      createRequestHandler({
        // ignoring as we are following direct instructions from remix
        /* c8 ignore next 6 */
        getLoadContext(req) {
          return { ...req.context };
        },
        build: require(serverBuildPath),
        mode: env,
      }),
    );
  }
}
