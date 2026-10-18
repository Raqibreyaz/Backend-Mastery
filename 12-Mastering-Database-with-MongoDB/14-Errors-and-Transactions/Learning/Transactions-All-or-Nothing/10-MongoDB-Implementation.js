/*
  10 — Implementing Transactions in MongoDB (Node.js)
  =====================================================
  MongoDB transactions require a Replica Set to work — even locally.

  Setup Steps:
  ─────────────────────────────────────────────────────────────────
  1. Edit the Config File (mongod.conf)
     Add under the replication section:

         replication:
             replSetName: rs0

  2. Restart the MongoDB service.

  3. Initiate the Replica Set in the shell:
         rs.initiate()

  4. Verify status:
         rs.status()

  5. Update your connection string:
         mongodb://localhost:27017/?replicaSet=rs0
  ─────────────────────────────────────────────────────────────────
*/

import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/app");
await client.connect();

const db = client.db();
const directoryCollection = db.collection("directories");
const userCollection = db.collection("users");

// Start a session and open the transaction
const session = client.startSession();
session.startTransaction();

try {
  // Both inserts are part of the same transaction
  await directoryCollection.insertOne(
    { name: "db", userName: "rr" },
    { session },
  );
  await userCollection.insertOne({ name: "rr", storageDir: "db" }, { session });

  // If both succeed, commit
  await session.commitTransaction();
} catch (error) {
  console.log(error);
  // If anything fails, roll back both inserts
  await session.abortTransaction();
} finally {
  client.close();
}
