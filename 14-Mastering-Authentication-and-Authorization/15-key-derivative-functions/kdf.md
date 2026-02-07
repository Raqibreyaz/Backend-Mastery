# 🔐 Key Derivation Functions (KDFs)

Key Derivation Functions (KDFs) are cryptographic algorithms used to derive secure keys from a shared secret, such as a password, passphrase, or master key.

---

## 🧠 Why Do We Need KDFs?

Raw passwords or secrets are:

- Often short
- Human-readable
- Not random enough for cryptographic operations

A KDF helps convert a weak or low-entropy secret into a strong, cryptographically secure key.

---

## 🔁 How Does a KDF Work?

A typical KDF process involves:

- **Input**: A password or shared secret
- **Salt**: A random value to prevent precomputed attacks
- **Iterations**: Repeated hashing to slow down brute-force
- **Output**: A strong cryptographic key

Example:

```js
StrongKey = KDF(password, salt, iterations);
```

---

## 🧰 Popular Key Derivation Functions

| KDF        | Description                                                                 |
| ---------- | --------------------------------------------------------------------------- |
| **PBKDF2** | Password-Based Key Derivation Function 2; uses HMAC and multiple iterations |
| **bcrypt** | Adds built-in salt and adaptive cost; good for password storage             |
| **scrypt** | Memory-intensive; resists parallel attacks                                  |
| **Argon2** | Modern, memory-hard KDF; recommended for password hashing                   |
| **HKDF**   | Used for deriving keys from a master key in secure protocols                |

---

## ✅ When Are KDFs Used?

- 🔑 Password storage (hashing)
- 🔒 Deriving encryption keys from user passwords
- 🔐 Secure protocol key generation (e.g., TLS, SSH)
- 🔁 Session key derivation (e.g., Signal, WhatsApp)

---

## 🔐 Using PBKDF2 in Node.js (Example)

```js
const crypto = require("crypto");

const password = "mysecret";
const salt = crypto.randomBytes(16);
const iterations = 100000;
const keylen = 32; // For AES-256
const digest = "sha256";

crypto.pbkdf2(password, salt, iterations, keylen, digest, (err, derivedKey) => {
  if (err) throw err;
  console.log("Derived key:", derivedKey.toString("hex"));
});
```

---

## 🔒 Best Practices

- Always use a **unique salt** per key/user.
- Use **high iteration counts** to slow down brute-force attempts.
- Never use raw passwords directly as encryption or signing keys.

---

## 🍪 KDFs and Cookie Signing

In apps like Express.js, you might use a secret for signing cookies:

```js
const cookieParser = require("cookie-parser");
app.use(cookieParser("mySecretKey"));
```

If `mySecretKey` is a short or predictable string, it should be strengthened using a KDF:

```js
const crypto = require("crypto");

const password = process.env.COOKIE_SECRET;
const salt = "cookie-signing-salt";
const iterations = 100000;
const keyLength = 32;

const derivedKey = crypto.pbkdf2Sync(
  password,
  salt,
  iterations,
  keyLength,
  "sha256",
);
app.use(cookieParser(derivedKey.toString("hex")));
```

---

## 📈 Choosing a Good Number of Iterations

A good number of iterations depends on the environment and security requirements:

| Environment        | Recommended Iterations |
| ------------------ | ---------------------- |
| Web apps / APIs    | 100,000 – 300,000      |
| High-security apps | 600,000 – 1,000,000    |

> Rule of thumb: Choose an iteration count that results in \~100–300ms of computation time on your production server.

Use this code to benchmark:

```js
console.time("pbkdf2");
crypto.pbkdf2Sync("password", "salt", 100000, 32, "sha256");
console.timeEnd("pbkdf2");
```

---

## 🎯 Summary

- KDFs transform weak secrets into strong cryptographic keys.
- Always use salts and high iteration counts.
- Use PBKDF2, bcrypt, scrypt, or Argon2 depending on your use case.
- In modern apps, it is safer to derive keys for signing/encryption using KDFs rather than using raw secrets directly.

Want to explore Argon2 or scrypt examples too? Just ask! ✨
