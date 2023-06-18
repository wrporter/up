import '~/styles/tailwind.css';

import type { Preview } from '@storybook/react';

// eslint-disable-next-line import/no-default-export
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
