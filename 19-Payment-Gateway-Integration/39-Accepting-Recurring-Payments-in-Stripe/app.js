import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_API_SECRET);

const checkoutSession = await stripe.checkout.sessions.create({
  mode: "subscription",
  line_items: [
    {
      price: "price_1TNxKvFHDoQVaRBKbHzRUZAI",
      quantity: 1,
    },
  ],
  success_url: "https://raquibreyaz.netlify.app",
});

console.log(checkoutSession.url);

/*
assignment:
    - create a page showing 3 plans: basic, standard and pro
    - listen and act for webhook events for each required one
*/