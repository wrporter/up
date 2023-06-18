import type { LoaderFunction } from '@remix-run/node';
import { useSubmit } from '@remix-run/react';
import type { RequestContext } from '@wesp-up/express-remix';
import { Button } from '@wesp-up/ui';

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
    const submit = useSubmit();

    return (
        <div>
            <div>Hello, {user.displayName}!</div>
            <Button
                onClick={() =>
                    submit(null, {
                        method: 'post',
                        action: '/logout',
                    })
                }
            >
                Logout
            </Button>
        </div>
    );
}
