# Role-Based Access Control (RBAC) Explained

## What is RBAC?

**Role-Based Access Control (RBAC)** is a method of managing user permissions within an application by assigning predefined roles to users. Each role has specific access rights that determine what actions a user can perform and what resources they can interact with—such as files, folders, or user data—based on their role (e.g., admin, manager, or regular user).

### Core Concepts of RBAC

1. **Users**: The individuals who need access to the system.
2. **Roles**: Job functions or responsibilities assigned to users (e.g., Admin, Manager, Viewer).
3. **Permissions**: Approval to perform specific operations on resources (e.g., read, write, delete).
4. **Resources**: Objects or entities in the system that users interact with, such as files, folders, or user profiles.
5. **Role Assignments (User-Role Mapping)**
   The relationship between users and roles—defining which user holds which role(s).

### Example

Let's take an example of a cloud storage application:

| Role    | Permissions                                          |
| ------- | ---------------------------------------------------- |
| User    | read\:own_files, write\:own_files, delete\:own_files |
| Manager | read\:all_files, read\:users                         |
| Admin   | all_permissions (read/write/delete files and users)  |

A user with the role of `Manager` cannot delete files or modify users, but can read any file or user info.

### Benefits of RBAC

- **Least Privilege**: Users only get the access they need.
- **Easier Management**: Manage roles instead of individual permissions.
- **Security**: Reduces risk of accidental or malicious privilege escalation.
- **Auditing**: Clear view of who has access to what.

---

## Other Types of Access Control

- **Attribute-Based Access Control (ABAC)**

- **Policy-Based Access Control (PBAC)**

- **Relationship-Based Access Control (ReBAC)**

- **Discretionary Access Control (DAC)**

- **Mandatory Access Control (MAC)**

---

RBAC is one of the most widely used and practical access control mechanisms, especially for enterprise and web applications due to its simplicity and scalability.
