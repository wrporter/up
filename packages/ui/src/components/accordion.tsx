import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { ChevronDownIcon } from '@radix-ui/react-icons';
import { tv } from 'tailwind-variants';

import type { CoreProps } from '~/core';
import { forwardRef } from '~/core';

const accordionVariants = tv({
    slots: {
        root: ['w-[300px] rounded-md shadow-md'],
        item: [
            'mt-px overflow-hidden first:mt-0 first:rounded-t last:rounded-b',
            'focus-within:relative focus-within:ring-2 focus-within:ring-blue-900 focus-within:ring-offset-2',
        ],
        trigger: [
            'cursor-pointer outline-none shadow-slate-200 shadow-[0_1px_0]',
            'flex h-12 flex-1 items-center justify-between',
            'text-slate-800 hover:bg-blue-100 group px-5 leading-none',
        ],
        arrow: ['transition-transform duration-300 group-data-[state=open]:rotate-180'],
        content: [
            'bg-slate-50 overflow-hidden',
            'data-[state=open]:animate-slideDown data-[state=closed]:animate-slideUp',
        ],
    },
});

export type AccordionProps = (
    | AccordionPrimitive.AccordionSingleProps
    | AccordionPrimitive.AccordionMultipleProps
) &
    CoreProps;

export const Accordion = forwardRef<AccordionProps, 'div'>(
    ({ className, ...rest }: AccordionProps, ref) => {
        const { root } = accordionVariants();
        return <AccordionPrimitive.Root ref={ref} className={root({ className })} {...rest} />;
    },
);

export interface AccordionItemProps extends AccordionPrimitive.AccordionItemProps {}

export const AccordionItem = forwardRef<AccordionItemProps, 'div'>(
    ({ className, ...rest }, ref) => {
        const { item } = accordionVariants();
        return <AccordionPrimitive.Item ref={ref} className={item({ className })} {...rest} />;
    },
);

export interface AccordionTriggerProps extends AccordionPrimitive.AccordionTriggerProps {}

export const AccordionTrigger = forwardRef<AccordionTriggerProps, 'button'>(
    ({ className, children, ...rest }, ref) => {
        const { trigger, arrow } = accordionVariants();
        return (
            <AccordionPrimitive.Header className="flex">
                <AccordionPrimitive.Trigger ref={ref} className={trigger({ className })} {...rest}>
                    {children}
                    <ChevronDownIcon className={arrow()} aria-hidden />
                </AccordionPrimitive.Trigger>
            </AccordionPrimitive.Header>
        );
    },
);

export interface AccordionContentProps extends AccordionPrimitive.AccordionContentProps {}

export const AccordionContent = forwardRef<AccordionContentProps, 'div'>(
    ({ className, children, ...rest }, ref) => {
        const { content } = accordionVariants();
        return (
            <AccordionPrimitive.Content ref={ref} className={content({ className })} {...rest}>
                <div className="py-4 px-5">{children}</div>
            </AccordionPrimitive.Content>
        );
    },
);
