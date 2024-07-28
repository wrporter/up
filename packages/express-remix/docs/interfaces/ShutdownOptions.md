[**@wesp-up/express-remix**](../README.md) • **Docs**

---

# Interface: ShutdownOptions

Options for performing a graceful shutdown of a server.

## Properties

### server

> **server**: `Server`\<_typeof_ `IncomingMessage`, _typeof_ `ServerResponse`\> \| `Server`

The server to shut down.

---

### log?

> `optional` **log**: `Logger`

Optional logger for logging events.

---

### timeout?

> `optional` **timeout**: `number`

Time in milliseconds to wait for open connections to finish. Defaults
to 10,000ms.

---

### onInit()?

> `optional` **onInit**: () => `void`

Callback function to call at the start of the shutdown operation.

#### Returns

`void`

---

### onShutdown()?

> `optional` **onShutdown**: () => `void`

Callback function to call just after the server closes.

#### Returns

`void`
