/* eslint-disable no-underscore-dangle */
import { log } from '@wesp-up/express-remix';
import { MongoClient } from 'mongodb';

declare global {
    // eslint-disable-next-line no-var,@typescript-eslint/naming-convention,vars-on-top
    var __db__: MongoClient;
}

const { DATABASE_HOST } = process.env;

async function mongo(): Promise<MongoClient> {
    if (global.__db__) {
        return Promise.resolve(global.__db__);
    }

    const client = await MongoClient.connect(
        `mongodb://${DATABASE_HOST}:27017/commit`,
    );

    log.info('Successfully connected to the Mongo database!');
    global.__db__ = client;

    return client;
}

mongo();

export { mongo };
