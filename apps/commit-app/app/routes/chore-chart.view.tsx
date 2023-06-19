import * as Checkbox from '@radix-ui/react-checkbox';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { tv } from 'tailwind-variants';

import { requireUser } from '~/auth.server';
import { getChoreChart } from '~/lib/models/chore-chart.server';
import type { days } from '~/lib/models/days';

export const loader = async ({ request }: LoaderArgs) => {
    const user = await requireUser(request);
    const choreChart = await getChoreChart(user.id);
    return json({ choreChart });
};

export default function Page() {
    const { choreChart } = useLoaderData<typeof loader>();
    const today = new Date().toLocaleString('en-us', {
        weekday: 'long',
    }) as (typeof days)[number];

    return (
        <div className="p-4 flex gap-4">
            {choreChart ? (
                choreChart.children.map((child) => (
                    <div
                        key={child.name}
                        className="flex-grow rounded-md p-4 bg-slate-100 border border-slate-200"
                    >
                        <h3 className="flex justify-center text-lg font-bold border-b border-b-slate-200 pb-2 mb-2">
                            {child.name}
                        </h3>
                        {child.chores[today]
                            .filter(({ name }) => Boolean(name))
                            .map((chore) => (
                                <Chore key={chore.name}>{chore.name}</Chore>
                            ))}
                    </div>
                ))
            ) : (
                <div>Go create a chore chart!</div>
            )}
        </div>
    );
}

const choreVariants = tv({
    base: [
        'px-6 py-4 w-full bg-white rounded flex justify-start',
        'hover:bg-blue-100',
    ],
    variants: {
        done: {
            true: 'line-through opacity-50',
            false: 'underline',
        },
    },
});

function Chore({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    const [done, setDone] = useState(false);

    return (
        <Checkbox.Root
            checked={done}
            onCheckedChange={() => setDone((v) => !v)}
            className={choreVariants({ done, className })}
        >
            {children}
        </Checkbox.Root>
    );
}
