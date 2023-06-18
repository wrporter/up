import type { Meta, StoryObj } from '@storybook/react';

import { Button as ButtonComponent } from '~/components/button';

const meta = {
    title: 'Components/Button',
    component: ButtonComponent,
} satisfies Meta<typeof ButtonComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Button: Story = {
    args: {
        children: 'Click me!',
        kind: 'primary',
    },
};
