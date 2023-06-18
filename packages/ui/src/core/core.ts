import type React from 'react';
import { forwardRef as forwardReactRef } from 'react';

// Ideas taken from the Chakra UI core system.
// See https://sourcegraph.com/github.com/chakra-ui/chakra-ui/-/tree/packages/core/system

/**
 * Allow customizing the underlying element within a component.
 */
export type As<Props = any> = React.ElementType<Props>;

/**
 * Extract props from a React element or component.
 */
export type PropsOf<T extends As> = React.ComponentPropsWithoutRef<T> & {
    as?: As;
};

/**
 * Core props for a component using as to override the underlying element.
 */
export type HTMLCoreProps<T extends As> = Omit<PropsOf<T>, 'ref'> & { as?: As };

export interface CoreProps {
    /** Test identifier, particularly helpful for E2E testing. */
    'data-testid'?: string;
}

export type OmitCommonProps<
    Target,
    OmitAdditionalProps extends keyof any = never,
> = Omit<Target, 'as' | 'color' | OmitAdditionalProps>;

export type RightJoinProps<
    SourceProps extends object = {},
    OverrideProps extends object = {},
> = OmitCommonProps<SourceProps, keyof OverrideProps> & OverrideProps;

export type MergeWithAs<
    ComponentProps extends object,
    AsProps extends object,
    AdditionalProps extends object = {},
    AsComponent extends As = As,
> = RightJoinProps<ComponentProps, AdditionalProps> &
    RightJoinProps<AsProps, AdditionalProps> & {
        as?: AsComponent;
    };

export type ComponentWithAs<Component extends As, Props extends object = {}> = {
    <AsComponent extends As = Component>(
        props: MergeWithAs<
            React.ComponentProps<Component>,
            React.ComponentProps<AsComponent>,
            Props,
            AsComponent
        >,
    ): JSX.Element;

    displayName?: string;
    id?: string;
};

export function forwardRef<Props extends object, Component extends As>(
    component: React.ForwardRefRenderFunction<
        any,
        RightJoinProps<PropsOf<Component>, Props> & {
            as?: As;
        }
    >,
) {
    return forwardReactRef(component) as unknown as ComponentWithAs<
        Component,
        Props
    >;
}

/**
 * Similar to TypeScript's utility function NonNullable (see
 * https://www.typescriptlang.org/docs/handbook/utility-types.html#nonnullabletype),
 * but allows undefined.
 */
export type NoNullMember<T> = {
    [P in keyof T]?: NoNullMember<Exclude<T[P], null>>;
};
