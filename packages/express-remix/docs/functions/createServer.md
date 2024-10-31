[**@wesp-up/express-remix**](../README.md) • **Docs**

***

# Function: createServer()

> **createServer**(`options`?): [`Server`](../classes/Server.md)

Creates a base server that can be customized for any service.

## Parameters

• **options?**: [`Options`](../interfaces/Options.md)

[Options](../interfaces/Options.md)

## Returns

[`Server`](../classes/Server.md)

## Example

```typescript
const server = createServer({ pathPrefix: '/my-service' });
server.start(3000);
```
