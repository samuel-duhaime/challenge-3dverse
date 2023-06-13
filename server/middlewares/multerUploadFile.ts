import { RequestHandler } from "express";
import multer, { Multer, StorageEngine, FileFilterCallback } from "multer";
import { Request } from "express-serve-static-core";
import path from "path";

// Create storage for multer
const storage: StorageEngine = multer.diskStorage({
  // Specify the destination directory
  destination: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, destination: string) => void
  ) => {
    cb(null, "./uploads");
  },

  // Generate a unique filename for the uploaded file
  filename: (
    req: Request,
    file: Express.Multer.File,
    cb: (error: Error | null, filename: string) => void
  ) => {
    const uniqueSuffix = Date.now();
    const filename = `${uniqueSuffix}-${file.originalname}`;
    cb(null, filename);
  },
});

// Filter the file to only accept .obj extension
const fileFilter = (req: Request, file: Express.Multer.File, cb: any) => {
  const fileExtension = path.extname(file.originalname); // Get the extension of the file
  if (fileExtension !== ".obj") {
    return cb(new Error("Only .obj files are allowed"), false); 
  }
  cb(null, true);
};

// Create upload storage
export const upload: Multer = multer({
  fileFilter,
  storage,
});

// Define the multer middleware to upload single file
export const multerUploadFile: RequestHandler = (req, res, next) => {
  upload.single("file")(req, res, (error: any) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({ message: error.message });
    } else if (error) {
      return res.status(500).json({ message: "Failed to upload file" });
    }
    next();
  });
};
