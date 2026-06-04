/*
Steps to enable transaction in MongoDB

    1. Edit the Config File (mongod.conf)

        -> Add the following under the replication section:
            replication:
                replSetName: rs0

    2. Restart the MongoDB service if installed as a service on Windows

    3. Initiate the Replica Set
        -> In the shell, run: rs.initiate()

    4. Verify Status: rs.status()

    5. Change the connection String: mongodb://localhost:27017/?replicaSet=rs0
*/

import { MongoClient } from "mongodb";

const client = new MongoClient("mongodb://localhost:27017/app");
await client.connect();

const db = client.db();
const directoryCollection = db.collection("directories");
const userCollection = db.collection("users");

const session = client.startSession();
session.startTransaction();

try {
  await directoryCollection.insertOne(
    { name: "db", userName: "rr" },
    { session },
  );
  await userCollection.insertOne({ name: "rr", storageDir: "db" }, { session });

  await session.commitTransaction();
} catch (error) {
  console.log(error);
  await session.abortTransaction();
}

client.close();
