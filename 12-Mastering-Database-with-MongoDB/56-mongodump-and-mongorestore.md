# MongoDB Backup and Restore

## `mongodump` Command

The `mongodump` command is used to create a backup of a MongoDB database. It extracts data from a running MongoDB instance and stores it in a BSON format.

### Syntax

```sh
mongodump [options]
```

### Common Options

| Option                              | Description                                                               |
| ----------------------------------- | ------------------------------------------------------------------------- |
| `--host <hostname>`                 | Specifies the MongoDB server (default: `localhost`).                      |
| `--port <port>`                     | Specifies the port to connect to MongoDB (default: `27017`).              |
| `--db <database>`                   | Dumps a specific database.                                                |
| `--collection <collection>`         | Dumps a specific collection within a database.                            |
| `--out <path>`                      | Specifies the output directory for the backup (default: `dump/`).         |
| `--gzip`                            | Compresses the output with gzip.                                          |
| `--archive=<filename>`              | Dumps the data into a single archive file instead of separate BSON files. |
| `--authenticationDatabase <dbname>` | Specifies the authentication database for login credentials.              |
| `--username <username>`             | Specifies the username for authentication.                                |
| `--password <password>`             | Specifies the password for authentication.                                |
| `--query <query>`                   | Dumps documents matching the query (in JSON format).                      |

### Examples

1. **Dump all databases**

```sh
mongodump --out /backup/mongo/
```

2. **Dump a specific database**

```sh
mongodump --db mydatabase --out /backup/mongo/
```

3. **Dump a specific collection**

```sh
mongodump --db mydatabase --collection users --out /backup/mongo/
```

4. **Dump with authentication**

```sh
mongodump --db mydatabase --username admin --password secret --authenticationDatabase admin --out /backup/mongo/
```

5. **Dump data in gzip format**

```sh
mongodump --db mydatabase --gzip --out /backup/mongo/
```

6. **Dump data to a BSON archive file**

```sh
mongodump --db mydatabase --archive=/backup/mongo/mongodb_backup.bson
```

7. **Dump data to a gzip archive file**

```sh
mongodump --db mydatabase --archive=/backup/mongo/mongodb_backup.gz --gzip
```

---

## `mongorestore` Command

The `mongorestore` command is used to restore data from a BSON backup created by `mongodump`.

### Syntax

```sh
mongorestore [options] <path>
```

### Common Options

| Option                              | Description                                                      |
| ----------------------------------- | ---------------------------------------------------------------- |
| `--host <hostname>`                 | Specifies the MongoDB server (default: `localhost`).             |
| `--port <port>`                     | Specifies the port to connect to MongoDB (default: `27017`).     |
| `--db <database>`                   | Restores to a specific database.                                 |
| `--collection <collection>`         | Restores a specific collection.                                  |
| `--drop`                            | Drops existing collections before restoring.                     |
| `--gzip`                            | Restores from a gzip-compressed dump.                            |
| `--archive=<filename>`              | Restores from a single archive file.                             |
| `--authenticationDatabase <dbname>` | Specifies the authentication database for login credentials.     |
| `--username <username>`             | Specifies the username for authentication.                       |
| `--password <password>`             | Specifies the password for authentication.                       |
| `--dir <path>`                      | Specifies the input directory for the backup (default: `dump/`). |

### Examples

1. **Restore all databases from a dump directory**

```sh
mongorestore --dir /backup/mongo/
```

2. **Restore a specific database**

```sh
mongorestore --db mydatabase /backup/mongo/mydatabase/
```

3. **Restore a specific collection**

```sh
mongorestore --db mydatabase --collection users /backup/mongo/mydatabase/users.bson
```

4. **Restore with authentication**

```sh
mongorestore --db mydatabase --username admin --password secret --authenticationDatabase admin /backup/mongo/mydatabase/
```

5. **Restore and drop existing collections before restoring**

```sh
mongorestore --db mydatabase --drop /backup/mongo/mydatabase/
```

6. **Restore from a BSON archive file**

```sh
mongorestore --archive=/backup/mongo/mongodb_backup.bson
```

7. **Restore from a gzip archive**

```sh
mongorestore --gzip --archive=/backup/mongo/mongodb_backup.gz
```
