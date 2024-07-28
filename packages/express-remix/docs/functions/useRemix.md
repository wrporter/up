[**@wesp-up/express-remix**](../README.md) • **Docs**

---

# Function: useRemix()

> **useRemix**(`app`, `options`?): `void`

Apply Remix middleware and assets to an Express application. This should be
applied towards the end of an application since control will be given to
Remix at this point. Any custom Express routes and middleware should be
applied previous to using this.

## Parameters

• **app**: `Application`

Express app to apply Remix middleware to.

• **options?**: `Partial`\<[`RemixOptions`](../interfaces/RemixOptions.md)\>

Options for configuring Remix assets and middleware.

## Returns

`void`
