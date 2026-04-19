## Subscription states

A Razorpay subscription moves through a few common states such as **created**, **authenticated**, **active**, **pending**, **halted**, **cancelled**, and sometimes **completed/expired** depending on how the plan ends.  
A simple way to read them is: created = subscription record exists, authenticated = card or mandate setup succeeded, active = recurring billing is live, pending = waiting for the next charge outcome, halted = billing stopped due to failure, cancelled = stopped manually.

- Example: A user subscribes to a ₹499/month course plan. If signup is done but mandate is not fully confirmed yet, it may still be in created or authenticated state; once the first successful setup/payment happens, it becomes active.

## Immediate vs normal

In an **immediate** subscription, billing starts right away and the first payment is collected at signup itself.  
In a more **normal delayed-start** flow, the subscription may be set up first and the actual recurring charge starts from the first billing date, trial end, or scheduled cycle.

- Example: Netflix-style trial: user signs up today, but first charge happens after 7 days, so the subscription exists before the first real billing cycle starts.
- Example: Gym membership: user pays today and access starts today, so the first payment and subscription start happen immediately.

**Note**: for normal case, the state goes to 'authenticated' by paying 5 rupees for verification(which gets refunded automatically) but for immediate the state directly goes to 'active'

## Offers

An offer is usually applied on top of the subscription or plan when the subscription satisfies the offer’s rules, such as amount, plan, customer eligibility, or payment method.  
The discount may affect the first payment, a limited number of billing cycles, or the full plan duration, depending on how the offer was configured.

- Example: “20% off for first 3 months” on a ₹1000/month plan means the user pays ₹800 for month 1, 2, and 3, then ₹1000 from month 4 onward.

## Why offer applies automatically

Sometimes an offer gets applied even when the user did not manually select it, because the system detects that the subscription is eligible and auto-applies the valid or best matching offer.  
This is done to reduce friction, improve conversions, and ensure the customer gets the configured benefit without needing extra clicks.

- Example: You have a “first subscription ₹100 off” offer. A new user opens checkout, does not choose any coupon, but still sees the reduced amount because the backend or checkout found that the user qualifies.

## Billing cycle

The billing cycle is the repeating interval on which Razorpay attempts charges, such as daily, weekly, monthly, or yearly, based on the plan configuration.  
Each successful cycle creates the next recurring payment flow until the total count is completed, the subscription is cancelled, or billing fails badly enough to halt it.

- Example: A ₹299 monthly plan created on April 10 usually tries the next cycle around May 10, then June 10, and so on.

## Important points

- A subscription is not just one payment; it is a long-lived billing agreement.
- The **first payment** is especially important because it often activates the subscription or mandate.
- Failed recurring payments can move the subscription into a waiting or halted state, depending on retry rules.
- Cancelling a subscription usually stops future billing, but it does not undo already successful charges.
- When designing backend logic, always track both the **subscription status** and each **individual payment status**, because “subscription exists” does not always mean “latest payment succeeded.”

## Easy memory trick

- **Subscription** = long-term contract.
- **Payment** = one installment inside that contract.
- **Offer** = discount rule applied to that contract or some of its installments.
- **Billing cycle** = when the next installment is attempted.

Example in one line: a user buys a ₹500/month plan, gets ₹100 off on the first month automatically, pays ₹400 now, the subscription becomes active, and next month Razorpay attempts the regular cycle again.