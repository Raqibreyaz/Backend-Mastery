# 🚀 Backend Mastery

A structured, in-depth course repository covering everything you need to become a proficient backend engineer — from Node.js internals and networking fundamentals all the way to cloud deployments and CI/CD pipelines.

---

## 📖 About This Repository

This repository is a personal learning journal for the **Backend Mastery** course. Each section covers a major backend topic, broken down into focused sub-topics that follow a consistent three-phase structure:

| Directory | Purpose |
|-----------|---------|
| `Learning/` | Notes and code written while actively learning the topic |
| `Revision/` | Condensed notes created during revision sessions |
| `Interview/` | Key points and Q&A prepared for technical interviews |

Topics within each section are numbered to reflect the recommended learning order.

---

## 🗂️ Course Curriculum

### Section 01–03 · Introduction to Node.js, CLI & OS Basics
> Laying the groundwork before diving into the runtime.

- **01 · Introduction to Node.js** — What Node.js is, how it differs from browser JS, and how the V8 engine works
- **02 · Basics of CLI** — Working with the command line, shell commands, and scripting fundamentals
- **03 · Basics of OS** — Operating system concepts relevant to backend development (processes, threads, file systems)

---

### Section 04 · Fundamentals of Node.js
> Core building blocks every Node.js developer must understand.

- **01 · Modules** — Module system overview and the module resolution algorithm
- **02 · CommonJS** — `require`, `module.exports`, and the CommonJS spec
- **03 · ESM** — `import`/`export`, `"type": "module"`, and interop with CJS
- **04 · NPM & NPX** — Package management, `package.json`, versioning, and running scripts
- **05 · Shebang** — Writing executable Node.js scripts with `#!/usr/bin/env node`
- **06 · FS** — The `fs` module: reading, writing, watching, and working with the file system
- **User Input** — Capturing and handling user input in CLI applications

---

### Section 05 · Data Representation
> How computers store and communicate data — the foundation of buffers and streams.

- **01 · Digital Data & Units** — Bits, bytes, kilobytes, encoding basics
- **02 · Character Encoding** — ASCII, Unicode, UTF-8, UTF-16, and why encoding matters
- **03 · Endianness & BOM** — Little-endian vs. big-endian, the Byte Order Mark
- **04 · 2's Complement** — How signed integers are represented in binary
- **05 · Buffer to String** — Converting raw binary data back to human-readable text

---

### Section 06 · Buffers
> Deep-diving into Node.js's mechanism for working with raw binary data.

- **01 · ArrayBuffer & DataView** — The Web Platform's low-level binary containers
- **02 · Typed Arrays** — `Uint8Array`, `Int32Array`, and the rest of the TypedArray family
- **03 · Transferring Over Network** — How binary data travels across network sockets
- **04 · Buffer Basics** — Creating and inspecting Node.js `Buffer` objects
- **05 · Buffer Methods** — `slice`, `copy`, `compare`, `fill`, and more
- **06 · Buffer Limitations** — Pool allocation, maximum size, and common gotchas
- **07 · Base64** — Encoding and decoding binary data as Base64 strings

---

### Section 07 · Event-Driven Architecture
> Understanding the async paradigm that powers Node.js.

- **01 · CPU vs. I/O Operations** — Blocking vs. non-blocking work, the event loop explained
- **02 · Event Emitter** — The `EventEmitter` class, custom events, memory leak warnings

---

### Section 08 · Streams
> Processing data efficiently without loading everything into memory.

- **02 · Readable Streams** — Flowing mode, paused mode, and consuming data from a source
- **03 · Writable Streams** — Writing data to a destination, backpressure, and drain events
- **04 · Piping & Pipeline** — Chaining streams with `pipe()` and the safer `pipeline()` utility
- **05 · Child Streams & Demo** — Using streams with child processes
- **06 · File Descriptors** — Low-level file access via `fs.open`, `fs.read`, and file descriptors
- **07 · Promise & Browser Streams** — `stream/promises` API and the Web Streams API

---

### Section 09 · Computer Networking
> The theory behind how data moves across the internet.

- **01 · IP Addresses & Ports** — IPv4/IPv6, subnetting, port ranges, and socket addresses
- *More networking topics* — DNS, TCP/IP stack layers, HTTP protocol internals

---

### Section 10 · Networking with Core Node.js Modules
> Building networked applications without any third-party frameworks.

- **01 · Introduction** — Node.js's networking APIs overview
- **02 · UDP** — Datagrams with the `dgram` module
- **03 · TCP** — Reliable connections with the `net` module
- **04 · HTTP with TCP** — Building HTTP on top of raw TCP sockets
- **05 · HTTP Module** — Using Node's built-in `http` / `https` modules to create servers

---

### Section 11 · Building RESTful APIs with Express
> The industry-standard way to build HTTP backends in Node.js.

- **01 · Express Internals** — How Express processes a request under the hood
- **02 · Middlewares** — Writing, composing, and ordering middleware functions
- **03 · Routing** — Route parameters, query strings, and route organization
- **04 · Serving Static Files** — `express.static`, caching, and serving SPAs
- **05 · Response Methods** — `res.json`, `res.send`, `res.redirect`, status codes
- **06 · CORS** — Cross-Origin Resource Sharing, preflight requests, and the `cors` package
- **07 · Path Module** — Node's `path` module for cross-platform file paths
- **08 · REST API** — REST constraints, resource naming, versioning, and best practices
- **09 · File Uploads** — Handling multipart form data with Multer
- **10 · Cookies** — Setting, reading, and securing HTTP cookies
- **11 · HTTP Internals** — Headers, status codes, keep-alive, and connection management

---

### Section 12 · Mastering Databases with MongoDB
> A thorough exploration of the leading NoSQL database.

- **01 · Database Intro** — Relational vs. document databases, when to use each
- **02 · MongoDB Intro** — Documents, collections, and the MongoDB shell
- **03 · CRUD Operations** — `insertOne`, `find`, `updateMany`, `deleteOne` and variations
- **04 · Inspecting with Wireshark** — Capturing and reading MongoDB wire protocol traffic
- **05 · Data Types** — BSON types: ObjectId, Date, NumberDecimal, and more
- **06 · Server Config** — `mongod` configuration, auth, and storage engines
- **07 · Scripting & Playground** — Using the MongoDB shell for scripting and exploration
- **08 · MongoDB in Node** — Connecting via the official Node.js driver
- **09 · Cursors & Projection** — Efficient data retrieval, field selection, and pagination
- **10 · Bulk Operations** — `bulkWrite` for high-throughput inserts and updates
- **11 · App Architecture** — Structuring a Node.js application around MongoDB
- **12 · Operators & Commands** — Query operators (`$gt`, `$in`, `$regex`), aggregation pipeline
- **13 · Schema Validation** — Enforcing structure with JSON Schema in MongoDB
- **14 · Errors & Transactions** — Multi-document ACID transactions and error handling
- **15 · Data Modeling** — Embedding vs. referencing, patterns for common use cases
- **16 · Backup & Restore** — `mongodump`, `mongorestore`, and Atlas backups
- **17 · Authentication in MongoDB** — Users, roles, and authentication mechanisms
- **18 · Deploying MongoDB** — Replica sets, sharding, and cloud deployment

---

### Section 13 · Mastering MVC Architecture with Mongoose
> Structuring applications cleanly and working with MongoDB through an ODM.

- **01 · MVC Architecture** — Model-View-Controller pattern applied to REST APIs
- **02 · Mongoose Basics** — Connecting, defining schemas, and creating models
- **03 · CRUD with Mongoose** — Using Mongoose's fluent query API
- **04 · Schema & Validation** — Built-in validators, custom validators, and error messages
- **05 · Mongoose Documents** — Document lifecycle, `toObject`, `toJSON`, `lean()`
- **06 · Relationships** — `ref` + `populate`, subdocuments, and discriminators
- **07 · Virtuals & Methods** — Adding computed properties and instance/static methods
- **08 · Mongoose Middlewares** — `pre` / `post` hooks for save, validate, remove, and queries
- **09 · Indexes** — Compound indexes, unique constraints, TTL indexes, and performance
- **10 · Versioning & Errors** — `__v` version key, `CastError`, `ValidationError`, and handling them

---

### Section 14 · Mastering Authentication & Authorization
> Securing your APIs and verifying user identity.

- **01 · Auth Intro** — Authentication vs. Authorization, common strategies
- **02 · Cryptography Basics** — Symmetric vs. asymmetric encryption, hashing, HMAC
- **03 · Password Hashing** — `bcrypt`, salting, and why plaintext storage is catastrophic
- **04 · JWT** — Structure of a JSON Web Token, signing, verification, and refresh tokens
- **05 · Sessions** — Server-side sessions, session stores, and `express-session`
- **06 · Emails** — Transactional email with Nodemailer and third-party providers
- **07 · OAuth & OpenID** — The OAuth 2.0 authorization framework and OpenID Connect
- **08 · Google Login** — Implementing "Sign in with Google" using Passport.js
- **09 · Grant Types** — Authorization Code, Client Credentials, Implicit, and PKCE flows
- **10 · GitHub Login** — Implementing "Sign in with GitHub" via OAuth 2.0

---

### Section 15 · Role-Based Access Control (RBAC)
> Fine-grained permission management for multi-user applications.

- **01 · RBAC Basics** — Roles, permissions, and policy enforcement patterns
- **02 · Zanzibar & OpenFGA** — Google's Zanzibar model and OpenFGA as a practical implementation
- **03 · Assignments** — Hands-on RBAC implementation exercises

---

### Section 16 · Redis Essentials for Performant Apps
> Supercharging your backend with in-memory data structures.

- **01 · Redis Intro** — What Redis is, why it's fast, use cases
- **02 · Data Types** — Strings, lists, sets, sorted sets, hashes, streams
- **03 · String Commands** — `GET`, `SET`, `INCR`, `EXPIRE`, `TTL`, and more
- **04 · Database Management** — Multiple databases, `FLUSHDB`, `SELECT`, persistence options
- **05 · Redis in Node** — Connecting with `ioredis` / `node-redis`, pipelines
- **06 · Caching** — Cache-aside pattern, cache invalidation, and best practices
- **07 · Redis Search** — Full-text and vector search with RediSearch
- **08 · Pub/Sub** — Publish-Subscribe messaging with Redis channels
- **09 · Auth & Eviction** — ACL, password protection, and memory eviction policies
- **10 · Redis Cloud** — Deploying to Redis Cloud, monitoring, and scaling
- **11 · More Topics** — Rate limiting, distributed locks, and session storage

---

### Section 17 · Securing Node.js Applications
> Defending your backend against real-world attacks.

- **01 · Security Basics** — OWASP Top 10, threat modeling, defense in depth
- **02 · SQL Injection** — How injection attacks work and parameterized query defenses
- **03 · Same-Origin Policy** — The browser's security model and its implications for APIs
- **04 · XSS Attacks** — Stored, reflected, and DOM-based Cross-Site Scripting
- **05 · Content Security Policy** — Setting CSP headers to mitigate XSS
- **06 · Clickjacking** — Frame-busting, `X-Frame-Options`, and `frame-ancestors`
- **07 · Cookies & Security** — `HttpOnly`, `Secure`, `SameSite`, and cookie theft vectors
- **08 · HTTPS** — TLS handshake, certificates, HSTS, and forcing secure connections
- **09 · CSRF Attacks** — Cross-Site Request Forgery and double-submit cookie patterns
- **10 · DoS & DDoS** — Denial of service, amplification attacks, and mitigation strategies
- **11 · Rate Limiting & Throttling** — Token bucket, sliding window, and `express-rate-limit`
- **12 · Security Headers** — Helmet.js and the headers that harden your HTTP responses
- **13 · Miscellaneous Security** — HPP, prototype pollution, and dependency auditing

---

### Section 18 · Cloud Storage Integration with AWS S3
> Storing and serving files at scale with Amazon S3.

- **01 · S3 Intro & Basics** — Buckets, objects, keys, and the S3 data model
- **02 · AWS CLI & S3 CLI** — Managing S3 resources from the command line
- **03 · S3 API & SDK Basics** — Authenticating and making requests with `@aws-sdk/client-s3`
- **04 · S3 CRUD & File Operations** — Uploading, downloading, copying, and deleting objects
- **05 · Signed URLs** — Generating pre-signed URLs for temporary, secure object access
- **06 · IAM Basics** — Users, groups, roles, and least-privilege access policies
- **07 · Bucket Policies & Security** — Public access blocks, ACLs, and bucket policies
- **08 · Storage Classes & Pricing** — Standard, Intelligent-Tiering, Glacier, and cost optimization
- **09 · CloudFront & CDN** — Distributing S3 content globally via CloudFront
- **10 · CORS in S3** — Configuring bucket CORS for browser-based uploads

---

### Section 19 · Payment Gateway Integration
> Accepting real money in your applications.

- **Intro to Payment Gateways** — How payment gateways work, PCI compliance overview
- **01 · Razorpay** — Orders API, checkout integration, and payment verification
- **02 · Webhooks** — Listening for async payment events and verifying signatures
- **03 · Stripe** — Stripe's payment intents API and the Stripe CLI
- **Ngrok** — Tunnelling localhost for webhook testing
- **Node Cron** — Scheduling recurring payment and reconciliation jobs
- **Invoice vs. Receipt** — The business and technical distinction between the two
- **Assignments & More to Explore** — Extended payment-related exercises

---

### Section 20 · Deploying Node.js Applications & CI/CD
> Taking your application from laptop to production.

- **01 · PM2** — Process management, clustering, and zero-downtime restarts
- **02 · Nginx** — Reverse proxying, load balancing, and serving static files
- **03 · CI/CD** — Continuous Integration and Continuous Delivery concepts
- **04 · GitHub Actions** — Writing workflows, secrets management, and automated deploys
- **05 · SSL & HTTPS** — Issuing certificates with Let's Encrypt and Certbot
- **06 · AWS CloudFront** — CDN configuration, cache behaviors, and custom domains
- **07 · Cloudflare & DNS** — DNS management, proxying, and Cloudflare Workers basics
- **08 · DevOps Basics** — Docker introduction, containerisation, and infrastructure-as-code concepts
- **09 · Deployment Strategies** — Blue/green, canary, rolling, and feature-flag deployments

---

## 🏗️ Repository Structure

```
Backend-Mastery/
├── 01-02-03-Intro-to-Nodejs-Basics-of-CLI-and-OS/
│   ├── 01-Introduction-to-Nodejs/
│   │   ├── Learning/
│   │   ├── Revision/
│   │   └── Interview/
│   └── ...
├── 04-Fundamentals-of-Nodejs/
├── 05-Data-Representation/
├── ...
└── 20-Deploying-Nodejs-Applications-and-CI-CD/
```

Each topic directory follows this three-phase layout:

```
<topic>/
├── Learning/      ← Notes + code written while learning
├── Revision/      ← Condensed notes for quick review
└── Interview/     ← Key points and Q&A for interviews
```

---

## 🛠️ Tech Stack Covered

| Category | Technologies |
|---|---|
| **Runtime** | Node.js |
| **Frameworks** | Express.js |
| **Databases** | MongoDB, Redis |
| **ODM** | Mongoose |
| **Auth** | JWT, Sessions, OAuth 2.0 (Google, GitHub), Passport.js |
| **Cloud** | AWS S3, AWS CloudFront, IAM |
| **Payments** | Razorpay, Stripe |
| **DevOps** | PM2, Nginx, GitHub Actions, Docker (basics) |
| **DNS/CDN** | Cloudflare, AWS CloudFront |
| **Tools** | Wireshark, AWS CLI, Ngrok, Node Cron |

---

## 📋 Prerequisites

- Comfortable with JavaScript (ES6+)
- Basic understanding of HTML & the browser
- Familiarity with Git and the command line

---

## 🎯 Learning Goals

By the end of this course you will be able to:

- [ ] Explain the Node.js event loop and write non-blocking, async code confidently
- [ ] Build production-grade RESTful APIs with Express and MongoDB
- [ ] Implement secure authentication flows (JWT, OAuth 2.0, Sessions)
- [ ] Design and enforce role-based access control systems
- [ ] Use Redis for caching, pub/sub, and session management
- [ ] Harden applications against OWASP Top 10 vulnerabilities
- [ ] Store and serve files at scale using AWS S3 and CloudFront
- [ ] Integrate payment gateways (Razorpay & Stripe) with webhook verification
- [ ] Deploy Node.js apps with PM2 + Nginx + SSL on a Linux server
- [ ] Automate deployments using GitHub Actions CI/CD pipelines

---

> **Note:** This is a living repository. Notes, code samples, and revision materials are added progressively as each topic is covered.