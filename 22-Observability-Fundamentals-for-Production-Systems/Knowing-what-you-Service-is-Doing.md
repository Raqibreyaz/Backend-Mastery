# Knowing What Your Service Is Doing

## What it is

**Observability** is the ability to understand what a running backend is doing from the information it produces.

A service that you cannot observe is a service you debug by guessing.

The three main observability tools answer different questions:

```text
Logs    → What happened to this request?
Metrics → How is the service doing overall?
Traces  → Where did the time go?
```

There is also a closely related operational concept:

```text
Health checks
    ├── Liveness   → Should this process be restarted?
    └── Readiness  → Should this process receive traffic?
```

The key is to choose the right tool for the right question.

---

## One-sentence summary

**Use structured logs to understand individual requests, metrics to understand system-wide behavior, traces to locate latency, health checks to control traffic/restarts, and alerts to detect user-visible symptoms rather than arbitrary infrastructure numbers.**

---

# Intuition

Imagine a restaurant.

You want to know why customers are complaining.

Different tools give you different views:

```text
Logs
  ↓
"What happened to this particular order?"

Metrics
  ↓
"How many orders are failing overall?"

Traces
  ↓
"Where did this particular order spend its time?"

Health checks
  ↓
"Can this restaurant currently serve customers?"

Alerts
  ↓
"Is something bad enough that someone needs to act?"
```

Trying to answer every question with logs alone creates huge amounts of data.

Trying to answer everything with metrics loses individual-request detail.

Trying to debug latency without traces can require adding logs everywhere.

The key is to choose the correct observability signal.

---

# 1. Logs

## What are logs?

Logs answer:

> **"What happened to this request?"**

For example:

```json
{
  "level": "error",
  "request_id": "r_8f2",
  "route": "POST /orders",
  "status": 500,
  "duration_ms": 812,
  "user_id": "u_41"
}
```

This tells us:

* log level = `error`
* request ID = `r_8f2`
* route = `POST /orders`
* HTTP status = `500`
* duration = `812 ms`
* user = `u_41`

---

# 2. Use Structured Logs

A common beginner approach is:

```text
Error while processing order for user 41
```

This is readable by a human.

But imagine there are:

```text
2,000,000 log entries
```

Searching and counting information from free-form text becomes difficult.

Instead, use structured data:

```json
{
  "level": "error",
  "request_id": "r_8f2",
  "route": "POST /orders",
  "status": 500,
  "duration_ms": 812,
  "user_id": "u_41"
}
```

Now machines can easily filter and count.

For example:

```text
Find all:
status = 500
```

or:

```text
Count:
route = POST /orders
AND status = 500
```

---

## Structured vs unstructured logs

| Unstructured                | Structured          |
| --------------------------- | ------------------- |
| Human-readable sentence     | Key-value data      |
| Harder to filter            | Easy to filter      |
| Harder to aggregate         | Easy to count       |
| Meaning is embedded in text | Meaning is explicit |

### Example

Bad for machine processing:

```text
Order failed for user 41
```

Better:

```json
{
  "event": "order_failed",
  "user_id": "u_41",
  "request_id": "r_8f2"
}
```

---

# 3. Request IDs

## The most important part of request logging

A **request ID** is an identifier assigned to a request.

Example:

```text
r_8f2
```

The same ID should follow the request throughout its lifetime.

```text
Client
  ↓
Request ID: r_8f2
  ↓
Service A
  ↓
Service B
  ↓
Database / external service
```

Every relevant log entry contains:

```text
request_id = r_8f2
```

---

# 4. Why Request IDs Matter

Suppose someone tells you:

> "The site broke around 14:32."

Without a request ID, you may have to search through logs based on time:

```text
14:32
 ↓
thousands of requests
 ↓
scroll
 ↓
guess
 ↓
scroll more
```

With a request ID:

```text
request_id = r_8f2
```

you can filter:

```text
request_id:r_8f2
```

and see the entire request.

The request ID is the **thread that ties everything together**.

---

# 5. Request ID Should Travel Across Services

Suppose:

```text
Frontend
   ↓
API Gateway
   ↓
Order Service
   ↓
Payment Service
   ↓
Shipping Service
```

The request ID should be passed along:

```text
r_8f2
 ↓
Gateway
 ↓
Order Service
 ↓
Payment Service
 ↓
Shipping Service
```

Every service logs:

```text
request_id = r_8f2
```

Now one ID lets you follow the request across the system.

---

# 6. Return the Request ID to the Client

Generate one request ID for every request.

Then:

1. Put it in every log line for that request.
2. Return it in the response header.
3. Pass it to services you call.

For example:

```http
X-Request-ID: r_8f2
```

Then if a user reports a problem, they can provide:

```text
r_8f2
```

and you can search for the complete request.

---

# 7. Metrics

## What are metrics?

Metrics answer:

> **"How is the service doing overall?"**

Unlike logs, which usually describe individual events, metrics are numerical measurements over time.

Examples:

```text
Requests per second
Error rate
Request duration
Queue depth
```

---

## Metrics are numbers over time

For example:

```text
Time       Requests/sec
10:00      120
10:01      130
10:02      127
10:03      500
```

You can then see that traffic suddenly increased.

Or:

```text
Time       Error rate
10:00      0.2%
10:01      0.3%
10:02      0.4%
10:03      5.7%
```

Now you can see a system-wide problem.

---

# 8. Metrics Are What You Alert On

Metrics are generally cheap to store and useful for observing trends.

They are therefore ideal for alerts.

For example:

```text
Error rate > 2%
for 5 minutes
        ↓
ALERT
```

This is much more useful than receiving an alert every time a single request fails.

One request can fail without the entire service being unhealthy.

---

# 9. Important Metrics

The important metrics include:

### Requests per second

How much traffic the service is receiving.

```text
RPS = requests / second
```

Example:

```text
500 requests/sec
```

---

### Error rate

Percentage of requests that fail.

For example:

```text
1000 requests
20 errors
```

then:

```text
error rate = 20 / 1000
           = 2%
```

---

### Duration

How long requests take.

For example:

```text
GET /users
→ 120 ms
```

---

### Queue depth

How much work is waiting in a queue.

Example:

```text
Queue depth = 50
```

If it keeps growing:

```text
100
200
500
1000
```

the system may not be processing work quickly enough.

---

# 10. The Average Latency Trap

This is one of the most important ideas.

> **The average latency is often misleading.**

Imagine 100 requests:

```text
99 requests → 10 ms
1 request   → 10 seconds
```

The average is:

```text
(99 × 10 + 1 × 10000) / 100
= 109.9 ms
```

So the average looks like roughly:

```text
110 ms
```

That sounds reasonable.

But one user waited:

```text
10 seconds
```

That user had a terrible experience.

This is why we use **percentiles**.

---

# 11. What Are p50, p95, and p99?

`p50`, `p95`, and `p99` are **percentiles**.

They describe different positions in the distribution of the same measured value.

For example, if we are measuring request latency:

```text
Raw request latencies
        ↓
     sort them
        ↓
10, 12, 15, 20, 25, ...
        ↓
find percentile position
```

The basic meaning is:

| Percentile | Meaning                                      |
| ---------- | -------------------------------------------- |
| **p50**    | 50% of requests are at or below this latency |
| **p95**    | 95% of requests are at or below this latency |
| **p99**    | 99% of requests are at or below this latency |

Think of them as:

```text
p50 → typical request
p95 → slower tail
p99 → very slow tail
```

---

# 12. How Are Percentiles Calculated?

The first important step is:

> **Sort the measurements from smallest to largest.**

Suppose 10 requests have these latencies:

```text
10
12
15
20
25
30
40
50
100
200
```

We can label their positions:

```text
Position:    1    2    3    4    5    6    7    8    9    10
Latency:    10   12   15   20   25   30   40   50  100   200
```

Now we can locate different percentiles.

---

# 13. p50 Calculation

`p50` means the 50th percentile.

With 10 values, the middle lies between positions 5 and 6:

```text
10   12   15   20   25 | 30   40   50   100   200
                        ↑
                    middle
```

The two middle values are:

```text
25
30
```

So:

```text
p50 = (25 + 30) / 2
    = 27.5 ms
```

Therefore:

```text
p50 = 27.5 ms
```

This is the **median**.

It means roughly half the requests were at or below this value and half were above it.

---

# 14. p95 Calculation

Using 100 requests makes p95 easier to understand.

Suppose the sorted values look like this:

```text
Position
  1       10 ms
  2       11 ms
  3       12 ms
  ...
 50       30 ms
 ...
 90       80 ms
 91       82 ms
 92       85 ms
 93       90 ms
 94       95 ms
 95      100 ms
 96      120 ms
 97      150 ms
 98      300 ms
 99      500 ms
100     2000 ms
```

The 95th percentile is around position 95:

```text
p95 ≈ 100 ms
```

Meaning:

```text
95% of requests
       ↓
≤ 100 ms

5% of requests
       ↓
> 100 ms
```

Visualize it as:

```text
100 requests

███████████████████████████████████████████████████████████████████████████████████████████████
←---------------------- 95% ------------------------------→|←------ 5% ------→
                                                           ↑
                                                         p95
```

So p95 tells you about the **slower tail**.

---

# 15. p99 Calculation

Using the same 100 requests:

```text
Position 99 = 500 ms
Position 100 = 2000 ms
```

So approximately:

```text
p99 = 500 ms
```

Meaning:

```text
99% of requests
       ↓
≤ 500 ms

1% of requests
       ↓
> 500 ms
```

Visual:

```text
100 requests

███████████████████████████████████████████████████████████████████████████████████████████████████|█
←---------------------------------- 99% ----------------------------------------------→|←-- 1% --→
                                                                                         ↑
                                                                                        p99
```

---

# 16. p50 vs p95 vs p99

Think of 100 sorted requests:

```text
1                                                        50                    95       99   100
│---------------------------------------------------------│---------------------│------│----│
                                                           ↑                     ↑      ↑
                                                          p50                   p95    p99
```

They describe different parts of the distribution:

```text
p50 → typical experience
p95 → slower requests
p99 → very slow requests
```

---

# 17. A More Precise Percentile Calculation

There is more than one mathematical convention for calculating percentiles.

Different monitoring systems and libraries can use slightly different interpolation rules, especially with small datasets.

A common method uses:

```text
rank = (p / 100) × (n - 1)
```

where:

```text
p = percentile
n = number of observations
```

For p95 with 10 values:

```text
rank = 0.95 × (10 - 1)
     = 0.95 × 9
     = 8.55
```

So the percentile lies between positions 9 and 10.

You then interpolate between those values.

The important mental model is:

```text
Measurements
     ↓
Sort
     ↓
Find percentile position
     ↓
Possibly interpolate
     ↓
Percentile value
```

In production, the exact calculation can depend on the monitoring system.

The meaning remains the same:

```text
p95 → approximately 95% are at or below it
p99 → approximately 99% are at or below it
```

---

# 18. Why p99 Can Reveal Something the Average Hides

Consider 10 requests:

```text
10
10
10
10
10
10
10
10
10
1000
```

Average:

```text
(9 × 10 + 1000) / 10
= 109 ms
```

So:

```text
Average = 109 ms
```

That doesn't look terrible.

But:

```text
9 requests → 10 ms
1 request  → 1000 ms
```

One user waited a full second.

The tail tells us something the average doesn't.

---

# 19. At Large Scale, the Tail Matters Even More

Imagine:

```text
1,000,000 requests
```

Suppose:

```text
999,000 requests → 20 ms
10,000 requests   → 5 seconds
1,000 requests    → 20 seconds
```

Even 1% represents:

```text
1% of 1,000,000
= 10,000 requests
```

So "only the slowest 1%" can still mean thousands of affected requests.

This is why the tail is where many complaints come from.

The lesson recommends alerting on **p99 rather than the mean**.

---

# 20. Traces

## What are traces?

Traces answer:

> **"Where did the time go?"**

A trace follows one request and breaks it into smaller operations called **spans**.

Example:

```text
Request
│
├── Handler: 4 ms
│
├── Third-party API: 190 ms
│
└── Database: 12 ms
```

Total time is roughly:

```text
4 + 190 + 12
= 206 ms
```

Now we immediately know that the third-party service consumed most of the time.

---

# 21. Why Traces Are Useful

Imagine:

```text
GET /orders
```

takes:

```text
800 ms
```

You know the endpoint is slow.

But where?

Possibilities:

```text
Handler?
Database?
Cache?
Payment API?
Another service?
Network?
```

Without tracing, you may add logs everywhere.

A trace can show the breakdown directly:

```text
800 ms total
│
├── handler       5 ms
├── database     20 ms
├── cache          3 ms
└── third party  772 ms
```

Now the bottleneck is obvious.

---

# 22. Logs vs Metrics vs Traces

| Tool    | Main question                    | Example                        |
| ------- | -------------------------------- | ------------------------------ |
| Logs    | What happened?                   | Request `r_8f2` returned `500` |
| Metrics | How is the system doing overall? | Error rate = 2%                |
| Traces  | Where did the time go?           | Payment API took 190 ms        |

Think:

```text
Individual request
       ↓
      Logs

Whole system
       ↓
    Metrics

Request journey
       ↓
     Traces
```

Do not try to force one tool to answer all three questions.

---

# 23. Health Checks

Health checks tell infrastructure whether your service can operate correctly.

There are two important types:

```text
Liveness
Readiness
```

They answer different questions.

---

# 24. Liveness

Liveness asks:

> **"Should this process be restarted?"**

Conceptually:

```text
Process alive?
     │
   yes/no
     ↓
Should orchestrator restart it?
```

A liveness failure usually indicates that the process is no longer functioning correctly.

---

# 25. Readiness

Readiness asks:

> **"Should this process receive traffic right now?"**

This is different.

A process can be alive but not ready.

For example:

```text
Application process
      ↓
Alive
      ↓
Connecting to database...
      ↓
Not ready
```

The process hasn't crashed.

But it cannot serve requests correctly.

Therefore:

```text
Liveness = yes
Readiness = no
```

---

# 26. Why Liveness and Readiness Must Be Separate

Imagine a new application instance starts:

```text
Application starts
       ↓
Process running
       ↓
Database connection not ready
```

If readiness always returns:

```http
200 OK
```

the load balancer may send traffic to it.

Then:

```text
Load balancer
      ↓
New instance
      ↓
Database unavailable
      ↓
Requests fail
```

That's exactly what readiness is supposed to prevent.

---

# 27. What Is Readiness Actually Checking?

A useful mental model is:

> **Readiness is a traffic gate.**

It is not asking:

> "Is the entire system perfectly healthy?"

It is asking:

> **"Can this specific instance serve the traffic it is supposed to serve right now?"**

Conceptually:

```text
                 Load Balancer
                       │
                       ↓
                  /ready
                       │
             ┌─────────┴─────────┐
             ↓                   ↓
          READY              NOT READY
             │                   │
             ↓                   ↓
       Send traffic         Stop traffic
```

This distinction is important because a service may have many dependencies, but not all of them necessarily determine whether the instance should receive traffic.

---

# 28. Readiness Should Check Real Dependencies

Suppose your service needs PostgreSQL:

```text
Load Balancer
      ↓
Your API
      ↓
PostgreSQL
```

If PostgreSQL is completely unavailable and the API cannot serve its important requests, the instance should probably become not ready.

But readiness does **not** need to perform expensive application queries such as:

```sql
SELECT *
FROM users
JOIN orders ...
JOIN payments ...
```

A readiness check is not a production request.

It only needs enough information to answer:

```text
Can this instance currently serve its required traffic?
```

---

# 29. How Do You Keep a Database Readiness Check Cheap?

There are several approaches.

The right choice depends on the architecture and the database/driver.

---

## Option 1: A Minimal Database Connectivity Check

Instead of an expensive query, perform a very small operation such as:

```sql
SELECT 1;
```

Conceptually:

```text
GET /ready
    ↓
DB connection
    ↓
SELECT 1
    ↓
success → READY
failure → NOT READY
```

This is much cheaper than querying application data.

However:

> `SELECT 1` is still a database query.

So if `/ready` is being called extremely frequently across many instances, you may want an even cheaper approach.

---

# 30. Option 2: Check the Connection Pool

Your application often already maintains a database connection pool:

```text
Application
     │
     ↓
Connection Pool
 ┌───┬───┬───┐
 │ C │ C │ C │
 └───┴───┴───┘
     │
     ↓
 PostgreSQL
```

Instead of establishing a new database connection for every readiness request, the application can use the existing pool state where the driver/library makes that information available.

Conceptually:

```text
GET /ready
    ↓
Is DB pool initialized?
    ↓
Are usable connections available?
    ↓
YES → READY
NO  → NOT READY
```

The exact implementation depends on the database driver and connection-pool library.

---

# 31. Option 3: Maintain Dependency State in the Background

For a very cheap readiness endpoint, you can periodically check dependencies in the background.

Instead of:

```text
Every readiness request
        ↓
Query database
        ↓
Return result
```

use:

```text
Background health monitor
          │
          ├── periodically checks DB
          │
          ↓
     dependency state
          │
          ↓
   "DB is healthy"
```

Then the readiness request becomes:

```text
GET /ready
    ↓
Read in-memory state
    ↓
true
    ↓
200 OK
```

The health-check work happens separately:

```text
Background process
       ↓
Check database periodically
       ↓
Update state

Readiness endpoint
       ↓
Read current state
       ↓
Return immediately
```

So the endpoint itself does:

```text
HTTP request
    ↓
Memory lookup
    ↓
HTTP response
```

No database query.

No external API call.

---

# 32. The Trade-off of Cached Dependency State

Suppose the background check runs every 5 seconds.

```text
12:00:00 → DB healthy
12:00:01 → DB dies
12:00:02 → readiness still says healthy
12:00:03 → readiness still says healthy
12:00:04 → readiness still says healthy
12:00:05 → health check runs
            ↓
          DB failed
            ↓
       readiness = false
```

There can be a small detection delay.

So you trade:

```text
cheap readiness requests
        ↕
slightly stale dependency state
```

Whether that trade-off is acceptable depends on your system.

---

# 33. Don't Check Every Dependency

Suppose your service has:

```text
API
 │
 ├── PostgreSQL
 ├── Redis
 ├── Payment API
 ├── Email API
 └── Analytics API
```

Should `/ready` call all five?

Usually, you should first ask:

> **Which dependencies are actually essential for this instance to serve its intended traffic?**

For example:

```text
Order Service
│
├── PostgreSQL     ← critical
├── Redis          ← important
├── Email API      ← non-critical
└── Analytics API  ← non-critical
```

You might decide:

```text
PostgreSQL unavailable
       ↓
NOT READY
```

while:

```text
Analytics unavailable
       ↓
still READY
```

because the application can continue serving its core requests.

The exact policy is an architectural decision.

---

# 34. Why You Normally Should Not Call External APIs From Readiness

Suppose:

```text
Your API
   ↓
Payment API
```

It may be tempting to do:

```text
GET /ready
   ↓
Call payment API
   ↓
Wait for response
   ↓
Return readiness
```

This creates several problems.

Your readiness endpoint now depends on:

* network latency
* third-party downtime
* third-party rate limits
* third-party failures

And if there are 100 instances:

```text
100 instances
×
1 readiness check / second
=
100 payment API calls / second
```

That is a bad way to perform a health check.

Instead, you can track the external dependency separately if it is important:

```text
Background process
      ↓
Periodically assess payment provider
      ↓
paymentAvailable = true / false
```

Then:

```text
GET /ready
      ↓
cheap state lookup
```

Or, if payment is not required for most traffic, don't make payment availability determine overall readiness. Handle payment failures when payment operations are actually requested.

---

# 35. Keep Readiness Checks Cheap

A readiness endpoint may be called frequently.

The lesson gives the example of something polling it every second.

Therefore, don't make the check unnecessarily expensive.

Bad:

```text
Every readiness request
    ↓
Query database 3 times
    ↓
Call external service
    ↓
Perform expensive computation
```

Better:

```text
Readiness request
    ↓
Cheap dependency/state check
    ↓
Return quickly
```

The key is:

```text
Readiness
   ≠
Complete system diagnostic
```

It is simply a quick traffic decision.

---

# 36. A Practical Readiness Architecture

For a normal backend, think about readiness like this:

```text
                  /ready
                     │
                     ↓
          ┌──────────────────────┐
          │ Is application       │
          │ initialized?         │
          └──────────┬───────────┘
                     ↓
          ┌──────────────────────┐
          │ Are critical         │
          │ dependencies         │
          │ available?           │
          └──────────┬───────────┘
                     ↓
                   READY
```

For dependency state:

```text
Simple system
    ↓
Cheap connectivity check

High-frequency / large-scale
    ↓
Cached/background dependency state

Complex distributed system
    ↓
Carefully define which dependencies
actually determine readiness
```

Avoid turning `/ready` into:

```text
/ready
  ↓
SELECT huge query
  ↓
Call payment API
  ↓
Call Redis
  ↓
Call another microservice
  ↓
Perform business logic
  ↓
200 OK
```

That's effectively a miniature production request.

---

# 37. Liveness vs Readiness

| Check         | Main Question                        |
| ------------- | ------------------------------------ |
| **Liveness**  | Should this process be restarted?    |
| **Readiness** | Should this process receive traffic? |

Remember:

```text
Liveness
→ Should I restart this process?

Readiness
→ Should I send traffic here?
```

They are different questions.

---

# 38. Alerts

## What should an alert do?

An alert should tell you:

> **Something important is wrong and someone should act.**

The important principle is:

> **Alert on symptoms, not causes.**

---

# 39. Good Alert: Error Rate

Example:

```text
Error rate > 2%
for 5 minutes
```

This is a symptom users can experience.

If enough requests are failing for five minutes, someone should investigate.

Conceptually:

```text
Normal
  ↓
Error rate rises
  ↓
> 2%
  ↓
for 5 minutes
  ↓
ALERT
```

---

# 40. Bad Alert: CPU > 80%

An alert such as:

```text
CPU > 80%
```

does not necessarily mean something is wrong.

High CPU could be completely normal.

For example:

```text
CPU = 90%
Error rate = 0%
Latency = healthy
```

The service may be functioning perfectly.

If you constantly receive alerts that do not represent actual problems, you develop **alert fatigue**.

Eventually:

```text
Alert
  ↓
"Probably nothing"
  ↓
Ignore
```

Then a genuinely important alert may also be ignored.

---

# 41. Symptoms vs Causes

### Cause

```text
CPU > 80%
```

Maybe the CPU is high because:

```text
More traffic
```

But more traffic isn't necessarily a problem.

### Symptom

```text
Error rate > 2% for 5 minutes
```

This directly represents failed requests.

So:

```text
Cause-based alert
    ↓
May or may not mean users are affected

Symptom-based alert
    ↓
More directly connected to actual impact
```

---

# 42. Complete Observability Picture

You can combine everything into one mental model:

```text
                    BACKEND SERVICE
                         │
          ┌──────────────┼──────────────┐
          │              │              │
          ↓              ↓              ↓
        Logs          Metrics         Traces
          │              │              │
          ↓              ↓              ↓
   What happened?   How overall?   Where was time spent?
          │              │              │
          └──────────────┼──────────────┘
                         │
                         ↓
                    Investigation
```

And for operational health:

```text
                 SERVICE INSTANCE
                       │
              ┌────────┴────────┐
              ↓                 ↓
          Liveness          Readiness
              │                 │
              ↓                 ↓
       Should restart?    Should receive
                           traffic?
```

And for alerting:

```text
Metrics
   ↓
User-visible symptoms
   ↓
Threshold / duration
   ↓
Alert
```

---

# 43. Practical Example: Slow `/orders` Endpoint

Suppose users report:

> "Creating orders is very slow."

How do you investigate?

### Step 1: Metrics

Check:

```text
p50
p95
p99
```

Suppose:

```text
p50 = 40 ms
p95 = 200 ms
p99 = 8 sec
```

Now you know the average/typical experience can hide a serious tail problem.

---

### Step 2: Find a request

Find one slow request:

```text
request_id = r_8f2
```

---

### Step 3: Logs

Search:

```text
request_id:r_8f2
```

You see:

```json
{
  "request_id": "r_8f2",
  "route": "POST /orders",
  "status": 500,
  "duration_ms": 812
}
```

---

### Step 4: Trace

Look at the trace:

```text
POST /orders
│
├── handler       4 ms
├── database     12 ms
└── payment API  796 ms
```

Now you know:

```text
Payment API
      ↓
main latency source
```

Without observability, you might spend hours guessing.

With the right tools:

```text
Metrics
   ↓
There is a tail problem

Request ID
   ↓
Find one problematic request

Logs
   ↓
Understand what happened

Trace
   ↓
Find where the time went
```

---

# 44. Security: Never Log Secrets

Sensitive values should never reach log files.

Sensitive keys include:

```text
password
token
authorization
apiKey
secret
```

The matching must be **case-insensitive**.

So these should all be treated as sensitive:

```text
password
Password
PASSWORD
PaSsWoRd
```

---

# 45. Redaction

The exercise introduces:

```javascript
redact(entry)
```

The function should:

1. Return a **copy** of the log entry.
2. Replace sensitive values with:

```text
"[redacted]"
```

3. Redact these keys:

   * `password`
   * `token`
   * `authorization`
   * `apiKey`
   * `secret`
4. Match keys case-insensitively.
5. Find those keys even inside **nested objects**.
6. Leave everything else unchanged.
7. Do not modify the original object.

---

## Example

Input:

```javascript
const entry = {
    user: "alice",
    password: "mypassword",
    profile: {
        token: "secret-token",
        name: "Alice"
    }
};
```

The redacted result should conceptually be:

```javascript
{
    user: "alice",
    password: "[redacted]",
    profile: {
        token: "[redacted]",
        name: "Alice"
    }
};
```

But the original object must remain unchanged.

```text
original
   │
   ├── remains unchanged
   │
   └── redact()
          ↓
      new object
          ↓
       secrets replaced
```

---

# 46. Why Redaction Must Be Recursive

Sensitive data might appear deep inside an object:

```javascript
{
    user: {
        profile: {
            credentials: {
                password: "secret"
            }
        }
    }
}
```

Checking only top-level keys is not enough.

You need to inspect nested objects.

Conceptually:

```text
entry
 │
 ├── user
 │    └── profile
 │         └── credentials
 │              └── password
 │
 └── other fields
```

The `password` must still become:

```text
"[redacted]"
```

---

# 47. Why the Original Object Must Not Be Modified

Suppose:

```javascript
const entry = {
    token: "abc123"
};
```

After:

```javascript
const safe = redact(entry);
```

we want:

```text
entry
 ↓
token = "abc123"

safe
 ↓
token = "[redacted]"
```

Not:

```text
entry
 ↓
token = "[redacted]"
```

Mutating the original object during logging can create difficult and surprising bugs.

So:

```text
redact(entry)
      ↓
new copy
```

not:

```text
redact(entry)
      ↓
modify entry directly
```

---

# 48. Check Yourself

## Question 1

Your average response time is `120 ms`, but users complain that the site is slow.

How can both be true?

**Answer:** The average can hide the latency tail. For example, most requests may be fast while a small percentage are extremely slow. A high `p99` can reveal the problem even when the mean looks good.

---

## Question 2

What does a request ID give you that a timestamp does not?

**Answer:** A request ID groups all log lines belonging to one request, including across services.

---

## Question 3

Why should a readiness check fail while the service is still connecting to its database?

**Answer:** Because the process may be alive but unable to serve traffic. If readiness incorrectly returns success, the load balancer may send requests to an instance that cannot handle them.

---

# Common Mistakes / Gotchas

## 1. Using plain-text logs everywhere

```text
"Something went wrong"
```

is difficult to search and aggregate at scale.

Prefer structured logs.

---

## 2. Not using request IDs

Without request IDs, debugging distributed requests becomes much harder.

Always carry the identifier through the request path.

---

## 3. Alerting on average latency

The mean can hide terrible tail latency.

Track:

```text
p50
p95
p99
```

and pay particular attention to the tail.

---

## 4. Not understanding what p50/p95/p99 mean

Remember:

```text
p50 → 50% are at or below it
p95 → 95% are at or below it
p99 → 99% are at or below it
```

They are **percentiles of the same measured quantity**, such as request latency.

---

## 5. Confusing liveness and readiness

Remember:

```text
Liveness
→ Should I restart this process?

Readiness
→ Should I send traffic here?
```

They are different questions.

---

## 6. Readiness checks that always return 200

If the application cannot connect to an essential dependency, it may not be ready.

A constant `200` can cause traffic to be routed to an unusable instance.

---

## 7. Making readiness an expensive production request

Avoid:

```text
/ready
  ↓
large DB query
  ↓
multiple API calls
  ↓
business logic
```

A readiness check should be cheap and focused on whether the instance can serve traffic.

---

## 8. Expensive database checks on every readiness request

If `/ready` is polled every second, don't run several expensive database queries every time.

Possible approaches include:

```text
Cheap connectivity check
        OR
Connection-pool state
        OR
Background dependency check + in-memory state
```

Choose based on the architecture.

---

## 9. Calling third-party APIs directly from readiness

This makes readiness dependent on:

* network conditions
* third-party availability
* third-party rate limits
* third-party latency

Track such dependencies separately when appropriate.

---

## 10. Treating every dependency as critical

Not every unavailable dependency should necessarily make the entire service unready.

Ask:

> Can this instance still serve its intended/core traffic?

---

## 11. Expensive readiness checks without considering scale

A single database query may look cheap.

But:

```text
100 instances
×
1 check/second
=
100 checks/second
```

At larger scale, even a small operation can become meaningful load.

---

## 12. Logging secrets

Never allow credentials or authentication material to appear in logs.

Redact:

```text
password
token
authorization
apiKey
secret
```

including nested occurrences and case variations.

---

## 13. Modifying the original log object during redaction

Return a new copy.

Do not mutate the original input.

---

# Comparison

| Concept       | Main Question                         | Typical Data                 |
| ------------- | ------------------------------------- | ---------------------------- |
| **Logs**      | What happened?                        | Structured events            |
| **Metrics**   | How is the service doing overall?     | Numbers over time            |
| **Traces**    | Where did the time go?                | Request + spans              |
| **Liveness**  | Should this process be restarted?     | Health state                 |
| **Readiness** | Should this instance receive traffic? | Dependency/service readiness |
| **Alerts**    | Does someone need to act?             | Symptom-based conditions     |

---

# Key Takeaways

* A service without observability is difficult to debug because you are forced to guess.
* **Logs** answer: `"What happened to this request?"`
* Use **structured logs**, not huge amounts of free-form prose.
* A **request ID** connects all log entries belonging to one request.
* Pass the request ID across services and return it to the client.
* **Metrics** answer: `"How is the service doing overall?"`
* Important metrics include:

  * requests per second
  * error rate
  * duration
  * queue depth
* The **average latency can be misleading**.
* Percentiles describe positions in the distribution of a measured value:

  * `p50` → 50% are at or below it
  * `p95` → 95% are at or below it
  * `p99` → 99% are at or below it
* To calculate a percentile conceptually:

  * collect measurements
  * sort them
  * find the percentile position
  * interpolate if required by the calculation method
* `p50` describes the typical experience.
* `p95` and `p99` reveal the slower tail.
* The lesson recommends alerting on **p99 rather than the mean**.
* **Traces** answer: `"Where did the time go?"`
* A trace breaks a request into spans so you can identify where latency is being spent.
* **Liveness** asks whether the process should be restarted.
* **Readiness** asks whether the process should receive traffic.
* Readiness should reflect the dependencies actually required for the instance to serve its intended traffic.
* A readiness check should be cheap because it may be called frequently.
* A cheap dependency check can use a minimal connectivity check, existing connection-pool state, or periodically refreshed background state.
* A background readiness state can make `/ready` itself only an in-memory lookup.
* Cached/background checks introduce a small possible detection delay.
* Not every external dependency needs to determine overall readiness.
* Avoid calling third-party APIs directly from a frequently polled readiness endpoint.
* **Alert on symptoms, not causes.**
* An error-rate alert is generally more directly connected to user impact than a raw CPU threshold.
* Bad alerts create alert fatigue and eventually cause important alerts to be ignored.
* Never log secrets.
* Redaction should:

  * be case-insensitive
  * work recursively
  * replace sensitive values with `"[redacted]"`
  * preserve everything else
  * avoid mutating the original object

---

# Minimal Self-Test

1. What are the three questions answered by logs, metrics, and traces?

2. Why is a request ID more useful than only a timestamp?

3. Why can an average latency of `120 ms` still coexist with users experiencing `8-second` requests?

4. You have these sorted latencies:

```text
10, 20, 30, 40, 50, 60, 70, 80, 90, 100
```

Where is the p50 located?

5. What does `p95 = 200 ms` mean?

6. What does `p99 = 2 seconds` mean?

7. Why can p99 be more useful than the average for understanding user experience?

8. What is the difference between `p50`, `p95`, and `p99`?

9. What is the difference between liveness and readiness?

10. Why should a service be allowed to be **alive but not ready**?

11. Why should `/ready` not perform several expensive database queries?

12. What are three ways you could make dependency checking cheap?

13. Why is calling a payment API directly from `/ready` usually a bad idea?

14. Should every dependency automatically determine readiness? Why or why not?

15. Why should `redact()` not modify the original object?

16. Why must redaction work recursively?

---

# What to Learn Next

A logical progression from this topic is:

```text
Observability
     ↓
Structured logging
     ↓
Metrics & percentiles
     ↓
Distributed tracing
     ↓
OpenTelemetry
     ↓
SLIs / SLOs
     ↓
Alert design
     ↓
Production debugging
```

The original lesson points to:

* **Google SRE Book — Monitoring Distributed Systems**
* **OpenTelemetry — What is observability?**
