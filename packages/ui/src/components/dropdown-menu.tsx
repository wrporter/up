import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { twMerge } from 'tailwind-merge';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import { Arrow, tooltipVariants } from './tooltip';

import type { CoreProps } from '~/core';
import { forwardRef } from '~/core';

const menuVariants = tv({
    extend: tooltipVariants,
    slots: {
        content: 'p-2 min-w-[220px] rounded-md',
    },
});

export interface DropdownMenuProps
    extends DropdownMenuPrimitive.DropdownMenuProps,
        CoreProps {}

export const DropdownMenu = forwardRef<DropdownMenuProps, 'div'>(
    ({ ...rest }: DropdownMenuProps, ignoredRef) => {
        return <DropdownMenuPrimitive.Root {...rest} />;
    },
);

export interface DropdownMenuTriggerProps
    extends DropdownMenuPrimitive.DropdownMenuTriggerProps {}

export const DropdownMenuTrigger = forwardRef<
    DropdownMenuTriggerProps,
    'button'
>(({ ...rest }, ignoredRef) => {
    return <DropdownMenuPrimitive.Trigger {...rest} />;
});

export interface DropdownMenuContentProps
    extends Omit<DropdownMenuPrimitive.DropdownMenuContentProps, 'color'>,
        Omit<VariantProps<typeof tooltipVariants>, 'class'> {
    portalProps?: DropdownMenuPrimitive.DropdownMenuPortalProps;
}

export const DropdownMenuContent = forwardRef<DropdownMenuContentProps, 'div'>(
    ({ portalProps, color, children, ...rest }, ref) => {
        const { content } = menuVariants({ color });
        return (
            <DropdownMenuPrimitive.Portal {...portalProps}>
                <DropdownMenuPrimitive.Content className={content()} {...rest}>
                    {children}
                    <DropdownMenuPrimitive.Arrow asChild>
                        <Arrow color={color} />
                    </DropdownMenuPrimitive.Arrow>
                </DropdownMenuPrimitive.Content>
            </DropdownMenuPrimitive.Portal>
        );
    },
);

export interface DropdownMenuItemProps
    extends DropdownMenuPrimitive.DropdownMenuItemProps {}

export const DropdownMenuItem = forwardRef<DropdownMenuItemProps, 'div'>(
    ({ className, ...rest }, ref) => {
        return (
            <DropdownMenuPrimitive.Item
                className={twMerge(
                    'group leading-none',
                    'rounded',
                    'flex items-center',
                    'px-2 py-2',
                    'relative select-none outline-none',
                    'cursor-pointer',
                    'data-[disabled]:text-gray-600 data-[disabled]:pointer-events-none',
                    'data-[highlighted]:bg-gray-300',
                    className,
                )}
                {...rest}
            />
        );
    },
);
