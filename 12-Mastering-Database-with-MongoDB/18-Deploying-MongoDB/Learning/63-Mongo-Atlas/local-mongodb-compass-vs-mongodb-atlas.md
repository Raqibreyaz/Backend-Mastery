## Atlas vs local vs Compass

- Atlas is a **cloud management layer** on top of MongoDB: it adds orgs, projects, clusters, metrics, backups, and security/UI around the same MongoDB engine you’d run locally.
- Local MongoDB is just **`mongod` you run yourself** (bare metal, VM, Docker); you manage installation, config, upgrades, backups, and monitoring.
- Compass is a **GUI client**: it connects to any MongoDB deployment (local, replica set, sharded cluster, Atlas) and shows only the **DB → collection → document** hierarchy.

## Atlas hierarchy

- Atlas structure: **Organization → Project → Cluster → Databases → Collections → Documents**.
- A **cluster** in Atlas is “a MongoDB deployment with specific topology, region, and resources” (replica set or sharded cluster).
- Within a cluster, DBs and collections behave like normal MongoDB; your app code only knows about DBs and collections, not org/project.

## Compass hierarchy

- Compass connects using a URI, then shows: **Databases → Collections → Documents**.
- It doesn’t expose Atlas concepts (org, project, cluster) directly; those are part of the deployment you connect to, not Compass itself.

## Connection strings: `mongodb://` vs `mongodb+srv://`

- `mongodb://` is the **basic format**: host(s) and options are specified directly (e.g., `mongodb://localhost:27017/mydb`).
- `mongodb+srv://` uses **DNS SRV records**: the driver looks up the actual hosts and options from DNS based on a single hostname.
- Atlas prefers `mongodb+srv://` because:
  - It can change underlying hosts/topology without changing your URI.
  - It automatically encodes cluster hosts and TLS defaults via DNS.
- Local dev usually uses `mongodb://` because you just have `localhost` or a single known host and no SRV DNS set up.

## Cluster vs replica set

- **Replica set**:
  - A group of `mongod` nodes holding **the same data**, with one primary and one or more secondaries.
  - Provides high availability and redundancy; writes go to the primary, secondaries replicate via the oplog.
- **Cluster** (conceptually):
  - A broader term for the MongoDB deployment:
    - A **replica-set cluster** (just replication).
    - A **sharded cluster** (data partitioned across shards, each shard typically a replica set).
- In Atlas:
  - Most “standard” clusters are replica sets under the hood.
  - Sharded clusters are built from multiple replica sets plus config servers and `mongos` routers.

## Raw, brief notes (cheat sheet style)

- Atlas = managed MongoDB (cloud), with org/project/cluster management.
- Local MongoDB = self-hosted `mongod`; full control, full ops responsibility.
- Compass = GUI client; shows DB/collections/docs, hides Atlas’s higher-level concepts.
- Atlas hierarchy: Org → Project → Cluster → DBs → Collections → Docs.
- Compass hierarchy: Connection → DBs → Collections → Docs.
- `mongodb://` → direct host list, typical for local and simple deployments.
- `mongodb+srv://` → DNS-based discovery (SRV), typical for Atlas; shorter URIs, automatic host list & TLS.
- Replica set = multiple nodes with identical data, one primary, secondaries for HA and read scaling.
- Cluster = deployment topology; can be replica set or sharded cluster.
- Atlas “cluster” = configured deployment (region, size, type), usually implemented as a replica set or sharded cluster.

## Key takeaways

1. As a developer, you mostly see **“connection string + DB name”**; Atlas’s org/project/cluster hierarchy is about ops, not query semantics.
2. Atlas **clusters are deployments**, and most non-sharded clusters are just **replica sets managed for you**, with extra UI for scaling, backups, metrics, and security.
3. Use **local MongoDB** to learn internals and for offline/single-machine dev; use **Atlas** when you care about reliability, shared environments (dev/stage/prod), and offloading ops.
4. The **`mongodb+srv://` URI** is just a smarter, DNS-driven way to describe a cluster; your driver still ends up talking to a replica set or sharded cluster.
5. In your code, switching between local and Atlas is mainly about **changing the URI and enabling TLS**, not rewriting how you use DBs, collections, or queries.
