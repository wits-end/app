import Stripe from "stripe";
import { PRIVATE_STRIPE_SECRET } from '$env/static/private'

export const stripe = new Stripe(PRIVATE_STRIPE_SECRET, {
    apiVersion: "2024-04-10"
});