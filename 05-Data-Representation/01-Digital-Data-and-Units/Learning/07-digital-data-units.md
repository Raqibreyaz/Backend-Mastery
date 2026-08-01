# Digital Data Units — Simple Notes

Every time you check your AWS S3 bill or run `du -h` on your server, you see storage numbers that don't quite match — not because something's wrong, but because there are two different counting systems hiding behind the same letters (KB, MB, GB).

## What Is It?

Digital data units are just ways to measure how much information a computer stores or sends. Everything starts from one basic unit: the **bit** (a single 0 or 1). Since talking in bits gets messy fast, we group them into bigger, easier-to-say units — byte, kilobyte, megabyte, and so on. [en.wikipedia](https://en.wikipedia.org/wiki/Units_of_information)

## One-Sentence Summary

Data units are just bytes grouped into bigger chunks, using either round-1000 math (KB, MB, GB) or round-1024 math (KiB, MiB, GiB) — same bytes, two different ways of counting them.

## The Building Block: Bit and Byte

A bit is one switch — on or off, 1 or 0. A **byte** is 8 bits put together, enough combinations to represent one letter or number. Everything bigger is built by grouping bytes. [ionos](https://www.ionos.com/digitalguide/websites/web-development/units-of-storage-in-computers/)

## The Two Counting Systems

This is the part that trips people up, so here it is in plain terms:

- **KB, MB, GB (decimal)** — count in groups of 1000. Used by hard drive makers, cloud bills (AWS S3), and internet speed. [idtech](https://www.idtech.com/blog/orders-of-magnitude-digital-data)
- **KiB, MiB, GiB (binary)** — count in groups of 1024. Used inside your operating system and RAM, because computers naturally work in powers of 2. [dataunits](https://www.dataunits.org/)

| Unit | Meaning | Value |
|---|---|---|
| KB (kilobyte) | 1000 bytes | 1000 B  [idtech](https://www.idtech.com/blog/orders-of-magnitude-digital-data) |
| KiB (kibibyte) | 1024 bytes | 1024 B  [ionos](https://www.ionos.com/digitalguide/websites/web-development/units-of-storage-in-computers/) |
| MB (megabyte) | 1000 KB | 1,000,000 B |
| MiB (mebibyte) | 1024 KiB | 1,048,576 B |
| GB (gigabyte) | 1000 MB | 10^9 B |
| GiB (gibibyte) | 1024 MiB | 2^30 B |

## Why This Happened

Computers naturally count in powers of 2 (2, 4, 8... 1024), because that's how memory addressing works. But normal people think in powers of 10 (10, 100, 1000). So two groups made two different choices:

- Hard drive companies picked 1000-based math, because it's simpler and makes drives sound bigger. [ionos](https://www.ionos.com/digitalguide/websites/web-development/units-of-storage-in-computers/)
- Operating systems picked 1024-based math, because that's how memory chips are actually organized. [dataunits](https://www.dataunits.org/)

For years, both got called "KB," causing confusion. Later, engineers created separate names — KiB, MiB, GiB — just to clear things up. [ionos](https://www.ionos.com/digitalguide/websites/web-development/units-of-storage-in-computers/)

## Simple Example: The "Missing" Storage

You buy a drive labeled 1 TB. The seller means 1,000,000,000,000 bytes (decimal, TB). Your file explorer shows size using 1024-based math (TiB), so it displays around "931 GB" instead of "1000 GB." No bytes are missing — it's just two different counting systems looking at the same data. [idtech](https://www.idtech.com/blog/orders-of-magnitude-digital-data)

```
Same physical bytes
        ↓
Decimal view (÷1000 each step) → "1000 GB"
Binary view  (÷1024 each step) → "931 GiB" (often mislabeled "GB")
```

## Where This Matters for You

- AWS S3 bills you in GB (decimal, 1000-based). [dataunits](https://www.dataunits.org/guides)
- Linux commands like `du -h` or `df -h` on your Storra server show GiB (1024-based).
- So the numbers you see in your AWS bill and the numbers you see on your server will never perfectly match, even for the exact same files.

## Quick Reference Table

| Level | Decimal (x1000) | Binary (x1024) |
|---|---|---|
| 1 | Byte | Byte |
| 2 | KB = 1000 B | KiB = 1024 B |
| 3 | MB = 1000 KB | MiB = 1024 KiB |
| 4 | GB = 1000 MB | GiB = 1024 MiB |
| 5 | TB = 1000 GB | TiB = 1024 GiB |

## Common Mistake

- Thinking "1 GB = 1 GiB" always — they're close but not equal (1 GiB is about 7% bigger than 1 GB).
- Mixing up bits and bytes for internet speed — "100 Mbps" internet means 100 million *bits* per second, not bytes. Divide by 8 to get roughly 12.5 MB/s.

## Key Takeaways

- Byte = 8 bits, the basic unit everything is built from.
- KB/MB/GB = decimal (1000-based) — used by cloud billing, hard drives, internet speed.
- KiB/MiB/GiB = binary (1024-based) — used by your operating system and RAM.
- Same data, different math — that's why AWS billing and Linux disk commands never match exactly.

## What to Learn Next

A natural next step is learning **bits vs bytes in network speed** (why Mbps and MB/s are different), followed by **binary number systems** to understand why computers prefer powers of 2 in the first place.