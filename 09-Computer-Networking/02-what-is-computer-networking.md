## What Is Computer Networking?

Computer networking means connecting computers so they can talk to each other and share stuff — files, printers, internet. Without it, every computer is stuck alone with whatever's on its own disk. [ibm](https://www.ibm.com/think/topics/networking)

## Why It Matters

Before networks, you moved files by literally carrying a disk to another machine. Networking removes that — machines just send data over wires or radio instead. [ibm](https://www.ibm.com/think/topics/networking)

## How It Basically Works

Your computer breaks data into small chunks called packets, addresses them, and sends them out. Routers along the way just look at the address and forward the packet toward its destination — nobody needs to know the whole path, just the next step. [checkpoint](https://www.checkpoint.com/cyber-hub/network-security/what-is-the-osi-model-understanding-the-7-layers/)

```
Your app → break into packets → routed hop by hop → reassembled → other app
```

## The Layer Idea (OSI Model)

Networking is split into layers so different systems can work together without knowing each other's internals. Rough version: [checkpoint](https://www.checkpoint.com/cyber-hub/network-security/what-is-the-osi-model-understanding-the-7-layers/)

| Layer | Job | Example |
|---|---|---|
| Application | Actual app talking | HTTP, DNS |
| Transport | Reliable delivery | TCP, UDP |
| Network | Routing across networks | IP |
| Physical/Link | Actual wires/signals | Ethernet, Wi-Fi |

## Key Terms

- Packet: small piece of data with an address, sent across the network
- Protocol: agreed rules two machines follow to talk (like a shared language)
- Router: forwards packets between networks
- IP address: a device's "address" on the network

## What to Learn Next

TCP vs UDP, then IP addressing, then DNS/HTTP — each builds directly on this.