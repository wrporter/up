import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import type { CoreProps } from '~/core';
import { forwardRef } from '~/core';

export const tooltipVariants = tv({
    slots: {
        content: [
            'max-w-[90vw]',
            'drop-shadow',
            'select-none rounded-[4px] px-4 py-2.5 leading-none',
            'will-change-[transform,opacity]',
            'data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade',
            'data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade',
            'data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade',
            'data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade',
        ],
    },
    variants: {
        color: {
            white: {
                content: ['bg-white', 'border border-gray-300'],
            },
            black: {
                content: ['bg-black', 'text-white'],
            },
        },
    },
    defaultVariants: {
        color: 'white',
    },
});

export const arrowVariants = tv({
    slots: {
        arrow: '',
        arrowBorder: '',
    },
    variants: {
        color: {
            white: {
                arrow: 'fill-white',
                arrowBorder: 'stroke-2 stroke-gray-300',
            },
            black: {
                arrow: 'fill-black',
                arrowBorder: '',
            },
        },
    },
    defaultVariants: {
        color: 'white',
    },
});

export interface TooltipProps extends TooltipPrimitive.TooltipProps, CoreProps {
    providerProps?: TooltipPrimitive.TooltipProviderProps;
}

export const Tooltip = forwardRef<TooltipProps, 'div'>(
    ({ providerProps, ...rest }: TooltipProps, ignoredRef) => {
        return (
            <TooltipPrimitive.Provider {...providerProps}>
                <TooltipPrimitive.Root {...rest} />
            </TooltipPrimitive.Provider>
        );
    },
);

export interface TooltipTriggerProps
    extends TooltipPrimitive.TooltipTriggerProps {}

export const TooltipTrigger = forwardRef<TooltipTriggerProps, 'button'>(
    ({ ...rest }, ignoredRef) => {
        return <TooltipPrimitive.Trigger {...rest} />;
    },
);

export interface TooltipContentProps
    extends Omit<TooltipPrimitive.TooltipContentProps, 'color'>,
        Omit<VariantProps<typeof tooltipVariants>, 'class'> {
    portalProps?: TooltipPrimitive.TooltipPortalProps;
}

export const TooltipContent = forwardRef<TooltipContentProps, 'div'>(
    ({ portalProps, color, children, ...rest }, ref) => {
        const { content } = tooltipVariants({ color });
        return (
            <TooltipPrimitive.Portal {...portalProps}>
                <TooltipPrimitive.Content className={content()} {...rest}>
                    {children}
                    <TooltipPrimitive.Arrow asChild>
                        <Arrow color={color} />
                    </TooltipPrimitive.Arrow>
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
        );
    },
);

export interface ArrowProps
    extends Omit<VariantProps<typeof arrowVariants>, 'class'> {}
export function Arrow({ color }: ArrowProps) {
    const { arrow, arrowBorder } = arrowVariants({ color });
    return (
        <svg
            className={arrow()}
            width="10"
            height="5"
            viewBox="0 0 30 10"
            preserveAspectRatio="none"
        >
            <polygon points="0,0 30,0 15,10" />
            <line className={arrowBorder()} x1={0} y1={0} x2={15} y2={10} />
            <line className={arrowBorder()} x1={15} y1={10} x2={30} y2={0} />
        </svg>
    );
}
