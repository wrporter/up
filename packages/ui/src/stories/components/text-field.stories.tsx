import type { Meta, StoryObj } from '@storybook/react';

import { TextField as TextFieldComponent } from '~/components/text-field';

const meta = {
    title: 'Components/TextField',
    component: TextFieldComponent,
} satisfies Meta<typeof TextFieldComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TextField: Story = {};
