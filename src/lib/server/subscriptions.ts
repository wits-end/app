import { stripe } from "$lib/server/stripe"
import { error } from '@sveltejs/kit';

export const getSubscriptionDetails = async (profile) => {
    const isPaid = profile.stripePriceId &&
        profile.stripeCurrentPeriodEnd?.getTime() + 86_400_000 > Date.now() ? true : false;

    let interval: string;

    if (profile.stripePriceId == "price_1PdICXCfyJF5ohGUmfEZhNe9") {
        interval = 'yearly'
    }
    else if (profile.stripePriceId == "price_1PdICJCfyJF5ohGUtbrJHC5R") {
        interval = 'monthly'
    }
    else {
        return error(400, "Invalid price id")
    }

    let isCanceled = false;

    if (isPaid && profile.stripeSubscriptionId) {
        const stripePlan = await stripe.subscriptions.retrieve(
            profile.stripeSubscriptionId
        )
        isCanceled = stripePlan.cancel_at_period_end
    }

    return {
        isPaid,
        interval,
        isCanceled
    }
}


export const createCheckoutSession = async (profile, priceId: string) => {
    const isEligibleForTrial = profile.stripeSubscriptionId ? false : true;

    if (isEligibleForTrial) {
        const checkoutSession = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            mode: "subscription",
            line_items: [
                {
                    price: priceId,
                    quantity: 1
                }
            ],
            success_url: 'https://witsend.ai/account',
            cancel_url: 'https://witsend.ai/premium',
            subscription_data: {
                metadata: {
                    userId: profile.id
                },
                trial_period_days: 3,
                trial_settings: {
                    end_behavior: {
                        missing_payment_method: "cancel"
                    }
                }
            }
        });

        if (!checkoutSession.url) {
            throw new Error("Error creating checkout session");
        }
        return checkoutSession.url;
    }

    const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        line_items: [
            {
                price: priceId,
                quantity: 1
            }
        ],
        success_url: 'https://witsend.ai/account',
        cancel_url: 'https://witsend.ai/premium',
        subscription_data: {
            metadata: {
                userId: profile.id
            }
        }
    });

    if (!checkoutSession.url) {
        throw new Error("Error creating checkout session");
    }
    return checkoutSession.url;
}