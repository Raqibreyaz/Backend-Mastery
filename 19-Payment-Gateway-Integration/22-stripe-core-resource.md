In Stripe, **core resources** are the main building blocks (objects) you interact with when using their APIs. Think of them as the fundamental entities that represent your business operations, payments, and customers inside Stripe.

Here are the **key core resources**:

1. **Customer**

   * Represents your end user.
   * Stores details like name, email, payment methods, and billing preferences.
   * Useful for recurring payments, subscriptions, and keeping a consistent billing history.

2. **PaymentIntent & SetupIntent**

   * **PaymentIntent** → Tracks the lifecycle of a payment from creation to confirmation (success, failure, cancellation).
   * **SetupIntent** → Used when you want to save a payment method for future use without charging right away.

3. **Charge**

   * Represents a single, finalized payment.
   * Mostly a legacy resource (PaymentIntents are now preferred), but still important for understanding historical data.

4. **Invoice**

   * A bill sent to a customer.
   * Used in subscriptions and one-off billing flows.
   * Can include line items, tax, discounts, and payment status.

5. **Subscription**

   * Represents a recurring payment relationship between you and a customer.
   * Automatically generates invoices and manages billing cycles.

6. **Product & Price**

   * **Product** → What you’re selling (e.g., "ProCodrr Node.js Course").
   * **Price** → Defines how much it costs and the billing model (one-time, recurring, per seat, etc.).

7. **PaymentMethod**

   * Represents the way a customer pays (card, UPI, wallets, bank debit, etc.).
   * Can be attached to customers, subscriptions, or one-time payments.

8. **Balance & Payout**

   * **Balance** → Money held in your Stripe account (funds collected but not yet paid out).
   * **Payout** → Transfer of money from Stripe to your bank account.

---

✅ **In short:**
Stripe’s **core resources** = Customers, PaymentIntents, Charges, Invoices, Subscriptions, Products, Prices, PaymentMethods, Balances, and Payouts.

These are the foundation for everything else you do in Stripe (like disputes, refunds, or reporting, which build on top of these resources).