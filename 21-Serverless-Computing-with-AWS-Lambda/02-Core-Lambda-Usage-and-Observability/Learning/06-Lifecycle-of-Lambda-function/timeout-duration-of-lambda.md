## 1️⃣ Timeout (3 seconds) ⏱️

### What this timeout actually means

**Timeout is the maximum total time Lambda allows a single invocation to live.**

Important word here is **total**.

It includes:

* ❄️ Cold start time (if it happens)
* 🧠 Init phase (runtime + top-level code)
* ▶️ Handler execution
* 📦 Response serialization

If **anything** crosses 3 seconds, Lambda forcefully kills the execution.

---

### What happens when timeout is hit 💥

When the timeout is exceeded:

* Lambda **terminates the Firecracker microVM**
* Your code stops immediately
* No graceful shutdown
* `finally` blocks may not run
* Open DB connections are dropped
* `/tmp` is wiped later

To the caller:

* You get a timeout error
* HTTP client sees failure

So timeout is **not just handler time**, it is **life expectancy of that invocation**.

---

### Why 3 seconds is dangerous by default ⚠️

3 seconds sounds fine, but:

* Cold start alone can take hundreds of milliseconds
* Network calls can easily take 1 to 2 seconds
* Any external API makes this risky

That is why:

* Short timeout = strict execution discipline
* Long timeout = more flexibility, but higher worst-case billing

---

### Mental model 🧠

Think of timeout as:

> “After this much time, Lambda pulls the power plug.”