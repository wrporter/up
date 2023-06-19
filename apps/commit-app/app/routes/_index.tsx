import { Link } from '@remix-run/react';
import { Button } from '@wesp-up/ui';

import { useOptionalUser } from '~/utils';

export default function Index() {
    const user = useOptionalUser();

    return (
        <main className="relative h-full bg-gradient-to-r from-lime-300 to-cyan-400 sm:flex sm:justify-center">
            <div className="relative sm:pb-16 sm:pt-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="lg:pb-18 relative px-4 pt-16 pb-8 sm:px-6 sm:pt-24 sm:pb-14 lg:px-8 lg:pt-32">
                        <h2 className="text-center text-5xl tracking-tight sm:text-6xl lg:text-7xl">
                            <span className="block drop-shadow-md">
                                Raise resilient children!
                            </span>
                        </h2>
                        <p className="mx-auto mt-6 max-w-lg text-center text-xl sm:max-w-3xl">
                            We provide tools to help children commit to success,
                            by learning to work and manage money. Design your
                            own chore chart and take chores to the next level
                            for your children with a reward system that teaches
                            them personal finances.
                        </p>
                        <div className="mt-10 flex justify-center">
                            {user ? (
                                <Button as={Link} to="/home">
                                    Take me home
                                </Button>
                            ) : (
                                <Button as={Link} to="/signup">
                                    Get started
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
