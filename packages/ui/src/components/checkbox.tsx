import React from 'react';
import { twMerge } from 'tailwind-merge';

import type { CoreProps, HTMLCoreProps } from '~/core';
import { forwardRef } from '~/core';
import { focusKeyboardRing } from '~/styles/common';

export interface CheckboxProps extends HTMLCoreProps<'input'>, CoreProps {}

export const Checkbox = forwardRef<CheckboxProps, 'input'>(
    ({ className, ...rest }: CheckboxProps, ref) => {
        return (
            <input
                ref={ref}
                type="checkbox"
                className={twMerge(
                    'h-4 w-4 cursor-pointer rounded border-gray-500 checked:bg-blue-600',
                    focusKeyboardRing,
                    className,
                )}
                {...rest}
            />
        );
    },
);
