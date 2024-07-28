[**@wesp-up/express**](../README.md) • **Docs**

---

# Function: gracefulShutdown()

> **gracefulShutdown**(`options`): () => `void`

Gracefully shuts down a server in the following sequence.

1. Call the `onInit` callback.
2. Wait for the timeout period if there are any open connections.
3. After the wait period, close any open connections.
4. Close the server.
5. Call the `onShutdown` callback.

## Parameters

• **options**: [`ShutdownOptions`](../interfaces/ShutdownOptions.md)

[ShutdownOptions](../interfaces/ShutdownOptions.md)

## Returns

`Function`

### Returns

`void`
