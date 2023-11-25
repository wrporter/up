import { Server } from 'http';
import type { IncomingMessage, OutgoingMessage } from 'http';
import type { Socket } from 'net';
import { Server as TlsServer } from 'tls';

import type { Logger } from '@wesp-up/logger';

/**
 * Options for performing a graceful shutdown of a server.
 */
export interface ShutdownOptions {
    /** The server to shut down. */
    server: Server | TlsServer;
    /** Optional logger for logging events. */
    log?: Logger;
    /**
     * Time in milliseconds to wait for open connections to finish. Defaults
     * to 10,000ms.
     */
    timeout?: number;
    /** Callback function to call at the start of the shutdown operation. */
    onInit?: () => void;
    /** Callback function to call just after the server closes. */
    onShutdown?: () => void;
}

/**
 * Gracefully shuts down a server in the following sequence.
 *
 * 1. Call the `onInit` callback.
 * 2. Wait for the timeout period if there are any open connections.
 * 3. After the wait period, close any open connections.
 * 4. Close the server.
 * 5. Call the `onShutdown` callback.
 * @param options - {@link ShutdownOptions}
 */
export function gracefulShutdown(options: ShutdownOptions) {
    const { server, log, timeout = 10000, onShutdown, onInit } = options;
    const sockets = new Set<Socket>();
    const secureSockets = new Set<Socket>();
    let isShuttingDown = false;

    server.on('connection', (socket: Socket) => {
        if (isShuttingDown) {
            // stop new connections if we are already shutting down
            socket.destroy();
        } else {
            sockets.add(socket);

            // remove connections that have successfully completed
            socket.once('close', () => {
                sockets.delete(socket);
            });
        }
    });
    server.on('secureConnection', (socket: Socket) => {
        if (isShuttingDown) {
            // stop new connections if we are already shutting down
            socket.destroy();
        } else {
            secureSockets.add(socket);

            // remove connections that have successfully completed
            socket.once('close', () => {
                secureSockets.delete(socket);
            });
        }
    });

    function destroySocket(socket: Socket) {
        socket.destroy();

        // @ts-ignore This is the HTTP CONNECT request socket.
        if (socket.server instanceof Server) {
            sockets.delete(socket);
        } else {
            secureSockets.delete(socket);
        }
    }

    function shutdown() {
        if (isShuttingDown) {
            log?.debug('Shutdown already in progress');
            return;
        }
        onInit?.();
        isShuttingDown = true;
        log?.debug('Shutdown initiated');

        server.on('request', (incoming: IncomingMessage, outgoing: OutgoingMessage) => {
            if (!outgoing.headersSent) {
                // Indicate to the client that the server would like to close
                // the connection. See
                // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Connection#directives
                outgoing.setHeader('Connection', 'close');
            }
        });

        sockets.forEach((socket) => {
            // @ts-ignore This is the HTTPS CONNECT request socket.
            if (!(socket.server instanceof Server)) {
                return;
            }

            // @ts-ignore
            // eslint-disable-next-line no-underscore-dangle
            const serverResponse = socket._httpMessage;

            if (serverResponse) {
                if (!serverResponse.headersSent) {
                    serverResponse.setHeader('Connection', 'close');
                }
                return;
            }

            destroySocket(socket);
        });

        secureSockets.forEach((socket) => {
            // @ts-ignore
            if (!(socket.server instanceof TlsServer)) {
                return;
            }

            // @ts-ignore
            // eslint-disable-next-line no-underscore-dangle
            const serverResponse = socket._httpMessage;

            if (serverResponse) {
                if (!serverResponse.headersSent) {
                    serverResponse.setHeader('Connection', 'close');
                }
                return;
            }

            destroySocket(socket);
        });

        let terminated = false;
        const timeoutId = setTimeout(() => {
            log?.warn(
                `Terminated ${
                    sockets.size + secureSockets.size
                } connections after waiting ${timeout}ms`,
            );
            sockets.forEach(destroySocket);
            secureSockets.forEach(destroySocket);
            terminated = true;
        }, timeout);

        server.close(() => {
            clearTimeout(timeoutId);
            if (!terminated) {
                log?.debug('All connections successfully completed');
            }
            onShutdown?.();
        });
    }

    return shutdown;
}

/**
 * Gracefully shuts down a server with SIGTERM and SIGINT signals. See
 * {@link gracefulShutdown} for more details.
 * @param options - {@link ShutdownOptions}
 */
export function gracefulShutdownWithSignals(options: ShutdownOptions) {
    const shutdown = gracefulShutdown(options);
    const signalShutdown = (code: string) => {
        options.log?.debug(`Shutdown initiated by signal: ${code}`);
        shutdown();
    };
    process.on('SIGTERM', signalShutdown);
    process.on('SIGINT', signalShutdown);
    return shutdown;
}
