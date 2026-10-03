# Caching: What, Where, and for How Long

**One-sentence summary:**
Caching makes repeated work faster, but every cache introduces a freshness problem: decide how stale data may be, choose the right cache layer, invalidate it correctly, prevent stampedes, and make sure the application still works when the cache disappears.

---

## Notes

| # | File | Covers |
|---|------|--------|
| 1 | [What Is Caching and Why](./01-What-Is-Caching-and-Why.md) | Mental model, intuition, why we cache, what not to cache, cache layers overview |
| 2 | [HTTP Caching](./02-HTTP-Caching.md) | `Cache-Control`, `public` vs `private`, `ETag`, `If-None-Match`, `304 Not Modified` |
| 3 | [Server-Side Caches](./03-Server-Side-Caches.md) | Redis (shared cache), in-process cache, comparison |
| 4 | [Cache Invalidation Strategies](./04-Cache-Invalidation-Strategies.md) | The hard problem, TTL, delete-on-write, versioned keys, comparison |
| 5 | [Thundering Herd](./05-Thundering-Herd.md) | The problem, lock-based solution, serve-stale-while-refreshing |
| 6 | [Negative Caching](./06-Negative-Caching.md) | Caching "not found", why short TTLs matter |
| 7 | [Cache Availability and Resilience](./07-Cache-Availability-and-Resilience.md) | Fallback design, the timeout trap, optional vs required dependencies |
| 8 | [TTL Implementation](./08-TTL-Implementation.md) | `cacheSet`, `cacheGet`, TTL logic, expired entry cleanup, minimal code |
| 9 | [Design Checklist and Common Mistakes](./09-Design-Checklist-and-Common-Mistakes.md) | Complete cache flow, 8 design questions, 8 common gotchas, comparison tables |
| 10 | [Self-Test and Key Takeaways](./10-Self-Test-and-Key-Takeaways.md) | 15 self-test questions, key takeaways, what to learn next |
