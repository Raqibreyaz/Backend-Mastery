Yes — here are clean notes you can keep and revise later.

## Plan change notes

For Razorpay subscription **upgrade/downgrade**, the safest design is: call the update API from your controller, but treat the webhook as the final source of truth for whether the subscription actually changed. [razorpay](https://razorpay.com/docs/payments/subscriptions/update/)

For your project, `subscription.updated` should be treated as the **plan-sync** event, while `activated`, `charged`, `pending`, `halted`, `paused`, `resumed`, and `cancelled` remain lifecycle events. [razorpay](https://razorpay.com/docs/webhooks/subscriptions/)

Because your app uses internal statuses instead of Razorpay statuses, always map Razorpay status to your own enum before storing anything in the `subscriptions` collection. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/4f7490be-9d3d-44a7-a8d4-0e820870f70e/razorpay-integration-upload-design-doc.md)

## Immediate update rule

Since you only allow **immediate** plan changes, you do not need to handle scheduled changes right now. [razorpay](https://razorpay.com/docs/payments/subscriptions/update/)

Also, do not update your local subscription document inside the `updateSubscription` controller just because the API call was made; wait for webhook confirmation. [razorpay](https://razorpay.com/docs/webhooks/subscriptions/)

The clean rule is: update the active plan in DB **only when** `subscription.updated` shows the new effective `plan_id` and the subscription is in a usable success state, with `active` being the safest checkpoint. [razorpay](https://razorpay.com/docs/payments/subscriptions/update/)

If the plan did not actually change in the webhook payload, then your local active plan and user quota should remain untouched. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/4f7490be-9d3d-44a7-a8d4-0e820870f70e/razorpay-integration-upload-design-doc.md)

## What to update

On successful plan migration, update these in your `Subscription` document:
- `planId`
- `billingCycle`
- `currentPeriodStart`
- `currentPeriodEnd`
- mapped internal `status` [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/4f7490be-9d3d-44a7-a8d4-0e820870f70e/razorpay-integration-upload-design-doc.md)

On successful plan migration, update this in `User`:
- `maxStorageInBytes` [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/174c1264-60c2-4210-82c8-218f1a25e23a/assignments-for-payment-gateway-integration.md)

If the plan update attempt fails, do **not** change the effective local plan or user quota. [razorpay](https://razorpay.com/docs/payments/subscriptions/update/)

Since you already store every raw webhook event in DB, that event log is enough as your failure/audit trail, so you do not need to duplicate failed update-attempt metadata in the subscription document unless you later want faster UI queries. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/174c1264-60c2-4210-82c8-218f1a25e23a/assignments-for-payment-gateway-integration.md)

## Status mapping

A practical mapping for your internal statuses is:

- `created` -> `awaiting_activation` 
- `authenticated` -> `awaiting_activation` 
- `active` -> `active` 
- `pending` -> `past_due` 
- `halted` -> `in_grace` 
- `paused` -> `paused` [razorpay](https://razorpay.com/docs/api/payments/subscriptions/pause-subscription/?preferred-country=IN)
- `cancelled` -> `cancelled` 
- `completed` -> `cancelled` or another terminal state if you later add one 
- `expired` -> `cancelled` or another terminal state if you later add one 

For plan migration specifically, the safest operational rule is still: only switch the active local plan on `subscription.updated` when the new `plan_id` is effective and status is `active`. [razorpay](https://razorpay.com/docs/payments/subscriptions/update/)

## Payment behavior

If an immediate update requires extra payment, Razorpay handles that as part of the subscription update flow. [razorpay](https://razorpay.com/docs/payments/subscriptions/update/)

Razorpay’s docs state that if the extra charge fails, the subscription is **not updated**. [razorpay](https://razorpay.com/docs/payments/subscriptions/update/)

That means you usually do **not** need a separate checkout flow from your side for normal immediate upgrades; your backend should wait for the webhook-confirmed result. [razorpay](https://razorpay.com/docs/webhooks/subscriptions/)

For downgrades that leave an amount to be adjusted, Razorpay says the refund is handled by Razorpay and you are notified through `subscription.updated`. [razorpay](https://razorpay.com/docs/payments/subscriptions/update/)

So your app’s job is mainly to sync the plan only after success, not to manually calculate or push the refund for the standard update flow. [razorpay](https://razorpay.com/docs/payments/subscriptions/update/)

## Event ordering note

Do **not** build your logic around assuming `subscription.charged` must come before `subscription.updated`. [razorpay](https://razorpay.com/docs/webhooks/subscriptions/)

Razorpay’s webhook docs say the subscription webhook may include payment information if a payment attempt happened before the event was triggered, and the update docs say successful immediate updates are communicated through `subscription.updated`. [razorpay](https://razorpay.com/docs/webhooks/subscriptions/)

So for plan migration:
- `subscription.updated` = plan-change confirmation event. [razorpay](https://razorpay.com/docs/payments/subscriptions/update/)
- `subscription.charged` = billing cycle / renewal maintenance event. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/4f7490be-9d3d-44a7-a8d4-0e820870f70e/razorpay-integration-upload-design-doc.md)

## Recommended decision rule

Use this rule in plain English:

1. Receive `subscription.updated`. [razorpay](https://razorpay.com/docs/webhooks/subscriptions/)
2. Read webhook subscription entity. [razorpay](https://razorpay.com/docs/webhooks/subscriptions/)
3. Map Razorpay `plan_id` to your internal plan config. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/4f7490be-9d3d-44a7-a8d4-0e820870f70e/razorpay-integration-upload-design-doc.md)
4. If mapped plan is different from stored active plan **and** status maps from Razorpay `active`, then update subscription plan fields and user quota. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/174c1264-60c2-4210-82c8-218f1a25e23a/assignments-for-payment-gateway-integration.md)
5. Otherwise, keep the existing active plan unchanged. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/4f7490be-9d3d-44a7-a8d4-0e820870f70e/razorpay-integration-upload-design-doc.md)

That rule avoids accidental quota changes on failed upgrades or downgrades. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/4f7490be-9d3d-44a7-a8d4-0e820870f70e/razorpay-integration-upload-design-doc.md)

## Example: successful upgrade

Example flow:
- User is on 2 TB monthly and requests upgrade to 5 TB monthly. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/4f7490be-9d3d-44a7-a8d4-0e820870f70e/razorpay-integration-upload-design-doc.md)
- Backend calls Razorpay subscription update API, but does not mutate the subscription document yet. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/4f7490be-9d3d-44a7-a8d4-0e820870f70e/razorpay-integration-upload-design-doc.md)
- Webhook `subscription.updated` arrives with the new Razorpay `plan_id` for 5 TB and status `active`. [razorpay](https://razorpay.com/docs/payments/subscriptions/update/)
- Now update local `planId`, `billingCycle`, period dates, and set `user.maxStorageInBytes` to 5 TB quota. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/174c1264-60c2-4210-82c8-218f1a25e23a/assignments-for-payment-gateway-integration.md)

## Example: failed upgrade

Example flow:
- User requests 2 TB -> 5 TB upgrade. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/4f7490be-9d3d-44a7-a8d4-0e820870f70e/razorpay-integration-upload-design-doc.md)
- Razorpay needs extra charge for the immediate update. [razorpay](https://razorpay.com/docs/payments/subscriptions/update/)
- That charge fails, so the subscription is **not updated** according to Razorpay docs. [razorpay](https://razorpay.com/docs/payments/subscriptions/update/)
- Your local DB should continue showing 2 TB as the active plan, and the user can retry the plan change request. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/4f7490be-9d3d-44a7-a8d4-0e820870f70e/razorpay-integration-upload-design-doc.md)

## Example: successful downgrade

Example flow:
- User is on 10 TB and downgrades to 5 TB immediately. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/4f7490be-9d3d-44a7-a8d4-0e820870f70e/razorpay-integration-upload-design-doc.md)
- First, your app should check used storage does not exceed the target plan quota, because your assignment explicitly asks for a downgrade guard. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/174c1264-60c2-4210-82c8-218f1a25e23a/assignments-for-payment-gateway-integration.md)
- Razorpay processes the immediate change and handles any refund adjustment if applicable. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/174c1264-60c2-4210-82c8-218f1a25e23a/assignments-for-payment-gateway-integration.md)
- When `subscription.updated` confirms the new plan, update local plan fields and set `maxStorageInBytes` to 5 TB. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/174c1264-60c2-4210-82c8-218f1a25e23a/assignments-for-payment-gateway-integration.md)

## Recommended implementation notes

Keep `updateSubscription` controller **thin**:
- validate target plan,
- validate downgrade guard,
- call Razorpay update API,
- return “plan change requested” response,
- do not finalize plan locally yet. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/174c1264-60c2-4210-82c8-218f1a25e23a/assignments-for-payment-gateway-integration.md)

Keep webhook handler **authoritative**:
- verify signature,
- store raw event,
- process lifecycle events,
- finalize plan change only from `subscription.updated`. [razorpay](https://razorpay.com/docs/webhooks/subscriptions/)

Keep active subscription row representing only the **effective current state**, not temporary failed update attempts. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/4f7490be-9d3d-44a7-a8d4-0e820870f70e/razorpay-integration-upload-design-doc.md)

## Common mistakes

- Updating local `planId` inside controller before webhook confirmation. [razorpay](https://razorpay.com/docs/webhooks/subscriptions/)
- Treating `subscription.charged` as the plan-switch event. [razorpay](https://razorpay.com/docs/webhooks/subscriptions/)
- Updating user quota on failed `pending` or `halted` update attempts. [razorpay](https://razorpay.com/docs/payments/subscriptions/update/)
- Storing raw Razorpay status directly when your app already has a custom internal status model. 
- Forgetting downgrade guard when used storage is already above the target plan quota. [ppl-ai-file-upload.s3.amazonaws](https://ppl-ai-file-upload.s3.amazonaws.com/web/direct-files/attachments/67232269/174c1264-60c2-4210-82c8-218f1a25e23a/assignments-for-payment-gateway-integration.md)

## Compact summary to remember

Use this one-liner as your rule:

**“Controller requests the plan change, webhook confirms it, and only confirmed `subscription.updated` with effective new `plan_id` and `active` status changes local plan + quota.”** [razorpay](https://razorpay.com/docs/webhooks/subscriptions/)