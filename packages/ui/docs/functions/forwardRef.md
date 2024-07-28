[**@wesp-up/ui**](../README.md) • **Docs**

---

# Function: forwardRef()

> **forwardRef**\<`Props`, `Component`\>(`component`): `ComponentWithAs`\<`Component`, `Props`\>

Forward a ref to a component that allows customizing the underlying element.

## Type Parameters

• **Props** _extends_ `object`

• **Component** _extends_ `As`\<`any`\>

## Parameters

• **component**: `ForwardRefRenderFunction`\<`any`, [`OmitCommonProps`](../type-aliases/OmitCommonProps.md)\<`PropsOf`\<`Component`\>, keyof `Props`\> & `Props` & `object`\>

The component to forward the ref to.

## Returns

`ComponentWithAs`\<`Component`, `Props`\>
