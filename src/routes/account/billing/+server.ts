import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { stripe } from '$lib/server/stripe'
import { isPremium } from '$lib/utils/subscriptions'

export const GET: RequestHandler = async ({ locals: { supabase, session } }) => {
    const { data: profile } = await supabase
        .from('profiles')
        .select(`
            stripe_customer_id,
            stripe_price_id, 
            stripe_current_period_end, 
        `)
        .eq('id', session?.user?.id)
        .single()

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