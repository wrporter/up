[**@wesp-up/ui**](../README.md) • **Docs**

***

# Interface: TooltipProps

## Extends

- `TooltipProps`.[`CoreProps`](CoreProps.md)

## Properties

### providerProps?

> `optional` **providerProps**: `TooltipProviderProps`

***

### children?

> `optional` **children**: `ReactNode`

#### Inherited from

`TooltipPrimitive.TooltipProps.children`

***

### open?

> `optional` **open**: `boolean`

#### Inherited from

`TooltipPrimitive.TooltipProps.open`

***

### defaultOpen?

> `optional` **defaultOpen**: `boolean`

#### Inherited from

`TooltipPrimitive.TooltipProps.defaultOpen`

***

### onOpenChange()?

> `optional` **onOpenChange**: (`open`) => `void`

#### Parameters

• **open**: `boolean`

#### Returns

`void`

#### Inherited from

`TooltipPrimitive.TooltipProps.onOpenChange`

***

### delayDuration?

> `optional` **delayDuration**: `number`

The duration from when the pointer enters the trigger until the tooltip gets opened. This will
override the prop with the same name passed to Provider.

#### Default Value

```ts
700
```

#### Inherited from

`TooltipPrimitive.TooltipProps.delayDuration`

***

### disableHoverableContent?

> `optional` **disableHoverableContent**: `boolean`

When `true`, trying to hover the content will result in the tooltip closing as the pointer leaves the trigger.

#### Default Value

```ts
false
```

#### Inherited from

`TooltipPrimitive.TooltipProps.disableHoverableContent`

***

### data-testid?

> `optional` **data-testid**: `string`

Test identifier, particularly helpful for E2E testing.

#### Inherited from

[`CoreProps`](CoreProps.md).[`data-testid`](CoreProps.md#data-testid)
