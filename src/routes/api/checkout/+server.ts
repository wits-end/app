import { error, redirect } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { createCheckoutSession } from "$lib/server/stripe"

export const GET: RequestHandler = async (event) => {
    const { session, profile } = await event.locals.safeGetSession()

    if (!session || !profile) {
        throw redirect(302, "/auth/register")
    }

    // If they already have a subscription then redirect to billing
    const isPaid = profile.stripePriceId &&
        profile.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now() ? true : false;

    if (isPaid) {
        throw redirect(302, "/account/billing")
    }

    // Create a checkout session
    const priceId = event.url.searchParams.get("id");

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