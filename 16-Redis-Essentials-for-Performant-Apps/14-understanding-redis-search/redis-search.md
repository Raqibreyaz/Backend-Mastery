# 🔍 Redis Search with JSON Data

Redis Search is a Redis module that enables full-text search and secondary indexing on your Redis data. It works with structured data stored in **Hash** and **JSON** formats.

Redis indexing allows efficient querying of fields within data structures. Without Redis Search, Redis can only perform key-based lookups.

---

## 📌 Check Existing Indexes

```bash
FT._LIST
```

This command lists all existing Redis Search indexes.

---

## 📋 Get Information About an Index

```bash
FT.INFO indexName
```

Example:

```bash
FT.INFO cityIdx
```

This command provides detailed information about the specified index, such as:

- indexed fields and their types
- number of documents
- memory usage
- failure stats
- index options and definition

Use this to inspect and debug your indexes.

---

## 📌 Create Indexes for JSON Data

### 🔹 Index on `city` field (as TAG)

```bash
FT.CREATE cityIdx ON JSON PREFIX 1 user: SCHEMA $.city AS city TAG
```

### 🔹 Index on `age` field (as NUMERIC)

```bash
FT.CREATE ageIdx ON JSON PREFIX 1 user: SCHEMA $.age AS age NUMERIC
```

### 🔹 Index on `name` field (as TEXT)

```bash
FT.CREATE nameIdx ON JSON PREFIX 1 user: SCHEMA $.name AS name TEXT
```

---

## 🔍 Searching with Redis CLI

### 🔸 Search by City (exact match)

```bash
FT.SEARCH cityIdx "@city:{Delhi}"
```

### 🔸 Search Users by Exact Age

```bash
FT.SEARCH ageIdx "@age:[25 25]"
```

### 🔸 Search Users with Age Greater Than or Equal to 28

```bash
FT.SEARCH ageIdx "@age:[28 +inf]"
```

### 🔸 Search Users with Age Less Than 28

```bash
FT.SEARCH ageIdx "@age:[-inf (28]"
```

> `+inf` and `-inf` represent unbounded upper and lower limits.
>
> Use **square brackets** `[]` for inclusive bounds.
> Use **parenthesis** `()` for exclusive bounds.
>
> Examples:
>
> - `[25 30]` → age between 25 and 30 (inclusive)
> - `[25 (30]` → age ≥ 25 and < 30

### 🔸 Search by Name (full-text)

```bash
FT.SEARCH nameIdx "@name:Anurag"
```

### 🔸 Command to Get Only the Matched Count

```bash
FT.SEARCH nameIdx "@name:Kumar" LIMIT 0 0
```

### 🔸 Command to Get the Selected Fields

It will work only for the field on which the search is being performed.

```bash
FT.SEARCH nameIdx "@name:Kumar" RETURN 1 name
```

---

## ❌ Drop an Index

### 🔹 Drop Index Only (keep documents)

```bash
FT.DROPINDEX nameIdx
```

### 🔹 Drop Index and Delete Documents

```bash
FT.DROPINDEX ageIdx DD
```

---

## ✅ Notes

- Use `TAG` for exact matches like city, userId, status.
- Use `NUMERIC` for range queries like age, price, date.
- Use `TEXT` for full-text and partial word matches.
- Always ensure the prefix (e.g., `user:`) matches your document keys.

---

## 📚 References

- [Redis Search Docs](https://redis.io/docs/stack/search/)
