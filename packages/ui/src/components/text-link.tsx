import React from 'react';
import { twMerge } from 'tailwind-merge';

import type { CoreProps, HTMLCoreProps } from '../core';
import { forwardRef } from '../core';
import { focusKeyboardRing } from '../styles/common';

export interface TextLinkProps extends HTMLCoreProps<'a'>, CoreProps {}

export const TextLink = forwardRef<TextLinkProps, 'a'>(
    ({ as: Component = 'a', className, ...rest }: TextLinkProps, ref) => {
        return (
            <Component
                ref={ref}
                className={twMerge(
                    className,
                    focusKeyboardRing,
                    'text-blue-600 underline',
                )}
                {...rest}
            />
        );
    },
);
