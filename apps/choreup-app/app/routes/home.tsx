import type { LoaderFunction } from '@remix-run/node';
import type { RequestContext } from '@wesp-up/express-remix';

import { requireUser } from '~/auth.server';
import { log } from '~/server/logger.server';
import { useUser } from '~/utils';

export const loader: LoaderFunction = async ({ request, context }) => {
    log.info({
        message: 'Example log with transaction context',
        ...(context.requestContext as RequestContext),
    });
    await requireUser(request);
    return null;
};
export default function Page() {
    const user = useUser();
    return <div>Hello, {user.displayName}!</div>;
}
