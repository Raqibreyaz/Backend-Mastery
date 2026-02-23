# 📚 Redis Lists and Common Commands

## 🔸 What is a Redis List?

A **Redis List** is an **ordered collection of strings**. It acts like a **linked list** and supports operations from both the **head (left)** and **tail (right)** ends.

You can use lists to implement any kind of queues and stacks.


## 🛠 Common List Commands

### 1. **LPUSH** – Add to the left (head)

```bash
LPUSH mylist "apple"
LPUSH mylist "banana"
```

List: `banana -> apple`

### 2. **RPUSH** – Add to the right (tail)

```bash
RPUSH mylist "cherry"
```

List: `banana -> apple -> cherry`

### 3. **LPOP** – Remove from the left

```bash
LPOP mylist
```

Returns: `banana`
List after: `apple -> cherry`

### 4. **RPOP** – Remove from the right

```bash
RPOP mylist
```

Returns: `cherry`
List after: `apple`

### 5. **LRANGE** – Get a range of elements

```bash
LRANGE mylist 0 -1
```

Returns all elements from index 0 to the end.

### 6. **LLEN** – Get the length of the list

```bash
LLEN mylist
```

Returns: `1` (after the above operations)

### 7. **LREM** – Remove elements by value

```bash
LREM mylist 1 "apple"
```

Removes 1 occurrence of `"apple"` from the list.

### 8. **LINDEX** – Get element by index

```bash
LINDEX mylist 0
```

Returns: First element in the list.

### 9. **LTRIM** – Keep only a specified range

```bash
LTRIM mylist 0 2
```

Trims the list to keep only elements from index 0 to 2.

---

## 🧪 Example

```bash
DEL mylist
LPUSH mylist "a" "b" "c"
LRANGE mylist 0 -1
```

Output: `c`, `b`, `a`

---

## ✅ Notes

* Lists are ideal for **FIFO (RPUSH + LPOP)** and **LIFO (LPUSH + LPOP)** queues.
* Always check `LLEN` to avoid popping from an empty list.
