import EventEmitter from 'events';
import { Server } from 'http';
import { Server as TlsServer } from 'https';

import { gracefulShutdown } from './shutdown.js';

beforeEach(() => {
  vi.useFakeTimers();
});

class MockServer extends EventEmitter {
  close(callback: () => void) {
    this.on('close', callback);
  }
}

type ServerResponse =
  | {
      headersSent: boolean;
      setHeader?: () => void;
    }
  | undefined;

class MockSocket extends EventEmitter {
  public server?: Server | TlsServer;

  public _httpMessage: ServerResponse;

  constructor(server: Server | TlsServer) {
    super();
    this.server = server;
  }

  destroy() {}

  setServerResponse(response: ServerResponse) {
    this._httpMessage = response;
  }
}

let server: MockServer;
let shutdown: () => void;
let socket: MockSocket;
let tlsSocket: MockSocket;
const onShutdown = vi.fn();
const onInit = vi.fn();

beforeEach(() => {
  server = new MockServer();
  vi.spyOn(server, 'close');

  shutdown = gracefulShutdown({
    server: server as unknown as Server,
    onShutdown,
    onInit,
  });

  socket = new MockSocket(new Server());
  vi.spyOn(socket, 'destroy');

  tlsSocket = new MockSocket(new TlsServer());
  vi.spyOn(tlsSocket, 'destroy');
});

it('closes the server', () => {
  shutdown();

  expect(onInit).toHaveBeenCalled();
  expect(server.close).toHaveBeenCalled();

  server.emit('close');

  expect(onShutdown).toHaveBeenCalled();
});

it('only initiates the shutdown once', () => {
  shutdown();
  shutdown();

  expect(server.close).toHaveBeenCalledTimes(1);
});

it('sets the connection close header to indicate the desire to close the connection to clients', () => {
  const outgoing = { setHeader: vi.fn(), headersSent: false };

  server.emit('connection', socket);
  server.emit('secureConnection', tlsSocket);
  shutdown();
  server.emit('request', undefined, outgoing);

  expect(outgoing.setHeader).toHaveBeenCalledWith('Connection', 'close');
});

it('terminates old connections after the given timeout', () => {
  server.emit('connection', socket);
  server.emit('secureConnection', tlsSocket);

  shutdown();
  vi.runAllTimers();

  expect(socket.destroy).toHaveBeenCalledTimes(1);
  expect(tlsSocket.destroy).toHaveBeenCalledTimes(1);
});

it('allows old connections to complete before the timeout', () => {
  server.emit('connection', socket);
  server.emit('secureConnection', tlsSocket);

  socket.emit('close');
  tlsSocket.emit('close');
  shutdown();

  expect(socket.destroy).not.toHaveBeenCalled();
  expect(tlsSocket.destroy).not.toHaveBeenCalled();
});

it('terminates new connections as they come in', () => {
  shutdown();
  server.emit('connection', socket);
  server.emit('secureConnection', tlsSocket);

  expect(socket.destroy).toHaveBeenCalledTimes(1);
  expect(tlsSocket.destroy).toHaveBeenCalledTimes(1);
});

it('does not terminate old sockets that are not requests', () => {
  delete socket.server;
  delete tlsSocket.server;
  server.emit('connection', socket);
  server.emit('secureConnection', tlsSocket);

  shutdown();

  expect(socket.destroy).not.toHaveBeenCalled();
  expect(tlsSocket.destroy).not.toHaveBeenCalled();
});

it('does not terminate old sockets that have already sent headers', () => {
  const socketSetHeader = vi.fn();
  const tlsSocketSetHeader = vi.fn();
  socket.setServerResponse({
    headersSent: false,
    setHeader: socketSetHeader,
  });
  tlsSocket.setServerResponse({
    headersSent: false,
    setHeader: tlsSocketSetHeader,
  });
  server.emit('connection', socket);
  server.emit('secureConnection', tlsSocket);

  shutdown();

  expect(socket.destroy).not.toHaveBeenCalled();
  expect(tlsSocket.destroy).not.toHaveBeenCalled();
  expect(socketSetHeader).toHaveBeenCalledWith('Connection', 'close');
  expect(tlsSocketSetHeader).toHaveBeenCalledWith('Connection', 'close');
});

it('terminates old sockets that are not server responses', () => {
  socket.setServerResponse(undefined);
  tlsSocket.setServerResponse(undefined);
  server.emit('connection', socket);
  server.emit('secureConnection', tlsSocket);

  shutdown();

  expect(socket.destroy).toHaveBeenCalledTimes(1);
  expect(tlsSocket.destroy).toHaveBeenCalledTimes(1);
});
