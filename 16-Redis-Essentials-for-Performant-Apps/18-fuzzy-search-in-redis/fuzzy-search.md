# 🔍 Fuzzy Search & Advanced Query Options

## 🔎 Fuzzy Search (Approximate Matching)

Fuzzy search allows you to find results even when there are typos or close matches. For example, if you search for `Kumar`, fuzzy search can still return results like `Kumaar`.

### ✅ Syntax:

```bash
FT.SEARCH userIdx "%Kumar%"
```

### 📌 Example:

If your document contains:

```json
{ "name": "Vishwajeet Kumaar", "city": "Kolkata" }
```

And you run:

```bash
FT.SEARCH userIdx "%Kumar%"
```

You will get a match, even though you searched `Kumar` instead of `Kumaar`.

**Note**: This works best when the field is indexed as `TEXT`.

---

## 🌠 Search by Any Word (Logical OR)

To match **any** word from a list:

```bash
FT.SEARCH userIdx "Bhupesh|Sahil"
```

Matches documents that contain **either** `Bhupesh` or `Sahil`.

---

## 📃 Paging Results

Use `LIMIT` to paginate:

```bash
FT.SEARCH userIdx "Delhi" LIMIT 10 5
```

Returns 5 results starting from the 11th match (i.e., skip first 10).

---

## 🚫 Excluding Words from Search

Use `-` to exclude terms:

```bash
FT.SEARCH userIdx "-Sanat"
```

Finds all documents **excluding** the word `Sanat`.

---

## 🔠 Partial Word Search (Prefix & Suffix)

Use `*` for pattern-based matches:

### Prefix Match

```bash
FT.SEARCH userIdx "Kum*"
```

Finds documents with words like `Kumar`, `Kumaar`, etc.

### Suffix Match

```bash
FT.SEARCH userIdx "*mar"
```

Finds documents that end with `mar`, such as `Kumar`, `Kumaar`.

### Example:

```bash
FT.SEARCH userIdx "*maar"
```

Matches:

```json
{ "name": "Vishwajeet Kumaar" }
```

---

## 💡 Summary

| Feature      | Example Command                        |     |
| ------------ | -------------------------------------- | --- |
| Fuzzy Search | `FT.SEARCH userIdx "%Kumar%"`          |     |
| OR Matching  | `FT.SEARCH userIdx "Bhupesh\|Sahil"`   |     |
| Pagination   | `FT.SEARCH userIdx "Delhi" LIMIT 10 5` |     |
| Exclude Word | `FT.SEARCH userIdx "-Sanat"`           |     |
| Prefix Match | `FT.SEARCH userIdx "Sah*"`             |     |

Use these techniques to build powerful and user-friendly search features in your Redis-powered applications.
