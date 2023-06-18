import type { EventHandler } from 'react';

/**
 * Merge multiple element event handlers to process all of them sequentially.
 * @example
 *
 * ```typescript jsx
 * function MyComponent() {
 *     const handleClick1 = () => { // do x };
 *     const handleClick2 = () => { // do y };
 *
 *     return <button onClick={mergeHandlers(handleClick1, handleClick2)}>Click</button>
 * }
 * ```
 */
export function mergeHandlers(
    ...handlers: Array<EventHandler<any> | (() => void)>
): EventHandler<any> {
    return (event: Event) => {
        handlers.forEach((handler) => handler(event));
    };
}
