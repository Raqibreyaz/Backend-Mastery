# REST Performance, HTTP/3 & Revision

# 38. REST Payload Overhead

REST commonly uses human-readable formats such as JSON.

Example:

```json
{
  "id": 123,
  "name": "Alex",
  "email": "alex@example.com"
}
```

JSON is easy for humans to read, but it contains overhead:

```text
{
"
:
,
}
```

and repeated field names such as:

```text
"id"
"name"
"email"
```

Binary serialization systems such as Protocol Buffers can represent the same information more compactly.

Therefore:

```text
REST + JSON
    ↓
Easy to read
Easy to debug
More payload overhead
gRPC + Protobuf
    ↓
Compact
Efficient
More optimized for machine-to-machine communication
```

This can matter in high-throughput or ultra-low-latency systems.

---

# 39. Manual Boilerplate in REST

REST clients often need application-level handling for:

```text
Authentication
Timeouts
Retries
Error handling
Serialization
Deserialization
```

For example:

```text
try request
   |
   +-- timeout?
   |
   +-- retry?
   |
   +-- 500?
   |
   +-- 401?
   |
   +-- parse response
```

Developers may repeatedly implement these patterns across services.

Libraries and frameworks can reduce this boilerplate, but REST itself does not automatically provide all these behaviors.

---

# 40. Do Other Systems Handle Retries and Timeouts Automatically?

Yes.

Different protocols and infrastructure systems provide mechanisms for:

- acknowledgements

- retries

- timeouts

- delivery guarantees

- redelivery

- fault tolerance

Examples include:

```text
AMQP / RabbitMQ
gRPC + service mesh
MQTT
Temporal / Cadence
```

---

# 41. AMQP / RabbitMQ

In message-queue systems such as RabbitMQ, messages can have acknowledgement mechanisms.

Basic flow:

```text
Producer
   |
   | Message
   v
RabbitMQ
   |
   v
Consumer
   |
   | ACK
   v
RabbitMQ
```

If the consumer crashes before acknowledging the message, the broker can requeue it.

---

## Dead Letter Queues

A system can also define retry policies.

For example:

```text
Attempt 1
   ↓ fail
Attempt 2
   ↓ fail
Attempt 3
   ↓ fail
Dead Letter Queue
```

This moves some retry and delivery management away from application code and into the messaging infrastructure.

---

# 42. gRPC Retry Policies and Service Meshes

gRPC can work with retry policies and infrastructure such as:

```text
Istio
Linkerd
Envoy
```

For example, a policy can specify:

```json
{
  "methodConfig": [{
    "name": [{"service": "UserService"}],
    "timeout": "2.0s",
    "retryPolicy": {
      "maxAttempts": 4,
      "initialBackoff": "0.1s",
      "maxBackoff": "1s",
      "backoffMultiplier": 2,
      "retryableStatusCodes": [
        "UNAVAILABLE",
        "DEADLINE_EXCEEDED"
]
}
}]
}
```

The important idea is that retry behavior can be **declared as configuration**, rather than implementing every retry loop manually in business logic.

---

# 43. MQTT Quality of Service

MQTT provides QoS levels.

### QoS 0

```text
At most once
```

No retry guarantee.

### QoS 1

```text
At least once
```

The sender retries until acknowledgement is received.

This can result in duplicate delivery.

### QoS 2

```text
Exactly once
```

Uses a multi-step handshake to provide stronger delivery guarantees.

The protocol handles the delivery state machine for you.

---

# 44. Temporal / Durable Execution

Temporal and Cadence are not simply network protocols.

They are workflow execution systems.

They can keep track of:

```text
Workflow state
Retries
Timeouts
Backoff
Failures
Recovery
```

For example:

```text
Workflow
   |
   v
Call REST API
   |
   X failure
   |
   v
Wait
   |
   v
Retry
   |
   v
Success
```

The workflow engine can preserve the state needed to continue execution even when individual services fail.

---

# 45. REST vs Messaging/RPC Reliability

A simplified comparison from the source:

| Feature             | REST over HTTP                        | AMQP / RabbitMQ      | gRPC + Config / Service Mesh | MQTT                      |
| ------------------- | ------------------------------------- | -------------------- | ---------------------------- | ------------------------- |
| Timeout handling    | Usually application/client configured | Broker-based         | Declarative/configurable     | Protocol-level mechanisms |
| Retry logic         | Usually application/library           | Queue redelivery     | Client/proxy configuration   | Protocol-level            |
| Delivery guarantees | Application-dependent                 | Messaging guarantees | RPC error/retry mechanisms   | QoS 1/2                   |
| Typical model       | Request/response                      | Message/queue        | RPC                          | Messaging/IoT             |

The key lesson is not that REST is "bad."

It is that different communication systems are designed around different requirements.

---

# 46. Transport Layer and HTTP

Traditional HTTP deployments have historically relied on TCP.

This creates some transport-level characteristics.

For example:

```text
REST
 ↓
HTTP/1.1 or HTTP/2
 ↓
TCP
```

The source identifies transport-layer coupling as one limitation when considering switching to fundamentally different transports such as UDP.

However, HTTP has evolved.

This leads to **HTTP/3**.

---

# 47. REST with HTTP/3

HTTP/3 runs over:

```text
HTTP/3
   ↓
QUIC
   ↓
UDP
```

So you can have:

```text
REST API
   ↓
HTTP/3
   ↓
QUIC
   ↓
UDP
```

This is important because it shows that modern REST APIs do not necessarily have to use TCP underneath.

---

# 48. What HTTP/3 Fixes

## 48.1 Head-of-Line Blocking

HTTP/2 supports multiple streams over one TCP connection.

Imagine:

```text
TCP connection
 ├── GET /users/1
 ├── POST /orders
 └── GET /products
```

If a TCP packet is lost, TCP may need to wait for retransmission before delivering later data to the relevant streams.

This can cause **head-of-line blocking**.

QUIC handles streams differently.

With HTTP/3:

```text
QUIC connection
 ├── Stream 1 → GET /users/1
 ├── Stream 2 → POST /orders
 └── Stream 3 → GET /products
```

A packet loss affecting one stream does not block all other streams in the same way.

---

# 49. Faster Connection Establishment

Traditional HTTP/2 over TCP + TLS requires connection setup involving:

```text
TCP handshake
      ↓
TLS handshake
      ↓
HTTP communication
```

QUIC combines transport and TLS mechanisms more tightly.

HTTP/3 can therefore reduce connection setup latency.

For known connections, QUIC can also support **0-RTT** in appropriate circumstances.

The idea is:

```text
Traditional:
Connection setup
     ↓
Security setup
     ↓
Data
HTTP/3 / QUIC:
More integrated setup
     ↓
Data sooner
```

---

# 50. Connection Migration

This is especially useful for mobile devices.

Imagine your phone is using Wi-Fi:

```text
Phone
 ↓
Wi-Fi
 ↓
REST API
```

Then Wi-Fi disappears and the phone switches to 5G:

```text
Phone
 ↓
5G
 ↓
REST API
```

Traditional TCP connections are tied to network addressing details such as the IP connection.

QUIC uses a **Connection ID**, allowing connections to survive network changes more gracefully.

This can improve mobile experiences.

---

# 51. What HTTP/3 Does NOT Fix

HTTP/3 improves the **transport layer**.

It does not remove REST's other architectural trade-offs.

---

## 51.1 JSON Overhead Still Exists

HTTP/3 can make network transport more efficient.

But this:

```json
{
  "id": 123,
  "name": "Alex"
}
```

is still JSON.

HTTP/3 does not magically turn JSON into a compact binary format.

So:

```text
HTTP/3 + REST + JSON
```

still has more payload overhead than a highly optimized binary serialization format in many cases.

---

## 51.2 Stub Generation Is Still Not Native to REST

Changing:

```text
HTTP/2 → HTTP/3
```

does not turn REST into gRPC.

You still have:

```text
REST
 +
HTTP/3
```

not:

```text
REST
 +
automatic RPC stub generation
```

You can still use OpenAPI and other tools, but HTTP/3 itself does not provide native RPC-style client generation.

---

## 51.3 CPU Overhead

QUIC operates in user space in many implementations and can introduce CPU costs that differ from traditional TCP stacks and offload mechanisms.

At very high throughput, this can matter.

Hardware acceleration and implementation improvements continue to reduce these costs.

---

# 52. REST Over HTTP/3: When Does It Make Sense?

For public web and mobile applications, HTTP/3 can provide useful transport improvements, particularly on networks with:

- packet loss

- changing connectivity

- mobile network transitions

- variable latency

For internal microservices, the source contrasts this with gRPC/RPC systems, which can provide:

```text
Binary serialization
Native generated stubs
Efficient service-to-service communication
```

So architecture should depend on the actual requirements rather than simply assuming one communication style is universally better.

---

# 53. Important REST Mental Model

A very useful way to visualize REST is:

```text
                REST API
                   |
        +----------+----------+
        |                     |
     Resource              Representation
        |                     |
     /users/123             JSON
     /orders/50             XML
     /products/7            CSV
        |
        |
   HTTP Method
        |
   +----+----+----+----+
   |    |    |    |    |
  GET POST  PUT PATCH DELETE
```

And behind the API:

```text
             REST API
                 |
        +--------+--------+
        |        |        |
       SQL     NoSQL     Cache
      MySQL   MongoDB    Redis
```

The client should primarily care about the **API contract**, not the internal storage implementation.

---

# 54. REST vs RPC — The Core Difference

This is one of the most important comparisons to remember.

### REST

Think:

> **"I have a resource. What do I want to do with it?"**

Example:

```http
GET /users/123
```

```http
DELETE /users/123
```

### RPC

Think:

> **"I want to execute a function."**

Example:

```http
POST /getUser
```

```http
POST /deleteUser
```

or with gRPC:

```text
UserService.GetUser(...)
UserService.DeleteUser(...)
```

Mental model:

```text
REST
Resource → Operation
RPC
Function → Parameters
```

---

# 55. Common Misunderstandings

## Mistake 1: "REST is HTTP."

Not exactly.

Better:

> *REST is an architectural style that is most commonly implemented over HTTP.*

---

## Mistake 2: "REST is a protocol."

No.

REST does not define network packets, handshakes, or a strict wire protocol in the way TCP, FTP, or similar protocols do.

---

## Mistake 3: "Only REST APIs can be stateless."

No.

GraphQL, gRPC, SOAP, RPC, and other systems can also be stateless.

The important point is:

> *Statelessness is a core REST constraint, but it is not exclusive to REST.*

---

## Mistake 4: "Non-REST APIs cannot return JSON or XML."

Wrong.

Any API can technically return JSON, XML, CSV, or another format.

REST mainly provides standardized mechanisms and conventions for resource representations and content negotiation.

---

## Mistake 5: "REST forces MySQL/PostgreSQL."

No.

REST says nothing about your database technology.

You can use:

```text
MySQL
PostgreSQL
MongoDB
Redis
Files
Multiple databases
```

---

## Mistake 6: "REST automatically generates client code."

No.

REST itself does not provide native standardized stub generation.

Tools such as OpenAPI can provide code generation as an additional layer.

---

## Mistake 7: "HTTP/3 makes REST equivalent to gRPC."

No.

HTTP/3 changes the transport layer:

```text
TCP-based HTTP
      ↓
QUIC/UDP-based HTTP
```

It does not change REST into RPC.

JSON overhead and the lack of native REST stub generation remain separate concerns.

---

## Mistake 8: "If an API uses HTTP, it is REST."

No.

For example:

```http
POST /deleteUser
```

can be perfectly valid HTTP while being action/RPC-oriented rather than resource-oriented REST.

HTTP and REST are related but not identical concepts.

---

# 56. REST's Main Advantages

REST over HTTP provides:

### 1. Simple resource model

```text
/users/123
/products/10
/orders/500
```

### 2. Standard HTTP interface

```text
GET
POST
PUT
PATCH
DELETE
```

### 3. Huge ecosystem

```text
Browsers
CDNs
Proxies
Load balancers
Firewalls
Postman
cURL
Monitoring tools
```

### 4. Caching support

HTTP caching infrastructure can work naturally with REST APIs.

### 5. Stateless scalability

Requests can be distributed across server instances.

### 6. Storage independence

The client does not need to know how the resource is stored.

### 7. Human-readable representations

JSON makes APIs relatively easy to inspect and debug.

---

# 57. REST's Main Trade-offs

REST can have limitations when compared with specialized RPC or messaging systems.

### 1. Manual client plumbing

Developers may need to handle:

```text
URLs
Headers
Serialization
Deserialization
Errors
Retries
Timeouts
```

### 2. JSON payload overhead

JSON is convenient but can be larger than binary formats.

### 3. No native standardized stub generation

OpenAPI can help, but it is an additional ecosystem tool.

### 4. Application-level reliability logic

Retries, delivery guarantees, and similar behaviors often require libraries, application logic, or additional infrastructure.

### 5. Not always ideal for ultra-low-latency internal communication

For some high-throughput service-to-service systems, binary RPC systems can be a better fit for the specific requirements.

---

# 58. Why REST Remains So Common

REST over HTTP combines several things that are difficult to ignore:

```text
REST principles
      +
HTTP
      +
Existing Internet infrastructure
      +
Developer familiarity
      +
Caching
      +
Standard tooling
```

This makes it particularly convenient for public-facing APIs and general web applications.

At the same time, specialized systems such as gRPC, AMQP, MQTT, and workflow engines exist because different problems have different communication requirements.

---

# 59. Final Big Picture

Think about API design as several layers:

```text
┌─────────────────────────────────┐
│          API Architecture       │
│                                 │
│ REST / RPC / GraphQL / etc.     │
└─────────────────────────────────┘
                ↓
┌─────────────────────────────────┐
│          Application Protocol   │
│                                 │
│ HTTP / gRPC / MQTT / AMQP / ... │
└─────────────────────────────────┘
                ↓
┌─────────────────────────────────┐
│          Transport              │
│                                 │
│ TCP / QUIC over UDP / ...       │
└─────────────────────────────────┘
                ↓
┌─────────────────────────────────┐
│          Network                │
└─────────────────────────────────┘
```

This helps avoid mixing up concepts.

For example:

```text
REST + HTTP/1.1 + TCP
REST + HTTP/2  + TCP
REST + HTTP/3  + QUIC/UDP
```

These are all different combinations of architectural style, application protocol, and transport.

---

# 60. Interview Questions to Know

### Q1. What is REST?

REST is an architectural style for designing distributed systems around resources, representations, stateless communication, and a uniform interface.

### Q2. Is REST a protocol?

No. REST is an architectural style.

### Q3. Is REST the same as HTTP?

No. HTTP is a protocol commonly used to implement REST.

### Q4. What is a resource?

A resource is an entity exposed through an API, such as:

```text
User
Product
Order
Bank Account
Student
```

### Q5. Can a bank account be a REST resource?

Yes.

For example:

```http
/accounts/123
```

### Q6. Does REST dictate the database?

No.

REST does not specify whether the server uses SQL, NoSQL, Redis, files, or something else.

### Q7. Can non-REST APIs be stateless?

Yes.

Statelessness is not exclusive to REST.

### Q8. Why is statelessness still a REST principle?

Because it is one of REST's fundamental architectural constraints, even though other architectures can also use it.

### Q9. Can non-REST APIs return JSON?

Yes.

REST does not own JSON.

REST provides standardized ways of working with representations through HTTP.

### Q10. What happens if we remove REST from a REST API?

You can still have HTTP.

But you lose the REST architectural constraints.

The API may become command/RPC-oriented:

```http
POST /getUser
POST /deleteUser
```

instead of:

```http
GET /users/123
DELETE /users/123
```

### Q11. What is a stub?

A stub is generated helper code that hides network communication details and lets a client call remote services through normal-looking methods.

### Q12. Does REST have automatic stub generation?

Not inherently.

OpenAPI and similar tools can generate clients, but they are additional tools.

### Q13. Why is gRPC good for internal services?

It can provide:

```text
Binary serialization
Generated client/server code
Strong contracts
Efficient RPC communication
```

### Q14. Does HTTP/3 use TCP?

No.

HTTP/3 uses **QUIC**, which runs over **UDP**.

### Q15. Does HTTP/3 eliminate JSON overhead?

No.

HTTP/3 improves transport behavior. JSON is still JSON.

---

# 61. Key Takeaways

- **REST = Representational State Transfer.**

- REST is an **architectural style**, not a protocol.

- HTTP is the most common protocol used to implement REST.

- REST is **resource-oriented**.

- Resources should generally be represented using **nouns** in URLs.

- HTTP methods describe operations on resources.

- `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` commonly map to CRUD-style operations.

- REST separates the resource's external representation from its internal database storage.

- JSON, XML, and CSV can be representations of the same resource.

- REST can use HTTP content negotiation mechanisms such as `Accept` and `Content-Type`.

- **Statelessness** means every request contains the information needed to process it.

- Statelessness is fundamental to REST but is **not exclusive to REST**.

- Statelessness makes horizontal scaling and failover easier.

- REST does not dictate your database.

- Non-REST APIs can also hide database implementation details.

- Without REST constraints, HTTP can simply be used as a transport for commands, similar to RPC.

- REST over HTTP benefits from existing infrastructure such as caches, CDNs, load balancers, WAFs, API gateways, testing tools, and monitoring systems.

- REST does not inherently provide standardized client stub generation.

- gRPC uses `.proto` contracts and generated stubs to hide much of the networking and serialization work.

- OpenAPI can provide generated REST clients, but it is an additional tool rather than a fundamental REST feature.

- REST + JSON can have more payload overhead than binary protocols such as Protobuf.

- Messaging systems such as AMQP and MQTT provide different delivery and retry mechanisms.

- HTTP/3 uses QUIC over UDP.

- HTTP/3 can reduce transport-level problems such as TCP head-of-line blocking and improve connection migration.

- HTTP/3 does **not** remove REST's architectural trade-offs or JSON overhead.

---

# 62. Minimal Self-Test

Try answering these without looking above:

**1.** What exactly is REST?

**2.** Why is REST called an architectural style instead of a protocol?

**3.** What is a resource?

**4.** Can a bank account be a REST resource? Why?

**5.** Why is `/users/123` more resource-oriented than `/getUser`?

**6.** What remains if you remove REST constraints but keep HTTP?

**7.** What is the difference between REST and RPC?

**8.** What does statelessness mean?

**9.** Why can non-REST APIs also be stateless?

**10.** Why is statelessness still considered fundamental to REST?

**11.** Does REST dictate whether you use MySQL or MongoDB?

**12.** What is a representation of a resource?

**13.** What is content negotiation?

**14.** Can a non-REST API return JSON?

**15.** What is a stub?

**16.** Why does gRPC have an advantage in standardized stub generation?

**17.** What does a `.proto` file contain?

**18.** What happens when `protoc` compiles a `.proto` file?

**19.** Why can JSON create payload overhead?

**20.** Why might gRPC be preferred for some internal microservices?

**21.** How do message brokers handle retries differently from typical REST clients?

**22.** What are MQTT QoS 0, 1, and 2?

**23.** What is the relationship between REST, HTTP/3, QUIC, and UDP?

**24.** What does HTTP/3 solve?

**25.** What does HTTP/3 **not** solve?

**26.** Why does REST work so well with CDNs and load balancers?

**27.** Why can a load balancer distribute stateless REST requests across many servers?

**28.** Why is `POST /deleteUser` valid HTTP but not necessarily resource-oriented REST?

---

# 63. What to Learn Next

A good learning sequence after REST is:

```text
REST
 ↓
HTTP fundamentals
 ↓
HTTP methods + status codes
 ↓
HTTP headers + content negotiation
 ↓
Caching + ETags
 ↓
Authentication vs Authorization
 ↓
JWT + OAuth 2.0
 ↓
Idempotency
 ↓
API versioning
 ↓
Pagination / filtering / sorting
 ↓
OpenAPI / Swagger
 ↓
RPC and gRPC
 ↓
Protobuf
 ↓
Message queues
 ↓
AMQP / RabbitMQ
 ↓
WebSockets
 ↓
HTTP/2
 ↓
HTTP/3 + QUIC
```

The key conceptual progression is:

```text
REST
  ↓
How APIs are designed
HTTP
  ↓
How web communication works
gRPC / RPC
  ↓
How remote function calls differ from resource-oriented APIs
Messaging
  ↓
How asynchronous communication differs from request/response
HTTP/2 + HTTP/3
  ↓
How the underlying transport affects API performance
```
