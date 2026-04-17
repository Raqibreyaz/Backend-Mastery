The easiest way to understand them is: Checkout Session manages the checkout journey, PaymentIntent manages the payment lifecycle, and Charge represents an actual payment attempt. [docs.stripe](https://docs.stripe.com/api/payment_intents)

## Core idea

- A new **Checkout Session** is created for a customer’s checkout attempt, and Stripe recommends creating a new Session each time a customer tries to pay. [gist.github](https://gist.github.com/jsbeaudry/5f6664fe9d2a05f08d9d7a4d47c25d7b)
- A **PaymentIntent** is the object that tracks the lifecycle of collecting a payment for an order or session. [docs.stripe](https://docs.stripe.com/api/payment_intents)
- A **Charge** is the concrete payment attempt created as part of that payment flow. [docs.stripe](https://docs.stripe.com/api/payment_intents)

Example: if a user opens a payment page to buy a course, the Checkout Session is the whole checkout visit, the PaymentIntent is Stripe’s internal payment workflow for that visit, and the Charge is the actual card attempt made during payment. [docs.stripe](https://docs.stripe.com/api/checkout/sessions)

## Checkout Session

- A Checkout Session represents the customer’s checkout state while they are paying through Stripe Checkout or a Payment Link. [gist.github](https://gist.github.com/jsbeaudry/5f6664fe9d2a05f08d9d7a4d47c25d7b)
- As the customer moves through checkout, the Session gets updated with more information, such as its progress and the related successful payment object after completion. [docs.stripe](https://docs.stripe.com/api/checkout/sessions)
- A Checkout Session can have statuses such as `open`, `complete`, and `expired`. [docs.stripe](https://docs.stripe.com/api/checkout/sessions)
- `open` means the checkout flow is still active and not yet finished. [docs.stripe](https://docs.stripe.com/payments/quickstart-checkout-sessions)
- `complete` means the checkout flow has been completed, but to know whether money was actually collected you should check `payment_status`. [docs.stripe](https://docs.stripe.com/payments/quickstart-checkout-sessions)
- `expired` means the Session is no longer usable. [docs.stripe](https://docs.stripe.com/api/checkout/sessions)

Example: think of Checkout Session like a food-order counter ticket; `open` means the customer is still at the counter, `complete` means checkout is finished, and `expired` means that ticket is no longer valid. [docs.stripe](https://docs.stripe.com/payments/quickstart-checkout-sessions)

## Payment status

- The Checkout Session’s `payment_status` is the safer field to inspect when you want to know whether payment actually happened. [docs.stripe](https://docs.stripe.com/payments/quickstart-checkout-sessions)
- Stripe documents values such as `paid`, `unpaid`, and `no_payment_required` for `payment_status`. [docs.stripe](https://docs.stripe.com/api/checkout/sessions)
- `paid` means the payment has actually been completed. [docs.stripe](https://docs.stripe.com/api/checkout/sessions)
- `unpaid` means payment has not been completed yet, which can happen while checkout is still ongoing or after it fails or expires. [docs.stripe](https://docs.stripe.com/payments/quickstart-checkout-sessions)
- `no_payment_required` is used for cases where no immediate charge is needed at checkout. [docs.stripe](https://docs.stripe.com/api/checkout/sessions)

Example: a Session can be `complete` because the checkout flow ended, but the real business question is answered by `payment_status`, not just by Session status. [docs.stripe](https://docs.stripe.com/payments/quickstart-checkout-sessions)

## PaymentIntent

- A PaymentIntent is usually created when the customer proceeds with payment in the checkout flow, and it becomes the main object for tracking what happens to that payment. [docs.stripe](https://docs.stripe.com/payments/checkout/how-checkout-works)
- Stripe’s PaymentIntent statuses include values such as `requires_payment_method`, `requires_action`, `requires_capture`, `canceled`, and `succeeded`. [docs.stripe](https://docs.stripe.com/api/payment_intents)
- `requires_payment_method` means Stripe still needs a valid way to charge the customer. [docs.stripe](https://docs.stripe.com/api/payment_intents)
- `requires_action` means extra customer action is needed, such as authentication. [docs.stripe](https://docs.stripe.com/api/payment_intents)
- `requires_capture` means the payment was authorized and now awaits capture if you are using manual capture. [docs.stripe](https://docs.stripe.com/api/payment_intents)
- `succeeded` means the payment finished successfully. [docs.stripe](https://docs.stripe.com/api/payment_intents)
- If a payment attempt fails, the PaymentIntent can move back to `requires_payment_method` so the customer can try again with another method. [docs.stripe](https://docs.stripe.com/api/payment_intents)

Example: if a user tries one card and it fails, the PaymentIntent can stay alive and wait for another card instead of throwing away the entire payment flow. [docs.stripe](https://docs.stripe.com/api/payment_intents)

## Charge

- A Charge is the actual payment attempt created under the PaymentIntent-driven flow. [docs.stripe](https://docs.stripe.com/api/payment_intents)
- Multiple Charges can be associated with one PaymentIntent when the customer makes multiple attempts, such as retrying with another card or another supported payment method. [docs.stripe](https://docs.stripe.com/api/payment_intents)
- This is why Checkout Session, PaymentIntent, and Charge should not be treated as the same thing. [docs.stripe](https://docs.stripe.com/api/checkout/sessions)

Example: one Checkout Session can lead to one PaymentIntent, and that PaymentIntent can produce multiple Charges if the customer first fails with Card A and then succeeds with Card B. [docs.stripe](https://docs.stripe.com/api/checkout/sessions)

## Mental model

- **Checkout Session** = the customer’s checkout visit. [docs.stripe](https://docs.stripe.com/api/checkout/sessions)
- **PaymentIntent** = the payment state machine for that visit. [docs.stripe](https://docs.stripe.com/api/payment_intents)
- **Charge** = an actual attempt to move money. [docs.stripe](https://docs.stripe.com/api/payment_intents)

A simple way to remember it is: session is the container, intent is the payment process, and charge is the attempt. [docs.stripe](https://docs.stripe.com/api/checkout/sessions)