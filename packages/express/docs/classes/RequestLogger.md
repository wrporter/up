[**@wesp-up/express**](../README.md) • **Docs**

***

# Class: RequestLogger

Request-scoped logger that decorates logs with data from `req.context`. The
logger applies `requestId` and `transactionId` to all logs.

## Example

```typescript
function route(req, res, next) {
    const log = new RequestLogger(req);
    log.addMeta({ myProp: 'my-prop' });
    log.info({ message: 'power-up' });
    // ->
    // {
    //   "message": "power-up",
    //   "meta": {
    //     "myProp": "my-prop"
    //   },
    //   "requestId": "3b0285da-5f26-44ed-964f-c00e4b484aa7",
    //   "transactionId": "9a2792cd-42d2-46d5-9804-d85778ece7b8"
    // }
}
```

## Extends

- [`ServerLogger`](ServerLogger.md)

## Constructors

### new RequestLogger()

> **new RequestLogger**(`request`, `options`?): [`RequestLogger`](RequestLogger.md)

#### Parameters

• **request**: `Request`\<`ParamsDictionary`, `any`, `any`, `ParsedQs`, `Record`\<`string`, `any`\>\>

• **options?**: `Options$1`

#### Returns

[`RequestLogger`](RequestLogger.md)

#### Overrides

[`ServerLogger`](ServerLogger.md).[`constructor`](ServerLogger.md#constructors)

## Properties

### level

> `protected` **level**: `Level`

#### Inherited from

[`ServerLogger`](ServerLogger.md).[`level`](ServerLogger.md#level)

## Methods

### addGlobalMeta()

> **addGlobalMeta**(`meta`): `void`

Add global metadata to all logs, stored under the `meta` property.
Consecutive calls to this method shallowly merge the metadata.

#### Parameters

• **meta**: [`LogMeta`](../interfaces/LogMeta.md)

Metadata to include with logs.

#### Returns

`void`

***

### addAccessMeta()

> **addAccessMeta**(`meta`): `void`

Add metadata only to access logs, stored under the `meta` property.
Consecutive calls to this method shallowly merge the metadata.

#### Parameters

• **meta**: [`LogMeta`](../interfaces/LogMeta.md)

Metadata to include with logs.

#### Returns

`void`

***

### addEventMeta()

> **addEventMeta**(`meta`): `void`

Add metadata only to event logs (all logs that are not access logs),
stored under the `meta` property. Consecutive calls to this method
shallowly merge the metadata.

#### Parameters

• **meta**: [`LogMeta`](../interfaces/LogMeta.md)

Metadata to include with logs.

#### Returns

`void`

***

### addScopedMeta()

> `protected` **addScopedMeta**(`scope`, `meta`): `void`

Adds scoped metadata to logs. Consecutive calls to this method
shallowly merge the metadata.

#### Parameters

• **scope**: [`LogMetaScope`](../type-aliases/LogMetaScope.md)

The scope to apply the metadata to.

• **meta**: [`LogMeta`](../interfaces/LogMeta.md)

Metadata to include with logs.

#### Returns

`void`

***

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

[`ServerLogger`](ServerLogger.md).[`commit`](ServerLogger.md#commit)

***

### configure()

> **configure**(`options`): `void`

Sets options on the logger.

#### Parameters

• **options**: `Options$1`

Options to set.

#### Returns

`void`

#### Inherited from

[`ServerLogger`](ServerLogger.md).[`configure`](ServerLogger.md#configure)

***

### getLevel()

> **getLevel**(): `Level`

Returns the current logging level set in the logger.

#### Returns

`Level`

#### Inherited from

[`ServerLogger`](ServerLogger.md).[`getLevel`](ServerLogger.md#getlevel)

***

### log()

> **log**(`level`, `data`): `void`

Sends log data to the Logger.commit function only if the level meets
the configured maximum.

#### Parameters

• **level**: `Level`

Level of the data to log.

• **data**: `string` \| `Error` \| `AccessEntry` \| `Entry`

Data to be logged. Can be of any type.

#### Returns

`void`

#### Inherited from

[`ServerLogger`](ServerLogger.md).[`log`](ServerLogger.md#log)

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

[`ServerLogger`](ServerLogger.md).[`debug`](ServerLogger.md#debug)

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

[`ServerLogger`](ServerLogger.md).[`info`](ServerLogger.md#info)

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

[`ServerLogger`](ServerLogger.md).[`access`](ServerLogger.md#access)

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

[`ServerLogger`](ServerLogger.md).[`warn`](ServerLogger.md#warn)

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

[`ServerLogger`](ServerLogger.md).[`error`](ServerLogger.md#error)
