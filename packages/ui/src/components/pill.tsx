import { ChevronDownIcon } from '@heroicons/react/24/outline';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import { Button } from '~/components/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '~/components/dropdown-menu';
import type { CoreProps, HTMLCoreProps } from '~/core';
import { forwardRef } from '~/core';
import { focusKeyboardRing } from '~/styles/common';

export interface PillGroupProps extends HTMLCoreProps<'div'>, CoreProps {}
export const PillGroup = forwardRef<PillGroupProps, 'div'>(
    ({ as: Component = 'div', className, ...rest }, ref) => {
        return (
            <Component
                ref={ref}
                className={twMerge('flex rounded border border-gray-400', className)}
                {...rest}
            />
        );
    },
);

export interface PillProps extends HTMLCoreProps<'button'>, CoreProps {}
export const Pill = forwardRef<PillProps, 'button'>(
    ({ as: Component = 'button', className, ...rest }, ref) => {
        return (
            <Component
                ref={ref}
                className={twMerge(
                    'flex flex-grow rounded-l p-4 cursor-pointer hover:bg-blue-100 active:bg-blue-200',
                    focusKeyboardRing,
                    className,
                )}
                {...rest}
            />
        );
    },
);

export interface PillMenuProps extends HTMLCoreProps<'button'>, CoreProps {}
export const PillMenu = forwardRef<PillMenuProps, 'button'>(
    ({ as: Component = 'div', className, children, ...rest }, ref) => {
        return (
            <Component ref={ref} className="flex flex-col border-l border-gray-400" {...rest}>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            kind="neutral"
                            className="flex-grow border-none rounded-l-none p-1 w-10 bg-gray-100 hover:bg-gray-200 active:bg-gray-300"
                        >
                            <ChevronDownIcon className="w-6 h-6" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>{children}</DropdownMenuContent>
                </DropdownMenu>
            </Component>
        );
    },
);
