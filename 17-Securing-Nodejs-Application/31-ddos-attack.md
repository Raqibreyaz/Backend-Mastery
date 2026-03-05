# What is a DDoS Attack (Compared to DoS)?

**DDoS (Distributed Denial of Service)** attack is essentially a **massive, scaled-up version** of **DoS** attack.

Instead of **one attacker**, DDoS uses **many devices**, often spread across the globe, to send traffic to the target at the same time.

---

## 🧠 Quick Recap: DoS vs DDoS

| Feature   | DoS Attack            | DDoS Attack                        |
| --------- | --------------------- | ---------------------------------- |
| Source    | One system            | Many systems (botnet)              |
| Volume    | Limited traffic       | Huge traffic from multiple sources |
| Detection | Easier                | Harder due to distributed IPs      |
| Blocking  | Simple (block one IP) | Complex (many IPs involved)        |

---

## 💥 Purpose of a DDoS Attack

* To **take down websites, apps, or servers** by overwhelming them
* Often done to **disrupt business**, **hurt reputation**, or for **extortion**
* Can also be used to **distract while another attack takes place**

---

## 🔧 How DDoS Works

1. An attacker builds a **botnet** — a network of infected computers or IoT devices
2. These bots are controlled remotely
3. All bots flood the target with traffic simultaneously

🧠 Think of it like thousands of DoS attacks happening **at once**.

---

## 🔄 Common Types of DDoS Attacks

* **Volumetric Attacks** (e.g., DNS amplification, UDP flood): Focus on overwhelming bandwidth
* **Protocol Attacks** (e.g., SYN flood): Target weaknesses in TCP/IP stack
* **Application Layer Attacks** (e.g., HTTP flood): Send valid-looking requests to overload server resources

---

## 🧠 Real-Life Analogy

> DoS is like one prank caller jamming a phone line.
> DDoS is like **thousands of prank callers** flooding every line at once.

---

## 🛡️ Defense Against DDoS

You **can’t defend against DDoS effectively with code alone**. You need:

* **Cloud-based protection** (Cloudflare, AWS Shield)
* **Load balancers** and **auto-scaling infrastructure**
* **WAFs (Web Application Firewalls)**
* **Rate limiting and filtering at the network edge**

---

## 📌 Summary

* **DDoS = Many devices performing DoS together**
* Harder to detect and block
* Needs external help (CDNs, firewalls, etc.)
* A major threat to public-facing websites and APIs
