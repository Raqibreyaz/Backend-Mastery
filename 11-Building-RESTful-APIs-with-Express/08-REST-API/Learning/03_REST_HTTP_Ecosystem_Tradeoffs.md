# REST HTTP Ecosystem & Trade-offs

# 21. HTTP Gives REST a Huge Ecosystem

When you use REST over HTTP, you don't have to build the entire networking ecosystem yourself.

Existing infrastructure already understands HTTP.

This includes:

```text
Browsers
CDNs
Reverse proxies
Load balancers
API gateways
Firewalls
Monitoring systems
Testing tools
```

This is a major reason REST over HTTP became so widespread.

---

# 22. How REST Leverages Existing Tools

## 22.1 Caches and CDNs

Examples:

- Cloudflare

- Akamai

- Varnish

- Nginx

- Browser caches

HTTP provides headers such as:

```http
Cache-Control
ETag
Last-Modified
```

These allow intermediaries to cache responses.

Imagine:

```text
1,000,000 clients
       |
       v
      CDN
       |
       +---- cached /products/123
       |
       v
Application Server
       |
       v
Database
```

If the response is cacheable, many requests can be served by the CDN without repeatedly reaching your application server.

That reduces:

- database load

- application-server load

- latency

- infrastructure cost

---

# 23. Load Balancers and API Gateways

Examples:

- AWS Application Load Balancer

- HAProxy

- Nginx

- Kong

- Traefik

Because HTTP requests have standardized methods and URLs, Layer 7 infrastructure can inspect them.

For example:

```text
GET /images/*
       ↓
Media servers
```

while:

```text
POST /payments
       ↓
Payment servers
```

A load balancer can route traffic based on the request path and method.

Statelessness makes this even easier because requests can be distributed across server nodes without depending on one server's session memory.

---

# 24. Developer and Testing Tools

Common tools include:

```text
Postman
Insomnia
cURL
Swagger / OpenAPI
Swagger UI
```

These tools already understand:

```text
HTTP URLs
HTTP methods
Headers
Status codes
```

So you can immediately test:

```bash
curl https://api.example.com/users/123
```

instead of needing a custom protocol decoder.

OpenAPI can also describe the API and generate interactive documentation or client code.

---

# 25. Security Infrastructure

HTTP-based REST APIs can use existing security infrastructure such as:

```text
Web Application Firewalls
OAuth 2.0 identity providers
JWT authentication
Cloud security systems
```

For example:

```http
Authorization: Bearer <JWT>
```

Security infrastructure can inspect HTTP requests and apply policies such as:

- authentication

- rate limiting

- request filtering

- attack detection

A WAF can inspect traffic before it reaches the application servers.

---

# 26. Monitoring and Telemetry

Monitoring tools such as:

- Datadog

- Prometheus

- Grafana

- New Relic

already understand HTTP behavior.

For example, they can track:

```text
2xx → successful responses
4xx → client errors
5xx → server errors
```

They can also measure:

```text
Request latency
Error rate
Requests per second
Endpoint performance
```

This works without developers having to create a custom network telemetry system.

---

# 27. REST HTTP Methods and CRUD

REST commonly maps HTTP methods to CRUD operations.

CRUD means:

```text
C → Create
R → Read
U → Update
D → Delete
```

A typical mapping is:

| HTTP Method | Common Meaning | Example             |
| ----------- | -------------- | ------------------- |
| `GET`       | Read           | `GET /users/123`    |
| `POST`      | Create         | `POST /users`       |
| `PUT`       | Replace/create | `PUT /users/123`    |
| `PATCH`     | Partial update | `PATCH /users/123`  |
| `DELETE`    | Delete         | `DELETE /users/123` |

---

## 27.1 GET

Used to retrieve data.

```http
GET /students/10
```

Conceptually:

> *Give me student 10.*

`GET` is:

- **safe**

- **idempotent**

---

## 27.2 POST

Commonly used to create a new resource.

```http
POST /students
```

with:

```json
{
  "name": "Alex",
  "age": 21
}
```

`POST` is generally **not idempotent**.

Calling it twice may create two students.

---

## 27.3 PUT

Used to replace an existing resource entirely, or create it at a specified location where supported.

```http
PUT /students/10
```

For example:

```json
{
  "id": 10,
  "name": "Alex",
  "age": 22
}
```

`PUT` is **idempotent**.

---

## 27.4 PATCH

Used for a partial modification.

```http
PATCH /students/10
```

For example:

```json
{
  "age": 22
}
```

Only the relevant part is changed.

---

## 27.5 DELETE

Used to remove a resource.

```http
DELETE /students/10
```

`DELETE` is considered **idempotent**.

---

# 28. One URL, Multiple Operations

A major benefit of using HTTP methods is that the same resource URL can support different operations.

For:

```text
/students/1
```

we can have:

```http
GET    /students/1
PUT    /students/1
PATCH  /students/1
DELETE /students/1
```

Instead of creating:

```text
/getStudent
/updateStudent
/partiallyUpdateStudent
/deleteStudent
```

The HTTP method communicates the operation.

This is sometimes described as **multiplexing operations through the HTTP method**.

---

# 29. REST Trade-offs and Limitations

REST is extremely useful, but it is not perfect for every problem.

---

## 29.1 Client Development and Stub Generation

One criticism of REST compared with RPC frameworks is the lack of a **native standardized stub-generation mechanism**.

To understand this, first understand what a stub is.

---

# 30. What Is a Stub?

A **stub** is generated helper code that lets your application call a remote service almost like a local function.

Suppose the remote server provides:

```text
GetUser(123)
```

Without a stub, you might manually have to:

```text
Create URL
   ↓
Set headers
   ↓
Create HTTP request
   ↓
Serialize data
   ↓
Send request
   ↓
Receive response
   ↓
Parse JSON
   ↓
Handle errors
```

With a generated stub, you might simply write:

```python
user = user_service_stub.GetUser(user_id=123)
```

The generated code handles much of the network plumbing.

---

# 31. Easy Analogy for a Stub

Imagine visiting a store in a country where you don't speak the language.

### Without a stub

You personally have to:

```text
Translate your request
Convert terminology
Talk to the shopkeeper
Understand the response
Translate it back
```

### With a stub

You have a translator:

```text
You
 |
 | "I want a sandwich"
 v
Translator
 |
 | foreign-language request
 v
Store
 |
 | foreign-language response
 v
Translator
 |
 v
You
```

The translator hides the communication complexity.

A programming stub does something similar.

It hides network communication details behind normal-looking programming methods.

---

# 32. How Stub Generation Works in gRPC

This is where gRPC differs strongly from typical REST development.

Suppose we create:

```text
user.proto
```

Inside it:

```protobuf
syntax = "proto3";
message UserRequest {
    int32 user_id = 1;
}
message UserResponse {
    int32 id = 1;
    string name = 2;
    string email = 3;
}
service UserService {
    rpc GetUser (UserRequest) returns (UserResponse);
}
```

This file is an **API contract**.

It defines:

```text
What data exists?
What fields exist?
What functions can be called?
What do they accept?
What do they return?
```

It does not contain the actual business logic.

It is a **blueprint**.

---

# 33. Compile the `.proto` File

You then run a compiler such as:

```bash
python -m grpc_tools.protoc \
  -I. \
  --python_out=. \
  --grpc_python_out=. \
  user.proto
```

The compiler reads:

```text
user.proto
```

and generates code such as:

```text
user_pb2.py
user_pb2_grpc.py
```

These generated files contain classes and methods that the client can use.

So:

```text
.proto blueprint
       |
       | protoc
       v
Generated client/server code
       |
       v
Application
```

---

# 34. Using the Generated gRPC Stub

The client can then write:

```python
import grpc
import user_pb2
import user_pb2_grpc
channel = grpc.insecure_channel("localhost:50051")
client = user_pb2_grpc.UserServiceStub(channel)
request = user_pb2.UserRequest(user_id=123)
response = client.GetUser(request)
print(response.name)
print(response.email)
```

Notice the important part:

```python
response = client.GetUser(request)
```

It **looks like a normal function call**.

But `GetUser()` is actually calling another machine over the network.

That is the power of the generated stub.

---

# 35. What Did the Generated Stub Handle?

The developer did not manually write code to:

**1.** Serialize the request into the wire format.

**2.** Send the request through the network.

**3.** Handle the RPC protocol details.

**4.** Deserialize the response.

**5.** Turn the response into structured objects.

The generated code and runtime handle these details.

So the mental model is:

```text
Your Code
   |
   | client.GetUser(...)
   v
Generated Stub
   |
   | serialization + networking
   v
Remote Server
   |
   | response
   v
Generated Stub
   |
   | deserialization
   v
Your Code
```

---

# 36. Why Doesn't REST Work This Way by Default?

REST is an architectural style.

It does not define one mandatory programming language, IDL, compiler, or native stub-generation system.

A typical REST client might manually do:

```python
import requests
url = "https://api.example.com/users/123"
headers = {
    "Authorization": "Bearer token123",
    "Content-Type": "application/json"
}
response = requests.get(url, headers=headers)
if response.status_code == 200:
    data = response.json()
    user_name = data["name"]
else:
raise Exception("Failed to fetch user")
```

The developer is responsible for the HTTP client logic and interpreting the response.

---

# 37. OpenAPI / Swagger Helps REST

REST does not mean client code can **never** be generated.

Tools such as:

```text
OpenAPI
Swagger
OpenAPI Generator
```

can generate client libraries.

For example:

```text
OpenAPI specification
        |
        v
OpenAPI Generator
        |
        +---- Java client
        +---- Python client
        +---- TypeScript client
        +---- Go client
```

The important distinction is:

```text
gRPC:
IDL + code generation
        ↓
part of the standard ecosystem
REST:
OpenAPI + code generation
        ↓
external/additional tooling
```

Therefore, REST **can** have generated clients, but stub generation is not inherently built into REST itself.

---
