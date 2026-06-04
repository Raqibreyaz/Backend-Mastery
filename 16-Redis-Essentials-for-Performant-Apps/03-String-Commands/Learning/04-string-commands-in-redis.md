# Redis String Commands

Redis strings are the most basic kind of Redis value. Below is a list of all commonly used Redis string commands.

---

## 🔹 SET Commands

### `SET key value`

Sets the value of a key.

```bash
SET name "Anurag"
```

### `SETNX key value`

Sets the key only if it does not already exist.

```bash
SETNX name "ProCodrr"
```

---

## 🔹 GET Commands

### `GET key`

Gets the value of a key.

```bash
GET name
```

### `GETRANGE key start end`

Gets a substring of the string stored at a key.

```bash
GETRANGE name 0 2  # "Anu"
```

### `GETSET key value`

Sets a new value and returns the old one.

```bash
GETSET name "ProCodrr"  # returns "Anurag"
```

---

## 🔹 Modification Commands

### `APPEND key value`

Appends a value to a string.

```bash
APPEND name " Singh"
```

### `STRLEN key`

Gets the length of the string value stored at a key.

```bash
STRLEN name
```

---

## 🔹 Numeric Operations

### `INCR key`

Increments the numeric value of a string by one.

```bash
INCR counter
```

### `INCRBY key increment`

Increments by a specific value.

```bash
INCRBY counter 10
```

### `DECR key`

Decrements the numeric value of a string by one.

```bash
DECR counter
```

### `DECRBY key decrement`

Decrements by a specific value.

```bash
DECRBY counter 5
```

### `INCRBYFLOAT key increment`

Increments the value by a floating point number.

```bash
INCRBYFLOAT balance 2.5
```

---

## 🗑️ Utility

### `DEL key`

Deletes a key (works for strings and all types).

```bash
DEL name
```

---

For a full reference, visit the [official Redis documentation](https://redis.io/commands/#string).
