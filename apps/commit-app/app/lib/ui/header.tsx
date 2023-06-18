import { Link, useSubmit } from '@remix-run/react';
import {
    Button,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@wesp-up/ui';

import { useOptionalUser } from '~/utils';

export function Header() {
    const user = useOptionalUser();
    const submit = useSubmit();

    return (
        <header className="flex items-center justify-between border-b border-b-gray-200 bg-white p-3">
            <Link
                to={user ? '/home' : '/'}
                // to="/"
                className="flex items-center space-x-2"
            >
                <img src="/assets/logo.svg" alt="" className="h-10 w-10" />
                <h1 className="text-2xl">Commit</h1>
            </Link>

            <div>
                {user ? (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button>
                                {user.imageUrl ? (
                                    <img
                                        src={user.imageUrl}
                                        alt=""
                                        className="h-8 w-8 rounded-full"
                                    />
                                ) : (
                                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm text-white">
                                        {user.displayName
                                            .charAt(0)
                                            .toUpperCase()}
                                    </span>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem asChild>
                                <Link to="/profile">Profile</Link>
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
