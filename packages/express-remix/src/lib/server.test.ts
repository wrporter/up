import path from 'path';

import { createRequestHandler } from '@remix-run/express';
import type { NextFunction, Request, Response } from 'express';

import { createRemixServer } from './server.js';

// Import its own build as the build module, I couldn't figure out how to stub
// the internal require
const buildModule = path.resolve(__dirname, '../..', 'test/mockBuild.cjs');
vi.doMock(buildModule, () => {
  return vi.fn();
});

vi.mock('@remix-run/express', () => ({
  createRequestHandler: vi
    .fn()
    .mockImplementation(() => (req: Request, res: Response, next: NextFunction) => next()),
}));

vi.mock('@wesp-up/express', () => ({
  Server: class {
    public app = { use: vi.fn(), all: vi.fn() };

    init() {
      this.postMountApp?.(this.app);
    }

    // this is never called; the postMountApp call above references the function in server.ts
    protected postMountApp?(app: any): void;
  },
}));

describe('postMountApp', () => {
  it('applies middleware for Remix', () => {
    const server = createRemixServer({ serverBuildPath: buildModule });

    expect(createRequestHandler).toHaveBeenCalled();
    expect(vi.mocked(server.app.all)).toHaveBeenCalledWith('*', expect.anything());
  });
});
