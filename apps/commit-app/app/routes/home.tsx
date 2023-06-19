import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, useLoaderData, useNavigation } from '@remix-run/react';
import type { RequestContext } from '@wesp-up/express-remix';
import { Button, TextField } from '@wesp-up/ui';
import type { EventHandler, FormEvent } from 'react';
import { useEffect, useState } from 'react';

import { requireUser } from '~/auth.server';
import type {
    Child,
    Chore,
    ChoreAssignments,
} from '~/lib/models/chore-chart.server';
import {
    createChoreChart,
    getChoreChart,
    updateChoreChart,
} from '~/lib/models/chore-chart.server';
import { days } from '~/lib/models/days';
import { log } from '~/server/logger.server';

export const loader: LoaderFunction = async ({ request, context }) => {
    log.info({
        message: 'Example log with transaction context',
        ...(context.requestContext as RequestContext),
    });
    const user = await requireUser(request);
    const choreChart = await getChoreChart(user.id);
    return json({ choreChart });
};

export const action: ActionFunction = async ({ request }) => {
    const user = await requireUser(request);
    if (!user) {
        return json({ error: 'Unauthenticated' }, { status: 401 });
    }

    const formData = await request.formData();
    const children: Child[] = [];

    for (let childIndex = 0; childIndex < 10; childIndex += 1) {
        const name = formData.get(`child.${childIndex}.name`) as string;
        if (!name) {
            break;
        }

        const chores = days.reduce((result, day) => {
            const chores: Chore[] = [];
            for (let choreIndex = 0; choreIndex < 10; choreIndex += 1) {
                const chore = formData.get(
                    `child.${childIndex}.${day}.chore.${choreIndex}`,
                );
                if (chore) {
                    chores.push({ name: chore as string });
                }
                if (!chore) {
                    break;
                }
            }

            return {
                ...result,
                [day]: chores,
            };
        }, {} as ChoreAssignments);

        children.push({ name, chores });
    }

    if (request.method === 'POST') {
        await createChoreChart(user.id, children);
    }
    if (request.method === 'PUT') {
        await updateChoreChart(user.id, {
            id: formData.get('id') as string,
            children,
        });
    }
    return null;
};

export default function Page() {
    const { choreChart } = useLoaderData<typeof loader>();
    const [children, setChildren] = useState<Child[]>(
        choreChart?.children ?? [],
    );
    const navigation = useNavigation();

    useEffect(() => {
        if (choreChart) {
            setChildren(choreChart?.children);
        }
    }, [choreChart]);

    const handleChange: EventHandler<FormEvent> = (e) => {};

    return (
        <div className="p-4">
            <h2 className="text-xl mb-4">Chore Chart</h2>

            {navigation.state === 'submitting' ? (
                <div>Loading...</div>
            ) : (
                <Form
                    method={choreChart?.id ? 'PUT' : 'POST'}
                    onChange={handleChange}
                >
                    <input type="hidden" name="id" value={choreChart?.id} />

                    <table className="table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Child
                                </th>
                                {days.map((day) => (
                                    <th
                                        key={day}
                                        scope="col"
                                        className="px-6 py-3"
                                    >
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {children.map((child, childIndex) => (
                                <tr
                                    key={newGuid()}
                                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                >
                                    <th
                                        scope="row"
                                        className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                    >
                                        <TextField
                                            className="w-full"
                                            name={`child.${childIndex}.name`}
                                            defaultValue={child.name}
                                        />
                                    </th>
                                    {days.map((day) => {
                                        const chores = child.chores[day];
                                        if (chores.length === 0) {
                                            chores.push({ name: '' });
                                        }
                                        return (
                                            <td
                                                key={newGuid()}
                                                className="px-2 py-4"
                                            >
                                                {chores.map(
                                                    (chore, choreIndex) => (
                                                        <TextField
                                                            key={newGuid()}
                                                            name={`child.${childIndex}.${day}.chore.${choreIndex}`}
                                                            className="w-full"
                                                            defaultValue={
                                                                chore.name
                                                            }
                                                        />
                                                    ),
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="flex mt-4 justify-between">
                        <Button
                            kind="secondary"
                            type="button"
                            onClick={() => {
                                setChildren([...children, newChild()]);
                            }}
                        >
                            Add Child
                        </Button>

                        <Button>Save</Button>
                    </div>
                </Form>
            )}
        </div>
    );
}

function newGuid() {
    const S4 = () =>
        // eslint-disable-next-line no-bitwise
        (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    return `${S4() + S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
}

function newChild(): Child {
    return {
        name: '',
        chores: days.reduce(
            (result, day) => ({
                ...result,
                [day]: [{ name: '' }],
            }),
            {} as ChoreAssignments,
        ),
    };
}

// const choreVariants = tv({
//     base: ['px-2 py-4 w-full', 'hover:bg-blue-100'],
//     variants: {
//         done: {
//             true: 'line-through',
//             false: 'underline',
//         },
//     },
// });

// function Chore({
//     children,
//     className,
// }: {
//     children: ReactNode;
//     className?: string;
// }) {
//     const [done, setDone] = useState(false);
//
//     return (
//         <Checkbox.Root
//             checked={done}
//             onCheckedChange={() => setDone((v) => !v)}
//             className={choreVariants({ done, className })}
//         >
//             {children}
//         </Checkbox.Root>
//     );
// }
