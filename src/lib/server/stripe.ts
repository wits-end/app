import Stripe from "stripe";
import { error } from '@sveltejs/kit';
import { PRIVATE_STRIPE_SECRET, PRIVATE_STRIPE_TEST_SECRET } from '$env/static/private'

export const stripe = new Stripe(PRIVATE_STRIPE_TEST_SECRET, {
    apiVersion: "2024-04-10"
});

export const createCheckoutSession = async (profile, priceId: string) => {
    const isEligibleForTrial = profile.stripe_subscription_id ? false : true;

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
            success_url: 'https://witsend.ai/account/dashboard',
            cancel_url: 'https://witsend.ai/premium',
            subscription_data: {
                trial_period_days: 3,
                trial_settings: {
                    end_behavior: {
                        missing_payment_method: "cancel"
                    }
                }
            },
            metadata: {
                user_id: profile.id
            },
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
        success_url: 'https://witsend.ai/account/dashboard',
        cancel_url: 'https://witsend.ai/premium',
        metadata: {
            user_id: profile.id
        }

    });

    if (!checkoutSession.url) {
        throw new Error("Error creating checkout session");
    }
    return checkoutSession.url;
}