import { XMarkIcon } from '@heroicons/react/24/outline';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { twMerge } from 'tailwind-merge';
import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import type { tooltipVariants } from './tooltip';

import { Button } from '~/components/button';
import type { CoreProps } from '~/core';
import { forwardRef } from '~/core';

const dialogVariants = tv({
    slots: {
        overlay: [
            // 'z-50',
            'fixed inset-0',
            'bg-black bg-opacity-25',
            'data-[state=open]:animate-overlayShow',
        ],
        content: [
            // 'z-50',
            'fixed top-1/2 left-1/2 max-h-[85vh] w-[90vw] max-w-[450px]',
            'min-w-[220px] rounded-md',
            'bg-white shadow',
            'data-[state=open]:animate-contentShow',
            '-translate-x-1/2 -translate-y-1/2 focus:outline-none',
        ],
        title: ['p-4 border-b border-gray-300', 'text-xl font-bold'],
        description: ['p-2'],
        close: [
            // 'z-50',
            'absolute top-[10px] right-[10px] inline-flex',
            'text-gray-500 w-10 h-10 p-2',
        ],
    },
});

export interface DialogProps extends DialogPrimitive.DialogProps, CoreProps {}

export const Dialog = forwardRef<DialogProps, 'div'>(({ ...rest }: DialogProps, ignoredRef) => {
    return <DialogPrimitive.Root {...rest} />;
});

export interface DialogTriggerProps extends DialogPrimitive.DialogTriggerProps {}

export const DialogTrigger = forwardRef<DialogTriggerProps, 'button'>(({ ...rest }, ignoredRef) => {
    return <DialogPrimitive.Trigger {...rest} />;
});

export interface DialogCloseProps extends DialogPrimitive.DialogCloseProps {}

export const DialogClose = forwardRef<DialogCloseProps, 'button'>(({ ...rest }, ignoredRef) => {
    return <DialogPrimitive.Close {...rest} />;
});

export interface DialogContentProps
    extends Omit<DialogPrimitive.DialogContentProps, 'color'>,
        Omit<VariantProps<typeof tooltipVariants>, 'class'> {
    portalProps?: DialogPrimitive.DialogPortalProps;
}

export const DialogContent = forwardRef<DialogContentProps, 'div'>(
    ({ portalProps, children, ...rest }, ref) => {
        const { content, overlay, close } = dialogVariants();
        return (
            <DialogPrimitive.Portal {...portalProps}>
                <DialogPrimitive.Overlay className={overlay()} />
                <DialogPrimitive.Content className={content()} {...rest}>
                    {children}
                    <DialogPrimitive.Close asChild>
                        <Button kind="tertiary" className={close()} aria-label="Close">
                            <XMarkIcon className="w-6 h-6" />
                        </Button>
                    </DialogPrimitive.Close>
                </DialogPrimitive.Content>
            </DialogPrimitive.Portal>
        );
    },
);

export interface DialogTitleProps extends DialogPrimitive.DialogTitleProps {}

export const DialogTitle = forwardRef<DialogTitleProps, 'div'>(({ className, ...rest }, ref) => {
    const { title } = dialogVariants();
    return <DialogPrimitive.Title className={twMerge(title(), className)} {...rest} />;
});

export interface DialogDescriptionProps extends DialogPrimitive.DialogDescriptionProps {}

export const DialogDescription = forwardRef<DialogDescriptionProps, 'div'>(
    ({ className, ...rest }, ref) => {
        const { description } = dialogVariants();
        return (
            <DialogPrimitive.Description className={twMerge(description(), className)} {...rest} />
        );
    },
);
