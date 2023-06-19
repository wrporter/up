import * as Avatar from '@radix-ui/react-avatar';
import { Link, useSubmit } from '@remix-run/react';
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    focusKeyboardRing,
} from '@wesp-up/ui';
import { twMerge } from 'tailwind-merge';

import { useOptionalUser } from '~/utils';

export function Header() {
    const user = useOptionalUser();
    const submit = useSubmit();

    return (
        <header className="flex items-center justify-between border-b border-b-gray-200 bg-white px-3 py-1">
            <Link
                to={user ? '/home' : '/'}
                className={twMerge(
                    'flex items-center space-x-2',
                    'p-1',
                    'rounded',
                    focusKeyboardRing,
                )}
            >
                <img src="/assets/logo.svg" alt="" className="h-10 w-10" />
                <h1 className="text-2xl">Commit</h1>
            </Link>

            <div>
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button kind="tertiary" className="p-1">
                                <Avatar.Root className="bg-blackA3 inline-flex h-10 w-10 select-none items-center justify-center overflow-hidden rounded-full align-middle">
                                    <Avatar.Image
                                        className="h-full w-full rounded-[inherit] object-cover"
                                        src={user.imageUrl}
                                        alt={user.displayName}
                                    />
                                    <Avatar.Fallback
                                        className="text-violet11 leading-1 flex h-full w-full items-center justify-center bg-white text-[15px] font-medium"
                                        delayMs={600}
                                    >
                                        {user.displayName
                                            .charAt(0)
                                            .toUpperCase()}
                                    </Avatar.Fallback>
                                </Avatar.Root>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <Link to="/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link to="/chore-chart/view">
                                    Chore Chart Kiosk
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onSelect={() =>
                                    submit(null, {
                                        method: 'post',
                                        action: '/logout',
                                    })
                                }
                            >
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                ) : (
                    <div className="flex space-x-2">
                        <Button as={Link} to="/login">
                            Log in
                        </Button>
                        <Button kind="secondary" as={Link} to="/signup">
                            Sign up
                        </Button>
                    </div>
                )}
            </div>
        </header>
    );
}
