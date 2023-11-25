/* eslint-disable no-alert */
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '~/components/button';
import {
    DropdownMenu as DropdownMenuComponent,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '~/components/dropdown-menu';

const meta = {
    title: 'Components/DropdownMenu',
    component: DropdownMenuComponent,
    argTypes: {
        providerProps: { table: { disable: true } },
        color: { options: ['white', 'black'], control: { type: 'select' } },
        items: { control: { type: 'object' } },
    },
} satisfies Meta<typeof DropdownMenuComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const DropdownMenu: Story = {
    args: {
        trigger: 'Focus or hover',
        items: ['Item 1', 'Item 2', 'Item 3'],
        color: 'white',
    },
    render: ({ trigger, items, color, ...args }) => (
        <DropdownMenuComponent delayDuration={0} {...args}>
            <DropdownMenuTrigger>
                <Button>{trigger}</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent color={color}>
                {items.map((item: string) => (
                    <DropdownMenuItem key={item} onClick={() => alert(`You clicked [${item}]!`)}>
                        {item}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenuComponent>
    ),
};
