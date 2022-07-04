# @wesp-up/sample-test

## Interfaces

- [HelloProps](interfaces/HelloProps.md)

## Functions

### hello

▸ **hello**(`entity`): `string`

Returns a string greeting the provided entity.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `entity` | `string` | The entity to greet. |

#### Returns

`string`

___

### Hello

▸ **Hello**(`__namedParameters`): `Element`

A component that greets the provided entity. When no entity is provided, 'World' is used by default.

```typescript jsx
function App() {
    return <Hello entity="Alice" />
}
```

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`HelloProps`](interfaces/HelloProps.md) |

#### Returns

`Element`
