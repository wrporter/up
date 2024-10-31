[**@wesp-up/logger**](../README.md) • **Docs**

***

# Class: WinstonLogger

A production-ready logger for application and HTTP access logs. Uses
[Winston](https://github.com/winstonjs/winston) for logging. Merges
consecutive parameters passed to its logging functions. For example,

```typescript
log.info('Fancy message', { other: 'info' });
```

Will output a log message with the following fields included.

```json
{"message":"Fancy message","other":"info"}
```

This means that consecutive parameters that match previous ones will
override them.

## Extends

- [`Logger`](Logger.md)

## Constructors

### new WinstonLogger()

> **new WinstonLogger**(`options`?): [`WinstonLogger`](WinstonLogger.md)

#### Parameters

• **options?**: [`WinstonLoggerOptions`](../interfaces/WinstonLoggerOptions.md)

#### Returns

[`WinstonLogger`](WinstonLogger.md)

#### Overrides

[`Logger`](Logger.md).[`constructor`](Logger.md#constructors)

## Properties

### logger

> **logger**: `Logger`

***

### level

> `protected` **level**: [`Level`](../type-aliases/Level.md)

#### Inherited from

[`Logger`](Logger.md).[`level`](Logger.md#level)

## Methods

### commit()

> `protected` **commit**(`level`, `data`): `void`

Function for processing log data when the level is allowed.

#### Parameters

• **level**: [`Level`](../type-aliases/Level.md)

Level of the data to log.

• **data**: [`Entry`](../interfaces/Entry.md)

#### Returns

`void`

#### Overrides

[`Logger`](Logger.md).[`commit`](Logger.md#commit)

***

### configure()

> **configure**(`options`): `void`

Sets options on the logger.

#### Parameters

• **options**: [`WinstonLoggerOptions`](../interfaces/WinstonLoggerOptions.md)

Options to set.

#### Returns

`void`

#### Overrides

[`Logger`](Logger.md).[`configure`](Logger.md#configure)

***

### getLevel()

> **getLevel**(): [`Level`](../type-aliases/Level.md)

Returns the current logging level set in the logger.

#### Returns

[`Level`](../type-aliases/Level.md)

#### Inherited from

[`Logger`](Logger.md).[`getLevel`](Logger.md#getlevel)

***

### log()

> **log**(`level`, `data`): `void`

Sends log data to the [Logger.commit](Logger.md#commit) function only if the level meets
the configured maximum.

#### Parameters

• **level**: [`Level`](../type-aliases/Level.md)

Level of the data to log.

• **data**: `string` \| [`Entry`](../interfaces/Entry.md) \| `Error` \| [`AccessEntry`](../interfaces/AccessEntry.md)

Data to be logged. Can be of any type.

#### Returns

`void`

#### Inherited from

[`Logger`](Logger.md).[`log`](Logger.md#log)

***

### debug()

> **debug**(`data`): `void`

Logs debug messages.

#### Parameters

• **data**: `string` \| [`Entry`](../interfaces/Entry.md)

Data to be logged.

#### Returns

`void`

#### Inherited from

[`Logger`](Logger.md).[`debug`](Logger.md#debug)

***

### info()

> **info**(`data`): `void`

Logs info messages.

#### Parameters

• **data**: `string` \| [`Entry`](../interfaces/Entry.md)

Data to be logged.

#### Returns

`void`

#### Inherited from

[`Logger`](Logger.md).[`info`](Logger.md#info)

***

### access()

> **access**(`entry`): `void`

Log HTTP access messages.

#### Parameters

• **entry**: [`AccessEntry`](../interfaces/AccessEntry.md)

Entry to be logged.

#### Returns

`void`

#### Inherited from

[`Logger`](Logger.md).[`access`](Logger.md#access)

***

### warn()

> **warn**(`data`): `void`

Logs warn messages.

#### Parameters

• **data**: `string` \| [`Entry`](../interfaces/Entry.md)

Data to be logged.

#### Returns

`void`

#### Inherited from

[`Logger`](Logger.md).[`warn`](Logger.md#warn)

***

### error()

> **error**(`data`): `void`

Logs error messages.

#### Parameters

• **data**: `string` \| [`Entry`](../interfaces/Entry.md)

Data to be logged.

#### Returns

`void`

#### Inherited from

[`Logger`](Logger.md).[`error`](Logger.md#error)
