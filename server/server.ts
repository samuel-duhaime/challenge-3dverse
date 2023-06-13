import express, { Express } from "express";
import cors from "cors";
import { corsOptions } from "./configs/corsOptions";
import { connectToDatabase } from "./configs/mongoDB";
import {
  getListFiles,
  getFile,
  patchRenameFile,
  deleteFile,
  getDownloadFile,
  postUploadFile,
  getTransformFile,
} from "./controllers/filesCtl";
import { multerUploadFile } from "./middlewares/multerUploadFile";

const PORT: number = 3333;
const app: Express = express();

connectToDatabase().catch(console.error); // Connect to database

// App middlewares
app.use(cors(corsOptions)); // Enable CORS with options
app.use(express.json()); // Body parsing middleware

// Routes
app.get("/files", getListFiles);
app.get("/file/:fileId", getFile);
app.patch("/file/:fileId", patchRenameFile);
app.delete("/file/:fileId", deleteFile);
app.get("/file/:fileId/download", getDownloadFile);
app.post("/file/upload", multerUploadFile, postUploadFile);
app.get("/file/:fileId/transform", getTransformFile);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
