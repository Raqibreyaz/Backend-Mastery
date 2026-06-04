# Enabling Authentication in MongoDB Server

## 1. **Starting MongoDB with Authentication**

### **Method 1: Using `--auth` Flag (Terminal-Based)**

Run MongoDB with authentication enabled using the `--auth` flag:

```sh
mongod --auth
```

### **Method 2: Using Configuration File (`mongod.conf`)**

Add the following lines under the `security` section:

```yaml
security:
  authorization: enabled
```

Then, restart MongoDB Server:

---

## 2. **Creating the Admin User in `admin` Database (Root Privileges)**

After enabling authentication, you must create an **admin user** to manage the database.

1. Open the MongoDB shell:

   ```sh
   mongosh
   ```

2. Switch to the `admin` database:

   ```js
   use admin
   ```

3. Create the admin user with `root` access:

   ```js
   db.createUser({
     user: "admin",
     pwd: "admin",
     roles: [{ role: "root", db: "admin" }],
   });
   ```

Now, you **must** authenticate to perform administrative actions.

---

## 3. **Connecting to MongoDB with Authentication**

After enabling authentication, use the following command to log in as `adminUser`:

### **Method 1: Login Using MongoShell Command (Mongoshell)**

```js
db.auth({
  user: "username",
  pwd: "password",
});
```

or

```js
db.auth("username", "password");
```

### **Method 2: Login using Terminal Command (Mongoshell)**

First exit the mongoshell and run the below command.

```sh
mongosh -u "username" -p "password" --authenticationDatabase "admin"
```

### **Method 3: Login using Terminal Command (Node.js Driver, Compass, MongoDB VSCode Extension)**

Use one of the below connection strings.

`authenticationDatabase` in the below strings refers to the database in which the user was created.

```js
"mongodb://username:password@host:port/authenticationDatabase";
```

```js
"mongodb://username:password@host:port/database?authSource=authenticationDatabase";
```

---

## 3.2 **See logged in user's info**

```js
db.runCommand({ connectionStatus: 1 }).authInfo;
```

## 4. **Creating Other Users with Different Roles**

### **Example: Creating a User with `readWrite` Access on `storageApp` Database**

```js
use storageApp

db.createUser({
  user: "anurag",
  pwd: "anurag",
  roles: [{ role: "readWrite", db: "storageApp" }]
})
```

### **Example: Creating a Database Administrator for `storageApp`**

```js
use storageApp

db.createUser({
  user: "dbAdminUser",
  pwd: "secureDBPass",
  roles: [{ role: "dbAdmin", db: "storageApp" }]
})
```

---

## 5. **Updating User Roles**

### **Granting Additional Permissions to a User**

If you need to update a user’s roles, use the `updateUser` command.

#### **Example: Granting `dbAdmin` Role to `Anurag`**

```js
db.updateUser("anurag", {
  roles: [
    { role: "readWrite", db: "storageApp" },
    { role: "dbAdmin", db: "storageApp" },
    { role: "readWrite", db: "test" },
  ],
});
```

---

## 6. **Listing Users**

### **List All Users in the Current Database**

```js
db.getUsers();
```

### **List All Users Across the Server (All Databases)**

Switch to the `admin` database and run:

```js
use admin

db.system.users.find()
```

---

## 7. **Testing Authentication for Other Users**

To test access for a normal user (e.g., `Anurag`):

```sh
mongosh -u "Anurag" -p "password123" --authenticationDatabase "storageApp"
```

Then try reading or writing data:

```js
db.products.insertOne({ name: "Laptop", price: 1000 });
db.products.find();
```

If `Anurag` only has `readWrite`, they won’t be able to modify the database structure (e.g., create indexes or modify schema).

---

## 8. **Removing a User**

If you need to remove a user, use:

```js
db.dropUser("Anurag");
```

---

## 9. **Logout User**

If you need to logout the user, use:

```js
db.logout();
```

---

This guide ensures that MongoDB authentication is correctly set up and users are managed securely. 🚀
