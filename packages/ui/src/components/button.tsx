import React from 'react';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import type { CoreProps, HTMLCoreProps } from '../core';
import { forwardRef } from '../core';
import { focusKeyboardRing } from '../styles/common';

const buttonVariants = tv({
    base: ['py-2 px-4 rounded text-white', focusKeyboardRing],
    variants: {
        kind: {
            primary:
                'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800',
            secondary:
                'border border-blue-600 bg-white text-blue-600 hover:bg-blue-100 active:bg-blue-200',
            tertiary:
                'bg-white text-blue-600 hover:bg-blue-100 active:bg-blue-200',
            danger: 'border border-red-600 bg-white text-red-600 hover:bg-red-100 active:bg-red-200',
        },
    },
    defaultVariants: {
        kind: 'primary',
    },
});

export interface ButtonProps
    extends HTMLCoreProps<'button'>,
        CoreProps,
        VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<ButtonProps, 'button'>(
    ({ as: Component = 'button', className, kind, ...rest }, ref) => {
        return (
            <Component
                ref={ref}
                className={buttonVariants({
                    kind,
                    className,
                })}
                {...rest}
            />
        );
    },
);
