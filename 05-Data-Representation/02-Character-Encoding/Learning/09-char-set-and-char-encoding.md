# Character Sets & Character Encoding

## What it is

A **character set** is the list that says which number belongs to each character, and a **character encoding** is the rule for turning that number into bytes a computer can store or send. d
The easiest way to remember it is: first choose the number for the character, then choose how to write that number in binary.

## One-sentence summary

A character set decides the code point for a character, and a character encoding decides how that code point becomes bytes. d

## Why this exists

Computers only understand numbers, so text needs two steps: assign a number to each character, then store that number as bytes.
This matters because the same character can be represented by different byte patterns depending on the encoding, even when the character’s code point stays the same.

## Character set

A character set is the numbering system for text, often described using **code points**.
ASCII is a small early character set with 128 values, good for basic English text, digits, and a few symbols.
Unicode is the modern, much larger character set that covers most languages and symbols, including emojis.

### Example

| Character | Code point |
| --------- | ---------: |
| A         |         65 |
| a         |         97 |
| 1         |         49 |
| €         |       8364 |

Unicode exists because ASCII could not cover many non-English scripts, so different regions used incompatible systems before Unicode created one shared standard.

## Character encoding

A character encoding decides how a code point is written as bytes.
That means the same code point can have different byte sequences depending on the encoding you choose.

Common encodings include:

- **UTF-8**, which uses 1 byte for ASCII-like characters and up to 4 bytes for others.
- **UTF-16**, which uses 2 bytes for most characters and sometimes 4.
- **UTF-32**, which uses 4 bytes for every character.

## The two-step model

Think of text like this:

`Character -> Character set -> Code point -> Encoding -> Bytes`

### Example 1: `a`

The letter `a` has code point `97`, and different encodings store it differently:

| Encoding | Bytes         |
| -------- | ------------- |
| UTF-8    | `61`          |
| UTF-16   | `00 61`       |
| UTF-32   | `00 00 00 61` |

For small values like `97`, the difference is mostly extra zero padding in larger encodings.

### Example 2: `क`

The Devanagari letter `क` has code point `2325`, and the byte pattern changes a lot by encoding:

| Encoding | Bytes         |
| -------- | ------------- |
| UTF-8    | `E0 A4 95`    |
| UTF-16   | `09 15`       |
| UTF-32   | `00 00 09 15` |

This shows that the same character and the same code point can still produce completely different byte sequences.

## Why people mix them up

People often say “charset” when they really mean “encoding,” because the terms are closely related and often appear together in old and new standards.
A simple distinction is:

| Topic         | Job                            | Example               |
| ------------- | ------------------------------ | --------------------- |
| Character set | Assigns numbers to characters  | Unicode, ASCII        |
| Encoding      | Turns those numbers into bytes | UTF-8, UTF-16, UTF-32 |

## Where it matters

In databases like PostgreSQL or MongoDB, UTF-8 is often chosen because it stores text efficiently and supports many languages and emojis.  
In web APIs, headers like `charset=utf-8` tell the browser how to read the bytes correctly.  
If the wrong encoding is assumed for a file, the text can turn into garbled characters, which is often called **mojibake**.

## Common mistakes

- Unicode is **not** an encoding; it is the character set. UTF-8, UTF-16, and UTF-32 are encodings.
- One character is **not always** one byte. That is true for some English text in UTF-8, but not for many other characters or emojis.
- The code point stays fixed, but the encoding changes the byte pattern used to store it.

## Key takeaways

- A character set gives each character a number. d
- A character encoding turns that number into bytes.
- Unicode is the modern character set most systems use today.
- UTF-8 is popular because it keeps ASCII text compact but can still represent all Unicode characters.
- The same character can have different byte representations depending on the encoding.

## Minimal self-test

1. What is the difference between a character set and a character encoding? d
2. Why is Unicode a character set and not an encoding?
3. What bytes does `a` become in UTF-8, UTF-16, and UTF-32?
4. Why can `क` use 3 bytes in UTF-8?
5. What happens if a file is read using the wrong encoding?

## What to learn next

The best next step is to learn how UTF-8 stores multi-byte characters bit by bit, then study binary number systems so the byte patterns make sense naturally.
