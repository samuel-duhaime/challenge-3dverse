import { MongoClient, Db, Collection, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { ObjFile } from "../types/exportTypes";

dotenv.config(); // Load environment variables from .env

// Import the collection files inside the database
const batchImport = async () => {
  const uri: string = `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@localhost:27017`;
  const dbName: string = "3dverse";
  const client: MongoClient = new MongoClient(uri);

  try {
    await client.connect();

    const db: Db = client.db(dbName);
    const collection: Collection<ObjFile> = db.collection("files");

    const files: ObjFile[] = [
      {
        id: "bedd841f-6319-4c6f-8b09-7e57e5f9c9cc",
        name: "starwarsjuggeren.obj",
        creation_date: new Date(),
        size: 37979314,
        path: "uploads/1686670525162-starwarsjuggeren.obj",
      },
      {
        id: "b540f8e9-acad-4d11-b756-380bbaa8d73e",
        name: "whale.obj",
        creation_date: new Date(),
        size: 1053396,
        path: "uploads/1686670528764-whale.obj",
      },
      {
        id: "48dac34e-cd87-46d7-a5cc-c370a3fab81b",
        name: "teapot.obj",
        creation_date: new Date(),
        size: 51493,
        path: "uploads/1686670532164-teapot.obj",
      },
    ];

    const result = await collection.insertMany(files);
    console.log(`${result.insertedCount} documents inserted.`);
  } catch (error) {
    console.error("Error during batch import:", error);
  } finally {
    await client.close();
  }
};

batchImport();
