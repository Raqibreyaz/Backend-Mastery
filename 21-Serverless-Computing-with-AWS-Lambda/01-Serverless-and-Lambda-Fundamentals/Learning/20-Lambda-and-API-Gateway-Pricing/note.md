Lambda and API Gateway pricing becomes simple once you separate it into two meters: **Lambda charges for requests and compute**, while **API Gateway charges for API requests**. The key unit to understand is GB-seconds, because that is how Lambda turns “memory size × execution time” into billable compute.

## What is GB-seconds?

A GB-second means running **1 GB of memory for 1 second**. Lambda compute cost is based on:

GB-seconds = Memory in GB x Execution time in seconds

So if your function has 512 MB memory, that is 0.5 GB, and if it runs for 1 second, each request consumes 0.5 GB-seconds.

### Intuition

Think of Lambda compute like renting a box of RAM for a short time. More memory makes the box larger, longer execution keeps it rented longer, and GB-seconds is just the product of those two.

## Lambda pricing model

AWS Lambda pricing has two major parts:

- Request count.
- Compute duration in GB-seconds.

AWS also provides a free tier of **1 million requests** and **400,000 GB-seconds** of compute each month. That means small or medium serverless systems can often stay nearly free on the Lambda side for a while.

## API Gateway pricing model

API Gateway is billed separately from Lambda. The exact cost depends on whether you use **HTTP API** or **REST API**, and AWS pricing pages list them separately because HTTP API is cheaper while REST API has more features.

For a simple mental model:

- Lambda = pay for execution.
- API Gateway = pay for each API call.

## Your scenario

You asked for pricing with:

- Each request runs for 1 second.
- Lambda memory is 512 MB.
- Free tier includes 1M requests and 400k GB-seconds.
- Also, what happens if timeout is set to 1 minute.

Let’s build this carefully.

### Step 1: Compute per-request GB-seconds

512 MB = 0.5 GB.
Runtime = 1 second.

So:

0.5 x 1 = 0.5 GB-seconds per request

Each request uses **0.5 GB-seconds** of Lambda compute.

## What 1 million requests would consume

If you process 1,000,000 requests and each takes 1 second at 512 MB:

1,000,000 x 0.5 = 500,000 GB-seconds

So total Lambda compute would be **500,000 GB-seconds**. The Lambda free tier covers **400,000 GB-seconds**, so:

500,000 - 400,000 = 100,000 billable GB-seconds

You would exceed the free compute tier by **100,000 GB-seconds**.

## Lambda request free tier

Lambda also gives **1 million free requests per month**. So for exactly 1,000,000 requests:

- Request charges = covered by free tier
- Compute charges = only the excess above 400,000 GB-seconds is billed

That means in your example, **requests are free, but compute is not fully free**.

## Important question: does 1-minute timeout change cost?

**No, timeout setting by itself does not change cost**. Lambda charges for the **actual execution duration**, not the configured maximum timeout.

So:

- If timeout is set to 1 minute, but the function finishes in 1 second, you still pay for about 1 second of runtime.
- If the function actually runs for 1 minute, then you pay for 1 minute of runtime.

### Mental model

Timeout is just the **upper limit**, not the default billed duration. Setting it to 60 seconds does not mean every request is billed for 60 seconds.

## Worked examples

### Example A: 100,000 requests/month

Each request uses 0.5 GB-seconds.

100,000 x 0.5 = 50,000 GB-seconds

That is below the 400,000 GB-second free tier, and 100,000 requests is below the 1M free request tier, so Lambda cost would be **fully covered by free tier**.

### Example B: 1,000,000 requests/month

1,000,000 x 0.5 = 500,000 GB-seconds

Requests are covered by free tier, but compute exceeds free tier by 100,000 GB-seconds.

### Example C: same setup, but actual runtime is 2 seconds

Now each request uses:

0.5 x 2 = 1.0 GB-seconds

For 1,000,000 requests:

1,000,000 x 1.0 = 1,000,000 GB-seconds

Now free tier covers only 400,000, so 600,000 GB-seconds are billable. This shows that **runtime growth hurts cost quickly**, even if request count stays the same.

## Add API Gateway cost on top

Lambda is only one part of a serverless API bill. If every Lambda invocation comes through API Gateway, then **each API request is also billed by API Gateway**.

So total monthly serverless API cost is roughly:

Total cost = Lambda request cost + Lambda compute cost + API Gateway request cost

That is the right high-level formula for your architecture.

## Why HTTP API vs REST API matters for pricing

API Gateway cost depends strongly on API type. Third-party breakdowns based on AWS pricing pages note that HTTP API is much cheaper than REST API per million requests, which is why HTTP API is usually the better fit for simple Lambda-backed APIs when you do not need advanced REST API features.

## Cost intuition table

| Scenario   |  Requests | Runtime | Memory | Total GB-seconds | Free tier status            |
| ---------- | --------: | ------: | -----: | ---------------: | --------------------------- |
| Small app  |   100,000 |      1s | 512 MB |           50,000 | Fully inside free tier      |
| Medium app | 1,000,000 |      1s | 512 MB |          500,000 | 100,000 GB-seconds billable |
| Slower app | 1,000,000 |      2s | 512 MB |        1,000,000 | 600,000 GB-seconds billable |

## Common misconceptions

- **“Timeout is 1 minute, so I pay for 1 minute.”** False; you pay for actual execution time, not the configured limit.
- **“Only requests matter.”** False; compute often dominates Lambda cost once traffic grows.
- **“Free 1M requests means Lambda is free.”** Not necessarily, because compute can exceed the 400,000 GB-seconds free tier first.
- **“API Gateway is included in Lambda cost.”** False; API Gateway is billed separately.

## Key takeaways

- Lambda cost = requests + compute in GB-seconds.
- GB-seconds = memory in GB × execution time in seconds.
- At 512 MB and 1 second runtime, each request uses 0.5 GB-seconds.
- 1,000,000 such requests consume 500,000 GB-seconds, so 100,000 GB-seconds exceed the free compute tier.
- Setting timeout to 1 minute does not increase cost unless the function actually runs longer.
- API Gateway pricing is separate and must be added on top of Lambda pricing.

## Minimal self-test

- Explain GB-seconds in one sentence.
- Calculate GB-seconds for 256 MB running 4 seconds.
- Calculate monthly compute for 2 million requests at 512 MB and 1 second each.
- Explain why timeout configuration and billed duration are different.
- Explain why choosing HTTP API vs REST API matters for cost.
