# Redis Data Types Overview

Redis supports a variety of data types out of the box, along with several more through external modules. Here's a breakdown of both categories:

---

## ✅ Built-in Data Types (Out of the Box)

These data types are supported natively in Redis without any additional installation:

1. **Strings**

   - The most basic type; can hold any binary data (e.g., text, numbers, serialized JSON).

2. **Lists**

   - Ordered collection of strings; supports push/pop from both ends (like a queue or stack).

3. **Sets**

   - Unordered collection of unique strings.

4. **Hashes**

   - Field-value pairs, similar to JavaScript objects or Python dictionaries.

5. **Sorted Sets (ZSETs)**

   - Like sets, but each element is associated with a score, enabling sorting.

6. **Bitmaps**

   - Efficient way to store and operate on bits.

7. **Bitfields**

   - More advanced bit-level operations on binary strings.

8. **HyperLogLog**

   - Probabilistic data structure to estimate the cardinality (count of unique items).

9. **Streams**

   - Log-like data structure for message queues and real-time data ingestion.

10. **Pub/Sub Channels**

- Messaging system for broadcasting and subscribing to messages. It is not a data type rather it is a communication pattern.

---

## 📦 Additional Data Types via External Modules

These are not built-in to core Redis but can be enabled by installing **Redis modules**, often through **Redis Stack**:

1. **JSON** (via `RedisJSON`)

   - Store, query, and manipulate JSON documents natively.

2. **Time Series** (via `RedisTimeSeries`)

   - Optimized storage and querying of time-series data (e.g., metrics, sensors).

3. **Probabilistic Structures** (via `RedisBloom`)

   - Bloom Filters, Count-Min Sketch, Top-K, etc., for approximate set membership and frequency estimation.

4. **Full-Text Search and Secondary Indexes** (via `RediSearch`)

   - Index and search data using full-text queries, filtering, and scoring.

5. **Graph Data** (via `RedisGraph`)

   - Store and query data as nodes and relationships using Cypher query language.

6. **Geospatial Indexing** (extended via modules)

   - Native support exists for basic geospatial features; advanced indexing requires modules.

7. **Vector Similarity Search** (via `RedisVector` or Redis Stack's vector support)

   - Used for applications like recommendation systems and AI embeddings.

---

## 📌 Summary

| Category     | Data Types / Modules                                                                         |
| ------------ | -------------------------------------------------------------------------------------------- |
| Built-in     | Strings, Lists, Sets, Hashes, Sorted Sets, Bitmaps, Bitfields, HyperLogLog, Streams, Pub/Sub |
| With Modules | JSON, Time Series, Bloom, Count-Min, Full-Text Search, Graph, Vector, Geospatial (advanced)  |

Redis's modular architecture makes it highly adaptable, letting you go from a simple cache to a powerful data engine for modern applications.