import { MongoClient, ObjectId } from "mongodb";

const dbName = "Todo";
const collectionName = "Todos";
let dbClient = null;

const connectDb = async () => {
  if (dbClient) {
    return dbClient.db(dbName).collection(collectionName);
  }

  dbClient = new MongoClient(process.env.MONGODB_URI);
  await dbClient.connect();
  const Todo = dbClient.db(dbName);
  return Todo.collection(collectionName);
};

export const isValidObjectId = (id) => {
  return ObjectId.isValid(id);
};

export const createObjectId = (id) => {
  return new ObjectId(id);
};

export default connectDb;
