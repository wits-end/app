import { createServerClient } from '@supabase/ssr'
import { type Handle, redirect } from '@sveltejs/kit'
import { sequence } from '@sveltejs/kit/hooks'
import { isPremium } from '$lib/utils/subscriptions'

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY } from '$env/static/public'

const supabase: Handle = async ({ event, resolve }) => {
    /**
     * Creates a Supabase client specific to this server request.
     *
     * The Supabase client gets the Auth token from the request cookies.
     */
    event.locals.supabase = createServerClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_KEY, {
        cookies: {
            get: (key) => event.cookies.get(key),
            /**
             * SvelteKit's cookies API requires `path` to be explicitly set in
             * the cookie options. Setting `path` to `/` replicates previous/
             * standard behavior.
             */
            set: (key, value, options) => {
                event.cookies.set(key, value, { ...options, path: '/' })
            },
            remove: (key, options) => {
                event.cookies.delete(key, { ...options, path: '/' })
            },
        },
    })

    /**
     * Unlike `supabase.auth.getSession()`, which returns the session _without_
     * validating the JWT, this function also calls `getUser()` to validate the
     * JWT before returning the session.
     */
    event.locals.safeGetSession = async () => {
        const {
            data: { session },
        } = await event.locals.supabase.auth.getSession()
        if (!session) {
            return { session: null, user: null }
        }

        const {
            data: { user },
            error,
        } = await event.locals.supabase.auth.getUser()
        if (error) {
            // JWT validation has failed
            return { session: null, user: null }
        }

        // const { data: profile } = await event.locals.supabase
        //     .from('profiles')
        //     .select('*, articles (*)')
        //     .eq('id', user?.id)
        //     .single()

        return { session, user }
    }

    return resolve(event, {
        filterSerializedResponseHeaders(name) {
            /**
             * Supabase libraries use the `content-range` and `x-supabase-api-version`
             * headers, so we need to tell SvelteKit to pass it through.
             */
            return name === 'content-range' || name === 'x-supabase-api-version'
        },
    })
}

const authGuard: Handle = async ({ event, resolve }) => {
    const { session, user } = await event.locals.safeGetSession()
    event.locals.session = session
    event.locals.user = user

    const premiumRoutes = ["/account/lists", "/account/notes", "/account/billing"]

    // Redirect /account links to register
    if (!event.locals.session && event.url.pathname.startsWith('/account')) {
        return redirect(303, '/auth/register')
    }

    // Redirect /premium links to register
    if (!event.locals.session && event.url.pathname.startsWith('/premium')) {
        return redirect(303, '/auth/register')
    }
    // Redirect premium routes
    if (premiumRoutes.includes(event.url.pathname)) {
        const { data: profile } = await event.locals.supabase
            .from('profiles')
            .select('stripe_price_id, stripe_current_period_end')
            .eq('id', user?.id)
            .single()

        if (!isPremium(profile)) {
            return redirect(303, '/account/dashboard')
        }
    }

    if (event.locals.session && event.url.pathname === '/auth') {
        return redirect(303, '/account/dashboard')
    }

    return resolve(event)
}

export const handle: Handle = sequence(supabase, authGuard)