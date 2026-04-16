A Checkout Session is the server-created object that defines what the customer sees on Stripe’s checkout page for a one-time purchase or subscription, and Stripe recommends creating a new Session for each payment attempt. [docs.stripe](https://docs.stripe.com/api/checkout/sessions)

## Big picture

A Payment Link is the easier, reusable, no-code path, while a Checkout Session is the programmable checkout flow you create from your backend. [docs.stripe](https://docs.stripe.com/checkout/quickstart)
That is why Payment Links work well for fixed products, but they become awkward for random-amount or user-defined payments, where a custom Checkout Session is usually the better fit. [stackoverflow](https://stackoverflow.com/questions/66265960/how-can-i-use-stripe-checkout-with-dynamic-prices)
A good mental model is: Payment Link is the reusable entry point, and Checkout Session is the per-customer checkout container that controls line items, amount, currency, and payment methods. [docs.stripe](https://docs.stripe.com/api/checkout/sessions)

## Creating a session

You create a custom Checkout Session on the server and then redirect the user to Stripe’s hosted checkout URL. [rubydoc](https://www.rubydoc.info/gems/stripe/Stripe/Checkout/Session)
The Session controls what appears on the payment page, including line items, order amount, currency, and accepted payment methods. [docs.stripe](https://docs.stripe.com/checkout/quickstart)
In `line_items`, you can either reference predefined prices or use `price_data` with custom `product_data`, such as a dynamic product name, currency, unit amount, and quantity. [stackoverflow](https://stackoverflow.com/questions/76489495/add-metadata-to-stripe-checkout-button)
Because Checkout is Stripe-hosted, any custom product assets you expect Stripe to render, such as an image, need to be publicly reachable, so a `localhost` image URL is not suitable for that hosted flow. [stripe](https://stripe.com/payments/checkout)

## Customization and modes

The `mode` tells Stripe what kind of checkout you are creating, and the docs frame Checkout Sessions around one-time purchases and subscriptions. [hexdocs](https://hexdocs.pm/stripity_stripe/Stripe.Checkout.Session.html)
Stripe also lets you customize the checkout form during Session creation through parameters such as `custom_fields`, and its API reference says you can collect up to three additional fields this way. [docs.stripe](https://docs.stripe.com/api/checkout/sessions/create)
If you come from Razorpay, the closest mental mapping for carrying your own app-specific context is Stripe `metadata`, because Stripe describes metadata as structured key-value information attached to objects for your integration’s use. [stackoverflow](https://stackoverflow.com/questions/55742393/is-it-possible-to-pass-custom-data-to-stripe-checkout)

## Amount and session behavior

Checkout Sessions can support dynamic amount changes, and Stripe documents flows where totals are recalculated when customers change quantity, shipping, discounts, or custom selections. [docs.stripe](https://docs.stripe.com/payments/advanced/dynamically-update-amounts)
In that model, your server recalculates the totals and updates the session instead of trusting the browser to decide the amount. [docs.stripe](https://docs.stripe.com/payments/advanced/dynamically-update-amounts)
On the result side, Stripe says a Session can be `complete` after success, while `open` means the payment failed or was canceled and the customer can try again. [docs.stripe](https://docs.stripe.com/payments/quickstart-checkout-sessions)
So if a payment fails and the Session is still open and not expired, the checkout can still be retried, but Stripe’s broader recommendation is still to create a new Session for each payment attempt. [hexdocs](https://hexdocs.pm/stripity_stripe/Stripe.Checkout.Session.html)

## Redirects and Razorpay comparison

After Checkout, Stripe recommends handling the user’s return page by retrieving the Checkout Session and checking its status, while using webhook events as the reliable signal for fulfillment. [docs.stripe](https://docs.stripe.com/payments/checkout/how-checkout-works)
That is why the successful redirect is useful for showing status to the user, but your backend should still trust webhook-driven completion rather than the redirect alone. [docs.stripe](https://docs.stripe.com/payments/checkout/how-checkout-works)
If you want a Razorpay comparison, the closest equivalent is not one single Razorpay object but roughly **Razorpay Order + Checkout together**, because Razorpay centers the flow around an order, while Stripe packages much of the per-customer checkout state into the Checkout Session. [razorpay](https://razorpay.com/docs/payments/orders/)