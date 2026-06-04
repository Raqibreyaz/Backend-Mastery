# Understanding Google Zanzibar and OpenFGA

## 🔐 What is Google Zanzibar?

Google Zanzibar is a **global, consistent, and fine-grained authorization system** developed by Google. It powers access control for services like Google Drive, Calendar, Docs, and more—handling billions of users and trillions of access control rules efficiently.

Zanzibar allows Google to define **who has what type of access to which resource** through a relationship-based model instead of a traditional role-based model.

---

## 💡 Key Concept: Tuples

The core data structure in Zanzibar is the **tuple**, which defines a relationship between a subject (like a user or group) and a resource.

### Tuple Format:

```
<resource>:<resource_id>#<relation>@<user_type>:<user_id>
```

### Example:

```
document:doc123#viewer@user:alice
```

This means:

> User `alice` has the `viewer` role on the document with ID `doc123`

Another example:

```
folder:teamFolder#editor@group:marketing-team
```

Means:

> Group `marketing-team` has `editor` access to the folder `teamFolder`

This tuple-based relationship system makes it possible to define complex, hierarchical, and dynamic permissions.

---

## 🚀 What is OpenFGA?

**OpenFGA (Fine-Grained Authorization)** is an **open-source authorization system** inspired by Google Zanzibar. It was created by **Auth0** and is now under the OpenFGA organization.

OpenFGA allows developers to build **relationship-based access control** systems similar to Google’s Zanzibar model.

### Features:

* Relationship-based authorization using tuples
* DSL (Domain-Specific Language) for modeling access rules
* Built-in APIs to evaluate access
* Highly scalable and suitable for modern applications