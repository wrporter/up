import '~/styles/tailwind.css';

import type { Preview } from '@storybook/react';

export default {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  argTypes: {
    as: { table: { disable: true } },
    asChild: { table: { disable: true } },
    'data-testid': { table: { disable: true } },
  },
} satisfies Preview;
