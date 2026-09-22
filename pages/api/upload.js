import { put } from "@vercel/blob";
import formidable from "formidable";
import fs from "fs/promises";
import { authOptions } from "./auth/[...nextauth]";
import { getSessionSafe } from "../../lib/apiError.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const session = await getSessionSafe(req, res, authOptions);

  if (!session) {
    return res.status(401).json({
      code: "NOT_AUTHORIZED",
      error: "Not authorized",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({
      code: "METHOD_NOT_ALLOWED",
      error: "Method not allowed",
    });
  }

  try {
    const maxImages = 5;

    const maxFileSize = 5 * 1024 * 1024;

    const allowedMimeTypes = ["image/jpeg", "image/png"];

    const form = formidable({
      multiples: true,
      maxFiles: maxImages,
      maxFileSize: maxFileSize,
    });

    const [fields, files] = await form.parse(req);

    const uploadedFiles = files.file
      ? Array.isArray(files.file)
        ? files.file
        : [files.file]
      : [];

    if (uploadedFiles.length === 0) {
      return res.status(400).json({
        code: "UPLOAD_NO_FILES",
        error: "No files provided",
      });
    }

    if (uploadedFiles.length > maxImages) {
      return res.status(400).json({
        code: "UPLOAD_MAX_IMAGES",
        params: { max: maxImages },
        error: `You can upload a maximum of ${maxImages} images`,
      });
    }

    const uploadedImages = [];

    for (const imageFile of uploadedFiles) {
      if (imageFile.size > maxFileSize) {
        return res.status(400).json({
          code: "UPLOAD_FILE_TOO_LARGE",
          params: { filename: imageFile.originalFilename },
          error: `${imageFile.originalFilename} must not exceed 5 MB`,
        });
      }

      if (!allowedMimeTypes.includes(imageFile.mimetype)) {
        return res.status(400).json({
          code: "UPLOAD_INVALID_TYPE",
          params: { filename: imageFile.originalFilename },
          error: `${imageFile.originalFilename} is not a supported image type. Only JPEG and PNG images are allowed.`,
        });
      }

      const fileBuffer = await fs.readFile(imageFile.filepath);

      const blob = await put(
        imageFile.originalFilename || "image",
        fileBuffer,
        {
          access: "public",
          addRandomSuffix: true,
        },
      );

      uploadedImages.push({
        url: blob.url,
        filename: imageFile.originalFilename,
      });
    }

    return res.status(200).json({
      images: uploadedImages,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return res.status(500).json({
      code: "UPLOAD_FAILED",
      error: "Upload failed",
    });
  }
}
