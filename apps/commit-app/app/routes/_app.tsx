import { Outlet } from '@remix-run/react';

import { Header } from '~/lib/ui/header';

export default function Layout() {
    return (
        <div className="flex h-full min-h-screen flex-col">
            <Header />
            <Outlet />
        </div>
    );
}
