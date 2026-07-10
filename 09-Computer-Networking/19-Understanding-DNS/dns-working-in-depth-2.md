## 1. What DNS Is Really Doing

DNS (Domain Name System) is the **naming layer** of the internet.

- It translates human‑friendly **names** (like `storra.servehttp.com`) into machine‑friendly **records** (typically IP addresses).
- It is **hierarchical** and **distributed**, so no single machine stores all names.
- It works by combining:
  - A global tree of domains (root → TLD → second‑level → subdomains),
  - Delegation via NS records,
  - Recursive resolvers and caching.

Mental model: DNS is a tree of zones, plus a network of servers that know “who is authoritative for which part of the tree” and how to find them.

***

## 2. Domain, Subdomain, Zone: Getting Terminology Precise

### Labels and domains

Take `www.google.com`:

- Right‑to‑left labels:
  - `.com` → TLD.
  - `google.com` → second‑level domain under `.com`.
  - `www.google.com` → a subdomain/hostname under `google.com`.

Important precision:

- `google.com` is a **domain** and also a **subdomain of `.com`**.
- `www.google.com` is a **subdomain of `google.com`**.
- `www` alone is just the **leftmost label**; when combined with `google.com`, it forms the subdomain `www.google.com`.

So when people say “`www` is a subdomain,” what they really mean is “the label `www` is used to create the subdomain `www.google.com`.”

### Zones and authority

A **zone** is the portion of the DNS tree handled as a unit by a specific set of authoritative servers.

Example:

- The `google.com` zone may contain records for:
  - `google.com` (root of the zone),
  - `www.google.com`,
  - `mail.google.com`,
  - `api.google.com`, etc.

Authority lives at **zone boundaries**, not at “second vs third level”:

- If there is **no** NS delegation for `sub.google.com`, then the `google.com` zone and its authoritative servers answer for `sub.google.com` too.
- If there **is** an NS record for `sub.google.com` that points to different name servers, then `sub.google.com` becomes its own zone with its own authoritative servers.

So: authority is defined by **NS delegation**, not by how many labels deep you are.

***

## 3. Server Roles: Recursive vs Authoritative (and Root/TLD)

### Recursive resolver (what your device talks to)

- Receives queries from clients (your PC, router).
- Does the work of finding the answer:
  - Checks its cache.
  - If needed, queries root → TLD → authoritative servers.
- Returns final answers to clients.
- Caches answers (and often intermediate data like NS records) using TTL.

Your device usually sends a **recursive** query: “please do all the resolution work and give me the final answer.”

### Authoritative name server

- Stores the zone data for specific domains (e.g., `servehttp.com`, `example.com`).
- Answers **authoritatively** for names in its zones:
  - A/AAAA (IP addresses),
  - MX (mail servers),
  - CNAME, TXT, NS, etc.
- Does **not** recurse; if a name is not in a zone it owns, it doesn’t try to walk root/TLD to find someone else.

Authoritative servers are the “source of truth” for their zones.

### Root and TLD servers

- **Root servers**:
  - Are authoritative for the root zone `.`.
  - Know where each TLD (`.com`, `.org`, `.in`, etc.)’s name servers are.
  - When asked for `storra.servehttp.com`, they **do not** know the host’s IP.
  - They only respond with **NS records for `.com`** (and related glue IPs).

- **TLD servers (e.g., `.com` servers)**:
  - Are authoritative for `com.`.
  - Know which servers are authoritative for second‑level domains like `servehttp.com`.
  - When asked for `storra.servehttp.com`, they **do not** give the IP.
  - They respond with **NS records for `servehttp.com`** (and glue).

Root and TLD servers always work this way:

- They are **never** the final IP source for ordinary hostnames.
- Their job is to return **delegation information (NS records)**, not host IPs.

***

## 4. NS Records and Delegation: Who Is Authoritative?

### NS records in a zone

In a zone file for `example.com` you might see:

```text
example.com.      IN NS  ns1.example-dns.com.
example.com.      IN NS  ns2.example-dns.com.
```

This means:

- The authoritative name servers for the `example.com` zone are `ns1.example-dns.com` and `ns2.example-dns.com`.
- These are the servers that will return the **actual records** (A, AAAA, MX, etc.) for hostnames like `www.example.com`.

Key points:

- NS records identify **which servers are authoritative** for a zone.
- The server names (`ns1.example-dns.com`) themselves resolve to IPs via their own A/AAAA records.
- Upper‑level zones (like `.com`) store NS records plus “glue” A/AAAA records to let resolvers reach those servers without circular dependencies.

### Who returns NS records?

- **Root server**: returns NS for TLDs like `.com`.
- **`.com` TLD server**: returns NS for second‑level domains like `servehttp.com`.
- **Authoritative server for a zone**:
  - Returns the requested A/AAAA/MX/etc. in ANSWER.
  - Often includes NS records for the zone in AUTHORITY.

Not all responses carry NS records, but NS records appear wherever delegation or authority info is necessary.

### Authority, depth, and your `storra.servehttp.com` example

For `storra.servehttp.com`:

- `servehttp.com` is a second‑level domain under `.com`.
- Typically, there is a **zone** `servehttp.com` with its own NS records pointing to authoritative servers.
- The record for `storra.servehttp.com` (e.g., an A record) lives in that `servehttp.com` zone.
- So the **authoritative servers for `servehttp.com`** are the ones that actually return the IP for `storra.servehttp.com`.

Unless there’s further NS delegation (like `storra.servehttp.com NS ...`), authority is at the `servehttp.com` zone.

So you cannot say “authoritative DNS is always on the second‑level domain,” but you **can** say:

- “Authoritative DNS is wherever NS delegation defines a zone boundary.”
- “For `servehttp.com`, the authoritative servers for the `servehttp.com` zone are the source of truth for names under that zone, including `storra.servehttp.com`.”

***

## 5. Full Recursive Resolution Flow (Step-by-Step Example)

Let’s walk a full resolution for `storra.servehttp.com` with no cache in the resolver.

### Actors

- Stub resolver on your device.
- Recursive resolver (e.g., ISP DNS or 1.1.1.1).
- Root server.
- `.com` TLD server.
- Authoritative server for `servehttp.com`.

### Step 0: Device → Recursive resolver

Your device sends a **recursive** query:

- QNAME: `storra.servehttp.com`
- QTYPE: `A`
- RD (Recursion Desired) = 1

Recursive resolver receives the query and checks its cache:

- No cached A for `storra.servehttp.com`.
- No cached NS for `servehttp.com` or `.com`.

It decides to walk the hierarchy.

***

### Step 1: Recursive resolver → Root server

Sends an **iterative** query to a root server:

- QNAME: `storra.servehttp.com`
- QTYPE: `A`

Root server responds:

- It is authoritative only for the root zone `.`.
- It does not give the IP address for `storra.servehttp.com`.
- Response:

```text
ANSWER SECTION:
(none)  ; root does not know host IP

AUTHORITY SECTION:
com.   IN NS  a.gtld-servers.net.
com.   IN NS  b.gtld-servers.net.
...

ADDITIONAL SECTION:
a.gtld-servers.net. IN A  <IP-of-a.gtld>
b.gtld-servers.net. IN A  <IP-of-b.gtld>
...
```

The recursive resolver caches:

- NS records for `com.`.
- A records for TLD server names.

***

### Step 2: Recursive resolver → `.com` TLD server

Recursive chooses a TLD server (say `a.gtld-servers.net`) and sends:

- QNAME: `storra.servehttp.com`
- QTYPE: `A`

`.com` server responds:

- It is authoritative for `com.`, not for hostnames under `servehttp.com`.
- It does not give the final A record.
- Response:

```text
ANSWER SECTION:
(none)  ; TLD doesn’t give host IP

AUTHORITY SECTION:
servehttp.com.  IN NS  ns1.some-dns-provider.net.
servehttp.com.  IN NS  ns2.some-dns-provider.net.
...

ADDITIONAL SECTION:
ns1.some-dns-provider.net. IN A  <IP-of-ns1>
ns2.some-dns-provider.net. IN A  <IP-of-ns2>
...
```

The recursive resolver caches:

- NS records for `servehttp.com`.
- A records for those NS names.

***

### Step 3: Recursive resolver → authoritative for `servehttp.com`

Recursive picks an authoritative server (`ns1.some-dns-provider.net`) and sends:

- QNAME: `storra.servehttp.com`
- QTYPE: `A`

Authoritative server:

- Is authoritative for zone `servehttp.com`.
- Looks in its zone data.
- Finds something like:

```text
storra.servehttp.com. IN A 203.0.113.5
```

Response:

```text
ANSWER SECTION:
storra.servehttp.com.  IN A 203.0.113.5

AUTHORITY SECTION:
servehttp.com.         IN NS ns1.some-dns-provider.net.
servehttp.com.         IN NS ns2.some-dns-provider.net.

ADDITIONAL SECTION:
(ns A/AAAA records may appear here as glue/extra info)
```

Now the recursive resolver has the final answer.

It:

- Caches `storra.servehttp.com A 203.0.113.5` for its TTL.
- Returns this to your device.

***

### Step 4: Recursive resolver → Stub (device)

Recursive sends back:

```text
ANSWER SECTION:
storra.servehttp.com. IN A 203.0.113.5
```

Your device caches it locally and the browser uses the IP `203.0.113.5` to open a TCP/HTTPS connection.

Later queries for the same name:

- Hit your device’s cache, or
- Hit the recursive resolver’s cache, skipping root/TLD/authoritative until TTL expires.

***

## 6. Caching and TTL: Why DNS Feels “Instant”

Every DNS record comes with a **TTL** (Time To Live):

- Recursive resolvers store answers in cache until TTL expires.
- They also cache intermediate data (NS records for `.com`, `servehttp.com`, etc.).
- This is why:
  - Root/TLD servers see far fewer queries than you’d expect.
  - Many lookups are answered instantly from cache.

TTL trade‑off:

- High TTL = fewer upstream queries and better performance, but slower propagation of changes.
- Low TTL = faster updates (useful before migrations), but more load and more dependence on upstream infrastructure.

***

## 7. Putting It All Together: Key Mental Takeaways

1. **Names vs zones**:
   - `www.google.com` is a subdomain of `google.com`.
   - Authority is defined by **zones** (NS delegation), not by label depth.

2. **Authoritative DNS**:
   - A set of servers defined by NS records for a zone (e.g., for `servehttp.com`).
   - They store the records for hostnames in that zone and return final answers (A, AAAA, MX, etc.).

3. **Root and TLD**:
   - Root is only authoritative for `.`; it returns NS for TLDs and never host IPs.
   - TLD servers (`.com` etc.) return NS for second‑level domains and again don’t return host IPs in the normal flow.

4. **Recursive resolution**:
   - Your device asks a resolver: “please resolve this name.”
   - Resolver:
     - Checks cache.
     - If needed: root → TLD → authoritative.
     - Caches everything on the way back.

5. **NS records**:
   - In parent zones: define delegation to child zones.
   - In authoritative answers: reaffirm which servers are authoritative.

With this mental model, when you see any DNS diagram, packet capture (`dig +trace` output), or zone file, you can reason clearly about:

- Who is authoritative for which names.
- Why root and TLD behave the way they do.
- What each step in a recursive resolution is contributing.