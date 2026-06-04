# Enabling Authentication in MongoDB Replica Set

## 1. **Generating the KeyFile**

To enable authentication in a MongoDB replica set, you need to create a keyFile for internal authentication between the nodes.

### **Step 1: Generate a KeyFile**

Run the following command to generate a secure key file:

```sh
openssl rand -base64 756 > /path/to/mongo-keyfile
```

### **Step 2: Set Correct Permissions (Only for Unix Systems)**

Ensure that the key file has the correct permissions:

```sh
chmod 400 mongo-keyfile
```

## 2. **Configuring MongoDB to Use the KeyFile**

Add the following lines under the `security` section in the MongoDB configuration file (`mongod.conf`):

```yaml
security:
  authorization: enabled
  keyFile: /path/to/mongo-keyfile
```

## 3. **Restart MongoDB Nodes with Authentication**

Once the keyFile is set up, restart all nodes in the replica set:


Now, authentication is enabled for the replica set, and nodes will communicate securely using the keyFile.
