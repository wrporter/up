[**@wesp-up/express**](../README.md) • **Docs**

***

# Function: errorHandler()

> **errorHandler**(`error500Handler`?): `ErrorRequestHandler`

Creates an error handling middleware using the provided logger. Meant to be
the final middleware applied as a fallback to catch errors.

## Parameters

• **error500Handler?**: `ErrorRequestHandler`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\>

Custom error handler to overwrite the default JSON response.

## Returns

`ErrorRequestHandler`

A connect compatible (Express) error handling middleware
