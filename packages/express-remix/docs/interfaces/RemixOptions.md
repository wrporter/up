[**@wesp-up/express-remix**](../README.md) • **Docs**

***

# Interface: RemixOptions

Remix options.

## Properties

### serverBuildPath

> **serverBuildPath**: `string`

The build path for the backend server.

#### Default

`${PWD}/build`

***

### assetsRoot

> **assetsRoot**: `string`

The root folder for public assets.

#### Default

`public`

***

### assetsBuildDirectory

> **assetsBuildDirectory**: `string`

The build directory for remix assets, should be a child of
[RemixOptions.assetsRoot](RemixOptions.md#assetsroot).

#### Default

`public/build`

***

### publicPath

> **publicPath**: `string`

The route path for public assets.

#### Default

`/build/`

***

### assetsRootMaxAge

> **assetsRootMaxAge**: `string`

Max age to cache assets specified in [RemixOptions.assetsRoot](RemixOptions.md#assetsroot).
For more information on the options, see
https://expressjs.com/en/4x/api.html#express.static. Defaults to 1 hour.
