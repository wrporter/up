import type { ActionFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { withZod } from '@remix-validated-form/with-zod';
import React from 'react';
import { validationError } from 'remix-validated-form';
import invariant from 'tiny-invariant';
import { z } from 'zod';
import { zfd } from 'zod-form-data';

import { requireUser } from '~/auth.server';
import { getChartForUser } from '~/lib/models/chart.server';
import { getGroupForUser } from '~/lib/models/group.server';
import type { Serialized } from '~/lib/models/model';
import type { Person } from '~/lib/models/person.server';
import type { Task } from '~/lib/models/task.server';
import { createTaskReward, deleteTaskReward, updateTaskReward } from '~/lib/models/task.server';
import { Currency } from '~/lib/ui/currency';
import { ResourceCombobox } from '~/lib/ui/resource-combobox';
import type { ResourceFormField, ResourceFormPropagatedProps } from '~/lib/ui/resource-pill';
import { ResourceDialog, ResourcePill } from '~/lib/ui/resource-pill';
import { loader as chartLoader } from '~/routes/_app.groups_.$groupId.charts.$chartId';

export const loader = chartLoader;

export const action = async ({ request, params }: ActionFunctionArgs) => {
    const user = await requireUser(request);

    const groupId = Number.parseInt(params.groupId ?? '0', 10);
    invariant(groupId, 'Group not found');
    const group = await getGroupForUser(user.id, groupId);
    invariant(group, 'Unauthorized');

    const chartId = Number.parseInt(params.chartId ?? '0', 10);
    invariant(chartId, 'Chart not found');
    const chart = await getChartForUser(user.id, chartId);
    invariant(chart, 'Unauthorized');

    if (request.method === 'DELETE') {
        const formData = await request.formData();
        const rewardId = Number.parseInt((formData.get('rewardId') as string) ?? '0', 10);
        invariant(rewardId, 'No rewardId found');
        return deleteTaskReward(user.id, rewardId);
    }

    const form = await validator.validate(await request.formData());
    if (form.error) {
        return validationError(form.error);
    }

    const reward = {
        chartId,
        personId: form.data.person.id,
        taskId: form.data.task.id,
        reward: form.data.reward,
    };
    if (request.method === 'POST') {
        const result = createTaskReward(reward);
        return json(result);
    }

    if (request.method === 'PUT') {
        invariant(form.data.rewardId, 'No rewardId found');
        return updateTaskReward(user.id, form.data.rewardId, reward);
    }

    return null;
};

const validator = withZod(
    z.object({
        rewardId: zfd.numeric(z.number().optional()),
        person: z.object({ id: zfd.numeric(z.number()) }),
        task: z.object({ id: zfd.numeric(z.number()) }),
        reward: zfd.numeric(
            z
                .number({ required_error: 'Please enter a reward.' })
                .min(0, 'Please enter a value greater than 0.')
                .max(100, 'Please enter a value less than or equal to 100.'),
        ),
    }),
);

const fields: ResourceFormField[] = [
    {
        label: 'Reward',
        textFieldProps: {
            name: 'reward',
            placeholder: '0.00',
            type: 'number',
            step: '0.01',
            min: '0.00',
            max: '100',
            className: 'text-green-500 tabular-nums',
        },
    },
];

export default function Page() {
    const { group, chart } = useLoaderData<typeof loader>();

    if (!group) {
        return <div className="py-4">Group not found!</div>;
    }

    if (!chart) {
        return <div className="py-4">Chart not found!</div>;
    }

    const form: ResourceFormPropagatedProps = {
        validator,
        fields,
        children: (
            <>
                <ResourceCombobox<Serialized<Person>>
                    displayValue={(person: Serialized<Person>) => person.name}
                    resources={group.people as Serialized<Person[]>}
                    label="Person"
                    formName="person"
                    placeholder="Select person"
                />
                <ResourceCombobox<Serialized<Task>>
                    displayValue={(task: Serialized<Task>) => `${task.icon} ${task.name}`}
                    resources={chart.tasks as Serialized<Task[]>}
                    label="Task"
                    formName="task"
                    placeholder="Select task"
                />
            </>
        ),
        hiddenFields: [],
        resource: { type: 'Reward' },
    };

    return (
        <section className="pt-4">
            <ResourceDialog form={form} />

            <div className="flex flex-col gap-4 mt-4">
                {chart.taskRewards.map((reward) => {
                    const task = chart.tasks.find((task) => task.id === reward.taskId);
                    const person = group.people.find((person) => person.id === reward.personId);

                    return (
                        <ResourcePill
                            key={reward.id}
                            to={`/groups/${group.id}/charts/${chart.id}/rewards/${reward.id}`}
                            form={{
                                ...form,
                                defaultValues: {
                                    person,
                                    task,
                                    reward: reward.reward,
                                },
                                resource: {
                                    type: form.resource.type,
                                    id: reward.id,
                                    component: (
                                        <div className="flex space-x-4">
                                            <div className="text-gray-500">
                                                <div>Person</div>
                                                <div>Task</div>
                                                <div>Reward</div>
                                            </div>
                                            <div>
                                                <div className="font-bold">{person?.name}</div>
                                                <div>
                                                    <span>{task?.icon}</span>
                                                    <span className="ml-1">{task?.name}</span>
                                                </div>
                                                <Currency value={reward.reward} />
                                            </div>
                                        </div>
                                    ),
                                },
                                hiddenFields: form.hiddenFields.concat([
                                    { name: 'rewardId', value: reward.id },
                                ]),
                            }}
                        />
                    );
                })}
            </div>
        </section>
    );
}
