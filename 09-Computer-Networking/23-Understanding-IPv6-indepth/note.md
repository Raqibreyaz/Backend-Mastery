# IPv6 Deep Dive

## Why IPv6 exists

IPv4 gave the internet a 32-bit address space, which means about 4.3 billion addresses, and that quickly became too small for a world of phones, laptops, servers, VMs, IoT devices, and cloud networks. IPv6 was created as the long-term replacement with 128-bit addresses, a far larger address space, and a cleaner protocol design for routing, autoconfiguration, and modern network behavior. [en.wikipedia](https://en.wikipedia.org/wiki/IPv6)

## One-sentence summary

IPv6 is a redesigned IP layer that replaces IPv4’s scarcity and workarounds with a huge address space, cleaner packet format, better autoconfiguration, and more structured addressing. [learn.microsoft](https://learn.microsoft.com/pt-br/previous-versions/windows/it-pro/windows-server-2003/cc780593(v=ws.10))

## Intuition

The right mental model is: IPv4 is a crowded city constantly doing address-sharing and traffic redirection, while IPv6 is a much larger city where nearly every device can have its own globally unique address without squeezing through NAT all the time. IPv6 is not just “IPv4 with longer addresses”; it also changes how hosts discover routers, form addresses, find neighbors, and handle optional packet features. [aws.amazon](https://aws.amazon.com/compare/the-difference-between-ipv4-and-ipv6/)

## Address space

IPv6 uses 128-bit addresses, which yields about \(3.4 \times 10^{38}\) possible addresses, compared with IPv4’s 32-bit space of about 4.3 billion addresses. That huge space allows hierarchical allocation, better route aggregation, and much less need for conservation tricks like NAT that became common in IPv4. [tutorialspoint](https://www.tutorialspoint.com/ipv6/ipv6_features.htm)

## Address format

IPv6 addresses are written as eight 16-bit blocks in hexadecimal, separated by colons, such as `2001:0db8:85a3:0000:0000:8a2e:0370:7334`. Leading zeros inside a block can be omitted, and one continuous run of all-zero blocks can be compressed to `::`, so the example can become something like `2001:db8::8a2e:370:7334`, but `::` can appear only once in an address because otherwise the number of missing zero blocks would be ambiguous. [datatracker.ietf](https://datatracker.ietf.org/doc/html/rfc4291)

## Packet design

IPv6 keeps the basic IP job — source address, destination address, and hop-by-hop forwarding — but simplifies the main header compared with IPv4. The IPv6 base header has a fixed size and removes fields like the IPv4 header checksum and in-header fragmentation details; optional features are moved into extension headers so routers can process the common path more efficiently. [learn.microsoft](https://learn.microsoft.com/pt-br/previous-versions/windows/it-pro/windows-server-2003/cc780593(v=ws.10))

The main IPv6 header includes:

- Version.
- Traffic Class.
- Flow Label.
- Payload Length.
- Next Header.
- Hop Limit.
- Source Address.
- Destination Address. [learn.microsoft](https://learn.microsoft.com/pt-br/previous-versions/windows/it-pro/windows-server-2003/cc780593(v=ws.10))

The important design shift is that the base header stays small and predictable, and unusual or optional behavior is pushed into chained extension headers. [scs.stanford](https://www.scs.stanford.edu/10au-cs144/notes/l16-print.pdf)

## Broadcast removal

IPv6 does not use broadcast the way IPv4 does. Instead, it relies on: [tutorialspoint](https://www.tutorialspoint.com/ipv6/ipv6_features.htm)

- **Unicast**: one sender to one destination.
- **Multicast**: one sender to a selected group.
- **Anycast**: one logical address assigned to multiple nodes, where routing delivers packets to the nearest one from the network’s perspective. [ibm](https://www.ibm.com/docs/en/i/7.4.0?topic=concepts-ipv6-address-types)

This matters because broadcast can be noisy across a LAN, while multicast is more controlled and anycast is very useful for redundant services. [scs.stanford](https://www.scs.stanford.edu/10au-cs144/notes/l16-print.pdf)

## Address categories

IPv6 addresses are commonly discussed in terms of unicast, multicast, and anycast. For day-to-day host networking, the most important unicast types are: [datatracker.ietf](https://datatracker.ietf.org/doc/html/rfc4291)

- **Global unicast**: globally routable internet addresses. [ipcisco](https://ipcisco.com/lesson/ipv6-address-types/)
- **Link-local**: addresses valid only on the local link, always auto-configured, using `fe80::/10`. [learn.microsoft](https://learn.microsoft.com/zh-tw/previous-versions/windows/embedded/ee495100(v=winembedded.60))
- **Unique local addresses (ULA)**: internal-use addresses similar in spirit to IPv4 private addressing, from `fc00::/7`. [youtube](https://www.youtube.com/watch?v=H-n_md1PVBQ)

## Special addresses

Several IPv6 addresses behave like landmarks in the protocol.

### Loopback

The IPv6 loopback address is `::1`, which is the equivalent of IPv4 `127.0.0.1`. Packets sent to `::1` never leave the host; they are used for local testing and inter-process communication through the network stack. [learn.microsoft](https://learn.microsoft.com/zh-tw/previous-versions/windows/embedded/ee495100(v=winembedded.60))

Example:

- A web server listening only on localhost might be reachable at `http://[::1]:8080`.

### Unspecified address

The IPv6 unspecified address is `::`, meaning all 128 bits are zero. It indicates “no address yet” and cannot be assigned to an interface as a usable host address or used as a normal destination; it is typically used internally during initialization, such as when a host is testing whether a tentative address is already in use. [youtube](https://www.youtube.com/watch?v=H-n_md1PVBQ)

### Wildcard / any address

In socket programming and service binding, `::` is also used as the IPv6 wildcard or “listen on all IPv6 interfaces” address, just as `0.0.0.0` is used in IPv4. In routing, `::/0` is the IPv6 default route, analogous to `0.0.0.0/0` in IPv4. [ibm](https://www.ibm.com/docs/en/i/7.4.0?topic=concepts-ipv6-address-types)

### Link-local

All IPv6 interfaces are expected to have a link-local address in `fe80::/10`, which is valid only on the directly connected link and is never forwarded by routers. These addresses are crucial for neighbor discovery, router discovery, and local communication. [datatracker.ietf](https://datatracker.ietf.org/doc/html/rfc4291)

## How one interface gets multiple IPv6 addresses

A major conceptual shift from IPv4 is that **multiple IPv6 addresses on one interface are normal**. A host may have: [learn.microsoft](https://learn.microsoft.com/zh-tw/previous-versions/windows/embedded/ee495100(v=winembedded.60))

- One link-local address.
- One stable global unicast address.
- One or more temporary privacy addresses.
- Possibly a ULA as well.

Your Windows Wi‑Fi output is a perfect example:

```text
IPv6 Address. . . . . . . . . . . : 2401:4900:8541:5d5c:adf1:d3c7:a4a9:1619
Temporary IPv6 Address. . . . . . : 2401:4900:8541:5d5c:8dd4:1d94:138e:fbf7
Link-local IPv6 Address . . . . . : fe80::a34e:d7b2:2b48:d5a3%8
```

### Stable global address

`2401:4900:8541:5d5c:adf1:d3c7:a4a9:1619` is a global unicast address because it comes from a public IPv6 prefix, not from link-local or ULA space. The first 64 bits, `2401:4900:8541:5d5c`, are the network prefix advertised to your host, and the last 64 bits identify your interface within that subnet. [eng.libretexts](https://eng.libretexts.org/Bookshelves/Computer_Science/Networks/An_Introduction_to_Computer_Networks_(Dordal)/08:_IP_version_6/8.08:_IPv6_Host_Address_Assignment)

### Temporary address

`2401:4900:8541:5d5c:8dd4:1d94:138e:fbf7` is another global address on the same subnet prefix, but with a different randomized interface identifier. This is a privacy or temporary address, typically preferred for outbound connections so websites cannot track the same stable interface identifier over time as easily. [youtube](https://www.youtube.com/watch?v=amj0GBVdFwU)

### Link-local address

`fe80::a34e:d7b2:2b48:d5a3%8` is the link-local address. The `%8` suffix on Windows is the zone or interface index, needed when the same host has multiple interfaces that could each have link-local addresses like `fe80::...`. [ibm](https://www.ibm.com/docs/en/i/7.4.0?topic=concepts-ipv6-address-types)

The key takeaway is that your host is not “confused” by having three IPv6 addresses; this is expected behavior in IPv6. [learn.microsoft](https://learn.microsoft.com/zh-tw/previous-versions/windows/embedded/ee495100(v=winembedded.60))

## How hosts configure themselves

IPv6 was designed so that hosts can join a network and configure addresses with less manual administration than classic IPv4. The two main models are: [infotechninja](https://infotechninja.com/ipv6-deep-dive-link-local-slaac/)

- **SLAAC**: Stateless Address Autoconfiguration. [eng.libretexts](https://eng.libretexts.org/Bookshelves/Computer_Science/Networks/An_Introduction_to_Computer_Networks_(Dordal)/08:_IP_version_6/8.08:_IPv6_Host_Address_Assignment)
- **DHCPv6**: stateful IPv6 address configuration. [eng.libretexts](https://eng.libretexts.org/Bookshelves/Computer_Science/Networks/An_Introduction_to_Computer_Networks_(Dordal)/08:_IP_version_6/8.08:_IPv6_Host_Address_Assignment)

### SLAAC

With SLAAC, the host learns a prefix from Router Advertisements and builds its own full address by combining that prefix with an interface identifier. This lets a network provide basic IPv6 connectivity without necessarily running a DHCP server just to hand out addresses. [infotechninja](https://infotechninja.com/ipv6-deep-dive-link-local-slaac/)

### DHCPv6

DHCPv6 can still be used when the network wants stronger central control, leases, and additional managed configuration details. In practice, many networks mix SLAAC for address creation with DHCPv6 or RA options for things like DNS settings, depending on platform and policy. [mylilserver](https://mylilserver.net/networkArticles/dhcp.html)

## Neighbor Discovery

IPv4 uses ARP to map IP addresses to MAC addresses and separate mechanisms for router discovery. IPv6 replaces ARP with **Neighbor Discovery (ND)**, which uses ICMPv6 messages for: [learn.microsoft](https://learn.microsoft.com/pt-br/previous-versions/windows/it-pro/windows-server-2003/cc780593(v=ws.10))

- Neighbor Solicitation.
- Neighbor Advertisement.
- Router Solicitation.
- Router Advertisement.
- Redirects. [infotechninja](https://infotechninja.com/ipv6-deep-dive-link-local-slaac/)

This unifies several behaviors under ICMPv6 and uses multicast rather than broadcast, which fits the overall IPv6 design. [scs.stanford](https://www.scs.stanford.edu/10au-cs144/notes/l16-print.pdf)

## High-level host startup flow

A useful mental sequence for an IPv6 host is:

1. Interface comes up.
2. Host creates a link-local address in `fe80::/10`. [ibm](https://www.ibm.com/docs/en/i/7.4.0?topic=concepts-ipv6-address-types)
3. Host uses Neighbor Discovery to communicate locally and solicit routers. [infotechninja](https://infotechninja.com/ipv6-deep-dive-link-local-slaac/)
4. A router sends a Router Advertisement with prefix information, such as `2401:4900:8541:5d5c::/64`. [eng.libretexts](https://eng.libretexts.org/Bookshelves/Computer_Science/Networks/An_Introduction_to_Computer_Networks_(Dordal)/08:_IP_version_6/8.08:_IPv6_Host_Address_Assignment)
5. Host creates a stable global address from that prefix. [infotechninja](https://infotechninja.com/ipv6-deep-dive-link-local-slaac/)
6. Host may also create one or more temporary privacy addresses on the same prefix. [networkstoragesecurity.wordpress](https://networkstoragesecurity.wordpress.com/autoconfig-slaac-temporary-addresses-rfc4941/)
7. Host performs Duplicate Address Detection to ensure the chosen address is not already in use. [youtube](https://www.youtube.com/watch?v=amj0GBVdFwU)

That flow explains exactly why your Wi‑Fi adapter shows one link-local and two global-looking addresses.

## Privacy extensions

Temporary IPv6 addresses exist because a stable interface identifier in a global address can make long-term tracking easier. Privacy extensions generate randomized temporary interface IDs, producing addresses like your second `2401:4900:8541:5d5c:...` entry, and operating systems often prefer those addresses for outbound client traffic. [networkstoragesecurity.wordpress](https://networkstoragesecurity.wordpress.com/autoconfig-slaac-temporary-addresses-rfc4941/)

Example:

- Stable: `2401:4900:8541:5d5c:adf1:d3c7:a4a9:1619`
- Temporary: `2401:4900:8541:5d5c:8dd4:1d94:138e:fbf7`

Same subnet, different last 64 bits, different purpose.

## Prefixes and the /64 habit

In real IPv6 LANs, `/64` is the standard subnet size used for SLAAC because the lower 64 bits are typically used for interface identifiers and privacy addresses. This is one of the biggest mindset shifts from IPv4: in IPv6, “subnets are huge” is normal, and address abundance is built into the model. [digitalocean](https://www.digitalocean.com/resources/articles/ipv4-vs-ipv6)

## Security and routing implications

IPv6 was designed with IPsec support in mind and with cleaner routing behavior than the fragmented IPv4 world of NAT workarounds. That does **not** mean IPv6 is automatically secure, but it does mean the protocol was built for a more modern internet, with a bigger address space, less dependence on address sharing, and cleaner end-to-end assumptions. [aws.amazon](https://aws.amazon.com/compare/the-difference-between-ipv4-and-ipv6/)

A useful misconception to avoid: **IPv6 does not equal “no firewall needed.”** In fact, globally reachable addressing means filtering policy matters even more, because many hosts can have real globally scoped addresses. [digitalocean](https://www.digitalocean.com/resources/articles/ipv4-vs-ipv6)

## IPv4 vs IPv6 comparison

| Topic | IPv4 | IPv6 |
|---|---|---|
| Address size | 32 bits  [en.wikipedia](https://en.wikipedia.org/wiki/IPv6) | 128 bits  [en.wikipedia](https://en.wikipedia.org/wiki/IPv6) |
| Notation | Dotted decimal | Hexadecimal groups with colons  [datatracker.ietf](https://datatracker.ietf.org/doc/html/rfc4291) |
| Broadcast | Present | Removed  [tutorialspoint](https://www.tutorialspoint.com/ipv6/ipv6_features.htm) |
| Address scarcity | Severe, led to NAT | Vast space, much less pressure for NAT  [digitalocean](https://www.digitalocean.com/resources/articles/ipv4-vs-ipv6) |
| Local neighbor mapping | ARP | Neighbor Discovery via ICMPv6  [infotechninja](https://infotechninja.com/ipv6-deep-dive-link-local-slaac/) |
| Autoconfiguration | Mostly DHCP/manual | SLAAC and/or DHCPv6  [infotechninja](https://infotechninja.com/ipv6-deep-dive-link-local-slaac/) |
| Loopback | `127.0.0.1` | `::1`  [learn.microsoft](https://learn.microsoft.com/zh-tw/previous-versions/windows/embedded/ee495100(v=winembedded.60)) |
| Wildcard bind | `0.0.0.0` | `::`  [youtube](https://www.youtube.com/watch?v=H-n_md1PVBQ) |
| Default route | `0.0.0.0/0` | `::/0`  [youtube](https://www.youtube.com/watch?v=H-n_md1PVBQ) |

## Gotchas

A few common mistakes cause confusion:

- Thinking one interface should have only one IP address; in IPv6, multiple addresses per interface are normal. [learn.microsoft](https://learn.microsoft.com/zh-tw/previous-versions/windows/embedded/ee495100(v=winembedded.60))
- Confusing `::1` with `::`; `::1` is loopback, while `::` is unspecified/wildcard depending on context. [youtube](https://www.youtube.com/watch?v=H-n_md1PVBQ)
- Assuming `fe80::` addresses are globally usable; they are only valid on the local link and are not routed. [ibm](https://www.ibm.com/docs/en/i/7.4.0?topic=concepts-ipv6-address-types)
- Assuming the “Temporary IPv6 Address” is a bug or duplicate; it is usually a privacy feature. [youtube](https://www.youtube.com/watch?v=amj0GBVdFwU)
- Thinking ULA is exactly the same thing as IPv4 private addressing; it is similar in purpose but lives in a different, more address-rich design. [ripe](https://www.ripe.net/media/documents/ipv6-address-types.pdf)

## Step-by-step example from your machine

Take your global prefix:

```text
2401:4900:8541:5d5c::/64
```

Your system then has:

- Stable global:
  - `2401:4900:8541:5d5c:adf1:d3c7:a4a9:1619`
- Temporary global:
  - `2401:4900:8541:5d5c:8dd4:1d94:138e:fbf7`
- Link-local:
  - `fe80::a34e:d7b2:2b48:d5a3%8`

Interpretation:

- The first two are on the same routed subnet because they share the same first 64 bits.
- The last one is purely for the local link.
- Outbound traffic to websites is often sourced from the temporary address.
- Local IPv6 control-plane work like ND depends heavily on the link-local address.

That single example captures a lot of what makes IPv6 different from IPv4.

## Key takeaways

- IPv6 exists because IPv4 ran out of practical address scale and accumulated operational workarounds. [spiceworks](https://www.spiceworks.com/tech/networking/articles/what-is-ipv6/)
- IPv6 addresses are 128 bits and written in hexadecimal with compression rules. [en.wikipedia](https://en.wikipedia.org/wiki/IPv6_address)
- Multiple IPv6 addresses per interface are normal, especially link-local plus stable global plus temporary privacy addresses. [networkstoragesecurity.wordpress](https://networkstoragesecurity.wordpress.com/autoconfig-slaac-temporary-addresses-rfc4941/)
- `::1` is loopback, `::` is unspecified/wildcard depending on context, and `fe80::/10` is link-local. [youtube](https://www.youtube.com/watch?v=H-n_md1PVBQ)
- SLAAC and Neighbor Discovery are central to how IPv6 hosts join a network and function without heavy manual configuration. [eng.libretexts](https://eng.libretexts.org/Bookshelves/Computer_Science/Networks/An_Introduction_to_Computer_Networks_(Dordal)/08:_IP_version_6/8.08:_IPv6_Host_Address_Assignment)
- IPv6 is not just “more addresses”; it is a cleaner, more structured networking model. [digitalocean](https://www.digitalocean.com/resources/articles/ipv4-vs-ipv6)

## What to learn next

The most logical next steps are:

1. Neighbor Discovery packets in detail — RS, RA, NS, NA, DAD.
2. SLAAC bit-by-bit — how interface IDs and privacy addresses are formed.
3. IPv6 subnetting and prefix planning — especially `/64`, `/56`, `/48`.
4. IPv6 routing and default gateways.
5. IPv6 transition mechanisms — dual-stack, NAT64, DNS64, tunnels.
