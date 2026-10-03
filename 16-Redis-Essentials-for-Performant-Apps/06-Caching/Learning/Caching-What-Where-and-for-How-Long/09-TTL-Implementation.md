# TTL Implementation

## Cache TTL

The exercise in the lesson focuses on a basic cache with a **time to live (TTL)**.

TTL means:

> **How long a cache entry remains valid.**

Suppose:

```text
now = 1000
ttl = 5000 ms
```

Then:

```text
until = 1000 + 5000
      = 6000
```

The entry is valid before its expiration time.

---

## `cacheSet`

The exercise asks you to implement:

```javascript
cacheSet(store, key, value, now, ttlMs)
```

The intended representation is:

```javascript
store[key] = {
  value,
  until: now + ttlMs
};
```

Example:

```javascript
const store = {};

cacheSet(
  store,
  "user:42",
  { name: "Raquib" },
  1000,
  5000
);
```

The store becomes conceptually:

```javascript
{
  "user:42": {
    value: { name: "Raquib" },
    until: 6000
  }
}
```

---

## `cacheGet`

The exercise also asks for:

```javascript
cacheGet(store, key, now)
```

It should return:

### Cache hit

```javascript
{
  hit: true,
  value: ...
}
```

### Cache miss

```javascript
{
  hit: false
}
```

The important part is:

> **An entry existing in the object does not mean that it is still valid.**

You must check its expiration time. 

---

## Correct TTL Logic

Conceptually:

```javascript
function cacheGet(store, key, now) {
  const entry = store[key];

  if (!entry) {
    return { hit: false };
  }

  if (now >= entry.until) {
    delete store[key];
    return { hit: false };
  }

  return {
    hit: true,
    value: entry.value
  };
}
```

And:

```javascript
function cacheSet(store, key, value, now, ttlMs) {
  store[key] = {
    value,
    until: now + ttlMs
  };
}
```

---

## Why Delete Expired Entries?

Suppose you simply return:

```javascript
{ hit: false }
```

when an entry expires.

But you leave:

```javascript
store[key]
```

inside the store.

Then expired entries accumulate:

```text
store
 ├── old entry
 ├── old entry
 ├── old entry
 ├── old entry
 └── ...
```

The exercise specifically requires expired entries to be **removed** so they do not pile up. 

So expiration has two effects:

```text
Expired
  ↓
Treat as absent
  +
Delete from store
```

---

## TTL Timeline

Suppose:

```text
set time = 1000
TTL = 5000
expiration = 6000
```

Then:

```text
time
1000                    6000
 │-----------------------│
       VALID
                         │
                         ↓
                      EXPIRED
```

At:

```text
now = 5000
```

result:

```javascript
{
  hit: true,
  value: ...
}
```

At:

```text
now = 6000
```

the entry has expired:

```javascript
{
  hit: false
}
```

and it should be deleted.

---

## Minimal Implementation

The entire TTL exercise can be represented by:

```javascript
function cacheSet(store, key, value, now, ttlMs) {
  store[key] = {
    value,
    until: now + ttlMs
  };
}

function cacheGet(store, key, now) {
  const entry = store[key];

  if (!entry) {
    return { hit: false };
  }

  if (now >= entry.until) {
    delete store[key];
    return { hit: false };
  }

  return {
    hit: true,
    value: entry.value
  };
}
```

The key logic is:

```text
cacheSet
   ↓
store value + expiration time

cacheGet
   ↓
does entry exist?
   ↓
NO → miss
   ↓
YES
   ↓
expired?
 ┌───────┴────────┐
YES              NO
 ↓                 ↓
delete            hit
 ↓                 ↓
miss              value
```

---

**Next:** [Design Checklist and Common Mistakes →](./09-Design-Checklist-and-Common-Mistakes.md)
