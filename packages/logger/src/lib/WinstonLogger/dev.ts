import type { TransformableInfo } from 'logform';
import { addColors, format } from 'winston';

const { combine, timestamp, colorize, printf } = format;

const c = colorize();
addColors({
    error: 'bold black bgBrightRed',
    warn: 'bold black bgBrightYellow',
    access: 'bold black bgBrightCyan',
    info: 'bold black bgBrightBlue',
    debug: 'bold black bgBrightMagenta',

    timestamp: 'gray',
    stack: 'red',
    transactionId: 'green',

    url: 'green',
    method: 'bold bgCyan',
    status: 'brightMagenta',
    time: 'brightWhite',
});

export const printFormat: (info: TransformableInfo) => string = ({
    level,
    timestamp,
    message,
    method,
    status,
    url,
    time,
    error,
    transactionId,
}) => {
    const timestampF = c.colorize('timestamp', timestamp);
    const levelF = c.colorize(level, `[${level.toUpperCase().padEnd(6, ' ')}]`);

    const transactionIdF =
        transactionId && c.colorize('transactionId', `[${transactionId}]`);

    const messageF = message ?? '';
    const errorF = error && c.colorize('stack', `- ${error.stack}`);
    const methodF = method && c.colorize('method', method);
    const statusF = status && c.colorize('status', status);
    const urlF = url && c.colorize('url', url);
    const timeF = time && c.colorize('time', `${time}ms`);

    return [
        timestampF,
        levelF,
        transactionIdF,
        ':',
        methodF,
        statusF,
        timeF,
        urlF,
        messageF,
        errorF,
    ]
        .filter((item) => Boolean(item))
        .join(' ');
};

export const devFormat = combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
    printf(printFormat),
);
