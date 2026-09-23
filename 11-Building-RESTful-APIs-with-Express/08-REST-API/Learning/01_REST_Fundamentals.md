# REST Fundamentals

# REST — Everything You Need to Know

## 1. What is REST?

**REST** stands for **Representational State Transfer**.

REST is an **architectural style** for designing communication between systems.

The most important thing to understand is:

> **REST is not a protocol. It is a set of architectural constraints and design principles.**

It is most commonly implemented using **HTTP**, but REST itself is conceptually separate from HTTP.

---

## One-Sentence Summary

> **REST organizes an API around resources, uses a uniform interface to interact with those resources, keeps requests stateless, and separates the client's view of data from how that data is stored internally.**

---

# 2. Intuition: Think of REST as a Design Style

Imagine designing a restaurant.

A restaurant might follow some common design principles:

- customers interact with a menu

- customers don't enter the kitchen

- the kitchen can change internally without changing the menu

- orders follow predictable rules

REST works similarly.

```text
Client
  |
  |  Request for a resource
  v
REST API
  |
  |  Internally decides how to get/update data
  v
Database / Cache / Other Storage
```

The client does **not** need to know how the server stores its data.

For example:

```text
Client
  |
  | GET /users/123
  v
API Server
  |
  +----> MySQL
  |
  +----> MongoDB
  |
  +----> Redis
  |
  +----> Other storage
```

The client still sees something like:

```json
{
  "id": 123,
  "name": "Alex",
  "email": "alex@example.com"
}
```

The internal storage can change without necessarily changing the public API.

---

# 3. Fundamental Principles of REST

## 3.1 REST is an Architectural Style, Not a Protocol

A **protocol** is a defined set of communication rules.

Examples:

- TCP

- FTP

- SSH

REST is different.

It provides architectural constraints and guidelines rather than being a protocol that directly dictates packet formats or handshakes.

### Simple analogy

Think about:

**Protocol → strict rules**

Like driving laws:

```text
Drive on the correct side
Stop at red lights
Follow traffic rules
```

Breaking those rules can mean that communication or operation fails.

**Architectural style → design guidance**

Like interior design:

```text
Keep walking paths clear
Arrange furniture logically
Make the room usable
```

You can violate the recommendation and the room still physically works.

Similarly, if you create:

```http
POST /users/123/delete
```

the HTTP server will not automatically stop you because REST recommends another design.

REST is not an enforcement mechanism.

It is a set of architectural constraints that developers choose to follow.

---

# 4. Resource-Centric Architecture

One of the most important ideas in REST is the concept of a **resource**.

A resource is a meaningful entity in your system that you want to expose through an API.

Examples:

```text
User
Student
Product
Book
Order
Bank Account
Payment
```

A **bank account can absolutely be a REST resource**.

For example:

```http
/accounts/123
```

could represent bank account `123`.

The URL identifies the **resource**, while the HTTP method describes what we want to do with it.

For example:

```http
GET    /accounts/123
DELETE /accounts/123
PUT    /accounts/123
PATCH  /accounts/123
```

The resource remains:

```text
/accounts/123
```

The operation changes through the HTTP method.

---

## 4.1 Use Nouns, Not Verbs

REST generally models URLs around **nouns**.

### REST-style

```http
/users/123
/students/10
/products/500
/orders/1234
```

### Action-oriented style

```http
/getUser
/deleteUser
/createProduct
/updateOrder
```

The first style says:

> *"Here is the resource."*

The HTTP method says:

> *"Here is what I want to do with it."*

This creates a more uniform interface.

---

# 5. What Remains if We Remove REST from a REST API?

This is a very useful interview question.

Suppose you have:

```http
GET /students/1
DELETE /students/1
```

You are treating:

```text
/students/1
```

as a resource.

Now remove the REST architectural constraints.

You could instead design the API around commands:

```http
POST /getStudentDetails
POST /deleteStudent
```

The URL now represents an **action/function**, rather than the resource itself.

For example:

```http
POST /getStudentDetails
```

with:

```json
{
  "id": 1
}
```

and:

```http
POST /deleteStudent
```

with:

```json
{
  "id": 1
}
```

This is closer to an **RPC-style** design.

---

## REST vs RPC-style

### REST

```http
GET /students/1
```

Meaning:

> *Get the representation of student 1.*

```http
DELETE /students/1
```

Meaning:

> *Delete student 1.*

### RPC-style

```http
POST /getStudentDetails
```

Meaning:

> *Execute the* `getStudentDetails` *operation.*

```http
POST /deleteStudent
```

Meaning:

> *Execute the* `deleteStudent` *operation.*

So without REST, HTTP can simply become a **transport mechanism for sending commands/data**.

The important difference is:

```text
REST:
URL      → resource
HTTP verb → operation
RPC:
URL      → operation/function
Request  → parameters
```

Without the REST uniform interface, APIs can become more dependent on custom conventions.

---

# 6. REST Does Not Care How the Database Stores Data

This is another important REST concept.

Suppose the client requests:

```http
GET /users/123
```

The client only cares about getting user 123.

The server could store the user in:

### Relational database

```text
MySQL
PostgreSQL
```

### Document database

```text
MongoDB
```

### Key-value storage

```text
Redis
```

### Other storage

```text
Flat file
In-memory data
Multiple databases
```

The API can still return:

```json
{
  "id": 123,
  "name": "Alex",
  "email": "alex@example.com"
}
```

This is **storage independence**.

---

## 6.1 Why is this useful?

Imagine your application initially uses:

```text
REST API
   ↓
MySQL
```

Later you migrate to:

```text
REST API
   ↓
MongoDB
```

The client does not necessarily need to change:

```http
GET /users/123
```

still means:

> *Give me user 123.*

The client does not need to know whether the data came from SQL, MongoDB, Redis, or another storage system.

The API acts as a layer between the client and internal storage.

---

## 6.2 Is This Unique to REST?

No.

Non-REST APIs **can also** hide the database.

The important point is that REST explicitly emphasizes treating the thing being exposed as a **resource**, instead of exposing implementation details.

For example, this is tightly coupled to implementation:

```http
GET /getStudentFromTableA
```

or:

```http
POST /updateUserInMongo
```

If the database changes, these API designs may expose too much internal detail.

A resource-oriented API is more stable:

```http
GET /students/1
```

The implementation can change behind the API.

---

# 7. Representation

REST stands for:

> **Representational State Transfer**

The word **representation** is important.

The actual internal resource and the data representation sent to the client do not have to be identical.

For example, internally you might have:

```text
Database tables
    ↓
User table
Address table
Order table
```

But the client might receive:

```json
{
  "id": 123,
  "name": "Alex",
  "email": "alex@example.com"
}
```

The JSON is a **representation** of the resource.

---

# 8. Can REST Return Different Formats?

Yes.

A REST API can represent a resource using formats such as:

```text
JSON
XML
CSV
```

For example, the same user could conceptually be represented as:

### JSON

```json
{
  "id": 123,
  "name": "Alex"
}
```

### XML

```xml
<user>
    <id>123</id>
    <name>Alex</name>
</user>
```

The underlying resource is still the same:

```text
User 123
```

Only its representation changes.

---

# 9. Content Negotiation

REST commonly uses standard HTTP mechanisms for negotiating representations.

Two important headers are:

```http
Accept
Content-Type
```

For example, a client can communicate what representation it accepts:

```http
GET /users/123
Accept: application/json
```

The server can return JSON.

Another client might request another representation where supported.

The important idea is:

```text
Same resource
      |
      +---- JSON representation
      |
      +---- XML representation
      |
      +---- CSV representation
```

---

## REST vs Non-REST Format Selection

A non-REST API **can absolutely** return different formats.

There is nothing physically preventing it.

The difference is standardization.

A custom API might use:

```http
/getStudent?format=json
```

or:

```http
/getStudent?format=xml
```

Another API could invent a completely different mechanism.

REST's advantage is that HTTP provides standardized mechanisms such as:

```http
Accept
Content-Type
```

So REST can make format negotiation more predictable.

In short:

> **REST does not make multiple formats physically possible; it provides standardized mechanisms for representing and negotiating resources.**

---
