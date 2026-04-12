import Razorpay from "razorpay";

const rzp = new Razorpay({
  key_id: process.env.RZP_KEY_ID,
  key_secret: process.env.RZP_KEY_SECRET,
});

const payments = await rzp.payments.all();
console.log(payments);

const payment = await rzp.payments.fetch("pay_ScY0FFVcuKvQv1");
console.log(payment);

const refunds = await rzp.refunds.all();
console.log(refunds);

const order = await rzp.orders.fetch("order_ScYxpTC4ChgguJ");
console.log(order);
