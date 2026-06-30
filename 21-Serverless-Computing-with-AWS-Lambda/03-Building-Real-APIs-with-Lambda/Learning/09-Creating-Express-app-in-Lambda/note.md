Running an Express app on AWS Lambda with `serverless-http` is basically an **adapter pattern**: you keep writing Express routes and middleware, and `serverless-http` translates Lambda events into something Express can handle, then translates the response back to Lambda/API Gateway. This works well for getting an existing API onto Lambda quickly, but you still need to think in serverless terms because Lambda is not a long-running Node server with open ports, sticky memory, or reliable in-process state. [atlassian](https://www.atlassian.com/blog/bitbucket/deploy-an-express-js-app-to-aws-lambda-using-the-serverless-framework)

## What is it?

An Express app normally expects an HTTP server, open sockets, and a process that stays up waiting for requests, but Lambda invokes your code per request and gives you an event object instead of a listening socket. `serverless-http` wraps your Express app so you can export a Lambda handler like `module.exports.handler = serverless(app)`, avoiding `app.listen()` and letting AWS invoke your app through API Gateway routing such as `ANY /` and `ANY /{proxy+}`. [aldrinjenson](https://www.aldrinjenson.com/posts/serverless-express-api/)

### One-sentence summary

`serverless-http` lets Express keep its routing and middleware model while adapting it to Lambda’s event-driven execution model. [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/)

## Intuition

The right mental model is: Express is no longer the **server**; it becomes request-processing logic embedded inside a Lambda function. API Gateway receives the HTTP request, Lambda gets invoked with an event, `serverless-http` converts that event into Node/Express-style request-response objects, your middleware chain runs, and the adapter returns the final result back through API Gateway. [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs)

### High-level workflow

```text
Client HTTP request
   ↓
API Gateway route
   ↓
Lambda invocation with event/context
   ↓
serverless-http adapter
   ↓
Express middleware + routes
   ↓
Express response
   ↓
serverless-http converts response
   ↓
API Gateway sends HTTP response to client
```

This is why you can preserve most of your Express code while changing the runtime environment underneath it. [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/)

## Why this exists

This approach exists because many teams already have Express apps and want to move to Lambda without rewriting every route into separate handler functions on day one. It is useful as a migration bridge: you get AWS-managed scaling and pay-per-request behavior while keeping familiar Express middleware, routing, and controller organization. [serverless](https://www.serverless.com/examples/aws-node-express-api)

### What problem it solves

Without an adapter, Express expects a normal Node HTTP server and does not directly understand Lambda events. `serverless-http` solves that impedance mismatch, but it does not make Lambda behave like a traditional VM or container, so limitations around duration, request size, in-memory sessions, and websocket-style assumptions still matter. [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs)

## Internals

At the code level, the minimal pattern is very small: create the Express app, register middleware and routes as usual, do not call `app.listen()`, and export a Lambda handler by wrapping the app with `serverless-http`. The package explicitly describes itself as wrapping your API for serverless use with “no HTTP server, no ports or sockets,” which is the key conceptual shift. [atlassian](https://www.atlassian.com/blog/bitbucket/deploy-an-express-js-app-to-aws-lambda-using-the-serverless-framework)

### Minimal example

```js
const express = require('express');
const serverless = require('serverless-http');

const app = express();

app.use(express.json());

app.get('/api/info', (req, res) => {
  res.json({ app: 'demo', ok: true });
});

module.exports.handler = serverless(app);
```

That pattern matches the package usage and common deployment examples for Express on Lambda. [atlassian](https://www.atlassian.com/blog/bitbucket/deploy-an-express-js-app-to-aws-lambda-using-the-serverless-framework)

### Routing setup

To make all Express routes reachable, the deployment layer usually maps API Gateway with a catch-all pattern such as:
- `ANY /`
- `ANY /{proxy+}` [aldrinjenson](https://www.aldrinjenson.com/posts/serverless-express-api/)

That configuration matters because Express expects to do the internal route matching itself after API Gateway forwards the request into Lambda. [aldrinjenson](https://www.aldrinjenson.com/posts/serverless-express-api/)

## What changes from normal Express

The biggest misconception is thinking “my Express app is now running on Lambda” means Lambda is hosting a normal Node server; it is not. Your code may look familiar, but the execution model changes in important ways: [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/)

- No long-lived listening port; exporting a handler replaces `app.listen()`. [atlassian](https://www.atlassian.com/blog/bitbucket/deploy-an-express-js-app-to-aws-lambda-using-the-serverless-framework)
- In-memory state is unreliable because Lambda containers can be recreated or scaled out at any time. [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/)
- Session-based designs and websocket assumptions are poor fits unless you externalize state or change architecture. [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/)
- Provider limits still apply, including request/response constraints and execution duration constraints. [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/)

### Common migration adjustments

AWS’s migration guidance highlights several patterns that often need cleanup in Express apps before or during serverless migration: [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs)
- Remove or avoid local session assumptions because scaling makes local state unreliable. [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs)
- Prefer external storage for static assets rather than serving everything from the function package, with S3 explicitly recommended in the AWS write-up for static assets. [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs)
- Be careful with native binaries and packaging, because runtime compatibility matters in Lambda deployment environments. [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs)
- Watch timeout-sensitive dependencies like database connections, because API Gateway/Lambda timeouts can surface before your app logic naturally fails. [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs)

## Step-by-step example

Here is the usual shape of a simple project that uses Express plus `serverless-http` on Lambda: [aldrinjenson](https://www.aldrinjenson.com/posts/serverless-express-api/)

```text
project/
├── app.js
├── package.json
└── serverless.yml
```

**app.js**
```js
const express = require('express');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());

app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from Lambda + Express' });
});

module.exports.handler = serverless(app);
```

**serverless.yml**
```yml
service: express-lambda-demo

provider:
  name: aws
  runtime: nodejs18.x

functions:
  app:
    handler: app.handler
    events:
      - http:
          path: /
          method: ANY
      - http:
          path: /{proxy+}
          method: ANY
```

Install dependencies and deploy with the Serverless Framework, which provides a documented Express-on-AWS example and standard deploy flow using `serverless deploy`. [serverless](https://www.serverless.com/examples/aws-node-express-api)

## Where it is useful

This pattern is a good fit when you already have an Express API, want low operational overhead, and do not want to rewrite everything into many fine-grained Lambda handlers immediately. It is especially practical for small to medium APIs, internal tools, prototypes, migration phases, and teams that want to preserve Express middleware investments such as auth, validation, and error handling. [serverless](https://www.serverless.com/examples/aws-node-express-api)

### Where it becomes awkward

It is less ideal when you need deep control over per-route scaling boundaries, extremely latency-sensitive endpoints, heavy stateful behavior, or designs that depend on always-on processes. At that point, many teams either split hot routes into separate Lambda functions or move to architectures better aligned with serverless primitives. [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/)

## Gotchas

The most common gotchas come from forgetting that serverless is a different runtime, not just a different hosting destination. [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/)

- **Cold starts:** the first invocation of a new container pays initialization cost, and AWS notes that code outside the handler runs on first invocation per container or when scaling creates more containers. [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs)
- **Database connections:** connection setup can dominate latency, and timeout behavior must be tuned carefully for downstream systems. [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs)
- **Stateful middleware:** in-memory sessions and other local state patterns are unreliable in Lambda’s scaling model. [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/)
- **Static files and binaries:** serving assets and using native modules need more care than in a normal server process, and AWS explicitly recommends S3 for static assets in the migration article. [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs)
- **Assuming one Lambda per route:** with `serverless-http`, many routes often run inside one Lambda behind a proxy route, so you keep app-level organization rather than route-per-function decomposition. [atlassian](https://www.atlassian.com/blog/bitbucket/deploy-an-express-js-app-to-aws-lambda-using-the-serverless-framework)

## Comparison

| Approach | Best mental model | Strength | Weakness |
|---|---|---|---|
| Express + `serverless-http` | “Keep Express, adapt runtime”  [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/) | Fast migration, reuse middleware/routes  [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/) | Less native to serverless, shared function boundary  [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/) |
| Native Lambda handlers | “Each function is its own endpoint”  [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs) | Fine-grained control and more serverless-native design  [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs) | More rewrite effort and less Express reuse  [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs) |

The trade-off is mostly between migration speed and architectural purity: `serverless-http` minimizes rewrite cost, while native handlers maximize alignment with Lambda’s model. [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/)

## Interview view

A good interview answer is: “`serverless-http` is an adapter that lets Express middleware and routes run inside Lambda by converting API Gateway/Lambda events into Express-style request-response handling, but you still must design for stateless execution, cold starts, and managed-service limits”. If asked for caveats, mention `app.listen()` removal, unreliable in-memory state, API Gateway proxy routing, and the fact that this is often a migration-friendly pattern rather than the final architecture for every workload. [aldrinjenson](https://www.aldrinjenson.com/posts/serverless-express-api/)

## Key takeaways

- `serverless-http` wraps an Express app and exports it as a Lambda handler. [atlassian](https://www.atlassian.com/blog/bitbucket/deploy-an-express-js-app-to-aws-lambda-using-the-serverless-framework)
- You usually route API Gateway with `ANY /` and `ANY /{proxy+}` so Express can do the final route matching. [aldrinjenson](https://www.aldrinjenson.com/posts/serverless-express-api/)
- Remove `app.listen()` because Lambda is not a socket-listening server process. [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/)
- Treat the app as stateless; local sessions and in-memory assumptions are fragile in Lambda. [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs)
- This pattern is excellent for migration and reuse, but not every Express workload maps cleanly to serverless constraints. [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/)

## Minimal self-test

- Explain in one sentence why `app.listen()` is usually removed in Lambda. [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs)
- Trace the path from an HTTP request in API Gateway to an Express route handler when using `serverless-http`. [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/)
- Compare `serverless-http` with writing native Lambda handlers directly. [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs)
- Identify the mistake: storing user session state only in process memory in an Express app deployed on Lambda. [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/)
- Fill in the blank: `serverless-http` mainly acts as an ______ between Lambda events and Express request-response handling. [aws.amazon](https://aws.amazon.com/blogs/aws/running-express-applications-on-aws-lambda-and-amazon-api-gateway/)

## What to learn next

The most natural next topics are API Gateway proxy integration, Lambda cold starts and execution lifecycle, database connection reuse patterns in serverless Node.js, and when to split a monolithic Express Lambda into route-level functions or containers. After that, study AWS authentication patterns such as authorizers and stage-based deployment because those are common real-world extensions once the basic Express-on-Lambda path is working. [youtube](https://www.youtube.com/watch?v=ukndU_aQGMs)