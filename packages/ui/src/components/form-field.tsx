import type { VariantProps } from 'tailwind-variants';
import { tv } from 'tailwind-variants';

import type { CoreProps, HTMLCoreProps } from '~/core';
import { forwardRef } from '~/core';

const formVariants = tv({
  slots: {
    label: ['flex flex-col-reverse gap-1'],
    labelName: ['text-gray-600 peer-focus:text-blue-600 peer-focus-visible:text-blue-600'],
  },
});

export interface FormLabelProps
  extends HTMLCoreProps<'label'>,
    CoreProps,
    Omit<VariantProps<typeof formVariants>, 'class'> {
  name: string;
}

export const FormLabel = forwardRef<FormLabelProps, 'label'>(
  ({ name, className, children, ...rest }, ref) => {
    const { label, labelName } = formVariants();
    return (
      <label className={label({ className })} {...rest}>
        {children}

        <span className={labelName()}>{name}</span>
      </label>
    );
  },
);
