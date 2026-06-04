# 🌈 Rainbow Tables and Rainbow Table Attacks

## 🔍 What is a Rainbow Table?

A **Rainbow Table** is a precomputed lookup table used to reverse cryptographic hash functions — primarily to crack password hashes.

It contains a large list of **plaintext inputs** (like common passwords) and their corresponding **hash outputs**.

Instead of hashing each guess during an attack, the attacker just searches the table — making the process very fast.

---

## ⚠️ What is a Rainbow Table Attack?

A **Rainbow Table Attack** is when an attacker uses a rainbow table to:

- Look up the **hash of a stolen password** (e.g., from a database breach).
- Match it against known hash entries in the table.
- Retrieve the original **plaintext password**.

This works **only** if:

- The hash function used is known (e.g., SHA-1, SHA-256).
- No **salt** was used during hashing.

---

## 🛡️ How to Prevent Rainbow Table Attacks

1. **Always use a salt**: A unique random salt per password ensures that even the same password has a different hash.
2. **Use KDFs**: Functions like PBKDF2, bcrypt, scrypt, and Argon2 make hashing slow, which makes precomputation expensive.
3. **Avoid plain SHA-256/MD5** for password storage — they are fast and vulnerable to brute-force + rainbow tables.

---

## 🧪 Rainbow Table (SHA-256)

| Plaintext | SHA-256 Hash                                                       |
| --------- | ------------------------------------------------------------------ |
| password  | `5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8` |
| 1234      | `03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4` |
| qwerty    | `65e84be33532fb784c48129675f9eff3a682b27168c0ea744b2cf58ee02337c5` |
| letmein   | `1c8bfe8f801d79745c4631d09fff36c82aa37fc4cce4fc946683d7b336b63032` |
| admin     | `8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918` |
| welcome   | `280d44ab1e9f79b5cce2dd4f58f5fe91f0fbacdac9f7447dffc318ceb79f2d02` |
| ninja     | `54482595177116e6103b076dbf30648e5d0537dd1ed9cf5ae4562fa8a700d47b` |
| abc123    | `6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090` |
| iloveyou  | `e4ad93ca07acb8d908a3aa41e920ea4f4ef4f26e7f86cf8291c5db289780a5ae` |
| football  | `6382deaf1f5dc6e792b76db4a4a7bf2ba468884e000b25e7928e621e27fb23cb` |

---

## 🌐 Popular Websites to Crack Hashes

Here are three popular websites that can help crack hash values:

1. **[CrackStation](https://crackstation.net/)** — A powerful online hash cracker with a large lookup table (15GB+). Supports MD5, SHA1, SHA256. Easy to use and fast for common hashes.

2. **[Hashes.com](https://hashes.com/)** — A community-driven hash cracking service. You can upload hash lists, and it will try cracking using a massive collection of known hashes.

---

## 🔚 Conclusion

Rainbow tables are powerful tools for attackers — but they’re only effective if the hash is unsalted and predictable.

**Best defense: salt + slow hash + strong password policy.**

Want to see how to generate your own hashes or simulate an attack in Node.js or Python? Let me know!
