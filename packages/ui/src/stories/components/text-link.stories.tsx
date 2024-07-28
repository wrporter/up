import type { Meta, StoryObj } from '@storybook/react';

import { TextLink as TextLinkComponent } from '~/components/text-link';

const meta = {
  title: 'Components/TextLink',
  component: TextLinkComponent,
} satisfies Meta<typeof TextLinkComponent>;

export default meta;

type Story = StoryObj<typeof meta>;

export const TextLink: Story = {
  args: {
    children: 'Take me to the moon!',
    href: '/',
  },
};
