# DoS and DDoS — One-Shot Revision

## 1. One-line Definition

Denial of Service exhausts a service’s resources to deny legitimate users access; DDoS does so from many distributed sources.

## 2. Why was it introduced?

Internet-facing services have finite CPU, memory, connections, bandwidth, and expensive downstream capacity that attackers or accidental spikes can exhaust.

## 3. Core Mental Model

Availability is a resource-budget problem: make expensive work bounded, reject/absorb excess traffic early, and keep one abusive client from consuming shared capacity.

## 4. Internal Working

Attacks can flood network/application requests, hold connections open, trigger CPU-intensive work, inflate bodies/uploads, exhaust database pools, or abuse expensive regex/queries. DDoS complicates IP-based controls because requests arrive from many sources. Node’s event-loop model makes synchronous CPU work particularly harmful: one blocked loop can delay every request.

## 5. Key APIs / Syntax

```js
app.use(express.json({ limit: '100kb' }));
server.requestTimeout = 30_000;
server.headersTimeout = 35_000;
server.keepAliveTimeout = 5_000;
```

These are examples, not universal values—select limits from normal traffic and upstream-proxy configuration.

## 6. Comparison

| DoS | DDoS |
| --- | --- |
| One/few sources | Many distributed sources/botnet |
| Local per-client controls may help | Usually needs CDN/WAF/provider-level mitigation too |
| Can include application resource exhaustion | Can include volumetric and application-layer flooding |

## 7. Common Mistakes

- Believing a single Express middleware stops volumetric DDoS.
- No body/header/connection timeouts or upload limits.
- Blocking the event loop with sync CPU/file operations.
- Unbounded pagination, regex, database queries, or queues.
- Trusting spoofable client-IP headers without correct proxy setup.

## 8. Production Considerations

- Put CDN/WAF/DDoS protection and load balancing in front of origin servers.
- Apply rate limits, concurrency limits, request sizes/timeouts, caching, circuit breakers, queue backpressure, and autoscaling.
- Monitor saturation (event-loop lag, memory, connections, latency, error rate) and rehearse incident response.
- Separate critical workloads and protect expensive endpoints more strictly.

## 9. Interview Questions

1. DoS versus DDoS?
2. Why is Node event-loop blocking an availability risk?
3. What limits protect an HTTP server?
4. Why do WAF/CDN controls matter for DDoS?

## 10. Memory Triggers

- **Availability = bounded resources.**
- **DoS one source; DDoS many.**
- **Reject early, limit work, observe saturation.**

## 11. Summary

Preventing DoS/DDoS needs layered capacity controls: bounded requests/work, application limits, resilient architecture, and network-edge protection.
