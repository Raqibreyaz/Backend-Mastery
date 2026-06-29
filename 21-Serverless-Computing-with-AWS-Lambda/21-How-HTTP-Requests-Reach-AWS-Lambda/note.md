HTTP into Lambda looks simple from outside, but under the hood it is really AWS taking your request, turning it into an event, finding or creating an execution environment, running your code there, and then converting your function’s output back into an HTTP response. The big mental shift is this: **Lambda is not one always-running server; it is AWS-managed short-lived workers that may be reused**. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html)

## What Lambda really is

When people say “AWS manages the server,” it does **not** mean you have one invisible EC2 machine running your app forever. What AWS actually manages is a fleet of isolated execution environments, and each environment is the place where one invocation runs. [aws.amazon](https://aws.amazon.com/blogs/compute/operating-lambda-performance-optimization-part-1/)

AWS’s operator docs describe execution environments as running on hardware-virtualized MicroVMs dedicated to a single AWS account. So the simplest honest picture is: [docs.aws.amazon](https://docs.aws.amazon.com/ko_kr/lambda/latest/operatorguide/execution-environment.html)

```text
Request comes in
  ↓
AWS finds or creates one isolated worker
  ↓
Your function runs there
  ↓
Worker may be reused later or thrown away
```

## One-sentence summary

Lambda is AWS-managed horizontal scaling of isolated workers, not one hidden server. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html)

## HTTP request paths

There are two main ways an HTTP request reaches Lambda:
- **API Gateway**
- **Function URL** [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/furls-http-invoke-decision.html)

### Function URL path

This is the simpler path: [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html)

```text
Client
  ↓
Function URL
  ↓
Lambda service
  ↓
Execution environment
  ↓
Handler runs
  ↓
Response mapped back to HTTP
```

AWS says Function URLs map the incoming HTTP request into a Lambda event object, and then map your Lambda response back into an HTTP response using the same payload format family as API Gateway payload format version 2.0. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html)

### API Gateway path

This is the richer path: [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html)

```text
Client
  ↓
API Gateway
  ↓
Route / auth / throttling / request handling
  ↓
Lambda integration
  ↓
Execution environment
  ↓
Handler runs
  ↓
API Gateway builds final HTTP response
```

API Gateway is what you use when you need multiple routes, auth, usage control, or more advanced API behavior. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/furls-http-invoke-decision.html)

## How HTTP becomes an event

Your function is not reading raw TCP packets or directly accepting sockets. AWS terminates the HTTP request at its own front door, then builds a structured event object and passes that into your handler. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/furls-http-invoke-decision.html)

So this:

```http
GET /users/42?active=true
Host: api.example.com
Authorization: Bearer abc
```

can become conceptually something like:

```js
{
  requestContext: { ... },
  rawPath: "/users/42",
  queryStringParameters: { active: "true" },
  headers: { authorization: "Bearer abc", host: "api.example.com" },
  pathParameters: { id: "42" }
}
```

The exact shape depends on whether the request came through Function URL or API Gateway and which payload version is used, but the core idea is the same: **HTTP is translated into a JSON-like event**. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html)

## How the response becomes HTTP again

Your handler usually returns an object like:

```js
{
  statusCode: 200,
  headers: { "content-type": "application/json" },
  body: "{\"ok\":true}"
}
```

AWS then converts that result into the actual HTTP response the client receives. So your function is not “writing to a socket”; it is returning structured data that AWS maps to status line, headers, and body. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html)

This is also why bad formatting can break the API even if your business logic is correct. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html)

## What the execution environment actually is

The execution environment is the sandbox where your Lambda code runs. It includes: [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html)
- Runtime, like Node.js or Python [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/operatorguide/execution-environments.html?shortFooter=true)
- Your deployed code [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/operatorguide/execution-environments.html?shortFooter=true)
- Memory you configured [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/operatorguide/execution-environments.html?shortFooter=true)
- Environment variables [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/configuration-envvars.html)
- Temporary local storage like `/tmp` [docs.aws.amazon](https://docs.aws.amazon.com/ko_kr/lambda/latest/operatorguide/execution-environment.html)

AWS creates it when needed, runs your init code, then invokes your handler. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html)

### Lifecycle

```text
No environment yet
  ↓
AWS creates one
  ↓
Loads runtime + code
  ↓
Runs init code outside handler
  ↓
Runs handler
  ↓
Keeps environment around for possible reuse
```

This is the exact reason cold starts exist. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html)

## Cold start vs warm start

A **cold start** means AWS had to create a fresh environment before your request could run. That includes: [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/operatorguide/execution-environments.html?shortFooter=true)
- Creating the environment
- Loading the runtime
- Downloading/loading your code
- Running init code outside handler [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/operatorguide/execution-environments.html?shortFooter=true)

A **warm start** means AWS reused an already-initialized environment. In that case, the runtime and code are already there, so the request starts faster. [aws.amazon](https://aws.amazon.com/blogs/compute/operating-lambda-performance-optimization-part-1/)

### Easy analogy

Cold start = opening the shop for the day.  
Warm start = the shop is already open.

## Does the server run 24×7?

Not in the normal sense. AWS may keep some environments warm for reuse, but there is no guarantee that one environment stays alive forever or even for long. Lambda can effectively scale to zero, meaning there may be **no active environment at all** until the next request arrives. [dev](https://dev.to/jamesli/auto-scaling-in-aws-lambda-concurrency-throttling-scale-to-zero-km8)

So:
- Your **function definition** exists all the time.
- Your **execution environments** may exist only when needed or while AWS chooses to keep them warm. [dev](https://dev.to/jamesli/auto-scaling-in-aws-lambda-concurrency-throttling-scale-to-zero-km8)

## How scaling actually works

This is the part most people misunderstand.

One Lambda execution environment handles **one request at a time**. So if six requests come in **at the same time**, Lambda may need six execution environments. [aws.amazon](https://aws.amazon.com/blogs/compute/operating-lambda-performance-optimization-part-1/)

AWS’s own performance post gives exactly this kind of example: if API Gateway invokes a function six times simultaneously, Lambda creates six execution environments. [aws.amazon](https://aws.amazon.com/blogs/compute/operating-lambda-performance-optimization-part-1/)

### Simple example

```text
Request 1 starts → Env A
Request 2 starts → Env B
Request 3 starts → Env C
```

That is horizontal scaling.

If requests come one after another, and the previous request has already finished, AWS may reuse the same environment. [aws.amazon](https://aws.amazon.com/blogs/compute/operating-lambda-performance-optimization-part-1/)

### Sequential vs concurrent

```text
Sequential:
Req1 → Env A
Req2 → Env A again
Req3 → Env A again

Concurrent:
Req1 → Env A
Req2 → Env B
Req3 → Env C
```

That one picture explains almost everything. [aws.amazon](https://aws.amazon.com/blogs/compute/operating-lambda-performance-optimization-part-1/)

## Your important DB connection insight

This is where things get real.

If you create a DB connection during init, then a **warm environment** can reuse it for later requests handled by that same environment. That saves time and avoids reconnecting on every single invocation. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)

But if concurrency increases, AWS creates more environments, and each environment may create **its own** DB connection. So init-time connection reuse helps, but only **inside one environment**, not globally. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html)

### Example

Suppose:
- One Lambda env creates one PostgreSQL connection during init.
- Traffic is low, requests are sequential.

Then maybe one warm environment serves many requests using the same connection. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)

Now traffic spikes:
- 100 concurrent requests come in.
- Lambda may create ~100 environments.
- If each environment opens one DB connection, you now have ~100 DB connections. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html)

That is why Lambda can overwhelm databases much faster than people expect. [hidekazu-konishi](https://hidekazu-konishi.com/entry/aws_lambda_concurrency_and_scaling_guide.html)

## Why this happens

Because Lambda scales much faster than many databases can handle connections. AWS best practices explicitly recommend taking advantage of execution environment reuse, but also note that idle connections can be purged and reused connections can fail if they became stale. [hidekazu-konishi](https://hidekazu-konishi.com/entry/aws_lambda_concurrency_and_scaling_guide.html)

So the truth is:
- Reuse helps.
- Reuse is not guaranteed.
- Concurrency multiplies environments.
- More environments can mean more DB connections. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)

## Raw mental model

Here is the most useful raw model:

```text
Lambda function
  ≠ one server
  = many possible isolated workers over time

One worker
  = one execution environment
  = one request at a time

More concurrency
  = more workers

More workers
  = more init phases
  = more possible DB connections
  = more cold starts
```

That one model connects almost everything you learned.

## API Gateway vs Function URL

| Thing | Function URL | API Gateway |
|---|---|---|
| Setup | Simple  [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/furls-http-invoke-decision.html) | More setup  [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/furls-http-invoke-decision.html) |
| Features | Minimal  [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/furls-http-invoke-decision.html) | Routing, auth, throttling, traffic controls  [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/furls-http-invoke-decision.html) |
| Request mapping | Direct Lambda-style mapping  [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html) | API layer can shape request/response  [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html) |
| Best for | Simple endpoints, webhooks  [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/furls-http-invoke-decision.html) | Real APIs with multiple routes and controls  [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/furls-http-invoke-decision.html) |

## Example: what really happens for `/users/42`

### With API Gateway

```text
Browser sends GET /users/42
  ↓
API Gateway receives it
  ↓
Route matches GET /users/{id}
  ↓
API Gateway builds event with pathParameters.id = "42"
  ↓
Lambda gets invoked
  ↓
AWS finds warm env or creates new env
  ↓
Handler runs
  ↓
Returns { statusCode, body }
  ↓
API Gateway sends HTTP response
```

### With Function URL

```text
Browser sends GET /users/42
  ↓
Function URL endpoint receives it
  ↓
Lambda service builds event
  ↓
AWS finds warm env or creates new env
  ↓
Handler runs
  ↓
Returns { statusCode, body }
  ↓
Lambda service sends HTTP response
```

## What makes this system beautiful

The beauty is that AWS gives you:
- scale-to-zero when idle [dev](https://dev.to/jamesli/auto-scaling-in-aws-lambda-concurrency-throttling-scale-to-zero-km8)
- horizontal scaling when load increases [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html)
- reuse when possible for better latency [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html)

And the cost is:
- cold starts [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html)
- less control over infrastructure lifetime [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html)
- dangerous DB connection explosion under concurrency if you are careless [hidekazu-konishi](https://hidekazu-konishi.com/entry/aws_lambda_concurrency_and_scaling_guide.html)

## Common misconceptions

- **“Lambda is one hidden server.”** No, it is a fleet of isolated environments. [docs.aws.amazon](https://docs.aws.amazon.com/ko_kr/lambda/latest/operatorguide/execution-environment.html)
- **“Init connection means one DB connection total.”** No, it means one reusable connection per environment, potentially many total under concurrency. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html)
- **“Warm means always alive.”** No, AWS may discard the environment anytime. [tmmr](https://tmmr.uk/post/lambda/lambda-execution-environment/)
- **“HTTP directly hits my code.”** No, AWS first converts HTTP into an event and later converts your result back into HTTP. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html)

## Key takeaways

- Lambda is not one always-on server; it is AWS-managed isolated execution environments. [docs.aws.amazon](https://docs.aws.amazon.com/ko_kr/lambda/latest/operatorguide/execution-environment.html)
- HTTP reaches Lambda through Function URLs or API Gateway. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/furls-http-invoke-decision.html)
- AWS converts HTTP requests into event objects and converts handler results back into HTTP responses. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html)
- One execution environment handles one request at a time. [aws.amazon](https://aws.amazon.com/blogs/compute/operating-lambda-performance-optimization-part-1/)
- Concurrent requests can create multiple environments, often close to the number of in-flight requests. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-concurrency.html)
- Init-time DB reuse works only inside one warm environment, not across all concurrent environments. [hidekazu-konishi](https://hidekazu-konishi.com/entry/aws_lambda_concurrency_and_scaling_guide.html)
- Cold starts happen when AWS must create new environments; warm starts happen when AWS reuses existing ones. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/operatorguide/execution-environments.html?shortFooter=true)

## Minimal self-test

- Explain why Lambda is not a single hidden server.
- Trace a request from browser to Lambda through API Gateway.
- Explain why six concurrent requests can mean six execution environments.
- Explain why one DB connection in init can still become many DB connections under traffic.
- Explain the difference between cold start and warm start without using textbook words.

## What to learn next

The best next topics are:
- RDS Proxy and how it fixes Lambda DB connection storms [hidekazu-konishi](https://hidekazu-konishi.com/entry/aws_lambda_concurrency_and_scaling_guide.html)
- Provisioned concurrency and how AWS keeps environments pre-initialized [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/lambda-runtime-environment.html)
- API Gateway event format vs Function URL event format [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/urls-invocation.html)
- Lambda response streaming and why direct Lambda vs API Gateway behavior can differ [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/response-transfer-mode-lambda.html)