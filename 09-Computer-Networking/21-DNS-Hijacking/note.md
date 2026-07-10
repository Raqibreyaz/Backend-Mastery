# DNS Hijacking: Deep Note With Concrete Examples

![](DNS%20Hijacking%202025_7-1.webp)

## 1. Core Idea (Example)

DNS hijacking = returning a **wrong IP** for a **correct name**.

Example:

- The real `bank.com` resolves to `203.0.113.10`.
- An attacker manages to make DNS return `198.51.100.66` instead.
- Your browser:
  - Looks up `bank.com`.
  - Gets `198.51.100.66`.
  - Opens HTTPS/TCP to `198.51.100.66` (attacker’s machine).
- The page at `198.51.100.66` looks like your bank, asks for credentials, and sends them to the attacker.

From the user’s perspective: “I typed `bank.com`, I see a familiar login page.” But the DNS mapping is wrong.

***

## 2. Where DNS Hijacking Can Happen (Examples)

### a) Local hijack on the device

**Example: malware changing system DNS settings**

- You normally use your ISP DNS (e.g., `192.168.0.1` or `8.8.8.8`).
- Malware runs with admin rights and changes your network adapter’s DNS to `10.0.0.5` (attacker’s server).
- Now every DNS query goes to `10.0.0.5`.

Effect:

- `google.com` → attacker can still answer with the real IP so you don’t suspect anything.
- `bank.com` → attacker answers with their fake IP, e.g. `198.51.100.66`.
- Browsing looks mostly normal; only targeted names are hijacked.

You notice only if you inspect adapter DNS settings or compare resolutions from another network/device.

***

### b) Router / gateway hijack

**Example: compromised home router**

- Your router admin page is `192.168.0.1`, with default credentials still set.
- Attacker scans the internet, finds your router, logs in with default password.
- They change the router’s “DNS server” setting to `10.1.2.3` (malicious resolver).
- DHCP from the router now tells all devices:
  - “Use 10.1.2.3 as DNS.”

Effect:

- Phone, laptop, TV all use `10.1.2.3` for DNS.
- Attacker can redirect any domain they want for your entire home network.

You might see weird behavior (some sites look off, certain pages are suspicious), but most users never check router DNS; it just “works.”

***

### c) Resolver‑level hijacking / cache poisoning

**Example: poisoned ISP resolver**

- You use your ISP’s DNS at `203.0.113.55`.
- An attacker finds a way to inject a forged answer into that resolver’s cache:
  - `bank.com A 198.51.100.66` with TTL 300 seconds.
- For the next 5 minutes:
  - Everyone using that resolver gets `198.51.100.66` when they resolve `bank.com`.

Effect:

- Large number of users are redirected.
- Once TTL expires, the resolver queries the authoritative server again and, if not compromised, corrects the IP.

Engineers detect this by:

- Comparing answers for `bank.com` across multiple resolvers.
- Checking who is authoritative and what IPs authoritative servers return.

***

### d) Authoritative / DNS hosting hijack

**Example: compromised DNS provider account**

- Your company uses a DNS hosting provider to manage `example.com`.
- An attacker steals credentials or social‑engineers support.
- They log in and change:

  - `www.example.com A 198.51.100.66` (attacker IP)
  - From the previous legitimate IP (`203.0.113.10`).

Effect:

- Recursive resolvers worldwide, following normal root → TLD → authoritative process, now get the attacker’s IP as the “official” answer.
- For as long as the zone is altered, DNS is “correctly” doing what the (now maliciously changed) zone says.

Detection:

- Monitoring for unexpected changes in DNS records.
- Out‑of‑band checks (e.g., separate account watching change logs).

***

## 3. Normal vs Hijacked Flow (Concrete Compare)

### Normal flow for `bank.com` (simplified)

1. Laptop asks resolver (e.g., 1.1.1.1):  
   “`bank.com` A?”
2. Resolver:
   - Checks cache → miss.
   - Asks root → gets NS for `.com`.
   - Asks `.com` TLD → gets NS for `bank.com`.
   - Asks authoritative for `bank.com` → gets:
     - `bank.com A 203.0.113.10`.
3. Resolver returns `203.0.113.10`.
4. Laptop connects to `203.0.113.10`.

### Hijacked flow when a malicious resolver is used

1. Malware changes laptop DNS to `10.0.0.5` (attacker).
2. Laptop asks `10.0.0.5`:  
   “`bank.com` A?”
3. Attacker’s resolver responds immediately:
   - `bank.com A 198.51.100.66`.
4. Laptop connects to `198.51.100.66`.

No root/TLD or authoritative step is involved; the resolver simply lies.

***

## 4. Local DNS Hijack Mechanisms (Concrete Examples)

### 4.1 System DNS settings changed

**Windows example:**

- You open the network adapter settings and see:
  - “Preferred DNS server: 10.0.0.5”
  - “Alternate DNS server: 10.0.0.6”
- You never set these; they used to be blank or `8.8.8.8`.

If those IPs are attacker‑controlled:

- Every `A`/`AAAA` query passes through them.
- They can decide what IP to send back for any domain.

As a defender:

- You’d reset these to trusted DNS (e.g., router IP or a known resolver).
- You’d investigate what process changed them.

***

### 4.2 Hosts file changes

**Linux/macOS example:**

- `/etc/hosts` normally has only a few lines:

  ```text
  127.0.0.1   localhost
  ::1         localhost
  ```

- After a local hijack, you find:

  ```text
  198.51.100.66 bank.com
  198.51.100.66 www.bank.com
  ```

Now:

- `ping bank.com` shows `198.51.100.66`.
- Browser connects to `198.51.100.66` for `bank.com`.

DNS is never consulted for `bank.com`; the hosts file overrides everything.

Legitimate engineer example:

- For testing, you might add:

  ```text
  192.168.1.20  api.example.com
  ```

So your app talks to your local dev API instead of the production one.

Difference is: benign use is explicit and controlled; malicious use is hidden.

***

### 4.3 Local DNS proxy / forwarder example

Say you run a local dev tool that:

- Listens on `127.0.0.1:53`.
- Answers:
  - `api.example.com` with `127.0.0.1`.
  - Everything else by forwarding to 1.1.1.1.

Your system DNS is configured to `127.0.0.1`.

Effect:

- `api.example.com` resolves to your local machine (dev server).
- `google.com` resolves via normal DNS.

Malware variant:

- Same architecture, but uses its own logic to:
  - Redirect selected domains to attacker IPs.
  - Log queries for surveillance.

***

### 4.4 Router hijack concrete example

Router with default credentials:

- Admin panel: `http://192.168.0.1`.
- Username: `admin`, password: `admin`.

Attacker:

- Writes a script scanning IP ranges for that router type.
- Logs in with default creds.
- Sets DNS servers to `10.9.9.9` and `10.9.9.10`.

DHCP gives clients:

- “Your DNS is 10.9.9.9.”

Now, your phone, laptop, TV each:

- Resolves `bank.com` via `10.9.9.9`.
- Gets attacker’s IP.

You might test this by:

- Running `nslookup bank.com` from your laptop and seeing an unexpected resolver and IP.
- Running the same from your mobile data connection and seeing a different, likely correct IP.

***

## 5. Why DNS Hijacking Is Dangerous (Examples)

- **Phishing example**:
  - You visit `pay-service.com`, get redirected to a clone site.
  - It uses a similar UI and collects card details.
- **Malware example**:
  - Popular software site is hijacked at DNS hosting level.
  - Users downloading “updates” get trojanized binaries from attacker IP.
- **Corporate example**:
  - Internal VPN portal `vpn.corp.com` resolves to attacker IP from a compromised resolver.
  - Employees enter credentials into attacker’s capture system.

Even if TLS is used, many users click through warnings if they don’t understand them, so DNS hijacking plus social engineering can still work.

***

## 6. Defensive Examples: How You Might Check for Hijacking

### Example 1: Check system DNS

On Windows:

- `ipconfig /all` → check “DNS Servers”.
- If you see unknown IPs (not your router, not known public DNS), investigate.

On Linux/macOS:

- Check `/etc/resolv.conf` or network manager settings.
- Look for unexpected DNS IPs.

### Example 2: Check hosts file

- Open hosts file and look for entries for well‑known domains:
  - Banks.
  - Email providers.
  - Social networks.
- Unexpected entries could indicate local hijack.

### Example 3: Compare resolvers

From your machine:

- `nslookup bank.com 1.1.1.1`
- `nslookup bank.com 8.8.8.8`
- `nslookup bank.com <your-configured-DNS>`

If your configured DNS returns an IP that’s very different and suspicious while trusted public resolvers agree on another IP, you might be seeing resolver tampering.

***

## 7. Minimal Summary With Examples in Mind

Keep this compact model:

- DNS hijacking = “someone changed `name → IP` mapping.”
- It can happen:
  - On your device (DNS settings, hosts file, local proxy).
  - On your router (affecting all devices).
  - At the resolver (spoofing/cache poisoning).
  - At the domain’s DNS hosting (zone tampering).
- Concrete signs:
  - Hosts file entries for big sites you don’t remember adding.
  - DNS servers in your adapter/router config you didn’t choose.
  - Different, odd IPs for major domains when resolved via different resolvers.
- Defense:
  - Lock down configs and accounts.
  - Use secure DNS (DoH/DoT, DNSSEC validation where possible).
  - Rely on HTTPS/TLS and certificate checks as a second line.
