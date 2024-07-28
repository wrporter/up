import React from 'react';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import type { CoreProps, HTMLCoreProps } from '~/core';
import { forwardRef } from '~/core';
import { focusKeyboardRing } from '~/styles/common';

const textFieldVariants = tv({
  base: [
    'px-2 py-1 border border-gray-500',
    'rounded',
    'focus-visible:border-transparent',
    'group-focus-visible/label-name:text-blue-600',
  ],
  variants: {
    small: {
      true: 'h-8 text-sm',
      false: 'h-10 text-lg',
    },
  },
  defaultVariants: {
    small: false,
  },
});

export interface TextFieldProps
  extends HTMLCoreProps<'input'>,
    CoreProps,
    Omit<VariantProps<typeof textFieldVariants>, 'class'> {}

export const TextField = forwardRef<TextFieldProps, 'input'>(
  ({ small, className, ...rest }: TextFieldProps, ref) => {
    return (
      <input
        ref={ref}
        className={textFieldVariants({
          small,
          className: [focusKeyboardRing, className],
        })}
        {...rest}
      />
    );
  },
);
