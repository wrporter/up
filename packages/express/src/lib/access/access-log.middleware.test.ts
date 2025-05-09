import EventEmitter from "events";
import type { Socket } from "net";

import type { NextFunction, Request, RequestHandler, Response } from "express";
import express from "express";
import supertest from "supertest";

import { accessLogMiddleware } from "./access-log.middleware.js";
import type { RequestLogger } from "../logger/index.js";
import type { RequestContext } from "../request-context/index.js";

vi.mock("on-finished", () => ({
  default(res: Response, callback: () => void) {
    callback();
  },
}));

const logger = {
  access: vi.fn(),
} as unknown as RequestLogger;

const next = vi.fn() as unknown as NextFunction;
let req: Request;
let res: Response;
let middleware: RequestHandler;

let app: express.Application;

beforeEach(() => {
  middleware = accessLogMiddleware();

  req = {
    headers: {},
    context: { log: logger },
  } as Request;
  res = new EventEmitter() as unknown as Response;

  app = express();
  app.use((req, _res, next) => {
    req.context = { log: logger } as unknown as RequestContext;
    next();
  });
  app.use(middleware);
});

it("calls next", () => {
  void middleware(req, res, next);

  expect(next).toHaveBeenCalled();
});

it("logs access on the finish event", async () => {
  await supertest(app).get("/");

  expect(logger.access).toHaveBeenCalled();
});

it("logs the original url", async () => {
  const router = express.Router();
  router.get("/sub-path", (_req, res) => {
    res.status(200).end();
  });

  app.use("/base-path", router);
  await supertest(app).get("/base-path/sub-path");

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ url: "/base-path/sub-path" }),
  );
});

it("logs the fallback url when the original url does not exist", async () => {
  await supertest(app).get("/fallback");

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ url: "/fallback" }),
  );
});

it("logs the status code", async () => {
  app.use((_req, res) => {
    res.status(400).end();
  });
  await supertest(app).get("/");

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ status: 400 }),
  );
});

it("logs the status code for responses with headers", async () => {
  app.use((_req, res) => {
    res.header("foo", "bar");
    res.status(500).end();
  });
  await supertest(app).get("/");

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ status: 500 }),
  );
});

it("logs a 499 status for requests that were canceled by the client", () => {
  res.headersSent = false;
  void middleware(req, res, next);

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ status: 499 }),
  );
});

it("logs the elapsed time", async () => {
  await supertest(app).get("/");

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ time: expect.any(Number) }),
  );
});

it("logs the client ip", () => {
  // @ts-ignore
  req.ip = "10.10.10.10";
  void middleware(req, res, next);

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ clientIp: "10.10.10.10" }),
  );
});

it("logs the fallback client ip", () => {
  req.connection = { remoteAddress: "1.1.1.1" } as unknown as Socket;
  void middleware(req, res, next);

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ clientIp: "1.1.1.1" }),
  );
});

it("logs no client ip when it does not exist", () => {
  void middleware(req, res, next);

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ clientIp: undefined }),
  );
});

it("logs the method", async () => {
  await supertest(app).get("/");

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ method: "GET" }),
  );
});

it("logs the user agent", async () => {
  await supertest(app).get("/").set("user-agent", "test-agent");

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ userAgent: "test-agent" }),
  );
});

it("logs the response size in bytes", () => {
  res.content = "12345";
  void middleware(req, res, next);

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ bytes: 5 }),
  );
});

it("logs the response size in bytes even if it does not exist", async () => {
  await supertest(app).get("/");

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ bytes: 0 }),
  );
});

it("logs the request body size", async () => {
  await supertest(app).post("/").send("1234567890");

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ bytesIn: "10" }),
  );
});

it("logs the http version", async () => {
  app.use((req, _res, next) => {
    req.httpVersionMajor = 1;
    req.httpVersionMinor = 1;
    next();
  });

  await supertest(app).get("/");

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ httpVersion: "1.1" }),
  );
});

it("logs the referrer url", async () => {
  await supertest(app).get("/").set("referer", "referer");
  await supertest(app).get("/");

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ referer: "referer" }),
  );
});

it("logs the fallback referrer url", async () => {
  await supertest(app).get("/").set("referrer", "referrer");

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ referer: "referrer" }),
  );
});

it("logs x forwarded for header", async () => {
  await supertest(app).get("/").set("x-forwarded-for", "forward");

  expect(logger.access).toHaveBeenCalledWith(
    expect.objectContaining({ xForwardedFor: "forward" }),
  );
});
