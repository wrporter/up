import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import type { RequestContext } from '@wesp-up/express-remix';
import { Button, TextField } from '@wesp-up/ui';
import { FieldArray, ValidatedForm } from 'remix-validated-form';
import { z } from 'zod';

import { requireUser } from '~/auth.server';
import type { Child, ChoreAssignments } from '~/lib/models/chore-chart.server';
import {
    createChoreChart,
    getChoreChart,
    updateChoreChart,
} from '~/lib/models/chore-chart.server';
import { days } from '~/lib/models/days';
import { log } from '~/server/logger.server';

const validator = withZod(
    z.object({
        id: z.string(),
        children: z.array(
            z.object({
                name: z.string(),
                chores: z.object(
                    days.reduce(
                        (result, day) => ({
                            ...result,
                            [day]: z
                                .array(z.object({ name: z.string() }))
                                .optional(),
                        }),
                        {},
                    ),
                ),
            }),
        ),
    }),
);

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

    const form = await validator.validate(await request.formData());
    if (!form.data) {
        return null;
    }

    if (request.method === 'POST') {
        await createChoreChart(user.id, form.data.children as Child[]);
    }
    if (request.method === 'PUT') {
        await updateChoreChart(user.id, {
            id: form.data.id,
            children: form.data.children as Child[],
        });
    }
    return null;
};

export default function Page() {
    const { choreChart } = useLoaderData<typeof loader>();

    return (
        <div className="p-4">
            <h2 className="text-xl mb-4">Chore Chart</h2>

            <ValidatedForm
                id="choreChartForm"
                validator={validator}
                method={choreChart?.id ? 'put' : 'post'}
                defaultValues={choreChart}
            >
                <TextField
                    type="hidden"
                    name="id"
                    defaultValue={choreChart?.id}
                />

                <table className="table-fixed w-full text-sm text-left text-gray-500 dark:text-gray-400">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">
                                Child
                            </th>
                            {days.map((day) => (
                                <th key={day} scope="col" className="px-6 py-3">
                                    {day}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <FieldArray name="children">
                        {(children, { push }) => (
                            <tbody>
                                {children.map(
                                    ({ defaultValue, key }, childIndex) => (
                                        <tr
                                            key={key}
                                            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                                        >
                                            <th
                                                scope="row"
                                                className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                                            >
                                                <TextField
                                                    className="w-full"
                                                    name={`children[${childIndex}].name`}
                                                    defaultValue={
                                                        defaultValue.name
                                                    }
                                                />
                                            </th>

                                            {days.map((day) => {
                                                return (
                                                    <td
                                                        key={day}
                                                        className="px-2 py-4"
                                                    >
                                                        <FieldArray
                                                            name={`children[${childIndex}].chores.${day}`}
                                                        >
                                                            {(
                                                                chores,
                                                                {
                                                                    insert,
                                                                    remove,
                                                                },
                                                            ) => {
                                                                return (
                                                                    <>
                                                                        {chores.map(
                                                                            (
                                                                                {
                                                                                    defaultValue,
                                                                                    key,
                                                                                },
                                                                                choreIndex,
                                                                            ) => (
                                                                                <div
                                                                                    key={
                                                                                        key
                                                                                    }
                                                                                    className="flex"
                                                                                >
                                                                                    <TextField
                                                                                        name={`children[${childIndex}].chores.${day}[${choreIndex}].name`}
                                                                                        className="w-full"
                                                                                        defaultValue={
                                                                                            defaultValue.name
                                                                                        }
                                                                                    />

                                                                                    {chores.length >
                                                                                    1 ? (
                                                                                        <Button
                                                                                            kind="danger"
                                                                                            type="button"
                                                                                            onClick={() => {
                                                                                                remove(
                                                                                                    choreIndex,
                                                                                                );
                                                                                            }}
                                                                                        >
                                                                                            -
                                                                                        </Button>
                                                                                    ) : undefined}

                                                                                    <Button
                                                                                        kind="secondary"
                                                                                        type="button"
                                                                                        onClick={() => {
                                                                                            insert(
                                                                                                choreIndex +
                                                                                                    1,
                                                                                                {
                                                                                                    name: '',
                                                                                                },
                                                                                            );
                                                                                        }}
                                                                                    >
                                                                                        +
                                                                                    </Button>
                                                                                </div>
                                                                            ),
                                                                        )}
                                                                    </>
                                                                );
                                                            }}
                                                        </FieldArray>
                                                    </td>
                                                );
                                            })}
                                        </tr>
                                    ),
                                )}

                                <tr>
                                    <td>
                                        <Button
                                            kind="secondary"
                                            type="button"
                                            onClick={() => {
                                                push(newChild());
                                            }}
                                        >
                                            Add Child
                                        </Button>
                                    </td>
                                </tr>
                            </tbody>
                        )}
                    </FieldArray>
                </table>

                <div className="flex mt-4 justify-between">
                    <Button type="submit">Save</Button>
                </div>
            </ValidatedForm>
        </div>
    );
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
