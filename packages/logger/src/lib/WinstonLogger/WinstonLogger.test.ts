/* eslint-disable no-new */
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';
import { transports, createLogger as winstonCreateLogger } from 'winston';
import type { Logger } from 'winston';

import { devFormat } from './dev';
import { prodFormat } from './prod';
import { WinstonLogger } from './WinstonLogger';
import { severity } from '../Level';

vi.mock('winston', () => ({
    createLogger: vi.fn(),
    transports: {
        Console: vi.fn(),
    },
}));
vi.mock('./dev', () => ({ devFormat: 'devFormat' }));
vi.mock('./prod', () => ({ prodFormat: 'prodFormat' }));

describe('createLogger', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    afterAll(() => {
        vi.restoreAllMocks();
    });

    it('should create console logger with defaults', () => {
        new WinstonLogger();

        expect(winstonCreateLogger).toHaveBeenCalledOnce();
        expect(winstonCreateLogger).toHaveBeenCalledWith({
            silent: false, // because this is a test environment
            level: 'info',
            levels: severity,
            format: expect.anything(),
            transports: [expect.any(transports.Console)],
        });
    });

    it('should create console logger with custom level', () => {
        new WinstonLogger({
            level: 'error',
        });

        expect(winstonCreateLogger).toHaveBeenCalledOnce();
        expect(winstonCreateLogger).toHaveBeenCalledWith({
            silent: false,
            level: 'error',
            levels: severity,
            format: expect.anything(),
            transports: [expect.any(transports.Console)],
        });
    });

    it('sends data to the winston logger', () => {
        const mockLog = vi.fn();
        vi.mocked(winstonCreateLogger).mockReturnValue({
            log: mockLog,
        } as unknown as Logger);
        const log = new WinstonLogger();

        log.info('message');

        expect(mockLog).toHaveBeenCalledWith('info', { message: 'message' });
    });

    it('configures the underlying logger', () => {
        const mockLog = vi.fn();
        vi.mocked(winstonCreateLogger).mockReturnValue({
            log: mockLog,
        } as unknown as Logger);
        const log = new WinstonLogger();

        log.configure({ level: 'info' });

        expect(log.logger.level).toEqual('info');
    });

    it('uses the prod format when in production mode', () => {
        new WinstonLogger({ mode: 'production' });

        expect(winstonCreateLogger).toHaveBeenCalledWith(
            expect.objectContaining({ format: prodFormat }),
        );
    });

    it('uses the dev format when not in production mode', () => {
        new WinstonLogger({ mode: 'development' });

        expect(winstonCreateLogger).toHaveBeenCalledWith(
            expect.objectContaining({ format: devFormat }),
        );
    });
});
