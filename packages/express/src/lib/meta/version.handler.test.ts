import type { Request, Response } from 'express';

import type { VersionMeta } from './version.handler.js';
import { createVersionHandler } from './version.handler.js';

const versionMeta: VersionMeta = {
  id: 'testApp',
  branch: 'testBranch',
  sha: '12345',
  version: '1.0.2',
  buildDate: '2022-07-05',
};

describe('versionRoute', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  const { env } = process;

  beforeAll(() => {
    res = {
      json: vi.fn(),
    };
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    process.env = env;
  });

  it('returns the provided version info', () => {
    createVersionHandler(versionMeta)(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledOnce();
    expect(res.json).toHaveBeenCalledWith(versionMeta);
  });

  it('falls back to the version info from environment variables', () => {
    process.env.APP_ID = versionMeta.id;
    process.env.BUILD_BRANCH = versionMeta.branch;
    process.env.BUILD_SHA = versionMeta.sha;
    process.env.BUILD_VERSION = versionMeta.version;
    process.env.BUILD_DATE = versionMeta.buildDate;

    createVersionHandler()(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledOnce();
    expect(res.json).toHaveBeenCalledWith(versionMeta);
  });

  it('returns the metadata defaulted to empty strings', () => {
    delete process.env.APP_ID;
    delete process.env.BUILD_BRANCH;
    delete process.env.BUILD_SHA;
    delete process.env.BUILD_VERSION;
    delete process.env.BUILD_DATE;

    createVersionHandler()(req as Request, res as Response);

    expect(res.json).toHaveBeenCalledOnce();
    expect(res.json).toHaveBeenCalledWith({
      id: '',
      branch: '',
      sha: '',
      version: '',
      buildDate: '',
    });
  });
});
