# MongoDB Limits and Thresholds

## 1. Document Size Limits
- **Maximum Document Size**: 16MB (BSON format)
  - Affects: Single document storage, embedded arrays/objects
  - Exception: GridFS for larger files

- **Maximum Array Elements**: ~4,000,000 (practical limit)
- **Maximum Nesting Depth**: 100 levels

## 2. BSON Data Types
- **String**: 16MB maximum
- **Binary Data**: 16MB (use GridFS for larger)
- **Number Precision**: 
  - 64-bit for integers (Long)
  - 64-bit IEEE 754 for doubles

## 3. Indexing Limits
| Limit Type                     | Value               |
|--------------------------------|---------------------|
| Indexes per Collection         | 64                  |
| Index Key Length               | 1024 bytes          |
| Compound Index Fields          | 32 fields           |
| Text Index Fields per Document | 1                   |
| Sharded Cluster Index Key Size | 512 bytes           |

## 4. Sharding Limits
- **Shard Key**: 
  - Immutable after creation
  - Maximum size: 512 bytes
- **Maximum Shards**: 1024
- **Chunk Size**: 1MB-1024MB (default 64MB)

## 5. Replication Limits
- **Replica Set Members**: 
  - Maximum 50 members
  - Maximum 7 voting members
- **Oplog Size**: 
  - Minimum 990MB (default for 64-bit systems: 5% disk space)

## 6. Query Limitations
| Operation                  | Limit                |
|----------------------------|----------------------|
| Result Set Size            | 32MB per query       |
| Sort Memory                | 32MB (without index) |
| Aggregation Pipeline Stages| 100 stages           |
| Aggregation Memory         | 100MB per stage      |

## 7. Connection Limits
| Deployment Type       | Default Connection Limit |
|-----------------------|---------------------------|
| MongoDB Atlas         | 500 connections/server    |
| Self-Managed Community| 16,000 connections        |
| Self-Managed Enterprise| 125,000 connections       |

## 8. Write Operations
- **Atomicity**: Single document level
- **Write Throughput**: ~100,000 ops/sec per shard
- **Bulk Write Batch Size**: 100,000 operations

## 9. Database/Collection Limits
| Entity           | Limit                         |
|------------------|-------------------------------|
| Databases        | 40 (Atlas limit per project)  |
| Collections      | 1000 per database (namespace) |
| Namespace Length | 123 bytes (db.collection)     |

## 10. Security Limits
- **Authentication**:
  - 16MB user name limit (LDAP)
  - 250 roles per user
- **X.509 Certificates**:
  - 25 attributes per certificate

## 11. MongoDB Atlas Specific
- **Document Storage**: 512MB per document
- **Free Tier**: 
  - 512MB storage
  - Shared RAM
- **Backups**: 2 days retention (free tier)

## Important Notes
1. Most limits are configurable (except fundamental BSON/document limits)
2. Workarounds exist for many limits (e.g., GridFS for large files)
3. Monitor with `db.serverStatus()` and `currentOp`

[Official MongoDB Limits Documentation](https://www.mongodb.com/docs/manual/reference/limits/)