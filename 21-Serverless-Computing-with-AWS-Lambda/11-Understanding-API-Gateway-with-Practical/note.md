# AWS API Gateway by Hands-On Practice

## What is it?

Amazon API Gateway is the managed front door for HTTP, REST, and WebSocket APIs, sitting between clients and backend integrations such as Lambda or HTTP services. In practical terms, a working API needs at least a route, an integration, a stage, and a deployment before it can be invoked.

## One-Sentence Summary

API Gateway is a managed request router that matches an incoming HTTP request, applies gateway rules, forwards it to a backend, and returns the backend response to the client.

## Intuition

The simplest mental model is to treat API Gateway like a programmable front desk for backend services. It receives the request, decides which route matches, applies authorization or throttling if configured, forwards the request to the chosen integration, and sends the response back.

## Why engineers care

API Gateway becomes valuable when multiple clients need one stable HTTP entry point while backend implementations continue to change. It is also a natural fit for serverless systems because AWS explicitly provides tutorials built around Lambda-backed REST APIs and CRUD HTTP APIs.

## What to build first

AWS recommends starting with a REST API using a Lambda proxy integration as an entry path into API Gateway. For HTTP APIs, AWS also provides a fast setup path where creating the API can automatically create a default catch-all route, integration, and default stage so the API is immediately invokable.

## High-Level Workflow

```text
Client request
   ↓
Stage selection
   ↓
Route matching (method + path)
   ↓
Gateway policies (auth, throttling, validation if configured)
   ↓
Integration (Lambda, HTTP backend, AWS service)
   ↓
Backend response
   ↓
API Gateway response to client
```

API Gateway first determines the stage, then chooses the most specific route match, and returns `{"message":"Not Found"}` if no route matches and no `$default` stage or route handles the request.

## Core building blocks

| Component        | What it means                                            |
| ---------------- | -------------------------------------------------------- |
| API              | The container for routes and integrations.               |
| Route            | A method plus a resource path such as `GET /users/{id}`. |
| Integration      | The backend target such as Lambda or an HTTP endpoint.   |
| Stage            | A deployed environment and invoke surface for the API.   |
| Deployment       | The published configuration used by a stage.             |
| `$default` route | A catch-all route when no explicit route matches.        |

## Hands-on path

A practical learning sequence is:

1. Create a Lambda function that returns a small JSON response.
2. Create an HTTP API or REST API in API Gateway.
3. Add a route such as `GET /hello`.
4. Connect that route to the Lambda integration.
5. Deploy to a stage, or use the default stage when auto-deploy is enabled.
6. Call the invoke URL with a browser or `curl`.
7. Add a dynamic route such as `GET /users/{id}` and observe how the path value appears in the backend request context.

## Dynamic values in paths

Dynamic path segments are one of the first features that make an API feel real instead of toy-like. API Gateway supports named path variables such as `{id}` and greedy variables such as `{proxy+}`.

| Type                 | Example           | Meaning                                                                           |
| -------------------- | ----------------- | --------------------------------------------------------------------------------- |
| Named path variable  | `GET /users/{id}` | Matches one path segment and binds it to a name.                                  |
| Greedy path variable | `ANY /{proxy+}`   | Matches all remaining child path segments and must appear at the end of the path. |

### Named path parameter

A route like `GET /users/{id}` matches requests such as `/users/42`, and API Gateway exposes the bound value to the integration as a path variable. This is the standard way to model resource identity in the URL path.

```text
Request: GET /users/42
Route:   GET /users/{id}
Result:  id = "42"
```

### Greedy path variable

A greedy variable such as `{proxy+}` captures all remaining segments after its position and is commonly used to forward many application routes to a single backend. AWS requires the greedy variable to be the final component of the path.

```text
ANY /{proxy+}

Matches:
  /users/42
  /orders/abc/items
  /products/a/b/c
```

This pattern is especially useful when one backend framework, such as Express, wants to do the final route matching itself.

## Route selection and specificity

HTTP API route selection is based on the most specific match. AWS documents the priority order as: full route and method match first, then a route with a greedy path variable, then the `$default` route.

```text
1. GET /users/me
2. GET /users/{id}
3. GET /{proxy+}
4. $default
```

A request to `GET /users/me` is expected to match the exact route before broader patterns are considered.

## Path parameters vs query parameters

Path parameters and query parameters often look similar but play different roles. Path parameters are part of the route shape, while query parameters refine or filter the operation after the route is already selected.

```text
/users/42        -> path parameter
/users?id=42     -> query parameter
```

## Trailing slash behavior

API Gateway is strict about route matching, so `/users/42` and `/users/42/` can behave like different paths in practice. When no stage or route matches the request exactly, API Gateway can return `{"message":"Not Found"}`.

This matters because a route defined as `/users/{id}` should be assumed to match `/users/42`, but not necessarily `/users/42/` unless the routing setup or backend normalization makes that work. A clean engineering habit is to treat the trailing slash as part of the route contract rather than as harmless formatting.

### Practical ways to deal with trailing slashes

- Keep route definitions consistent and document whether clients should call canonical paths with or without the trailing slash.
- Use a broader route such as `$default` or `/{proxy+}` when the backend is expected to normalize path variants itself.
- Test both forms explicitly during API verification, especially when mixing static routes, dynamic routes, and custom domain stage mappings.

## Practical lab: `GET /users/{id}`

Use this mini-lab to internalize route matching.

1. Create a Lambda function that returns the incoming request context as JSON.
2. Create an HTTP API.
3. Add the route `GET /users/{id}`.
4. Attach the Lambda as the integration.
5. Deploy or use the auto-deployed default stage.
6. Invoke `/users/123` and inspect the path parameter in the request event visible to the function.
7. Invoke `/users/123/` and note whether the same route still matches in your exact configuration.

This lab teaches route matching faster than reading definitions because it forces observation of exact path behavior.

## Common misconceptions

- `ANY` does not mean “every possible path”; it means every HTTP method for the path pattern you defined.
- `{proxy+}` is not the same as `{id}` because the greedy form captures multiple segments, not one segment.
- A route that seems visually close, like `/users/42/`, should not be assumed equivalent to `/users/42` unless tested.
- If no route matches and no default path catches it, API Gateway returns `{"message":"Not Found"}` rather than trying to guess intent.

## Gotchas

- The greedy path variable must be the last component of the route path.
- A functional API still needs route, integration, stage, and deployment; missing one layer often looks like a routing problem even when it is a deployment problem.
- `$default` catches requests that do not explicitly match other routes, which can be helpful but can also hide route mistakes if overused.
- Stage selection happens before route selection, so a bad stage mapping can fail before route logic is even considered.

## Performance and engineering trade-offs

HTTP APIs are often the faster hands-on starting point because AWS offers a quick-create path that wires together integration, catch-all routing, and a default stage automatically. REST APIs remain useful when the learning goal includes older proxy integration patterns or more detailed API Gateway configuration models that AWS still teaches in its tutorials.

## Interview perspective

A strong practical answer is: API Gateway matches requests by method and path, forwards them to an integration, and supports named path variables like `{id}` plus greedy variables like `{proxy+}` for broader routing patterns. A stronger answer adds that exact path behavior matters, including trailing slash differences, stage selection, and the existence of `$default` routes and stages.

## Key takeaways

- API Gateway needs a route, integration, stage, and deployment to behave like a usable API.
- Routes are defined by method plus path, such as `GET /users/{id}`.
- `{id}` matches one path segment, while `{proxy+}` matches all remaining segments and must be last.
- API Gateway chooses the most specific route match before falling back to broader routes.
- Trailing slash handling should be tested explicitly because route matching is strict.

## Minimal self-test

- Explain the difference between `GET /users/{id}` and `ANY /{proxy+}`.
- Trace what API Gateway does before calling an integration.
- Predict whether `/users/42/` matches `/users/{id}` in your current setup, and explain how you would verify it.
- Explain why `$default` is useful and when it can hide mistakes.
- Draw the flow from client request to API Gateway route to integration to response.

## What to learn next

The best next topics are Lambda proxy integration, authorizers, request validation, custom domains and stage mappings, and the CRUD HTTP API tutorial with Lambda and DynamoDB that AWS recommends for hands-on practice
