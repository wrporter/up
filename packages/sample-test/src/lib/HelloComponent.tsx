import React from 'react';

/**
 * Props for the `Hello` component.
 */
export interface HelloProps {
    /** The entity to greet. Defaults to 'World'. */
    entity?: string;
}

/**
 * A component that greets the provided entity. When no entity is provided, 'World' is used by default.
 *
 * ```typescript jsx
 * function App() {
 *     return <Hello entity="Alice" />
 * }
 * ```
 */
export function Hello({ entity = 'World' }: HelloProps) {
    return <div>Hello, {entity}!</div>;
}
