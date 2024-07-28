import type { Request, Response } from 'express';

import { healthHandler } from './health.handler.js';

describe('healthcheck', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  const getMock = vi.fn();

  beforeAll(() => {
    res = {
      // @ts-ignore
      app: {
        get: getMock,
      },
      status: vi.fn().mockReturnThis(),
      json: vi.fn(),
    };
  });

  beforeEach(() => {
    vi.clearAllMocks();
    getMock.mockReset();
  });

  test('it should return 200 status when app status ok', () => {
    getMock.mockReturnValue('ok');

    healthHandler(req as Request, res as Response);

    expect(getMock).toHaveBeenCalledOnce();
    expect(getMock).toHaveBeenCalledWith('status');
    expect(res.status).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledOnce();
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' });
  });

  test('it should return 200 status when app status undefined', () => {
    getMock.mockReturnValue(undefined);

    healthHandler(req as Request, res as Response);

    expect(getMock).toHaveBeenCalledOnce();
    expect(getMock).toHaveBeenCalledWith('status');
    expect(res.status).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledOnce();
    expect(res.json).toHaveBeenCalledWith({ status: 'ok' });
  });

  test('it should return 503 status when app status set', () => {
    getMock.mockReturnValue('shutdown');

    healthHandler(req as Request, res as Response);

    expect(getMock).toHaveBeenCalledOnce();
    expect(getMock).toHaveBeenCalledWith('status');
    expect(res.status).toHaveBeenCalledOnce();
    expect(res.status).toHaveBeenCalledWith(503);
    expect(res.json).toHaveBeenCalledOnce();
    expect(res.json).toHaveBeenCalledWith({ status: 'shutdown' });
  });
});
