import React from 'react';
import { twMerge } from 'tailwind-merge';

import type { CoreProps, HTMLCoreProps } from '../core';
import { forwardRef } from '../core';
import { focusKeyboardRing } from '../styles/common';

export interface TextFieldProps extends HTMLCoreProps<'input'>, CoreProps {}

export const TextField = forwardRef<TextFieldProps, 'input'>(
    ({ className, ...rest }: TextFieldProps, ref) => {
        return (
            <input
                ref={ref}
                className={twMerge(
                    className,
                    focusKeyboardRing,
                    'border border-gray-500',
                    'rounded',
                    'px-2 py-1',
                    'text-lg',
                )}
                {...rest}
            />
        );
    },
);
