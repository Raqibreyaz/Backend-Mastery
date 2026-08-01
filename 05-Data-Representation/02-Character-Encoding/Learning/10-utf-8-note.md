# UTF-8 — Complete Notes (From Start to Bit Patterns)

Every time you see a file size mismatch, a garbled emoji, or a Hindi letter taking "too many bytes," you're running into the consequences of how computers turn abstract characters into concrete bytes — and UTF-8 is the system that quietly runs the entire internet while most engineers only vaguely understand it. [en.wikipedia](https://en.wikipedia.org/wiki/UTF-8)

## What Is It?

UTF-8 (Unicode Transformation Format – 8-bit) is a way to turn Unicode code points (numbers assigned to characters, like 97 for 'a' or 2325 for 'क') into actual bytes that a computer can store or send. It's the most common encoding on the web, used by over 95% of all websites today. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Glossary/UTF-8)

## One-Sentence Summary

UTF-8 is a variable-length encoding that uses 1 to 4 bytes per character, designed to be backward-compatible with ASCII while supporting every Unicode character in the world, using a clever bit-pattern system where the first few bits of each byte signal how many bytes belong to the character.

## Why UTF-8 Was Invented

Before UTF-8, there was a problem: ASCII could only handle 128 English characters (0–127), but Unicode had over a million code points for all languages. The challenge was: how do you encode all those huge numbers without wasting tons of space on simple English text? [blog.hubspot](https://blog.hubspot.com/website/what-is-utf-8)

UTF-8 solved this with a clever trick: simple characters (like English letters) use just 1 byte, but complex characters (like emojis or Chinese) use 2, 3, or 4 bytes as needed. [informatecdigital](https://informatecdigital.com/en/what-is-utf-8/)

## The Building Blocks: Bits, Bytes, and Patterns

UTF-8 uses the first few bits of each byte as "signals" to tell the decoder how many bytes belong to one character: [informatecdigital](https://informatecdigital.com/en/what-is-utf-8/)

| Bytes | Signal Pattern | Data Bits Available | Max Code Point |
|---|---|---|---|
| 1 byte | `0xxxxxxx` | 7 bits | U+007F (127)  [twilio](https://www.twilio.com/docs/glossary/what-utf-8) |
| 2 bytes | `110xxxxx 10xxxxxx` | 11 bits (5 + 6) | U+07FF (2047)  [medium](https://medium.com/@briannqc/utf-8-explained-its-not-8-bits-encoding-nor-32-bits-unicode-205362df9c80) |
| 3 bytes | `1110xxxx 10xxxxxx 10xxxxxx` | 16 bits (4 + 6 + 6) | U+FFFF (65535) |
| 4 bytes | `11110xxx 10xxxxxx 10xxxxxx 10xxxxxx` | 21 bits (3 + 6 + 6 + 6) | U+10FFFF (1114111)  [medium](https://medium.com/@briannqc/utf-8-explained-its-not-8-bits-encoding-nor-32-bits-unicode-205362df9c80) |

The key rules:
- If a byte starts with 0, it's a standalone ASCII character (1 byte total). [medium](https://medium.com/@briannqc/utf-8-explained-its-not-8-bits-encoding-nor-32-bits-unicode-205362df9c80)
- If a byte starts with 110, it means "this character is 2 bytes total". [informatecdigital](https://informatecdigital.com/en/what-is-utf-8/)
- If a byte starts with 1110, it means "this character is 3 bytes total."
- If a byte starts with 11110, it means "this character is 4 bytes total."
- If a byte starts with 10, it means "I'm a continuation byte" — part of a multi-byte character.

## Exact Boundary Code Points

| Code Point | Decimal | Binary | UTF-8 Bytes | Hex Encoding |
|---|---|---|---|---|
| U+0000 | 0 | `0` | 1 byte | `00` |
| U+007F | 127 | `1111111` | 1 byte | `7F` (last 1-byte char)  [twilio](https://www.twilio.com/docs/glossary/what-utf-8) |
| U+0080 | 128 | `10000000` | 2 bytes | `C2 80` (first 2-byte char) |
| U+07FF | 2047 | `11111111111` | 2 bytes | `DF BF` (last 2-byte char)  [medium](https://medium.com/@briannqc/utf-8-explained-its-not-8-bits-encoding-nor-32-bits-unicode-205362df9c80) |
| U+0800 | 2048 | `100000000000` | 3 bytes | `E0 A0 80` (first 3-byte char) |
| U+FFFF | 65535 | `1111111111111111` | 3 bytes | `EF BF BF` (last 3-byte char) |
| U+10000 | 65536 | `10000000000000000` | 4 bytes | `F0 90 80 80` (first 4-byte char)  [medium](https://medium.com/@briannqc/utf-8-explained-its-not-8-bits-encoding-nor-32-bits-unicode-205362df9c80) |
| U+10FFFF | 1114111 | `10000111111111111111` | 4 bytes | `F4 8F BF BF` (last valid Unicode) |

## Simple Examples: Step-by-Step Encoding

### 1-Byte: 'a' (code point 97)

```
Code point: 97
Binary:     1100001 (7 bits)
Pattern:    0xxxxxxx
Result:     01100001 = 61 (hex) = 1 byte

Verification:
echo -n "a" | xxd -g 1
Output: 61
```

### 1-Byte Boundary: DEL (code point 127, last 1-byte char)

```
Code point: 127
Binary:     1111111 (7 bits)
Pattern:    0xxxxxxx
Result:     01111111 = 7F (hex) = 1 byte ✓
```

### 2-Byte: 'ñ' (code point 241)

```
Code point: 241
Binary:     11110001 (8 bits, needs 2 bytes)
Pattern:    110xxxxx 10xxxxxx
Split:      11110 001
Fill:       11000011 10110001
Result:     C3 B1 (hex) = 2 bytes

Verification:
echo -n "ñ" | xxd -g 1
Output: c3 b1
```

### 2-Byte Boundary: U+07FF (code point 2047, last 2-byte char)

```
Code point: 2047
Binary:     11111111111 (11 bits)
Pattern:    110xxxxx 10xxxxxx
Split:      11111 11111111
Fill:       11011111 10111111
Result:     DF BF (hex) = 2 bytes ✓
```

### 3-Byte: 'क' (code point 2325)

```
Code point: 2325
Binary:     100100010101 (12 bits, needs 3 bytes)
Pattern:    1110xxxx 10xxxxxx 10xxxxxx
Split:      1001 000101 01
Fill:       11100000 10100001 10100101
Result:     E0 A1 A5 (hex) = 3 bytes

Verification:
echo -n "क" | xxd -g 1
Output: e0 a4 95
```

### 3-Byte Boundary: U+0800 (code point 2048, first 3-byte char)

```
Code point: 2048
Binary:     100000000000 (12 bits)
Pattern:    1110xxxx 10xxxxxx 10xxxxxx
Split:      0000 100000 000000
Fill:       11100000 10100000 10000000
Result:     E0 A0 80 (hex) = 3 bytes ✓
```

### 4-Byte: 🎉 (code point U+1F389 = 127881)

```
Code point: 127881
Binary:     0001 1111 0011 1000 1001 (17 bits, needs 4 bytes)
Pattern:    11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
Split:      000 111111 001110 001001
Fill:       11110000 10111111 10001110 10001001
Result:     F0 9F 8E 89 (hex) = 4 bytes

Verification:
echo -n "🎉" | xxd -g 1
Output: f0 9f 8e 89
```

### 4-Byte Boundary: U+10000 (code point 65536, first 4-byte char)

```
Code point: 65536
Binary:     10000000000000000 (17 bits)
Pattern:    11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
Split:      001 000000 000000 000000
Fill:       11110000 10000000 10000000 10000000
Result:     F0 80 80 80 (hex) = 4 bytes ✓
```

## The Hindi Letter 'त्र' (Tra) — 9 Bytes Explained

The Devanagari consonant **त्र** is actually a **conjunct** — it's formed by combining three separate Unicode code points:

- **त** (ta) = U+0924
- **्** (virama/halant) = U+094D
- **र** (ra) = U+0930

When rendered, these three code points combine visually into one character "त्र", but internally it's still 3 separate code points.

### In UTF-8 (for network/file storage)

| Code Point | UTF-8 Bytes | Hex |
|---|---|---|
| U+0924 (त) | 3 bytes | `E0 A4 A4` |
| U+094D (्) | 3 bytes | `E0 A5 8D` |
| U+0930 (र) | 3 bytes | `E0 A4 B0` |
| **Total** | **9 bytes** | — |

Verification:
```bash
echo -n "त्र" | xxd -g 1
# Output: e0 a4 a4 e0 a5 8d e0 a4 b0 (9 bytes)
```

### In Java/JavaScript (UTF-16 internally)

| Code Point | UTF-16 Code Units |
|---|---|
| U+0924 (त) | 1 char (2 bytes) |
| U+094D (्) | 1 char (2 bytes) |
| U+0930 (र) | 1 char (2 bytes) |
| **Total** | **3 chars = 6 bytes** |

JavaScript test:
```javascript
const text = "त्र";
console.log(text.length); // 3 (3 UTF-16 code units)
console.log(new TextEncoder().encode(text).length); // 9 bytes in UTF-8
```

## Java vs JavaScript: Internal vs External Encoding

### Java (UTF-16 internally)

- Every `String` object in Java is stored as an array of 16-bit `char` values. [ssojet](https://ssojet.com/character-encoding-decoding/utf-16-in-java)
- Characters in the Basic Multilingual Plane (BMP, U+0000 to U+FFFF) use 1 char (2 bytes).
- Characters outside BMP (like most emojis) use 2 chars (4 bytes) — called a **surrogate pair**. [linkedin](https://www.linkedin.com/posts/jayesh-karli-2b95b01a9_java-represents-all-string-objects-in-memory-activity-7325859493274124288-0Rka)

```java
String s = "aक🎉";
// 'a' = 1 char (2 bytes)
// 'क' = 1 char (2 bytes) — fits in BMP
// '🎉' = 2 chars (4 bytes) — surrogate pair, outside BMP
// Total: 4 chars = 8 bytes in memory
```

### JavaScript (UTF-16 internally, UTF-8 for network)

- Internally, JavaScript strings are **also UTF-16** — they use 16-bit code units and surrogate pairs for characters outside the BMP. [archive.qconlondon](https://archive.qconlondon.com/system/files/presentation-slides/anna_henningsen_-_js_character_encodings.pdf)
- But when you **send data over the network** (like in APIs, fetch requests, or storing in files), you're usually dealing with **UTF-8 bytes**. [linuxhaxor](https://linuxhaxor.net/code/how-to-encode-decode-utf-8-in-javascript.html)

```javascript
let s = "aक🎉";
// Internally: 4 UTF-16 code units (a=1, क=1, 🎉=2) = 8 bytes

// When sent via fetch() or saved to a file:
// UTF-8 encoding:
// 'a' = 1 byte
// 'क' = 3 bytes
// '🎉' = 4 bytes
// Total: 8 bytes in UTF-8
```

## Xxd Command Quick Reference

| Command | Output | Use Case |
|---|---|---|
| `xxd <file>` | 16 bytes per line, 2-char hex groups | Quick file inspection |
| `xxd -g 1 <file>` | 1 byte per group | See exact byte boundaries for UTF-8 |
| `xxd -b <file>` | Binary (8 bits per byte) | Bit-level debugging |
| `xxd -r <hex>` | Reverse (hex to binary) | Create test files |

## Practical Test Commands

```bash
# Create a test file with different character types
echo -n "a" | xxd -g 1     # 1 byte: 61
echo -n "ñ" | xxd -g 1     # 2 bytes: C3 B1
echo -n "क" | xxd -g 1     # 3 bytes: E0 A4 95
echo -n "🎉" | xxd -g 1    # 4 bytes: F0 9F 8E 89

# Verify byte count
echo -n "a" | wc -c        # 1
echo -n "ñ" | wc -c        # 2
echo -n "क" | wc -c        # 3
echo -n "🎉" | wc -c       # 4

# Hindi conjunct example
echo -n "त्र" | xxd -g 1   # 9 bytes: e0 a4 a4 e0 a5 8d e0 a4 b0
echo -n "त्र" | wc -c      # 9
```

## Common Gotchas

- **Overlong encoding is invalid**: UTF-8 has a unique valid encoding for each code point. You can't encode 'a' (U+0061) as 2 bytes — that would be `C0 E1` which is invalid. [medium](https://medium.com/@briannqc/utf-8-explained-its-not-8-bits-encoding-nor-32-bits-unicode-205362df9c80)
- **Surrogate pairs (U+D800 to U+DFFF) are forbidden**: These are reserved for UTF-16 and cannot appear in valid UTF-8. [twilio](https://www.twilio.com/docs/glossary/what-utf-8)
- **Maximum valid code point is U+10FFFF**: Anything higher (like U+110000) is not valid Unicode, even if the bit pattern would technically fit in 4 bytes.
- **Assuming 1 character = 1 byte always**: True for English in UTF-8, but false for anything else (emojis are 4 bytes, most non-Latin scripts are 2–3 bytes).
- **Conjunct letters in Hindi**: Often multiple code points combined, so they take more bytes than a single character (like त्र = 9 bytes).

## Where This Matters for You

- **Node.js/Express**: When you set `res.setHeader('Content-Type', 'text/html; charset=utf-8')`, you're telling the browser to decode your response bytes using UTF-8 rules. [developer.mozilla](https://developer.mozilla.org/en-US/docs/Glossary/UTF-8)
- **MongoDB/PostgreSQL**: Both default to UTF-8 storage, meaning your text fields can hold any language, but non-ASCII characters will take 2–4 bytes each instead of 1.
- **File uploads to S3**: If you assume every character is 1 byte when calculating file sizes, you'll underestimate storage for non-English text.
- **API design**: When you accept JSON with non-English user names or comments, UTF-8 ensures they're stored and returned correctly without corruption.
- **Java/JavaScript internals**: Both use UTF-16 in memory, so string `.length` can be misleading for emojis and conjuncts.

## Key Takeaways

- UTF-8 is a variable-length encoding using 1–4 bytes per character, designed to be efficient for ASCII while supporting all Unicode.
- The first bits of each byte signal how many bytes belong to the character: `0` (1 byte), `110` (2 bytes), `1110` (3 bytes), `11110` (4 bytes).
- Continuation bytes always start with `10`.
- ASCII characters (0–127) use exactly 1 byte in UTF-8, identical to old ASCII encoding.
- Non-ASCII characters use 2–4 bytes, with boundaries at 127, 2047, 65535, and 1114111 (U+10FFFF).
- Java and JavaScript both use UTF-16 internally for string storage, but UTF-8 for network/file transmission.
- Conjunct letters in Hindi (like त्र) are often multiple code points combined, so they take more bytes than a single character.
- Use `xxd -g 1` to see exact UTF-8 byte sequences for any character.

## What to Learn Next

A natural next step is implementing **UTF-8 encoding/decoding from scratch in code** (to solidify the bit-manipulation intuition), followed by learning how **string length differs across languages** (`length` in Java/JS vs grapheme count) when dealing with emojis and conjuncts, and finally understanding **how databases actually store UTF-8 text** and how it affects storage size and indexing in your MongoDB/PostgreSQL setup.