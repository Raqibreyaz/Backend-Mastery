`$default` is the catch-all route in API Gateway HTTP APIs: it receives requests that do not explicitly match any other route. If you define only a `$default` route, API Gateway forwards the full incoming path to the integration, which makes it useful for proxy-style backends and “forward everything” setups. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
## What it means
Think of `$default` as the final fallback after API Gateway tries more specific matches. Route selection works like this: [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
1. Exact route and method match.
2. Greedy path route like `{proxy+}`.
3. `$default`. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)

If nothing matches and there is no suitable default handling, API Gateway returns `{"message":"Not Found"}`. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
## Why it matters
`$default` is useful when you want one backend to handle many paths without defining every route up front. It is especially handy for proxy-style integrations where the backend decides what to do with paths like `/store/checkout` or `/users/42`. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
## Important detail
`$default` is for HTTP APIs, not REST APIs. For REST APIs, the usual catch-all pattern is `{proxy+}` instead. [stackoverflow](https://stackoverflow.com/questions/65976945/set-default-route-in-api-gateway-for-rest-apis)
## Quick comparison
| Pattern | API type | Behavior |
|---|---|---|
| `$default` | HTTP API | Catch-all for unmatched requests  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html) |
| `{proxy+}` | REST API / HTTP API routes | Greedy path match for remaining path segments  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html) |
## Practical example
If you create only a `$default` route and send a request to `/store/checkout`, API Gateway forwards the full path to the integration. That makes it a good fit when the backend framework, like Express, should own the routing logic. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
## Gotcha
A common mistake is expecting `$default` to behave like a normal named route with a method and exact path. It does not; it acts as the fallback when no other route matches. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
## Key takeaway
Use `$default` when you want a catch-all in an HTTP API, and use `{proxy+}` when you need a greedy path route pattern in the routing layer. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)