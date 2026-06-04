# 🧭 **Main Goal**

To know:

1. When a new subscription starts (first payment success) ✅
2. When recurring (auto) payments succeed 🔁
3. When payments fail ⚠️
4. When the subscription is canceled or ends 🚫
5. When Stripe retries or pauses/resumes 🕒

---

## 🧩 **Core Webhook Events to Listen For**

| Event                                           | When It Fires                                                                                                                           | What You Should Do                                                                                |
| ----------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| **`checkout.session.completed`**                | After the customer completes the Checkout flow (first payment success if `mode: 'subscription'`)                                        | - Grant initial access (course, app, etc.)<br>- Store `customer_id`, `subscription_id`            |
| **`invoice.payment_succeeded`**                 | Whenever a payment for an invoice succeeds (includes first and all renewals)                                                            | - Extend access / renew subscription period<br>- Mark invoice as paid                             |
| **`invoice.payment_failed`**                    | When a payment attempt fails                                                                                                            | - Notify user (email or dashboard alert)<br>- Keep limited access or grace period                 |
| **`customer.subscription.created`**             | When a new subscription object is created                                                                                               | - Record subscription in your DB<br>- Optionally, check `status`                                  |
| **`customer.subscription.updated`**             | When subscription changes (renewal, cancelation, pause, resume, plan change, etc.)                                                      | - React to status changes<br>- Pause or resume access depending on `status` or `pause_collection` |
| **`customer.subscription.deleted`**             | When a subscription is canceled (by customer, portal, or API)                                                                           | - Revoke access or downgrade user                                                                 |
| **`invoice.upcoming`**                          | About to generate a new invoice for renewal                                                                                             | - (Optional) Notify user: "Next payment coming soon"                                              |
| **`invoice.finalized`**                         | Stripe has finalized the invoice before attempting payment                                                                              | - Can log invoice details or update accounting records                                            |
| **`invoice.payment_action_required`**           | When 3D Secure / authentication is needed before a payment can succeed (SCA flows)                                                      | - Notify user to complete authentication                                                          |
| **`payment_intent.succeeded`**                  | Every successful payment intent (for one-off charges or invoices)                                                                       | - Usually redundant with `invoice.payment_succeeded`, but you can log it if needed                |
| **`payment_intent.payment_failed`**             | A payment intent failed (can also correspond to `invoice.payment_failed`)                                                               | - Optional for more granular logging                                                              |
| **`customer.subscription.paused` / `.resumed`** | ⚠️ Stripe doesn’t send separate pause/resume events; they appear as `customer.subscription.updated` with changes in `pause_collection`. | - Detect pause/resume by comparing `pause_collection` (null ↔ object)                             |

---

## 🧠 **Minimal Recommended Set (for production apps)**

If you want to keep it simple but complete, handle these **five events**:

1. `checkout.session.completed` — first signup success
2. `invoice.payment_succeeded` — any successful charge (initial + renewals)
3. `invoice.payment_failed` — failed payment attempts
4. `customer.subscription.updated` — plan change, pause/resume, renewal
5. `customer.subscription.deleted` — cancellation

These five cover **the full lifecycle** of a subscription.

---

## 🧩 **Example Node.js Webhook Switch**

```js
switch (event.type) {
  case 'checkout.session.completed':
    const session = event.data.object;
    if (session.mode === 'subscription') {
      // Save session.customer & session.subscription
      // Grant initial access
    }
    break;

  case 'invoice.payment_succeeded':
    const invoice = event.data.object;
    // Extend access / mark renewal success
    break;

  case 'invoice.payment_failed':
    const failedInvoice = event.data.object;
    // Notify user / suspend access after retries
    break;

  case 'customer.subscription.updated':
    const sub = event.data.object;
    if (sub.pause_collection) {
      // handle pause
    } else if (sub.status === 'active') {
      // handle resume or plan change
    } else if (sub.status === 'past_due' || sub.status === 'unpaid') {
      // handle soft suspension
    }
    break;

  case 'customer.subscription.deleted':
    // Hard cancel — revoke access
    break;
}
```

---

## 🔁 **How Renewals Work Internally**

1. Stripe automatically generates a new **Invoice** before the next billing cycle (`invoice.upcoming`).
2. It tries to charge the card.
3. If it succeeds → `invoice.payment_succeeded` fires.
4. If it fails → `invoice.payment_failed` fires, Stripe retries later.
5. If retries fail → Subscription `status` becomes `past_due` → `unpaid` → eventually canceled (depends on your retry rules).

So for your app’s logic:

* **Extend access** only when you get `invoice.payment_succeeded`.
* **Revoke access** when you get `customer.subscription.deleted` or final failure.