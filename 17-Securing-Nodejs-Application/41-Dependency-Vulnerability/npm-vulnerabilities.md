# 🧨 What are NPM Vulnerabilities?

When you run `npm install`, NPM **checks the dependencies** you're installing and their sub-dependencies for **known security vulnerabilities**.

These vulnerabilities are part of a **public advisory database** (like the one managed by the GitHub Advisory Database).

---

### ⚠️ Example Output:

You might see something like:

```
found 3 vulnerabilities (1 low, 1 moderate, 1 high) in 1033 scanned packages
```

---

### 📚 Types of Vulnerabilities Reported

| Severity     | What It Typically Means                                     |
| ------------ | ----------------------------------------------------------- |
| **Low**      | Minor issue, may not be exploitable in most cases           |
| **Moderate** | Some risk, but requires specific conditions                 |
| **High**     | Easily exploitable; likely affects real-world security      |
| **Critical** | Very serious — remote code execution (RCE), full compromise |

---

### 🕵️ Common Vulnerability Types in NPM Packages:

| Vulnerability Type                               | Description                                                               |
| ------------------------------------------------ | ------------------------------------------------------------------------- |
| **Prototype Pollution**                          | Attacker can manipulate an object’s prototype, affecting entire app logic |
| **Regular Expression Denial of Service (ReDoS)** | Malicious regex causes your app to hang                                   |
| **Command Injection**                            | Arbitrary commands executed on the server                                 |
| **Directory Traversal**                          | Attacker accesses restricted files outside the allowed path               |
| **Cross-Site Scripting (XSS)**                   | If used in frontend packages (e.g., rendering unsafe HTML)                |
| **Arbitrary Code Execution**                     | Attacker runs JS code on the system during install or usage               |

---

### 🔎 How to Check for These

* `npm audit` — Checks your current project for vulnerabilities.
* `npm audit fix` — Automatically tries to fix vulnerabilities by updating dependencies.

---

### 🚧 Limitations

* Sometimes fixes are not possible without **breaking changes** (major version bumps).
* Vulnerabilities may exist in **deep nested dependencies**.
* Some may be **false positives** or not relevant to your use-case (e.g., dev-only code).

---

### ✅ Best Practices

* Use `npm audit` regularly.
* Use tools like [Snyk](https://snyk.io/) or GitHub Dependabot.
* Review changelogs before blindly updating dependencies.
* Pin your dependencies and update them intentionally.
