import React from 'react';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import type { CoreProps, HTMLCoreProps } from '~/core';
import { forwardRef } from '~/core';
import { focusKeyboardRing } from '~/styles/common';

const buttonVariants = tv({
  base: ['rounded text-white flex justify-center items-center cursor-pointer'],
  variants: {
    kind: {
      neutral: [
        'bg-white text-gray-600',
        'border border-gray-600',
        'hover:bg-gray-100 active:bg-gray-200',
        'hover:border-gray-100 active:border-gray-200',
      ],
      primary: [
        'text-white bg-blue-600',
        'border border-blue-600',
        'hover:bg-blue-700 active:bg-blue-800',
        'hover:border-blue-700 active:border-blue-800',
      ],
      secondary: [
        'bg-white text-blue-600',
        'border border-blue-600',
        'hover:bg-blue-100 active:bg-blue-200',
        'hover:border-blue-100 active:border-blue-200',
      ],
      tertiary: [
        'bg-white text-blue-600',
        'border border-white',
        'hover:bg-blue-100 active:bg-blue-200',
        'hover:border-blue-100 active:border-blue-200',
      ],
      danger: [
        'bg-white text-red-600',
        'border border-red-600',
        'hover:bg-red-100 active:bg-red-200',
        'hover:border-red-100 active:border-red-200',
      ],
    },
    small: {
      true: 'p-2 h-8 text-sm',
      false: 'py-2 px-4 h-10',
    },
  },
  defaultVariants: {
    kind: 'primary',
    small: false,
  },
});

export interface ButtonProps
  extends HTMLCoreProps<'button'>,
    CoreProps,
    Omit<VariantProps<typeof buttonVariants>, 'class'> {}

export const Button = forwardRef<ButtonProps, 'button'>(
  ({ as: Component = 'button', className, kind, small, ...rest }, ref) => {
    return (
      <Component
        ref={ref}
        className={buttonVariants({
          kind,
          small,
          className: [focusKeyboardRing, className],
        })}
        {...rest}
      />
    );
  },
);
