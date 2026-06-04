## Payment links

- **Payment Links in Stripe** let you create a hosted payment page without building your own checkout UI.
- **Payment Links in Razorpay** offer a similar no-code payment collection flow, but Stripe’s ecosystem is usually deeper around Checkout, invoices, subscriptions, tax, shipping, and post-payment workflows.
- In practice, **Stripe Payment Links** feel more extensible when you want product catalog behavior, address collection, shipping rules, redirects, and follow-up flows.
- Razorpay Payment Links are often simpler for quick collection, while Stripe feels stronger for global commerce-style checkout.

## Customization

- Stripe lets you explore several customization options on the payment page, such as branding, product details, customer information collection, shipping collection, redirect behavior, and confirmation messaging.
- You can **recommend other products** on the payment page in supported setups, which helps with upselling or cross-selling.
- You can allow **shipping only to selected countries**, which is useful when fulfillment is limited by region.
- You can show a **custom message after payment**, giving users a clearer completion experience.
- You can also **redirect users to a specific URL after payment**, such as an order-confirmation page, onboarding page, or download page.

## Addresses and pricing

- **Billing address** is mainly for payment verification, invoices, tax records, and card-related identity checks.
- **Shipping address** is the destination where physical goods are delivered.
- These two addresses may be the same, but they serve different purposes in the checkout flow.
- **Stripe Invoicing** is a separate product area, and invoice-related charges should be treated separately from basic payment link usage; always confirm the latest pricing before implementation.

## Testing and payment behavior

- A common issue with **normal test cards** is that direct payment flows may succeed without OTP, so they do not simulate strong customer authentication well.
- To test OTP-like verification properly, use **3D Secure test cards**, because they better represent authentication steps before transaction completion.
- In Stripe terminology, a **payment attempt is represented as a charge**, and this can be fetched through the API for inspection or debugging.
- In test mode, the payment amount does not behave like real settled money in your balance; it may remain in an **incoming or pending-like state**, so test balance behavior should not be interpreted as real payout behavior.
- For a given Payment Link, repeated attempts by the same customer can sometimes appear tied to the same **Checkout Session** during its validity window, which is why failures may appear to update the same transaction context rather than creating a brand-new one every time.
- A **successful transaction** is final in that flow and typically will not keep getting updated by later failed retries.
- The practical takeaway is: use normal test cards for basic success/failure checks, but use **3D Secure cards** when you want to verify authentication-sensitive flows.

## Short version

- Stripe Payment Links are more customizable than Razorpay Payment Links for commerce-heavy use cases.
- Stripe supports product recommendations, selective shipping countries, custom success messages, and redirect URLs.
- Billing address is for payment/tax identity; shipping address is for delivery.
- Invoice pricing is separate and should be checked independently.
- Normal test cards are not enough for OTP-style testing; use **3D Secure** cards.
- A payment attempt maps to a **charge** and can be fetched from Stripe’s API.
- Failed attempts may stay tied to the same checkout context for some time, while a successful transaction generally becomes immutable.