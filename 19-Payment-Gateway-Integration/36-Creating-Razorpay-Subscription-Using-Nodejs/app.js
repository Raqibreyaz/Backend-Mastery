import Razorpay from "razorpay";

const rzp = new Razorpay({
  key_id: process.env.RZP_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET,
});

const sub = await rzp.subscriptions.create({
  plan_id: "plan_SfFUj0bAYCGKYl",
  customer_notify: true,
  quantity: 1,
  total_count: 120,
});

console.log(sub);
