import { error } from '@sveltejs/kit';

export const getSubscriptionDetails = async (profile) => {
    const isPaid = profile?.stripePriceId &&
        profile?.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now() ? true : false;

    let interval: string;

    if (profile?.stripePriceId == "price_1PdICXCfyJF5ohGUmfEZhNe9") {
        interval = 'yearly'
    }
    else if (profile?.stripePriceId == "price_1PdICJCfyJF5ohGUtbrJHC5R") {
        interval = 'monthly'
    }
    else {
        return error(400, "Invalid price id")
    }

    let isCanceled = false;

    if (isPaid && profile?.stripeSubscriptionId) {
        const stripePlan = await stripe.subscriptions.retrieve(
            profile?.stripeSubscriptionId
        )
        isCanceled = stripePlan.cancel_at_period_end
    }

    return {
        isPaid,
        interval,
        isCanceled
    }
}

export const isPremium = async (profile) => {
    return profile?.stripePriceId &&
        profile?.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now() ? true : false;
}