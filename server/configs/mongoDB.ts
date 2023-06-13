import { MongoClient, Db, Collection } from "mongodb";
import dotenv from "dotenv";
import { ObjFile } from "../types/exportTypes";

dotenv.config(); // Load environment variables from .env

export let filesDbCollection: Collection<ObjFile>;

// Connect to database
export const connectToDatabase = async (): Promise<void> => {
  const uri: string = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@localhost:27017`;
  const dbName: string = "3dverse";
  const client: MongoClient = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const db: Db = client.db(dbName);
    filesDbCollection = db.collection("files");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }
};
