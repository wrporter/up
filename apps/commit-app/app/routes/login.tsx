import type {
    ActionFunction,
    LoaderFunction,
    V2_MetaFunction,
} from '@remix-run/node';
import { json } from '@remix-run/node';
import { Form, Link, useActionData, useSearchParams } from '@remix-run/react';
import { Button, Checkbox, TextField, TextLink } from '@wesp-up/ui';
import * as React from 'react';

import { authenticator } from '~/auth.server';
import { validateEmail } from '~/utils';

export const loader: LoaderFunction = async ({ request }) => {
    return authenticator.isAuthenticated(request, {
        successRedirect: '/home',
    });
};

interface ActionData {
    errors?: {
        email?: string;
        password?: string;
    };
}

export const action: ActionFunction = async ({ request }) => {
    const requestClone = request.clone();
    const formData = await requestClone.formData();
    const redirectTo = formData.get('redirectTo');

    const email = formData.get('email');
    const password = formData.get('password');

    if (!validateEmail(email)) {
        return json<ActionData>(
            { errors: { email: 'Email is invalid' } },
            { status: 400 },
        );
    }

    if (typeof password !== 'string' || !password) {
        return json<ActionData>(
            { errors: { password: 'Password is required' } },
            { status: 400 },
        );
    }

    return authenticator.authenticate('basic', request, {
        successRedirect: typeof redirectTo === 'string' ? redirectTo : '/home',
        failureRedirect: '/login',
        throwOnError: true,
    });
    // TODO: Handle showing form validation errors with yup
};

export const meta: V2_MetaFunction = () => [{ title: 'Commit: Login' }];

export default function LoginPage() {
    const [searchParams] = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/home';
    const actionData = useActionData() as ActionData;
    const emailRef = React.useRef<HTMLInputElement>(null);
    const passwordRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
        if (actionData?.errors?.email) {
            emailRef.current?.focus();
        } else if (actionData?.errors?.password) {
            passwordRef.current?.focus();
        }
    }, [actionData]);

    return (
        <div className="flex h-full flex-col bg-gradient-to-r from-lime-300 to-cyan-400 py-6 sm:py-8 lg:py-10">
            <h2 className="mb-6 text-center text-4xl">Log in</h2>

            <Form
                action="/auth/google"
                method="post"
                className="mx-auto mb-8 w-full max-w-md"
            >
                <input type="hidden" name="redirectTo" value={redirectTo} />
                <input type="hidden" name="action" value="login" />

                <Button
                    type="submit"
                    kind="tertiary"
                    className="flex w-full items-center justify-center space-x-4"
                >
                    <img
                        src="/assets/google-logo.svg"
                        alt=""
                        className="h-6 w-6"
                    />
                    <span>Log in with Google</span>
                </Button>
            </Form>

            <div className="mx-auto w-full max-w-md rounded bg-white px-8 py-8 drop-shadow">
                <Form method="post" className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Email Address
                            <TextField
                                ref={emailRef}
                                required
                                // eslint-disable-next-line jsx-a11y/no-autofocus
                                autoFocus
                                name="email"
                                type="email"
                                autoComplete="email"
                                aria-invalid={
                                    actionData?.errors?.email ? true : undefined
                                }
                                aria-describedby="email-error"
                                className="w-full mt-1"
                            />
                        </label>
                        {actionData?.errors?.email && (
                            <div className="pt-1 text-red-700" id="email-error">
                                {actionData.errors.email}
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Password
                            <TextField
                                ref={passwordRef}
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                aria-invalid={
                                    actionData?.errors?.password
                                        ? true
                                        : undefined
                                }
                                className="w-full mt-1"
                                aria-describedby="password-error"
                            />
                        </label>
                        {actionData?.errors?.password && (
                            <div
                                className="pt-1 text-red-700"
                                id="password-error"
                            >
                                {actionData.errors.password}
                            </div>
                        )}
                    </div>

                    <input type="hidden" name="redirectTo" value={redirectTo} />
                    <Button type="submit" className="w-full">
                        Log in
                    </Button>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Checkbox id="remember" name="remember" />
                            <label
                                htmlFor="remember"
                                className="ml-2 block text-sm text-gray-900"
                            >
                                Remember me
                            </label>
                        </div>
                        <div className="text-center text-sm text-gray-500">
                            Don&apos;t have an account?{' '}
                            <TextLink
                                as={Link}
                                to={{
                                    pathname: '/signup',
                                    search: searchParams.toString(),
                                }}
                            >
                                Sign up
                            </TextLink>
                        </div>
                    </div>
                </Form>
            </div>
        </div>
    );
}
