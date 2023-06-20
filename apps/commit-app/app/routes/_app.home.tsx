import type { LoaderFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { TextLink } from '@wesp-up/ui';

import { requireUser } from '~/auth.server';

export const loader: LoaderFunction = async ({ request, context }) => {
    await requireUser(request);
    return null;
};

export default function Page() {
    return (
        <div className="container py-4">
            <h2 className="text-xl mb-4">Home</h2>

            <ul className="list-disc ml-6 space-y-1">
                <li>
                    <TextLink as={Link} to="/chore-chart">
                        Chore Chart
                    </TextLink>{' '}
                    - Manage your chore chart.
                </li>
                <li>
                    <TextLink as={Link} to="/chore-chart/kiosk">
                        Chore Chart Kiosk
                    </TextLink>{' '}
                    - Display your chore chart for your kids to update it when
                    they complete tasks.
                </li>
            </ul>
        </div>
    );
}
