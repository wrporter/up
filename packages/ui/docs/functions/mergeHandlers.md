[**@wesp-up/ui**](../README.md) • **Docs**

---

# Function: mergeHandlers()

> **mergeHandlers**(...`handlers`): `EventHandler`\<`any`\>

Merge multiple element event handlers to process all of them sequentially.

## Parameters

• ...**handlers**: (`EventHandler`\<`any`\> \| () => `void`)[]

## Returns

`EventHandler`\<`any`\>

## Example

```typescript jsx
function MyComponent() {
    const handleClick1 = () => { // do x };
    const handleClick2 = () => { // do y };

    return <button onClick={mergeHandlers(handleClick1, handleClick2)}>Click</button>
}
```
