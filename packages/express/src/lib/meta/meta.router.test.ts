import type { Request, Response } from 'express';
import express from 'express';
import request from 'supertest';

import { metaRouter } from './meta.router';

vi.mock('./health.handler', () => ({
    healthHandler: (req: Request, res: Response) => res.json({ status: 'ok' }),
}));
vi.mock('./version.handler', () => ({
    createVersionHandler: () => (req: Request, res: Response) => res.json({ version: 1 }),
}));

function setup(pathPrefix?: string) {
    const router = metaRouter({ pathPrefix });
    const app = express();
    app.use(router);
    return app;
}

it('configures a health route', async () => {
    const app = setup();

    const response = await request(app).get('/healthcheck');

    expect(response).toHaveProperty('status', 200);
    expect(response).toHaveProperty('body', { status: 'ok' });
});

it('configures a health route with a path prefix', async () => {
    const app = setup('/my-service');

    let response = await request(app).get('/healthcheck');

    expect(response).toHaveProperty('status', 404);

    response = await request(app).get('/my-service/healthcheck');

    expect(response).toHaveProperty('status', 200);
    expect(response).toHaveProperty('body', { status: 'ok' });
});

it('configures a version route', async () => {
    const app = setup();

    const response = await request(app).get('/version');

    expect(response).toHaveProperty('status', 200);
    expect(response).toHaveProperty('body', { version: 1 });
});
