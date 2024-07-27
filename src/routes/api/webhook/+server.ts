import { json } from "@sveltejs/kit"
import { stripe } from "$lib/server/stripe"
import { supabaseAdmin } from "$lib/server/supabase-admin";
import { PRIVATE_STRIPE_SIGNING_SECRET } from '$env/static/private'

import type { RequestHandler } from "./$types";
import type Stripe from "stripe";

export const POST: RequestHandler = async (event) => {
    const signature = event.request.headers.get("stripe-signature");

    if (!signature) {
        return json("Unauthorized", { status: 401 })
    }

    const body = await event.request.text()

    let stripeEvent;

    try {
        stripeEvent = stripe.webhooks.constructEvent(
            body,
            signature,
            PRIVATE_STRIPE_SIGNING_SECRET
        );
    } catch (e) {
        return json("Invalid Signature", { status: 401 })
    }

    try {
        switch (stripeEvent.type) {
            case 'checkout.session.completed': {
                const session = stripeEvent.data.object as Stripe.Checkout.Session;

                const subscription = await stripe.subscriptions.retrieve(
                    session.subscription as string,
                );

                const { error } = await supabaseAdmin
                    .from("profiles")
                    .update({
                        stripeSubscriptionId: subscription.id,
                        stripeCustomerId: subscription.customer as string,
                        stripePriceId: subscription.items.data[0].price.id,
                        stripeCurrentPeriodEnd: new Date(
                            subscription.current_period_end * 1000
                        )
                    })
                    .eq("id", session?.metadata?.user_id);

                break
            }
            case 'invoice.payment_succeeded': {
                const session = stripeEvent.data.object as Stripe.Invoice;

                // If the billing reason is not subscription_create, it means the customer has updated their subscription.
                // If it is subscription_create, we don't need to update the subscription id and it will handle by the checkout.session.completed event.
                if (session.billing_reason != "subscription_create") {
                    const subscription = await stripe.subscriptions.retrieve(
                        session.subscription as string
                    )

                    const { error } = await supabaseAdmin
                        .from("profiles")
                        .update({
                            stripePriceId: subscription.items.data[0].price.id,
                            stripeCurrentPeriodEnd: new Date(
                                subscription.current_period_end * 1000
                            )
                        })
                        .eq("stripe_subscription_id", subscription.id)
                }

                break
            }
            default: {
                console.warn(`Unhandled event type: ${stripeEvent.type}`);
                return json({ received: true }, { status: 200 });
            }
        }
    } catch (e) {
        console.log(e)
        return json(`Error processing event ${stripeEvent.type}`, { status: 500 })
    }

    return json({ recieved: true }, { status: 200 })
};