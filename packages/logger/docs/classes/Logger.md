[**@wesp-up/logger**](../README.md) • **Docs**

---

# Class: `abstract` Logger

Base logger object.

## Extended by

- [`MultiLogger`](MultiLogger.md)
- [`WinstonLogger`](WinstonLogger.md)

## Constructors

### new Logger()

> **new Logger**(`options`): [`Logger`](Logger.md)

#### Parameters

• **options**: [`Options`](../interfaces/Options.md) = `{}`

#### Returns

[`Logger`](Logger.md)

## Properties

### level

> `protected` **level**: [`Level`](../type-aliases/Level.md)

## Methods

### getLevel()

> **getLevel**(): [`Level`](../type-aliases/Level.md)

Returns the current logging level set in the logger.

#### Returns

[`Level`](../type-aliases/Level.md)

---

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

---

### configure()

> **configure**(`options`): `void`

Sets options on the logger.

#### Parameters

• **options**: [`Options`](../interfaces/Options.md)

Options to set.

#### Returns

`void`

---

### commit()

> `abstract` `protected` **commit**(`level`, `entry`): `void`

Function for processing log data when the level is allowed.

#### Parameters

• **level**: [`Level`](../type-aliases/Level.md)

Level of the data to log.

• **entry**: [`Entry`](../interfaces/Entry.md)

The entry to be logged.

#### Returns

`void`

---

### debug()

> **debug**(`data`): `void`

Logs debug messages.

#### Parameters

• **data**: `string` \| [`Entry`](../interfaces/Entry.md)

Data to be logged.

#### Returns

`void`

---

### info()

> **info**(`data`): `void`

Logs info messages.

#### Parameters

• **data**: `string` \| [`Entry`](../interfaces/Entry.md)

Data to be logged.

#### Returns

`void`

---

### access()

> **access**(`entry`): `void`

Log HTTP access messages.

#### Parameters

• **entry**: [`AccessEntry`](../interfaces/AccessEntry.md)

Entry to be logged.

#### Returns

`void`

---

### warn()

> **warn**(`data`): `void`

Logs warn messages.

#### Parameters

• **data**: `string` \| [`Entry`](../interfaces/Entry.md)

Data to be logged.

#### Returns

`void`

---

### error()

> **error**(`data`): `void`

Logs error messages.

#### Parameters

• **data**: `string` \| [`Entry`](../interfaces/Entry.md)

Data to be logged.

#### Returns

`void`
