## What is it?

Invoking Lambda through API Gateway means exposing a Lambda function behind an HTTP endpoint so that a browser, frontend, curl, or another service can call it over standard HTTP instead of calling Lambda APIs directly. In practice, API Gateway receives the request, selects the stage, selects the best-matching route, forwards the event to Lambda, and returns Lambda’s response back to the client. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)

### One-sentence summary

API Gateway turns a Lambda function into an HTTP API by handling external routing and forwarding requests into Lambda. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html)

## Why this exists

Lambda by itself is a compute service, not a public web server with routes like `/users/42` or `/orders/abc`. API Gateway fills that gap by providing HTTP-facing routing, integration, and API-level behavior so clients can use normal web semantics while the backend remains a Lambda function. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/api/API_Invoke.html)

## High-level workflow

```text
Client HTTP request
   ↓
API Gateway stage selection
   ↓
Route matching
   ↓
Integration to Lambda
   ↓
Lambda executes handler
   ↓
Response returned through API Gateway
   ↓
Client receives HTTP response
```

AWS documents that API Gateway first determines the stage, then selects the most specific route, and returns `{"message":"Not Found"}` if nothing suitable matches and no default handling exists. That routing model explains most of the behavior you observed during hands-on work. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)

## Basic setup

The simplest setup path is to create a Lambda function and then add an API Gateway trigger from the Lambda console, where AWS lets you create a new API or attach an existing one. A working API still needs a route, an integration, and a deployed stage before the invoke URL behaves like a usable endpoint. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started.html)

### Minimal handler

```js
exports.handler = async (event) => ({
  statusCode: 200,
  body: JSON.stringify({
    message: "Hello from Lambda",
    path: event.rawPath || event.path
  })
});
```

That shape works for a basic proxy-style Lambda response when API Gateway expects a normal buffered Lambda proxy result. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html)

## Routes and dynamic paths

A route in API Gateway is defined by an HTTP method and a path pattern such as `GET /users/{id}`. Dynamic path segments like `{id}` are what let one route handle many concrete URLs such as `/users/1`, `/users/42`, and `/users/abc`. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)

### Named path parameter

```text
Route:   GET /users/{id}
Request: GET /users/42
Binding: id = "42"
```

This is the normal way to represent a resource identity in the URL path. In Lambda, the path value is exposed through the request event for proxy-style integrations. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/response-transfer-mode-lambda.html)

### Greedy path variable

API Gateway also supports `{proxy+}`, which captures all remaining path segments and must appear at the end of the route pattern. This is useful when a backend framework like Express wants to do the final route matching itself. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)

```text
ANY /{proxy+}

Matches:
  /users/42
  /orders/a1/items
  /anything/else
```

## Default route

`$default` is the HTTP API catch-all route for requests that do not explicitly match any other route. When `$default` receives a request, API Gateway forwards the full request path to the integration, which makes it useful for proxy-style backends and “forward everything” setups. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)

### Important distinction

`$default` is a catch-all fallback, not a normal exact route. It only becomes relevant after API Gateway fails to find a more specific route. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)

## Route priority

This was one of the most important practical concepts: API Gateway chooses the most specific route match. AWS documents the order for HTTP APIs as: [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
1. Full route and method match
2. Route and method match with greedy path variable `{proxy+}`
3. `$default` route [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)

### Example

```text
Routes:
- GET /users/me
- GET /users/{id}
- ANY /{proxy+}
- $default
```

A request to `GET /users/me` matches the exact route first, not the `{id}` route and not the catch-all. A request to `/something/unknown` can fall through to `ANY /{proxy+}` or `$default`, depending on what exists. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)

## Trailing slash issue

One issue you noticed was that API Gateway did not tolerate a trailing slash the way you expected. That observation is important because API Gateway route matching is strict enough that `/users/42` and `/users/42/` should be treated as potentially different paths unless your routing strategy or backend normalization makes them equivalent. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)

### Practical interpretation

A route like `GET /users/{id}` should be assumed to match `/users/42`, but not automatically `/users/42/` unless tested in your exact setup. The safer engineering habit is to treat the trailing slash as part of the API contract rather than as harmless formatting. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)

### How to handle it

- Define canonical paths and keep clients consistent [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
- Use a broader backend-controlled catch-all like `{proxy+}` or `$default` if the backend will normalize paths [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
- Explicitly test both `/path` and `/path/` during verification [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)

## HTTP API vs REST API

You also explored the difference between HTTP API and REST API. AWS says REST APIs support more features, while HTTP APIs are designed with minimal features and lower cost. For hands-on Lambda-backed endpoints, HTTP API is often the easier starting point, while REST API becomes relevant when you need richer API Gateway features or newer response-streaming support documented for REST APIs. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/response-transfer-mode-lambda.html)

## Streaming issue you hit

This was another important real-world issue: a Lambda response could work when invoked directly, but fail with `Internal server error` when called through API Gateway. That happens because successful Lambda streaming and successful API Gateway streaming are not the same thing; API Gateway streaming has its own integration contract. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/response-streaming-lambda-configure.html)

### Why direct Lambda worked but API Gateway failed

AWS documents that API Gateway response streaming for Lambda requires:
- A Lambda proxy integration configured for response streaming [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/response-streaming-lambda-configure.html)
- Invocation through `InvokeWithResponseStream` rather than normal buffered invocation [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/response-transfer-mode-lambda.html)
- Response transfer mode set appropriately for streaming [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/response-streaming-lambda-configure.html)
- A special streamed output format from Lambda, including valid metadata JSON and an 8-null-byte delimiter within the first 16 KB of stream data [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/response-transfer-mode-lambda.html)

If Lambda streams correctly when called directly but API Gateway is still using normal proxy buffering assumptions, the gateway can surface the situation as an internal server error even though the function itself appears fine. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway-errors.html)

### Mental model for streaming

```text
Direct Lambda streaming success
≠
API Gateway streaming success
```

Direct invocation only proves the function can stream. API Gateway success requires the gateway integration itself to understand and relay that streamed format correctly. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/api/API_Invoke.html)

### Practical note to remember

A Lambda response may stream correctly when called directly, but still fail behind API Gateway if the gateway integration is not configured for streaming or if the Lambda output format does not match API Gateway’s required response-stream format. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway-errors.html)

## Common issues we faced

| Issue | What it really meant |
|---|---|
| Trigger added, but endpoint still not working | Route, stage, or deployment was incomplete even though Lambda existed  [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html) |
| `/users/{id}` worked, but `/users/{id}/` failed | Trailing slash changed the effective route path  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html) |
| A catch-all route swallowed traffic unexpectedly | Greedy `{proxy+}` has higher priority than `$default`  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html) |
| Unknown route gave `{"message":"Not Found"}` | No matching route or no suitable default stage/route existed  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html) |
| Lambda streamed directly, but API Gateway returned 500 | API Gateway streaming contract was not configured or formatted correctly  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/response-transfer-mode-lambda.html) |

## Gotchas

- API Gateway selects the stage before it selects the route, so a stage problem can look like a route problem [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
- `{proxy+}` must be the final path component [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
- `$default` is a fallback route, not a first-choice route [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
- Exact route matches beat greedy routes, and greedy routes beat `$default` [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
- Response streaming through API Gateway is not automatic just because direct Lambda streaming works [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/response-streaming-lambda-configure.html)

## Interview view

A strong answer is: API Gateway invokes Lambda by exposing it through an HTTP endpoint, then matching requests by stage and route before forwarding them as Lambda events. A stronger answer includes the real issues: exact routes outrank greedy routes, `$default` is the final catch-all, trailing slashes can break route matching, and Lambda streaming success does not guarantee API Gateway streaming success unless the streaming integration is configured correctly. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html)

## Key takeaways

- API Gateway is the HTTP front door for Lambda-backed APIs [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started.html)
- A working setup needs trigger, route, integration, stage, and deployment [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/getting-started.html)
- Route matching is priority-based: exact match, then `{proxy+}`, then `$default` [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
- Dynamic values like `/users/{id}` are handled through path parameters [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
- Trailing slash behavior must be tested explicitly [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
- Streaming through API Gateway is a separate integration contract from direct Lambda streaming [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/response-transfer-mode-lambda.html)

## Minimal self-test

- Explain why adding an API Gateway trigger is not enough by itself to guarantee a working endpoint
- Predict which route wins between `/users/me`, `/users/{id}`, `/{proxy+}`, and `$default`
- Explain why `/users/42/` might fail even if `/users/42` works
- Explain why direct Lambda streaming success does not prove API Gateway streaming is configured correctly
- Draw the end-to-end request path from client to API Gateway to Lambda and back

## What to learn next

The best next topics are Lambda proxy integration event shape, authorizers, custom domains and stage mappings, REST API vs HTTP API trade-offs, and the detailed configuration path for response streaming in API Gateway with Lambda. [docs.aws.amazon](https://docs.aws.amazon.com/lambda/latest/dg/services-apigateway.html)