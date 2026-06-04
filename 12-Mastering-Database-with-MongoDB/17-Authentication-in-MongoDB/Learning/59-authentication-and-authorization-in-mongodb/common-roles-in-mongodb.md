# Common MongoDB Roles and Their Meanings

MongoDB provides **Role-Based Access Control (RBAC)**, where users are assigned roles that determine their access level.

## **1. Database User Roles** (For interacting with data)

| Role | Meaning |
|------|---------|
| `read` | Allows the user to **only read data** from the assigned database. Cannot write or modify data. |
| `readWrite` | Allows the user to **read and write** data in the assigned database but cannot perform administrative tasks. |

## **2. Database Administration Roles** (For managing databases)

| Role | Meaning |
|------|---------|
| `dbAdmin` | Allows the user to **manage collections, indexes, and validation rules** but cannot read or modify data. |
| `dbOwner` | Full control over a specific database, including managing users and roles for that database. |
| `userAdmin` | Allows managing users and roles **for a specific database** but does not grant access to data. |

## **3. Cluster Administration Roles** (For managing MongoDB clusters)

| Role | Meaning |
|------|---------|
| `clusterAdmin` | Grants full control over the cluster, including managing shards, replica sets, and configuration settings. |
| `clusterManager` | Allows managing the cluster but does not allow administrative tasks like user creation. |
| `clusterMonitor` | Grants **read-only** access to cluster status and monitoring information. |
| `hostManager` | Allows managing servers but **not** making database-level changes. |

## **4. Backup and Restore Roles** (For managing database backups)

| Role | Meaning |
|------|---------|
| `backup` | Allows the user to **perform backups** but does not allow modifying data. |
| `restore` | Allows the user to **restore backups** but does not allow modifying collections directly. |

## **5. All-Database Roles** (For managing multiple databases)

| Role | Meaning |
|------|---------|
| `readAnyDatabase` | Grants **read access** to all databases on the server. |
| `readWriteAnyDatabase` | Grants **read and write access** to all databases on the server. |
| `userAdminAnyDatabase` | Allows creating and managing users **for all databases**. |
| `dbAdminAnyDatabase` | Grants administrative privileges **for all databases**, including index and validation management. |

## **6. Superuser Role** (For full server access)

| Role | Meaning |
|------|---------|
| `root` | Grants **full access** to all databases, collections, users, and settings. The highest privilege level in MongoDB. |

## **7. Custom Roles** (For specific needs)
MongoDB allows creating **custom roles** with specific privileges:
```js
db.createRole({
  role: "insertOnly",
  privileges: [{ resource: { db: "myDatabase", collection: "" }, actions: ["insert"] }],
  roles: []
})
```

---
### **Which Roles to Use?**
- **For developers** → `readWrite`
- **For database administrators** → `dbAdmin`, `userAdmin`
- **For monitoring** → `clusterMonitor`
- **For backups** → `backup`, `restore`
- **For super admins** → `root`

This list covers the **most commonly used roles** in MongoDB. 🚀

