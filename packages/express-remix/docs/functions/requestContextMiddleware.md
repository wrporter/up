[**@wesp-up/express-remix**](../README.md) • **Docs**

***

# Function: requestContextMiddleware()

> **requestContextMiddleware**(`req`, `res`, `next`): `void` \| `Promise`\<`void`\>

Middleware to set up context on the request. Context is accessed via
`req.context`.

## Parameters

• **req**: `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\>

• **res**: `Response`\<`any`, `Record`\<`string`, `any`\>, `number`\>

• **next**: `NextFunction`

## Returns

`void` \| `Promise`\<`void`\>

## Example

```typescript
app.use(requestContextMiddleware);
app.use((req, res, next) => {
    const { userId, brandId } = authenticate(req);
    req.context.userId = userId;
    req.context.brandId = brandId;
    req.context.log.info({ message: 'Authenticated!' });
});
```
