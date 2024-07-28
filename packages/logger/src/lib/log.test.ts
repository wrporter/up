import { createDefaultLogger, log } from './log.js';

const { env } = process;
beforeEach(() => {
  vi.resetAllMocks();
  vi.resetModules();
  process.env = { ...env };
});
afterEach(() => {
  process.env = env;
});

describe('default log', () => {
  it('the default instance has a silent level in test environments', () => {
    expect(log.getLevel()).toEqual('silent');
  });

  it('sets the default level to silent for test environments', () => {
    expect(createDefaultLogger().getLevel()).toEqual('silent');
  });

  it('sets the level to the LOG_LEVEL environment variable', () => {
    process.env.LOG_LEVEL = 'error';
    expect(createDefaultLogger().getLevel()).toEqual('error');
  });

  it('falls back to the info log level for production environments', () => {
    process.env.NODE_ENV = 'production';
    expect(createDefaultLogger().getLevel()).toEqual('info');
  });
});
