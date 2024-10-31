[**@wesp-up/logger**](../README.md) • **Docs**

***

# Interface: WinstonLoggerOptions

Options for the Winston Logger.

## Extends

- [`Options`](Options.md)

## Properties

### mode?

> `optional` **mode**: [`Mode`](../type-aliases/Mode.md)

***

### level?

> `optional` **level**: [`Level`](../type-aliases/Level.md)

Level to respect in the logger. Messages of a lower level will not be
logged.

#### Default

```ts
"info"
```

#### Inherited from

[`Options`](Options.md).[`level`](Options.md#level)
