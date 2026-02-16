# Role-Based Access Control (RBAC) - Assignments

Below are the assignments for the Role-Based Access Control (RBAC) section. These assignments are designed to help you deepen your understanding of access control principles by applying them to real-world scenarios in our Storage App project.

---

## ✅ Assignment 1: Implement Hard Delete and Soft Delete Separately

### Goal:

Implement soft delete and hard delete as two separate actions:

- Soft delete should mark the user as deleted but allow recovery.
- Hard delete should permanently remove the user from the database and must be irreversible.

### Requirements:

- You already have an endpoint `DELETE /users/:userId` that performs a **soft delete**.
- Create a new **hard delete endpoint**: `DELETE /users/:userId/hard`

  - This should **permanently delete** the user from the database.

- Build a corresponding **UI control** to select between **Soft Delete** and **Hard Delete** when deleting a user.
- In the UI, show a clear **confirmation dialog** before performing a **Hard Delete** with the message:

  > "Are you sure you want to permanently delete this user? This action **cannot be undone**."

- Soft-deleted users should not appear in the normal users list unless explicitly filtered.
- Implement the ability to **recover soft-deleted users** if needed (Owner role).

### Tips:

- Add a field like `isDeleted: true/false` in the user schema to manage soft deletes.
- Use filtered queries to exclude deleted users unless needed.
- For hard delete, ensure irreversible removal of both user document and related files.

---

## ✅ Assignment 2: Implement Owner Role

### Goal:

Create a new role called `Owner`.

### Requirements:

- The `Owner` should be able to perform **everything** that the `Admin` can do.
- In addition, the `Owner` should have the ability to **recover deleted users** (if you have implemented soft deletion or trash feature).

### Tips:

- Check how you're currently defining roles.
- We are not using fine-grained permissions in this app, so base your logic directly on user roles (e.g., `if (user.role === 'Owner')`).

---

## ✅ Assignment 3: Change Roles Feature

### Goal:

Allow `Admin`, `Owner`, and `Manager` roles to change the role of other users.

### Requirements:

- Build both **API endpoints and UI** to **change a user's role**.
- Only users with `Admin`, `Owner`, or `Manager` roles should be able to perform this action.
- Prevent users from changing **their own role**.

### Tips:

- This feature requires checking the current user’s role before updating another user’s role.
- Make sure only allowed roles are assigned (e.g., you may not want to allow assigning `Owner` role casually).

---

## ✅ Assignment 4: Access Users Data Based on Role (Optional)

### Goal:

Allow specific roles to access other users’ data.

### Requirements:

- The `Owner` can perform **all CRUD operations** on any user's resources (files, directories, and user data).
- The `Admin` can **only view** other users' data.

### Tips:

- This assignment will test how well you’ve enforced role-based logic.
- Make sure access to routes and actions is role-validated.

---

## ✅ Assignment 5: Set Password for Google Logged-in Users

### Goal:

Allow users who signed up using Google to set a password.

### Requirements:

- Build both **API endpoint and UI** to enable Google users to **set a password**.
- The new password should be securely hashed and stored.
- After setting a password, the user should also be able to log in using email + password.

### Tips:

- Ensure proper validation and security when setting the password.

---

## ✅ Assignment 6: Implement Sharing Functionality Like Google Drive

### Goal:

Enable users to share their files or folders either through a shareable link or by specifying an email address. Implement granular access levels such as `Viewer` and `Editor`.

### Requirements:

- Build both **API endpoints and UI** to support sharing resources.
- Allow users to:

  - Share a file or folder via **email** (e.g., add another user's email and assign them a role like `viewer` or `editor`).
  - Share via **link** where anyone with the link can access the resource with the selected permission.

- Provide options in the UI when sharing:

  - Viewer (can only view)
  - Editor (can edit and delete)

- Show a clear list of who currently has access to the resource, with their permission level.
- Allow updating or revoking a user's access.

### Tips:

- Use a `sharedWith` array in the resource schema to track user IDs and their roles.

- You can allow only the owner or editor of a resource to share it with others.

Make sure to test each feature thoroughly.
