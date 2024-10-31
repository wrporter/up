[**@wesp-up/express-remix**](../README.md) • **Docs**

***

# Class: ServerLogger

A logger class that can be used by consumers of @wesp-up/express. Emits counter metrics for log
levels. Useful for alerting on high error rates.

## Extends

- `Logger`

## Extended by

- [`RequestLogger`](RequestLogger.md)

## Constructors

### new ServerLogger()

> **new ServerLogger**(`options`?): [`ServerLogger`](ServerLogger.md)

#### Parameters

• **options?**: `Options$1`

#### Returns

[`ServerLogger`](ServerLogger.md)

#### Inherited from

`Logger.constructor`

## Properties

### level

> `protected` **level**: `Level`

#### Inherited from

`Logger.level`

## Methods

### commit()

> `protected` **commit**(`level`, `entry`): `void`

Function for processing log data when the level is allowed.

#### Parameters

• **level**: `Level`

Level of the data to log.

• **entry**: `Entry`

The entry to be logged.

#### Returns

`void`

#### Overrides

`Logger.commit`

***

### configure()

> **configure**(`options`): `void`

Sets options on the logger.

#### Parameters

• **options**: `Options$1`

Options to set.

#### Returns

`void`

#### Overrides

`Logger.configure`

***

### getLevel()

> **getLevel**(): `Level`

Returns the current logging level set in the logger.

#### Returns

`Level`

#### Inherited from

`Logger.getLevel`

***

### log()

> **log**(`level`, `data`): `void`

Sends log data to the Logger.commit function only if the level meets
the configured maximum.

#### Parameters

• **level**: `Level`

Level of the data to log.

• **data**: `string` \| `Error` \| `Entry` \| `AccessEntry`

Data to be logged. Can be of any type.

#### Returns

`void`

#### Inherited from

`Logger.log`

***

### debug()

> **debug**(`data`): `void`

Logs debug messages.

#### Parameters

• **data**: `string` \| `Entry`

Data to be logged.

#### Returns

`void`

#### Inherited from

`Logger.debug`

***

### info()

> **info**(`data`): `void`

Logs info messages.

#### Parameters

• **data**: `string` \| `Entry`

Data to be logged.

#### Returns

`void`

#### Inherited from

`Logger.info`

***

### access()

> **access**(`entry`): `void`

Log HTTP access messages.

#### Parameters

• **entry**: `AccessEntry`

Entry to be logged.

#### Returns

`void`

#### Inherited from

`Logger.access`

***

### warn()

> **warn**(`data`): `void`

Logs warn messages.

#### Parameters

• **data**: `string` \| `Entry`

Data to be logged.

#### Returns

`void`

#### Inherited from

`Logger.warn`

***

### error()

> **error**(`data`): `void`

Logs error messages.

#### Parameters

• **data**: `string` \| `Entry`

Data to be logged.

#### Returns

`void`

#### Inherited from

`Logger.error`
