import type { V2_MetaFunction } from '@remix-run/node';

export const meta: V2_MetaFunction = () => [{ title: 'Remix Notes' }];

export default function Index() {
    return <main>Hello, World!</main>;
}
