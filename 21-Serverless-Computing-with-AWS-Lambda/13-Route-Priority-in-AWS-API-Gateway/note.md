API Gateway route priority is mostly about **specificity**: exact route matches win first, then greedy path matches like `{proxy+}`, and finally `$default` as the catch-all. For HTTP APIs, AWS documents the route order as full route-and-method match, then greedy path variable match, then `$default`. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
## Route order
```text
1. Exact route + method
2. Greedy route like /users/{proxy+} or ANY /{proxy+}
3. $default route
```

That means a request to `GET /users/me` should match `GET /users/me` before `GET /users/{id}` or `ANY /{proxy+}`. A request that does not match any explicit route can fall through to `$default` if it exists. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
## Why this matters
Route priority is what lets you mix static and dynamic routes without them clashing all the time. For example, you can define: [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
- `GET /users/me` for the current user.
- `GET /users/{id}` for a user by ID.
- `ANY /{proxy+}` for a catch-all backend. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)

A more specific route should win over a broader one, otherwise common paths like `/users/me` would be swallowed by the dynamic `{id}` route. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
## Mental model
Think of API Gateway as checking routes from **most specific to least specific**. Exact path wins, then a wildcard that still preserves some structure, then the fallback route. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
## Important gotcha
If a request does not match a route, API Gateway returns `{"message":"Not Found"}` rather than guessing your intent. Also, the greedy path variable must be at the end of the resource path. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)
## Example
```text
Routes:
- GET /users/me
- GET /users/{id}
- ANY /{proxy+}
- $default

Request: GET /users/me

Winner: GET /users/me
```

```text
Request: GET /users/42

Winner: GET /users/{id}
```

```text
Request: GET /anything/else/here

Winner: ANY /{proxy+} if present, otherwise $default
```
## Key takeaway
When designing routes, put your exact business-specific paths first conceptually, use `{id}` for single dynamic values, use `{proxy+}` for broad passthrough routing, and keep `$default` as the fallback. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)