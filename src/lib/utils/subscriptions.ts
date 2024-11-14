import { error } from '@sveltejs/kit';

export const isPremium = (profile) => {
    if (!profile) {
        return false
    } else {
        return true
        // return profile?.stripe_price_id &&
        //     Date.parse(profile?.stripe_current_period_end) > Date.now() ? true : false;
    }
}

export const isCanceled = async (profile) => {
    if (!profile) {
        return false
    }
    else if (isPremium(profile) && profile?.stripe_subscription_id) {
        const stripePlan = await stripe.subscriptions.retrieve(
            profile?.stripe_subscription_id
        )
        return stripePlan.cancel_at_period_end
    }

    return false
}