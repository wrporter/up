import { Authenticator } from 'remix-auth';
import { FormStrategy } from 'remix-auth-form';
import { GoogleStrategy } from 'remix-auth-google';
import invariant from 'tiny-invariant';

import type { User } from '~/lib/models/user.server';
import {
    createUser,
    getUserByEmail,
    verifyLogin,
} from '~/lib/models/user.server';

import { sessionStorage } from './session.server';

const { SITE_PROTOCOL, SITE_HOST, SITE_PORT } = process.env;

export const AUTH_ERROR_KEY = 'auth-error-key';

export const authenticator = new Authenticator<User>(sessionStorage, {
    sessionErrorKey: AUTH_ERROR_KEY,
    throwOnError: true,
});

authenticator.use(
    new FormStrategy(async ({ form }) => {
        const email = form.get('email') as string;
        const password = form.get('password') as string;

        const user = await verifyLogin(email, password);
        invariant(user, 'Invalid email or password');

        return user;
    }),
    'basic',
);

let port = '';
if (SITE_PORT) {
    port = `:${SITE_PORT}`;
}

authenticator.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
            clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
            callbackURL: `${SITE_PROTOCOL}://${SITE_HOST}${port}/auth/google/callback`,
        },
        async ({ profile }) => {
            let user = await getUserByEmail(profile.emails[0].value);
            if (!user) {
                user = await createUser(
                    profile.displayName,
                    profile.emails[0].value,
                    undefined,
                    profile.photos[0].value,
                    undefined,
                    { google: true },
                );
            }
            invariant(user, 'User does not exist');
            return user;
        },
    ),
    'google',
);

export async function getUser(request: Request) {
    return authenticator.isAuthenticated(request);
}

export async function requireUser(request: Request) {
    const redirectTo = new URL(request.url).pathname;
    const searchParams = new URLSearchParams([['redirectTo', redirectTo]]);
    return authenticator.isAuthenticated(request, {
        failureRedirect: `/login?${searchParams}`,
    });
}
