import Stripe from "stripe";

const stripeSecret = process.env.STRIPE_API_SECRET;

const stripeClient = new Stripe(stripeSecret);

// const result = await stripeClient.checkout.sessions.create({
//   success_url: "https://raquibreyaz.netlify.app",
//   line_items: [
//     {
//       price: "price_1TMBN3FHDoQVaRBKVR2eXlXz",
//       quantity: 2,
//     },
//   ],
//   mode: "payment",
// });
const result = await stripeClient.checkout.sessions.create({
  success_url:
    "https://raquibreyaz.netlify.app?session_id={CHECKOUT_SESSION_ID}",
  customer_email: "raquib@raquib.com",
  shipping_address_collection: {
    allowed_countries: ["IN", "BD", "PK", "BG", ""],
  },
  billing_address_collection: "required",
  metadata: {
    userId: 12234,
    courseId: 54321,
    userName: "raquib",
  },
  line_items: [
    {
      price_data: {
        product_data: {
          name: "English Classes",
          description: "Best english classes in the world!",
          images: [
            "https://downloadscdn6.freepik.com/23/2148889/2148888810.jpg?filename=student-class-looking-course.jpg&token=exp=1776329031~hmac=0d940bc2b20f922472cec483cef91036&filename=2148888810.jpg",
          ],
        },
        unit_amount: 200,
        currency: "USD",
      },
      quantity: 1,
    },
  ],
  mode: "payment",
});
console.log(result);
