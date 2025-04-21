import type { Application, NextFunction, Request, Response } from "express";
import request from "supertest";

import { metricsMiddleware } from "./metrics/index.js";
import type { Options } from "./server.js";
import { Server, createServer } from "./server.js";

vi.mock("./metrics", () => ({
  metricsMiddleware: vi.fn().mockImplementation(() => {
    const middleware = (req: Request, res: Response, next: NextFunction) =>
      next();
    middleware.metricsMiddleware = (req: Request, res: Response) => {
      res.json({ test: "123" });
    };
    return middleware;
  }),
}));

interface CustomOptions extends Options {
  pre?: (app: Application) => void;
  post?: (app: Application) => void;
}

class CustomServer extends Server {
  private customOptions: CustomOptions;

  constructor(customOptions: CustomOptions = {}) {
    super(customOptions);
    this.customOptions = customOptions;
  }

  protected preMountApp(app: Application) {
    this.customOptions.pre?.(app);
  }

  protected postMountApp(app: Application) {
    this.customOptions.post?.(app);
  }
}

describe("init", () => {
  it("has a health check route", async () => {
    const server = createServer();
    const res = await request(server.httpServer)
      .get("/healthcheck")
      .expect(200);

    expect(res.body.status).toBe("ok");
  });

  it("has a version route", async () => {
    const server = createServer({ versionMeta: { id: "my-it-server" } });

    const res = await request(server.httpServer).get("/version").expect(200);

    expect(res.body.id).toBe("my-it-server");
  });

  it("passes provided metrics options", () => {
    createServer({ metricsOptions: { includePath: false } });

    expect(metricsMiddleware).toHaveBeenCalledWith({
      includePath: false,
      autoregister: false,
    });
  });

  it("has a metrics route on the metrics server", async () => {
    const server = createServer();
    const res = await request(server.metricsHttpServer)
      .get("/metrics")
      .expect(200);

    expect(res.body).toMatchObject({});
  });

  it("applies the pre mount hook before mount", async () => {
    const server = new CustomServer({
      pre(app) {
        app.use((req, res) => {
          res.json({ pre: "ok" });
        });
      },
      mountApp(app) {
        app.get("/mount", (req, res) => {
          res.send({ mount: "ok" });
        });
      },
    });
    server.init();

    const res = await request(server.httpServer).get("/mount").expect(200);

    // The pre mount handlers take precedence
    expect(res.body).toEqual({ pre: "ok" });
  });

  it("applies the post mount hook after mount", async () => {
    const server = new CustomServer({
      post(app) {
        app.use((req, res) => {
          res.json({ post: "ok" });
        });
      },
      mountApp(app) {
        app.get("/mount", (req, res) => {
          res.send({ mount: "ok" });
        });
      },
    });
    server.init();

    let res = await request(server.httpServer).get("/mount").expect(200);

    // The mount handlers take precedence
    expect(res.body).toEqual({ mount: "ok" });

    res = await request(server.httpServer).get("/other").expect(200);

    expect(res.body).toEqual({ post: "ok" });
  });
});

describe("start", () => {
  it("listens on default ports", () => {
    const server = createServer({
      gracefulShutdownTimeout: 0,
    });
    vi.spyOn(server.httpServer, "listen").mockImplementation(
      () => server.httpServer,
    );
    vi.spyOn(server.metricsHttpServer, "listen").mockImplementation(
      () => server.metricsHttpServer,
    );

    server.start();

    expect(server.httpServer.listen).toHaveBeenCalledTimes(1);
    expect(server.httpServer.listen).toHaveBeenCalledWith(80);
    expect(server.metricsHttpServer.listen).toHaveBeenCalledTimes(1);
    expect(server.metricsHttpServer.listen).toHaveBeenCalledWith(22500);
  });

  it("listens on specified ports", () => {
    const server = createServer();
    vi.spyOn(server.httpServer, "listen").mockImplementation(
      () => server.httpServer,
    );
    vi.spyOn(server.metricsHttpServer, "listen").mockImplementation(
      () => server.metricsHttpServer,
    );

    server.start(3000, 22501);

    expect(server.httpServer.listen).toHaveBeenCalledTimes(1);
    expect(server.httpServer.listen).toHaveBeenCalledWith(3000);
    expect(server.metricsHttpServer.listen).toHaveBeenCalledTimes(1);
    expect(server.metricsHttpServer.listen).toHaveBeenCalledWith(22501);
  });
});

describe("stop", () => {
  it("shuts down the servers", async () => {
    // @ts-ignore -- process.exit never returns
    const mockExit = vi.spyOn(process, "exit").mockImplementation(() => {});
    const server = createServer({
      gracefulShutdownTimeout: 0,
    });
    vi.spyOn(server.httpServer, "listen").mockImplementation(
      () => server.httpServer,
    );
    vi.spyOn(server.metricsHttpServer, "listen").mockImplementation(
      () => server.metricsHttpServer,
    );

    server.start();
    server.stop();

    expect(server.app.get("status")).toEqual("shutdown");
    await vi.waitFor(() => {
      expect(mockExit).toHaveBeenCalled();
    });
    expect(mockExit).toHaveBeenCalledWith(0);

    mockExit.mockReset();
  });
});
