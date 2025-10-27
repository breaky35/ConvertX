import { Router } from "elysia";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15"
});

export const stripeRouter = new Router()
  .post("/api/create-checkout-session", async ({ body, set }) => {
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: {
                name: "Service Name",
              },
              unit_amount: 499,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${process.env.APP_URL}/success`,
        cancel_url: `${process.env.APP_URL}/cancel`,
      });

      set.status = 200;
      return { id: session.id };
    } catch (err) {
      set.status = 500;
      return { error: (err as Error).message };
    }
  });
