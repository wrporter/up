import * as Checkbox from '@radix-ui/react-checkbox';
import type { LoaderFunction } from '@remix-run/node';
import type { RequestContext } from '@wesp-up/express-remix';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { tv } from 'tailwind-variants';

import { requireUser } from '~/auth.server';
import { log } from '~/server/logger.server';

export const loader: LoaderFunction = async ({ request, context }) => {
    log.info({
        message: 'Example log with transaction context',
        ...(context.requestContext as RequestContext),
    });
    await requireUser(request);
    return null;
};

const chores = [
    { name: 'Sweep' },
    { name: 'Take out trash' },
    { name: 'Unload dishwasher' },
];

export default function Page() {
    return (
        <div className="p-4">
            <h2>Welcome home!</h2>

            <div className="flex flex-col items-start">
                {chores.map(({ name }) => (
                    <Chore>{name}</Chore>
                ))}
            </div>
        </div>
    );
}

const choreVariants = tv({
    base: ['px-2 py-4 w-full', 'hover:bg-blue-100'],
    variants: {
        done: {
            true: 'line-through',
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
