import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_API_SECRET;

const stripeClient = new Stripe(stripeSecret);

// const result = await stripeClient.balance.retrieve();
// const result = await stripeClient.checkout.sessions.list({ limit: 10 });
// const result = await stripeClient.checkout.sessions.retrieve(
//   "cs_test_a1bptSL5uQujsQqAyx33BTO7XakS8ZwsqTVJptKHuEJtIFs7grsMigsL7N",
// );
const result = await stripeClient.checkout.sessions.list({
  payment_intent: "pi_3TMPRpFHDoQVaRBK1FD2Nmkv",
});
// const result = await stripeClient.charges.list();
console.log(JSON.stringify(result, null, 2));
