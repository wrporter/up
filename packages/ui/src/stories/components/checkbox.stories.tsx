import type { Meta, StoryObj } from '@storybook/react';

import { Checkbox as CheckboxComponent } from '~/components/checkbox';

const meta = {
    title: 'Components/Checkbox',
    component: CheckboxComponent,
} satisfies Meta<typeof CheckboxComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Checkbox: Story = {};
