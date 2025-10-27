import express from "express";
import Stripe from "stripe";

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

router.post("/api/create-checkout-session", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "PDF Converter Pro",
            },
            unit_amount: 499, // €4.99
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: "https://convertx.fly.dev/success",
      cancel_url: "https://convertx.fly.dev/cancel",
    });

    res.json({ id: session.id });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

export default router;

