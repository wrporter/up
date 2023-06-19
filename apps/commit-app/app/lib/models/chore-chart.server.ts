/* eslint-disable no-underscore-dangle */
import { ObjectId } from 'mongodb';

import { mongo } from '~/db.server';
import type { days } from '~/lib/models/days';

export interface ChoreChart {
    id: string;
    userId?: string;
    children: Child[];
    dateCreated?: Date;
    dateUpdated?: Date;
}

export interface Child {
    name: string;
    chores: ChoreAssignments;
}

export type ChoreAssignments = {
    [key in (typeof days)[number]]: Chore[];
};

export interface Chore {
    name: string;
}

interface MongoChoreChart extends Omit<ChoreChart, 'id' | 'userId'> {
    _id: ObjectId;
    userId: ObjectId;
}

export async function createChoreChart(
    userId: string,
    children: Child[],
): Promise<ChoreChart> {
    const choreChart: MongoChoreChart = {
        _id: new ObjectId(),
        userId: ObjectId.createFromHexString(userId),
        children,
        dateCreated: new Date(),
        dateUpdated: new Date(),
    };

    await (await mongo())
        .db()
        .collection<MongoChoreChart>('chorecharts')
        .insertOne(choreChart);

    return {
        id: choreChart._id.toHexString(),
        userId,
        children,
        dateCreated: choreChart.dateCreated,
        dateUpdated: choreChart.dateUpdated,
    };
}

export async function getChoreChart(
    userId: string,
): Promise<ChoreChart | undefined> {
    const choreChart = await (
        await mongo()
    )
        .db()
        .collection<MongoChoreChart>('chorecharts')
        .findOne({
            userId: ObjectId.createFromHexString(userId),
        });

    if (!choreChart) {
        return undefined;
    }

    return {
        id: choreChart._id.toHexString(),
        userId,
        children: choreChart.children,
        dateCreated: choreChart.dateCreated,
        dateUpdated: choreChart.dateUpdated,
    };
}

export async function updateChoreChart(
    userId: string,
    choreChart: ChoreChart,
): Promise<void> {
    await (
        await mongo()
    )
        .db()
        .collection('chorecharts')
        .updateOne(
            {
                _id: ObjectId.createFromHexString(choreChart.id),
                userId: ObjectId.createFromHexString(userId),
            },
            {
                $set: {
                    children: choreChart.children,
                    dateUpdated: new Date(),
                },
            },
        );
}
