import { devFormat, printFormat } from './dev';

vi.mock('winston', async () => {
    const { format } =
        // eslint-disable-next-line @typescript-eslint/consistent-type-imports
        await vi.importActual<typeof import('winston')>('winston');

    return {
        format: {
            colorize: vi.fn(() => ({
                colorize: (color: string, value: string) => value,
            })),
            timestamp: format.timestamp,
            printf: format.printf,
            combine: format.combine,
        },
        addColors: vi.fn(),
    };
});

const timestamp = '2022-05-09 12:15:08.345';

it('prints the timestamp', () => {
    const result = printFormat({
        timestamp,
        level: 'info',
        message: undefined,
    });

    expect(result).toEqual(`${timestamp} [INFO  ] :`);
});

it('prints the level', () => {
    const result = printFormat({
        timestamp,
        level: 'warn',
        message: undefined,
    });

    expect(result).toEqual(`${timestamp} [WARN  ] :`);
});

it('prints the transactionId', () => {
    const result = printFormat({
        timestamp,
        level: 'info',
        message: undefined,
        transactionId: '1234',
    });

    expect(result).toEqual(`${timestamp} [INFO  ] [1234] :`);
});

it('prints the method', () => {
    const result = printFormat({
        timestamp,
        level: 'info',
        message: undefined,
        method: 'PUT',
    });

    expect(result).toEqual(`${timestamp} [INFO  ] : PUT`);
});

it('prints the status', () => {
    const result = printFormat({
        timestamp,
        level: 'info',
        message: undefined,
        status: '500',
    });

    expect(result).toEqual(`${timestamp} [INFO  ] : 500`);
});

it('prints the time', () => {
    const result = printFormat({
        timestamp,
        level: 'info',
        message: undefined,
        time: 313,
    });

    expect(result).toEqual(`${timestamp} [INFO  ] : 313ms`);
});

it('prints the url', () => {
    const result = printFormat({
        timestamp,
        level: 'info',
        message: undefined,
        url: '/service/path',
    });

    expect(result).toEqual(`${timestamp} [INFO  ] : /service/path`);
});

it('prints the message', () => {
    const result = printFormat({
        timestamp,
        level: 'info',
        message: 'Fire in the hole!',
    });

    expect(result).toEqual(`${timestamp} [INFO  ] : Fire in the hole!`);
});

it('prints the error', () => {
    const result = printFormat({
        timestamp,
        level: 'error',
        message: undefined,
        error: new Error('boom!'),
    });

    expect(result).toContain(`${timestamp} [ERROR ] : - Error: boom!`);
});

it('prints additional metadata', () => {
    const result = printFormat({
        timestamp,
        level: 'info',
        message: 'mock message',
        userId: 'mockuser',
        brandId: 'mockbrand',
    });

    expect(result).toEqual(`${timestamp} [INFO  ] : mock message {
  "userId": "mockuser",
  "brandId": "mockbrand"
}`);
});

it('transforms into the dev format', () => {
    const result = devFormat.transform({
        level: 'info',
        message: undefined,
    });

    expect(result).toEqual(
        expect.objectContaining({
            level: 'info',
            message: undefined,
            timestamp: expect.any(String),
        }),
    );
});
