// learn more: https://fly.io/docs/reference/configuration/#services-http_checks
import type { LoaderFunction } from '@remix-run/node';

import { mongo } from '~/db.server';
import { log } from '~/server/logger.server';

export const loader: LoaderFunction = async ({ request }) => {
    const host =
        request.headers.get('X-Forwarded-Host') ?? request.headers.get('host');

    try {
        const url = new URL('/', `http://${host}`);
        // if we can connect to the database and make a simple query
        // and make a HEAD request to ourselves, then we're good.
        await Promise.all([
            (await mongo()).db().collection('users').countDocuments(),
            fetch(url.toString(), { method: 'HEAD' }).then((r) => {
                if (!r.ok) return Promise.reject(r);
                return undefined;
            }),
        ]);
        return new Response(JSON.stringify({ status: 'ok' }));
    } catch (error: unknown) {
        log.error({ message: 'healthcheck ❌', error });
        return new Response(JSON.stringify({ status: 'failed', error }));
    }
};
