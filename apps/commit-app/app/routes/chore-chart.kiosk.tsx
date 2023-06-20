import * as Checkbox from '@radix-ui/react-checkbox';
import type { LoaderArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { TextLink } from '@wesp-up/ui';
import { useState } from 'react';
import { tv } from 'tailwind-variants';

import { requireUser } from '~/auth.server';
import type { Chore } from '~/lib/models/chore-chart.server';
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
        <div className="container py-4">
            <div className="flex gap-4 flex-col lg:flex-row">
                {choreChart ? (
                    choreChart.children.map((child) => {
                        const chores = child.chores[today].filter(({ name }) =>
                            Boolean(name),
                        );
                        return (
                            <div
                                key={child.name}
                                className="lg:basis-1/3 rounded-md p-4 bg-slate-100 border border-slate-200"
                            >
                                <h3 className="flex justify-center text-lg font-bold border-b border-b-slate-200 pb-2 mb-2">
                                    {child.name}
                                </h3>

                                {chores.length > 0 ? (
                                    <div className="flex flex-col gap-4">
                                        {chores.map((chore) => (
                                            <ChoreCheckbox
                                                key={chore.name}
                                                chore={chore}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="px-6 py-4 w-full rounded text-lg bg-gradient-to-r from-cyan-200 to-blue-200">
                                        🎉 No chores today!
                                    </div>
                                )}
                            </div>
                        );
                    })
                ) : (
                    <div>Nothing to see here. Go create a chore chart!</div>
                )}
            </div>

            <TextLink as={Link} to="/home" className="flex mt-8">
                Take me home
            </TextLink>
        </div>
    );
}

const choreVariants = tv({
    base: [
        'px-6 py-4 w-full bg-white rounded text-lg',
        'flex justify-between items-center',
        'hover:bg-blue-100',
    ],
    variants: {
        done: {
            true: 'line-through opacity-50',
            false: '',
        },
    },
});

function ChoreCheckbox({
    chore,
    className,
}: {
    chore: Chore;
    className?: string;
}) {
    const [done, setDone] = useState(false);

    return (
        <Checkbox.Root
            checked={done}
            onCheckedChange={() => setDone((v) => !v)}
            className={choreVariants({ done, className })}
        >
            <span>{chore.name}</span>
            <span className="text-sm text-green-500 tabular-nums slashed-zero">
                ${chore.reward.toFixed(2)}
            </span>
        </Checkbox.Root>
    );
}
