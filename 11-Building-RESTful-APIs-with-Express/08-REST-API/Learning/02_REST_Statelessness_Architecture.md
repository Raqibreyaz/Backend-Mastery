# REST Statelessness & Architecture

# 10. Statelessness

**Statelessness** means:

> *The server does not maintain client-specific session state between requests.*

Every request should contain the information necessary for the server to process it.

For example:

```http
GET /users/123
Authorization: Bearer <token>
```

The server can independently process this request.

It does not need to remember:

```text
"What did this client ask me five requests ago?"
```

---

## 10.1 Stateful vs Stateless

### Stateful

Imagine:

```text
Request 1:
"Login as Alex"
Server:
"Okay, I'll remember Alex."
Request 2:
"Give me my orders."
Server:
"I know you are Alex because I remember your session."
```

The server is maintaining client state.

### Stateless

```text
Request 1:
Login information / token
Request 2:
Token + request information
Request 3:
Token + request information
```

Each request carries what the server needs.

---

# 11. Is Statelessness Only a REST Feature?

**No.**

Statelessness is a general architectural principle.

Non-REST systems can also be stateless.

Examples include:

- GraphQL

- gRPC

- RPC

- serverless systems

For example, a GraphQL request can contain an authentication token in every request:

```http
POST /graphql
Authorization: Bearer <JWT>
```

The server processes the request without maintaining a user session.

Similarly, gRPC can have:

```text
GetUser(UserRequest)
```

where the request contains the required information and authentication metadata.

SOAP can also be designed to operate statelessly.

Serverless functions are commonly designed around independent invocations as well.

---

# 12. Why Is Statelessness Still a Fundamental REST Principle?

Because a principle does not have to be **unique** to REST to be fundamental to REST.

Think about a car.

```text
Car
 ├── Wheels
 └── Engine
```

Trucks and buses also have wheels and engines.

That doesn't make wheels irrelevant to the definition of a car.

Similarly:

```text
REST
 └── Statelessness
```

Other architectures can use statelessness too.

But statelessness is still one of the core REST constraints.

The source describes the original six REST architectural constraints as:

**1.** Client-Server

**2.** Statelessness

**3.** Cacheability

**4.** Uniform Interface

**5.** Layered System

**6.** Code on Demand — optional

Therefore, statelessness is not merely an optional REST recommendation in the formal architectural definition.

---

# 13. Benefits of Statelessness

## 13.1 Horizontal Scalability

Suppose you have:

```text
             Load Balancer
             /     |     \
            /      |      \
       Server A  Server B  Server C
```

If requests are stateless, any server can process any request.

```text
Request 1 → Server A
Request 2 → Server C
Request 3 → Server B
Request 4 → Server A
```

No particular server needs to remember the client's previous request.

---

## 13.2 Fault Tolerance

Suppose:

```text
Request 1 → Server A
```

Then Server A crashes.

The next request can go to:

```text
Request 2 → Server B
```

Server B does not need Server A's private session memory if the system is stateless.

---

## 13.3 Simpler Server Design

Servers do not need to constantly:

- synchronize session data

- manage inactive sessions

- replicate session state between servers

This can simplify distributed systems.

---

# 14. Statelessness and Authentication

Stateless APIs commonly send authentication information with each request.

For example:

```http
GET /users/123
Authorization: Bearer eyJ...
```

The server verifies the token.

It does not need to remember:

```text
Client X logged in 5 minutes ago.
```

This is one reason tokens such as JWTs are commonly used with stateless APIs.

---

# 15. REST and Protocol Independence

REST is **protocol-independent** at the architectural level.

That means REST describes architectural concepts such as:

```text
Resources
Statelessness
Representations
Uniform interface
```

It does not fundamentally define the low-level transport mechanism.

HTTP is simply the protocol with which REST fits extremely well.

The general idea is:

```text
REST principles
      ↓
Transport mechanism
```

The transport must provide enough capabilities to implement the desired architectural behavior.

The source gives examples of applying REST-like ideas over several protocols/technologies.

---

# 16. REST Over CoAP

**CoAP (Constrained Application Protocol)** is designed for constrained IoT devices.

These devices may have:

- low power

- limited memory

- unreliable networks

- UDP-based communication

Example resource:

```text
coap://sensor.local/temperature
```

Operations can map to:

```text
GET
POST
PUT
DELETE
```

So the same general resource-oriented idea can exist without traditional HTTP.

---

# 17. REST-like Communication Over WebSocket

WebSockets provide a persistent connection.

Unlike normal request/response HTTP communication, the connection stays open for two-way communication.

You could send a structured message such as:

```json
{
  "action": "GET",
  "resource": "/users/123"
}
```

The important point is that WebSocket itself does **not automatically become REST**.

You are building a REST-like application convention on top of WebSocket.

---

# 18. REST-like Communication Over MQTT / AMQP

Messaging systems can also represent resources and operations using topics and message payloads.

For example:

```text
app/users/123/get
app/users/123/delete
```

The message payload can contain the resource representation.

Again, the important distinction is:

> *The underlying protocol does not automatically become REST. You are applying resource-oriented architectural ideas over it.*

---

# 19. REST-like File Operations Over FTP / SFTP

A file can be treated as a resource:

```text
ftp://files.example.com/documents/report.pdf
```

Operations can conceptually map to:

```text
GET    → download
PUT    → upload/replace
DELETE → remove
```

For example:

```text
GET report.pdf
```

means:

> *Give me the representation/content of this resource.*

The source presents these as examples of applying RESTful principles beyond HTTP.

---

# 20. Why Is REST So Closely Associated With HTTP?

If REST is protocol-independent, why does almost everyone associate REST with HTTP?

Because HTTP already provides almost everything REST APIs naturally need.

HTTP gives us:

```text
URIs
GET
POST
PUT
DELETE
PATCH
Headers
Status codes
Caching
Content negotiation
```

So REST maps naturally onto HTTP.

For example:

```http
GET /users/123
```

The URL identifies the resource.

```http
GET
```

identifies the operation.

And the response can use standard status codes:

```text
200 OK
201 Created
400 Bad Request
404 Not Found
500 Internal Server Error
```

This alignment makes HTTP + REST extremely convenient.

---
