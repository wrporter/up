[**@wesp-up/ui**](../README.md) • **Docs**

***

# Type Alias: NoNullMember\<T\>

> **NoNullMember**\<`T`\>: `{ [P in keyof T]?: NoNullMember<Exclude<T[P], null>> }`

Similar to TypeScript's utility function NonNullable (see
https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype),
but allows undefined.

## Type Parameters

• **T**
