# Additional MongoDB Roles Not Covered in the Previous List

MongoDB has several other built-in roles that may be useful in specific use cases. Below is a list of roles that were **not included** in the previous markdown file.

## **1. Internal Roles** (Used by MongoDB internally)

| Role | Meaning |
|------|---------|
| `__system` | A special role with **unrestricted access**. This role is **not** meant to be assigned to users. |

## **2. Roles Related to Specific Operations**

| Role | Meaning |
|------|---------|
| `restore` | Grants the ability to **restore** database backups, but does not allow modifying collections. |
| `readWriteAnyDatabase` | Provides `readWrite` access to **all** databases on the server. |

## **3. Internal Replication & Sharding Roles** (Used in Replica Sets & Sharded Clusters)

| Role | Meaning |
|------|---------|
| `readWriteInternal` | Grants read and write privileges to **internal system operations**. |
| `enableSharding` | Allows enabling **sharding** for databases. |
| `clusterMonitor` | Provides **read-only access** to cluster status and monitoring tools. |
| `clusterManager` | Allows **managing** the cluster, but not modifying user permissions. |
| `hostManager` | Grants permissions to manage servers but does **not** allow modifying database-level settings. |

## **4. Auditing & Security Roles**

| Role | Meaning |
|------|---------|
| `auditAdmin` | Allows managing **audit configurations** but does not modify user access. |
| `backup` | Grants permission to **perform backups** of the database. |

## **5. Special System Roles**

| Role | Meaning |
|------|---------|
| `root` | The **highest-level** role with full access to **all** databases, collections, users, and settings. |

### **Which Additional Roles Should You Use?**
- **For managing replica sets** → `clusterMonitor`, `clusterManager`
- **For backups and recovery** → `backup`, `restore`
- **For security audits** → `auditAdmin`
- **For sharding** → `enableSharding`

These roles provide additional control in **specialized MongoDB deployments**. 🚀

