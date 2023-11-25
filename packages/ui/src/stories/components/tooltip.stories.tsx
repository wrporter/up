import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '~/components/button';
import { Tooltip as TooltipComponent, TooltipContent, TooltipTrigger } from '~/components/tooltip';

const meta = {
    title: 'Components/Tooltip',
    component: TooltipComponent,
    argTypes: {
        providerProps: { table: { disable: true } },
        color: { options: ['white', 'black'], control: { type: 'select' } },
    },
} satisfies Meta<typeof TooltipComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Tooltip: Story = {
    args: {
        trigger: 'Focus or hover',
        content: 'I am content in a tooltip!',
        color: 'white',
    },
    render: ({ trigger, content, color, ...args }) => (
        <TooltipComponent delayDuration={0} {...args}>
            <TooltipTrigger>
                <Button>{trigger}</Button>
            </TooltipTrigger>
            <TooltipContent color={color}>{content}</TooltipContent>
        </TooltipComponent>
    ),
};
