import type { Request, Response } from "express";

/**
 * Health check route handler. It is recommended to place the route at the path
 * `/<service id>/healthcheck`.
 *
 * The route is sensitive to the `status` setting on the Express app. If status
 * is set to anything except `ok` the status will be returned with a 503. If
 * status is undefined, the service will default to `ok`.
 */
export function healthHandler(_: Request, res: Response) {
  const status = res.app.get("status") ?? "ok";
  const statusCode = status === "ok" ? 200 : 503;
  res.status(statusCode).json({ status });
}
