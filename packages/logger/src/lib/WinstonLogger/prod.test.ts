/* eslint-disable no-new */
import { describe, expect, it } from 'vitest';

import { pickFieldsFromError, prodFormat, transformErrors } from './prod';

class CustomError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CustomError';
    }
}

describe('pickFieldsFromError', () => {
    it('returns the error name, message, and stack', () => {
        const err = new Error('Catastrophic Error');

        const replaced = pickFieldsFromError(err);

        expect(replaced).toEqual({
            name: 'Error',
            message: 'Catastrophic Error',
            stack: expect.any(String),
        });
    });
});

describe('transformErrors', () => {
    it('returns the transformed error if an error is passed in', () => {
        const err = new CustomError('Catastrophic Error');

        const replaced = transformErrors('key', err);

        expect(replaced).toEqual({
            name: 'CustomError',
            message: 'Catastrophic Error',
            stack: expect.any(String),
        });
    });

    it('returns the transformed error for objects that appear to be errors and strips other data', () => {
        const err = {
            name: 'MockError',
            message: 'failure',
            stack: 'mock stack trace',
            other: 'data',
        };

        const replaced = transformErrors('key', err);

        expect(replaced).toEqual({
            name: 'MockError',
            message: 'failure',
            stack: 'mock stack trace',
        });
    });

    it('returns the original value if no error is passed in', () => {
        const value = 'Hello There';

        const replaced = transformErrors('key', value);

        expect(replaced).toEqual('Hello There');
    });
});

it('transforms into the prod format', () => {
    const result = prodFormat.transform({
        level: 'info',
        message: '',
    });

    expect(result).toEqual(
        expect.objectContaining({
            level: 'info',
            message: '',
            timestamp: expect.any(String),
        }),
    );
});
