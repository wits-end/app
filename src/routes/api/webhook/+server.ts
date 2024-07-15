import { json } from "@sveltejs/kit"
import { stripe } from "$lib/server/stripe"
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
            case 'checkout.session.completed':
                const checkoutSession = stripeEvent.data.object as Stripe.Checkout.Session;

                const subscription = await stripe.subscriptions.retrieve(
                    checkoutSession.subscription as string,
                );

                // const { error } = await supabaseAdmin
                // .from("profiles")
                // .update(customer)
                // .eq("id", customer.id);

                // await update user in supabase 
                // where: {
                //     id: session?.metadata?.userId,
                //   },
                // data: {
                //     stripeSubscriptionId: subscription.id,
                //     stripeCustomerId: subscription.customer as string,
                //     stripePriceId: subscription.items.data[0].price.id,
                //     stripeCurrentPeriodEnd: new Date(
                //       subscription.current_period_end * 1000,
                //     ),
                //   },
                break
            case 'invoice.payment_succeeded':
                const invoiceSession = stripeEvent.data.object as Stripe.Invoice;

                if (invoiceSession.billing_reason != "subscription_create") {
                    const invoiceSubscription = await stripe.subscriptions.retrieve(
                        invoiceSession.subscription as string
                    )

                    // Update price id and set new period end
                    // await update user in supabase
                    // where: {
                    //   stripeSubscriptionId: subscription.id,
                    //     },
                    //     data: {
                    //     stripePriceId: subscription.items.data[0].price.id,
                    //     stripeCurrentPeriodEnd: new Date(
                    //         subscription.current_period_end * 1000,
                    //     ),
                    //     },
                    //   
                }

                break
            default:
                console.warn(`Unhandled event type: ${stripeEvent.type}`);
                return json({ received: true }, { status: 200 });
        }
    } catch (e) {
        console.log(e)
        return json(`Error processing event ${stripeEvent.type}`, { status: 500 })
    }

    return json({ recieved: true }, { status: 200 })
};