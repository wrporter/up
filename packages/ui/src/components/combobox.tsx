import { Combobox as ComboboxPrimitive, Transition } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/24/outline';
import { Fragment } from 'react';
import { tv } from 'tailwind-variants';

import { forwardRef } from '~/core';
import { focusKeyboardRing } from '~/styles/common';

const comboboxVariants = tv({
    slots: {
        trigger: [
            focusKeyboardRing,
            'relative w-full cursor-default overflow-hidden rounded',
            'bg-white text-left border border-gray-500',
        ],
        input: [
            // 'focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-indigo-900',
            // 'focus:outline-none focus:ring-0 focus-visible:z-50 focus-visible:ring-blue-900 focus-visible:ring-offset-2 focus-visible:ring-2',
            focusKeyboardRing,
            'w-full border-none py-1 pl-2 pr-10 outline-none',
            'lg:text-lg lg:h-[38px]',
            'sm:text-sm sm:h-[30px]',
        ],
    },
});

// export interface ComboboxProps
//     extends ComboboxPrimitiveProps<typeof ComboboxPrimitive>,
// CoreProps {}

export const Combobox = forwardRef<any, 'div'>(({ children, ...rest }, ref) => {
    return (
        <ComboboxPrimitive ref={ref} {...rest}>
            <div className="relative">{children}</div>
        </ComboboxPrimitive>
    );
});

// export interface ComboboxTriggerProps extends ComboboxInputProps {}

export const ComboboxTrigger = forwardRef<any, 'input'>(({ className, ...rest }, ref) => {
    const { trigger, input } = comboboxVariants();
    return (
        <div className={trigger()}>
            <ComboboxPrimitive.Input ref={ref} className={input({ className })} {...rest} />
            <ComboboxPrimitive.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <ChevronUpDownIcon className="h-5 w-5 text-gray-500" aria-hidden="true" />
            </ComboboxPrimitive.Button>
        </div>
    );
});

// export interface ComboboxOptionsProps extends ComboboxPrimitiveOptionsProps {}

export const ComboboxOptions = forwardRef<any, 'input'>(({ children, ...rest }, ref) => {
    return (
        <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <ComboboxPrimitive.Options
                ref={ref}
                className="z-10 absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
                {...rest}
            >
                {children}
            </ComboboxPrimitive.Options>
        </Transition>
    );
});

// export interface ComboboxOptionProps extends ComboboxPrimitiveOptionProps {}

export const ComboboxOption = forwardRef<any, 'div'>(({ children, ...rest }, ref) => {
    return (
        <ComboboxPrimitive.Option
            ref={ref}
            className={({ active }: { active: boolean }) =>
                `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-blue-100' : undefined
                }`
            }
            {...rest}
        >
            {({ selected }) => (
                <>
                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {children}
                    </span>
                    {selected ? (
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-600">
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                    ) : null}
                </>
            )}
        </ComboboxPrimitive.Option>
    );
});
