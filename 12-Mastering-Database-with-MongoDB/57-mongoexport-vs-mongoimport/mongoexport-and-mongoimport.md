# MongoDB Export and Import

## `mongoexport` Command

The `mongoexport` command is used to export data from a MongoDB database into a readable format such as JSON or CSV.

### Syntax
```sh
mongoexport [options]
```

### Common Options
| Option | Description |
|---------|-------------|
| `--host <hostname>` | Specifies the MongoDB server (default: `localhost`). |
| `--port <port>` | Specifies the port to connect to MongoDB (default: `27017`). |
| `--db <database>` | Exports data from a specific database. |
| `--collection <collection>` | Exports data from a specific collection. |
| `--out <filename>` | Specifies the output file name. |
| `--type <json or csv>` | Specifies the export format (JSON or CSV). Default is JSON. |
| `--fields <field1,field2>` | Specifies fields to include (only for CSV export). |
| `--query <query>` | Exports only documents matching the query (JSON format). |
| `--jsonArray` | Outputs JSON as an array instead of separate objects. |
| `--authenticationDatabase <dbname>` | Specifies the authentication database. |
| `--username <username>` | Specifies the username for authentication. |
| `--password <password>` | Specifies the password for authentication. |

### Examples

1. **Export a collection to a JSON file**
```sh
mongoexport --db mydatabase --collection users --out users.json
```

2. **Export a collection to a CSV file**
```sh
mongoexport --db mydatabase --collection users --type=csv --fields name,email,age --out users.csv
```

3. **Export data with a query filter**
```sh
mongoexport --db mydatabase --collection users --query '{"age": {"$gte": 25}}' --out users.json
```

4. **Export data with authentication**
```sh
mongoexport --db mydatabase --collection users --username admin --password secret --authenticationDatabase admin --out users.json
```

5. **Export JSON as an array**
```sh
mongoexport --db mydatabase --collection users --jsonArray --out users.json
```

---

## `mongoimport` Command

The `mongoimport` command is used to import data into a MongoDB database from JSON or CSV files.

### Syntax
```sh
mongoimport [options] <file>
```

### Common Options
| Option | Description |
|---------|-------------|
| `--host <hostname>` | Specifies the MongoDB server (default: `localhost`). |
| `--port <port>` | Specifies the port to connect to MongoDB (default: `27017`). |
| `--db <database>` | Specifies the database to import into. |
| `--collection <collection>` | Specifies the collection to import data into. |
| `--file <filename>` | Specifies the input file. |
| `--type <json or csv>` | Specifies the import format (JSON or CSV). Default is JSON. |
| `--fields <field1,field2>` | Specifies field order for CSV imports. |
| `--jsonArray` | Indicates that the input JSON is an array. |
| `--drop` | Drops the collection before importing new data. |
| `--authenticationDatabase <dbname>` | Specifies the authentication database. |
| `--username <username>` | Specifies the username for authentication. |
| `--password <password>` | Specifies the password for authentication. |

### Examples

1. **Import a JSON file into a collection**
```sh
mongoimport --db mydatabase --collection users --file users.json
```

2. **Import a CSV file into a collection**
```sh
mongoimport --db mydatabase --collection users --type=csv --headerline --file users.csv
```

3. **Import JSON data as an array**
```sh
mongoimport --db mydatabase --collection users --jsonArray --file users.json
```

4. **Import data with authentication**
```sh
mongoimport --db mydatabase --collection users --username admin --password secret --authenticationDatabase admin --file users.json
```

5. **Drop existing collection before importing**
```sh
mongoimport --db mydatabase --collection users --drop --file users.json
