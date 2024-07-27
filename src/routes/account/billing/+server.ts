import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { stripe } from '$lib/server/stripe'
import { isPremium } from '$lib/utils/subscriptions'

export const GET: RequestHandler = async ({ locals: { supabase, session, profile } }) => {
    if (!session || !profile) {
        throw redirect(302, "/auth/login")
    }

    let portalSession;

    if (isPremium(profile)) {
        portalSession = await stripe.billingPortal.sessions.create({
            customer: profile?.stripe_customer_id,
            return_url: `https://witsend.ai/account/dashboard`
        })


        if (!portalSession?.url) {
            throw error(500, "Error retrieving billing information.")
        }

        throw redirect(302, portalSession.url)
    } else {
        throw error(500, "Error retrieving subscription information.")
    }
}