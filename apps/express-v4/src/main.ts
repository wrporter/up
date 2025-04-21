import { createServer } from "@wesp-up/express";

import { contactRouter } from "./feature/contact/contact.router.js";

const pathPrefix = "/contact-service";

const server = createServer({
  pathPrefix,
  mountApp(app) {
    app.use(pathPrefix, contactRouter);

    /**
     * Route used to test graceful shutdown.
     * 1. Send a GET request to `/slow`
     * 2. Send a shutdown signal to the server
     * 3. Wait for the request to finish for the server to immediately shut down
     *   - Adjust the timeout to 6000ms to see that the server shuts down at the default time of
     *     5000ms and terminates the request before it completes.
     */
    app.get("/slow", (_, res) => {
      setTimeout(() => {
        res.send("Hello World!");
      }, 2000);
    });
  },
});

server.start(3001, 22501);
