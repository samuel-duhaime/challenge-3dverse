import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { createInterface } from "readline";
import { ObjFile } from "../types/exportTypes";
import { filesDbCollection } from "../configs/mongoDB";

// TODO: For a production website, it is recommended to use user authentication
// TODO: You can implement user authentication using libraries like Passport.js or Firebase Authentication for a quick and secure solution

// Get List files
export const getListFiles = async (req: Request, res: Response) => {
  try {
    const files: ObjFile[] = await filesDbCollection.find().toArray();

    if (files.length > 0) {
      return res.status(200).json(files);
    } else {
      return res.status(404).json({ message: "Files not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get file
export const getFile = async (req: Request, res: Response) => {
  const { fileId } = req.params;

  try {
    const file: ObjFile | null = await filesDbCollection.findOne({
      id: fileId,
    });

    if (file) {
      return res.status(200).json(file);
    } else {
      return res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Patch rename file
export const patchRenameFile = async (req: Request, res: Response) => {
  const { fileId } = req.params;
  const { newName } = req.body;

  if (!newName) {
    return res.status(404).json({ message: "File without a new name" });
  }

  try {
    const updatedFile = await filesDbCollection.findOneAndUpdate(
      { id: fileId },
      { $set: { name: newName } },
      { returnDocument: "after" } // Return the updated document and not the old document
    );

    if (updatedFile.value) {
      return res.status(200).json(updatedFile.value);
    } else {
      return res.status(404).json({ message: "File not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete file
export const deleteFile = async (req: Request, res: Response) => {
  const { fileId } = req.params;

  try {
    const file: ObjFile | null = await filesDbCollection.findOne({
      id: fileId,
    });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = file.path;

    // Delete the file from the 'uploads' folder
    fs.unlink(filePath, async (error) => {
      if (error) {
        return res.status(500).json({ message: "Failed to delete file" });
      }

      // Delete the file from the database collection
      const result = await filesDbCollection.deleteOne({ id: fileId });

      if (result.deletedCount === 1) {
        return res.sendStatus(204); // Successful deletion
      } else {
        return res.status(500).json({ message: "Failed to delete file data" });
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get download file
export const getDownloadFile = async (req: Request, res: Response) => {
  const { fileId } = req.params;

  try {
    // Find the file by its fileId in the MongoDB collection
    const file = await filesDbCollection.findOne({ id: fileId });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = file.path;
    const fileName = file.name;
    res.status(200).download(filePath, fileName); // Download the file
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

// TODO: For a production website, it is recommended to use a cloud storage solution such as AWS S3 buckets
// TODO: Instead of directly storing the file in the file system
// TODO: To do that, you can utilize multer and multer-s3 to stream the file directly to AWS S3

// Post upload file
export const postUploadFile = async (req: Request, res: Response) => {
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const fileData: ObjFile = {
    id: uuidv4(), // Generate an unique id
    name: file.originalname,
    creation_date: new Date(),
    size: file.size,
    path: file.path,
  };

  try {
    await filesDbCollection.insertOne(fileData);

    return res.status(200).json({ ...fileData });
  } catch (error) {
    return res.status(500).json({ message: "Failed to insert file" });
  }
};

// Get transform file
export const getTransformFile = async (req: Request, res: Response) => {
  const { fileId } = req.params;
  const { scaleX, scaleY, scaleZ, offsetX, offsetY, offsetZ } = req.query;

  // Verify if all parameters are numbers
  if (
    typeof Number(scaleX) !== "number" ||
    typeof Number(scaleY) !== "number" ||
    typeof Number(scaleZ) !== "number" ||
    typeof Number(offsetX) !== "number" ||
    typeof Number(offsetY) !== "number" ||
    typeof Number(offsetZ) !== "number"
  ) {
    return res.status(400).json({
      message: "All parameters must be numbers",
    });
  }

  try {
    // Find the file by its fileId in the MongoDB collection
    const file = await filesDbCollection.findOne({ id: fileId });

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    const filePath = file.path;
    const fileName = file.name;

    // Read the file line by line
    const lineReader = createInterface({
      input: fs.createReadStream(filePath),
    });

    const transformedLines: string[] = [];

    // Process each line and apply the transformation
    lineReader.on("line", (line: string) => {
      if (line.startsWith("v ")) {
        const [_, x, y, z] = line.split(/\s+/); // Split the line based on one or more consecutive spaces to extract the vertex values

        // Apply the transformation to the vertex values
        const transformedX = Number(x) * Number(scaleX) + Number(offsetX);
        const transformedY = Number(y) * Number(scaleY) + Number(offsetY);
        const transformedZ = Number(z) * Number(scaleZ) + Number(offsetZ);

        // Construct the transformed line
        const transformedLine = `v ${transformedX} ${transformedY} ${transformedZ}`;

        transformedLines.push(transformedLine); // Add the transformed line to the array
      } else {
        transformedLines.push(line); // Add the original line to the array
      }
    });

    // TODO: For a production website, it is recommended to store the transformedFileContent inside the cloud
    // TODO: And save the unique transformedFileName inside the mongoDB document of the file

    // After you finish to transform each lines
    lineReader.on("close", () => {
      const transformedFileContent = transformedLines.join("\n"); // Create the transformed file by joining the transformed lines
      const transformedFileName = `transformed-${fileName}`;

      // Save the transformed file to the file system
      const transformedFilePath = path.join("uploads", transformedFileName);

      // Replace with the actual transformed file path
      fs.writeFileSync(transformedFilePath, transformedFileContent);

      // Send the transformed file as a download
      res.download(transformedFilePath, transformedFileName);
    });
  } catch {
    return res.status(500).json({ message: "Failed to transform file" });
  }
};
