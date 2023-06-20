import { PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import type { ActionFunction, LoaderFunction } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import type { RequestContext } from '@wesp-up/express-remix';
import { Button, TextField } from '@wesp-up/ui';
import { Fragment } from 'react';
import { FieldArray, ValidatedForm } from 'remix-validated-form';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

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
                                .array(
                                    z.object({
                                        name: z.string(),
                                        reward: zfd.numeric(),
                                    }),
                                )
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

    // console.log(JSON.stringify(form.data));

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
    // const form = useFormContext('choreChartForm');
    // console.log(choreChart, form.fieldErrors);

    return (
        <div className="container py-4">
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

                <div className="flex flex-col gap-8">
                    <FieldArray name="children">
                        {(children, { push }) => (
                            <>
                                {children.map(
                                    ({ defaultValue, key }, childIndex) => (
                                        <div
                                            key={key}
                                            className="p-2 bg-gray-100 border border-gray-300 rounded"
                                        >
                                            <div className="border-b border-gray-400">
                                                <label className="flex flex-row-reverse items-center gap-4 mb-4">
                                                    <TextField
                                                        className="flex-grow text-2xl font-bold"
                                                        name={`children[${childIndex}].name`}
                                                        defaultValue={
                                                            defaultValue.name
                                                        }
                                                    />
                                                    <span className="text-2xl font-bold text-emerald-600">
                                                        Child {childIndex + 1}
                                                    </span>
                                                </label>
                                            </div>

                                            {days.map((day) => (
                                                <Fragment key={`${key}-${day}`}>
                                                    <h3 className="py-2 my-3 text-2xl font-mono font-semibold tracking-widest text-center bg-stone-300 text-blue-700">
                                                        {day}
                                                    </h3>

                                                    <ChoresForDay
                                                        day={day}
                                                        childIndex={childIndex}
                                                    />
                                                </Fragment>
                                            ))}
                                        </div>
                                    ),
                                )}

                                <Button
                                    kind="secondary"
                                    type="button"
                                    className="flex-grow gap-2"
                                    onClick={() => {
                                        push(newChild());
                                    }}
                                >
                                    <PlusIcon /> Add Child
                                </Button>
                            </>
                        )}
                    </FieldArray>
                </div>

                <div className="flex mt-4 justify-between">
                    <Button type="submit">Save</Button>
                </div>
            </ValidatedForm>
        </div>
    );
}

function ChoresForDay({
    day,
    childIndex,
}: {
    day: string;
    childIndex: number;
}) {
    return (
        <div className="flex flex-col gap-6">
            <FieldArray name={`children[${childIndex}].chores.${day}`}>
                {(chores, { insert, remove }) => {
                    return chores.map(({ defaultValue, key }, choreIndex) => (
                        <div key={key} className="flex flex-col gap-2">
                            <label className="text-sm flex flex-col-reverse">
                                <TextField
                                    type="text"
                                    small
                                    name={`children[${childIndex}].chores.${day}[${choreIndex}].name`}
                                    className="w-full peer"
                                    defaultValue={defaultValue.name}
                                />
                                <span className="mb-1 font-bold peer-focus:text-blue-600">
                                    Chore {choreIndex + 1}
                                </span>
                            </label>

                            <label className="text-sm flex flex-col-reverse">
                                <TextField
                                    type="number"
                                    step="0.01"
                                    small
                                    name={`children[${childIndex}].chores.${day}[${choreIndex}].reward`}
                                    className="w-full peer tabular-nums slashed-zero"
                                    defaultValue={defaultValue.reward ?? 0.01}
                                />
                                <span className="mb-1 font-bold peer-focus:text-blue-600">
                                    Reward
                                </span>
                            </label>

                            <div className="flex gap-4">
                                <Button
                                    kind="secondary"
                                    type="button"
                                    small
                                    className="flex-grow gap-2"
                                    onClick={() => {
                                        insert(choreIndex + 1, {
                                            name: '',
                                        });
                                    }}
                                >
                                    <PlusIcon /> Add Chore
                                </Button>

                                {chores.length > 1 ? (
                                    <Button
                                        kind="danger"
                                        type="button"
                                        small
                                        className="w-8"
                                        onClick={() => {
                                            remove(choreIndex);
                                        }}
                                    >
                                        <TrashIcon />
                                    </Button>
                                ) : undefined}
                            </div>
                        </div>
                    ));
                }}
            </FieldArray>
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
