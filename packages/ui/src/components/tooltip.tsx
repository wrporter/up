import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { tv } from 'tailwind-variants';

import type { CoreProps } from '../core';
import { forwardRef } from '../core';

const variants = tv({
    slots: {
        content: [
            'z-20 max-w-[90vw]',
            'border border-gray-300',
            'drop-shadow',
            'select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none',
            'will-change-[transform,opacity]',
            'data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade',
            'data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade',
            'data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade',
            'data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade',
        ],
        arrow: 'fill-white',
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
    extends TooltipPrimitive.TooltipContentProps {
    portalProps?: TooltipPrimitive.TooltipPortalProps;
}

export const TooltipContent = forwardRef<TooltipContentProps, 'div'>(
    ({ portalProps, children, ...rest }, ref) => {
        const { content, arrow } = variants();
        return (
            <TooltipPrimitive.Portal {...portalProps}>
                <TooltipPrimitive.Content className={content()} {...rest}>
                    {children}
                    <TooltipPrimitive.Arrow className={arrow()} />
                </TooltipPrimitive.Content>
            </TooltipPrimitive.Portal>
        );
    },
);
