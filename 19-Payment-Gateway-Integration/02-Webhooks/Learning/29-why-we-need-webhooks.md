## Problem

If your backend marks an order as paid only when the frontend calls `/complete-order`, then the browser becomes the single messenger for a critical business event. [docs.stripe](https://docs.stripe.com/payments/checkout/custom-success-page)
That is unsafe because the customer might close the tab, lose internet, refresh at the wrong moment, or never reach your success page even though the payment actually succeeded. [razorpay](https://razorpay.com/docs/webhooks/?preferred-country=IN)
Stripe explicitly says you cannot rely on fulfillment only from the checkout landing page because customers are not guaranteed to visit it. [docs.stripe](https://docs.stripe.com/payments/checkout/custom-success-page)

## Real scenario

In your food-order example, the user may complete payment successfully, but the connection can break before the frontend notifies your backend. [razorpay](https://razorpay.com/docs/webhooks/?preferred-country=IN)
The result is that money is taken, but your system still shows the order as unpaid, so preparation or delivery never starts. [docs.stripe](https://docs.stripe.com/checkout/fulfillment)
Razorpay also documents this kind of case, noting that slow networks or the customer closing the window can prevent client-side communication even when payment later becomes authorized. [razorpay](https://razorpay.com/docs/payments/subscriptions/plugins/magento/webhook-events/)

## Correct approach

The backend should listen for payment webhooks and update the order status when the payment provider sends the event directly to your server. [docs.stripe](https://docs.stripe.com/webhooks)
For Stripe, fulfillment should be driven by webhook events such as `checkout.session.completed`, and Stripe says webhooks are the most reliable way to confirm that you got paid. [docs.stripe](https://docs.stripe.com/payments/checkout/how-checkout-works)
For Razorpay, webhook events like `order.paid` or `payment.authorized` let your server learn about successful or late-authorized payments even when the client never reports back. [razorpay](https://razorpay.com/docs/payments/subscriptions/plugins/magento/webhook-events/)

## Better note

You can write it like this: relying on the frontend to send the final “order complete” signal is unreliable, because if the client disconnects after payment, the backend may never mark the order as paid even though the payment succeeded. [docs.stripe](https://docs.stripe.com/payments/checkout/custom-success-page)
Therefore, payment success should be confirmed through provider webhooks, with the frontend redirect used only for user experience and not as the source of truth. [docs.stripe](https://docs.stripe.com/checkout/fulfillment)

## Design rule

Use the frontend success page to show status to the user, but let the backend trust only verified webhook events for updating payment and order state. [docs.stripe](https://docs.stripe.com/checkout/fulfillment)
Also make the fulfillment logic idempotent, because Stripe warns that webhook-driven fulfillment functions can be called multiple times for the same Checkout Session. [docs.stripe](https://docs.stripe.com/checkout/fulfillment)
