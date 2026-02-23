# 📡 Pub/Sub in Computer Science and Redis

## 🔹 What is Pub/Sub?

**Pub/Sub (Publish/Subscribe)** is a messaging pattern where:

* **Publishers** send messages to a channel.
* **Subscribers** listen to specific channels and receive messages automatically.
* Publishers and subscribers are **decoupled** (they don’t know about each other).

This model is useful for building **event-driven**, **real-time**, and **distributed systems**.

---

## 🔹 Use Cases of Pub/Sub

* **Chat applications** (e.g., chat rooms)
* **Notification systems** (e.g., send alerts to users)
* **Real-time analytics** (e.g., logs, stock data)
* **IoT device communication**
* **Microservices communication** (loosely coupled systems)

---

## 🔹 Redis Pub/Sub Concepts

* Redis provides a lightweight Pub/Sub implementation.
* Messages are **not persisted** — subscribers must be connected to receive them.
* Uses **TCP connections** to deliver messages.

---

## 🔹 Redis Pub/Sub Commands

### ▶ SUBSCRIBE

Subscribe to a channel.

```bash
SUBSCRIBE cli_channel
```

### ▶ PUBLISH

Send a message to all subscribers of a channel.

```bash
PUBLISH cli_channel "Hello World"
```

### ▶ UNSUBSCRIBE

Stop listening to a channel.

```bash
UNSUBSCRIBE cli_channel
```

---

## 🔹 Using Redis Pub/Sub in Node.js (Official Library)

### Step 1: Connect and Use Pub/Sub

```js
const { createClient } = require('redis');

// Publisher client
const redisClient = createClient();
await redisClient.connect();

// Subscribe to a channel
await redisClient.subscribe('cli_channel', (message) => {
  console.log('Received:', message);
});

// Publish a message
await redisClient.publish('node_channel', 'Hello from publisher');
```

### 🔄 Notes

* You must use **separate Redis connections** for publishing and subscribing.
* Subscriptions are blocking; the client stays in listening mode.

---

## 🧠 Summary

* Pub/Sub enables decoupled, event-driven communication.
* Redis offers a simple, fast in-memory Pub/Sub system.
* It’s great for real-time use cases where message persistence isn’t needed.
* Use the official Redis Node.js client for simple integration.
