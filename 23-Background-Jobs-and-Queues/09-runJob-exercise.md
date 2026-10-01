# The `runJob` Exercise

The lesson includes a practical JavaScript exercise.

The function is:

```javascript
runJob(job, store, handler)
```

Its purpose is to implement an **at-least-once worker guard**.

The rules are:

### Case 1: Job already ran

If:

```javascript
store[job.id]
```

exists, the job has already completed.

Return:

```javascript
{
  ok: true,
  skipped: true
}
```

and **do not call the handler**.

---

### Case 2: Job has not run

Call:

```javascript
handler(job)
```

Then record the result in:

```javascript
store[job.id]
```

and return:

```javascript
{
  ok: true,
  skipped: false
}
```

---

### Case 3: Handler throws

If:

```javascript
handler(job)
```

throws an error:

* record nothing
* increase the attempt count
* determine whether the job is dead

Return:

```javascript
{
  ok: false,
  attempts: job.attempts + 1,
  dead: job.attempts + 1 >= 3
}
```

So the job becomes dead at the third attempt.

---

# Correct Worker-Guard Logic

A direct implementation of the exercise is:

```javascript
function runJob(job, store, handler) {
  if (store[job.id]) {
    return {
      ok: true,
      skipped: true
    };
  }

  try {
    const result = handler(job);

    store[job.id] = result;

    return {
      ok: true,
      skipped: false
    };
  } catch (error) {
    return {
      ok: false,
      attempts: job.attempts + 1,
      dead: job.attempts + 1 >= 3
    };
  }
}
```

### Important detail

Notice that the result is recorded **only after the handler succeeds**.

If the handler throws:

```text
handler throws
    ↓
do NOT record result
    ↓
return failure information
```

This is important because recording a failed execution as completed would cause future retries to be skipped incorrectly.

---

# Walking Through the Exercise

Suppose:

```javascript
const job = {
  id: "job-1",
  attempts: 0
};

const store = {};
```

and:

```javascript
function handler(job) {
  return "done";
}
```

First execution:

```text
store["job-1"]?
      ↓
    no
      ↓
handler(job)
      ↓
   "done"
      ↓
store["job-1"] = "done"
```

Result:

```javascript
{
  ok: true,
  skipped: false
}
```

Now run the same job again.

```text
store["job-1"]?
      ↓
     yes
      ↓
    skip
```

Result:

```javascript
{
  ok: true,
  skipped: true
}
```

The handler does not execute again.

This is a simple demonstration of **idempotent job handling**.

---

# Failed Attempt Example

Suppose:

```javascript
const job = {
  id: "job-1",
  attempts: 1
};
```

and:

```javascript
function handler(job) {
  throw new Error("Something failed");
}
```

The handler throws.

So:

```text
attempts = 1
new attempts = 2
```

Return:

```javascript
{
  ok: false,
  attempts: 2,
  dead: false
}
```

Because:

```javascript
2 >= 3
```

is false.

On the next failed attempt:

```text
attempts = 2
new attempts = 3
```

Return:

```javascript
{
  ok: false,
  attempts: 3,
  dead: true
}
```

Now the job has reached the dead threshold.
