HTTP API vs REST API in API Gateway is mostly a decision about **minimalism vs control**: HTTP API gives you the common path at lower cost, while REST API gives you a larger control surface for governance and advanced gateway behavior. The key is not “which is newer,” but “which constraints does your system actually have?” [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)

## What are they?

AWS API Gateway offers two RESTful API products: REST APIs and HTTP APIs. AWS says REST APIs support more features, while HTTP APIs are intentionally minimal so they can be offered at a lower price. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)

### One-sentence summary

Use HTTP API when you want the lean default; use REST API when you know you need advanced API management features. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)

## Intuition

Think of HTTP API as a lightweight request router with the most common capabilities built in, especially for Lambda and HTTP backends. Think of REST API as the more configurable gateway product, where you pay extra complexity and cost to gain advanced controls like API keys, per-client throttling, request validation, WAF integration, and private endpoints. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)

### Visual model

```text
HTTP API
Client
  ↓
Simple route match
  ↓
Lambda / HTTP backend
  ↓
Response

REST API
Client
  ↓
Route + validation + API keys + usage plans + WAF + private endpoint options
  ↓
Lambda / HTTP / AWS service backend
  ↓
Response
```

This is not a literal pipeline diagram for every request, but it is the right mental model for choosing between them. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)

## Why two products exist

AWS positions HTTP API as the lower-cost, minimal-feature option for common API use cases, especially where teams do not need the heavier API management features of REST API. REST API remains relevant because many production systems need those additional controls, not because HTTP API is incomplete in general. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)

## Feature differences

The most useful comparison is not every checkbox, but the few features that change architecture decisions. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)

| Capability | HTTP API | REST API |
|---|---|---|
| Lower-cost design | Yes  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) | No  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) |
| Custom domains | Yes  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) | Yes  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) |
| JWT authorizers | Yes  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) | No built-in JWT authorizer in the same way  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) |
| API keys | No  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) | Yes  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) |
| Per-client rate limiting / throttling | No  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) | Yes  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) |
| Request validation | No  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) | Yes  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) |
| AWS WAF integration | No  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) | Yes  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) |
| Private API endpoints | No  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) | Yes  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) |
| AWS X-Ray tracing | No  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) | Yes  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) |
| Built-in CORS support | Yes  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html) | Available, but HTTP API is positioned as simpler here  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html) |
| Automatic deployments | Yes  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html) | Not positioned the same way  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html) |

### What matters most

The real separators are these:
- Need API keys or usage plans → choose REST API [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)
- Need per-client throttling or quotas → choose REST API [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)
- Need request validation at the gateway → choose REST API [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)
- Need WAF or private endpoints → choose REST API [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)
- Need simple Lambda/HTTP routes with lower price and built-in JWT/OIDC support → choose HTTP API [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)

## Hands-on mental model

If you are building a small Lambda-backed service, HTTP API usually feels simpler because the model is close to “define route, attach integration, test invoke URL”. If you are building an externally managed platform API with client-specific controls, quotas, stricter request governance, or network isolation, REST API becomes the more natural fit because those features are explicitly supported there. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)

### Route flavor difference

HTTP API uses a cleaner route-oriented model like:
```text
GET /users/{id}
POST /orders
ANY /{proxy+}
```

AWS documents HTTP APIs in terms of routes made of an HTTP method and a resource path. REST API historically feels more “gateway-config-heavy,” especially once you start using API keys, validation, and other policy layers. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-routes.html)

## Decision tree

```text
Start
  ↓
Do you need API keys, usage plans, or per-client throttling?
  ├─ Yes → REST API
  └─ No
       ↓
Do you need request validation, AWS WAF, or private API endpoints?
  ├─ Yes → REST API
  └─ No
       ↓
Do you mostly need Lambda/HTTP integrations with lower cost and common auth support?
  ├─ Yes → HTTP API
  └─ No → Re-check whether advanced governance needs push you to REST API
```

This is almost exactly how AWS frames the choice: REST API if you need the advanced management features, HTTP API if you do not. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)

## Where each fits

| Use case | Better fit | Why |
|---|---|---|
| Simple serverless backend | HTTP API | Lower cost, simpler model  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) |
| Public CRUD API with Lambda | HTTP API | Common features are enough  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html) |
| Internal API behind governance controls | REST API | More management features  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) |
| Partner API with API keys and quotas | REST API | API keys and per-client controls are supported  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) |
| API needing WAF or private exposure | REST API | Those features are explicitly listed there  [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) |

## Gotchas

A common misconception is that HTTP API is just a better REST API; AWS does not position it that way. HTTP API is a deliberate trade-off: you gain simplicity and lower price by giving up features that some systems genuinely need. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)

Another common mistake is choosing REST API too early “just in case,” then carrying extra complexity without a real requirement. The opposite mistake is choosing HTTP API and later discovering you need API keys, request validation, or private endpoints, which forces a rethink. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)

## Interview perspective

A strong answer is: “HTTP API is the lower-cost, minimal-feature API Gateway option for common use cases, while REST API is the richer option for advanced API management features such as API keys, per-client throttling, request validation, WAF, and private endpoints”. A stronger answer adds that HTTP API also supports built-in JWT/OIDC style authorization and is often the default choice for simple Lambda-backed APIs. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)

## Key takeaways

- Both are RESTful API products in API Gateway. [aws.amazon](https://aws.amazon.com/api-gateway/faqs/)
- HTTP API is designed to be cheaper and more minimal. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)
- REST API exists for advanced API management and governance features. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)
- The deciding factors are usually API keys, throttling, validation, WAF, and private endpoint needs. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html)
- For many simple modern serverless APIs, HTTP API is the default starting point. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)

## Minimal self-test

- Explain in one sentence why HTTP API and REST API both still exist.
- Name three features that immediately force the choice toward REST API.
- Explain why JWT support can make HTTP API attractive.
- Compare “simple Lambda CRUD API” vs “partner API with quotas” and choose the better fit for each.
- Draw your own decision tree from requirements to API type.

## What to learn next

The most natural next topics are Lambda proxy integration, JWT authorizers for HTTP API, usage plans and API keys in REST API, and custom domains plus stage mappings across both models. [docs.aws.amazon](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html)