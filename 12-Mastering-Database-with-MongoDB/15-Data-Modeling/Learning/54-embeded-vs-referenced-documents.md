# Embedded vs. Referenced Documents

## Introduction
In NoSQL databases, particularly in document-based databases like MongoDB, data relationships can be handled using **embedded** or **referenced** documents. The choice between these approaches affects performance, scalability, and ease of querying.

## 1. Embedded Documents
Embedded documents store related data within the same document.

### Pros:
- **Faster Reads**: Data retrieval is quicker since related data is stored together.
- **Fewer Joins**: No need for complex queries or additional lookups.
- **Atomic Updates**: Easier to update related data in a single operation.

### Cons:
- **Data Duplication**: Can lead to redundancy if the same sub-document is used in multiple documents.
- **Limited Scalability**: Large nested documents can impact performance and exceed document size limits.

### Example:
```json
{
  "_id": 1,
  "name": "John Doe",
  "orders": [
    { "order_id": 101, "amount": 50 },
    { "order_id": 102, "amount": 75 }
  ]
}
```

## 2. Referenced Documents
Referenced documents store relationships using document references (IDs).

### Pros:
- **Better Scalability**: Useful for large datasets where embedding would exceed size constraints.
- **Efficient Updates**: Changes to referenced documents don’t require updating multiple documents.
- **Normalization**: Reduces redundancy and improves maintainability.

### Cons:
- **Slower Reads**: Requires additional lookups to retrieve related data.
- **Increased Query Complexity**: Queries involve joins or multiple fetch operations.

### Example:
```json
{
  "_id": 1,
  "name": "John Doe",
  "orders": [101, 102]
}

{
  "_id": 101,
  "order_id": 101,
  "amount": 50
}

{
  "_id": 102,
  "order_id": 102,
  "amount": 75
}
```

## 3. When to Use Each Approach
| Use Case | Embedded Documents | Referenced Documents |
|----------|--------------------|---------------------|
| Data is frequently read together | ✅ | ❌ |
| Data relationships are complex and scalable | ❌ | ✅ |
| Updates are frequent across multiple documents | ❌ | ✅ |
| Document size constraints are not a concern | ✅ | ❌ |

## Conclusion
Choosing between embedded and referenced documents depends on the application’s needs. Use **embedded documents** when data is closely related and frequently accessed together. Use **referenced documents** when scalability, normalization, and flexibility are priorities.