import { error, redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { createCheckoutSession } from "$lib/server/stripe"
import { isPremium } from "$lib/utils/subscriptions"

export const GET: RequestHandler = async ({ url, locals: { session, supabase } }) => {
    if (!session) {
        throw redirect(302, "/auth/register")
    }

    const { error, data: profile } = await supabase
        .from('profiles')
        .select(`
            id,
            stripe_subscription_id,
            stripe_price_id, 
            stripe_current_period_end
        `)
        .eq('id', session?.user?.id)
        .single()

    // If they already have a subscription then redirect to billing
    if (isPremium(profile)) {
        throw redirect(302, "/account/billing")
    }

    // Create a checkout session
    const priceId = url.searchParams.get("id");

    if (!priceId) {
        throw error(400, "Invalid request")
    }

    let checkoutUrl: string;

    try {
        checkoutUrl = await createCheckoutSession(profile, priceId);
    } catch (e) {
        console.log(e)
        throw error(500, "An error occurred while creating the checkout session")
    }

    throw redirect(302, checkoutUrl)
}