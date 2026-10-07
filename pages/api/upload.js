import { put } from "@vercel/blob";
import formidable from "formidable";
import fs from "fs/promises";
import sharp from "sharp";
import { authOptions } from "./auth/[...nextauth]";
import { getSessionSafe } from "../../lib/apiError.js";
import { logError } from "../../lib/logger.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Re-encodes the image, which drops all metadata (EXIF incl. GPS location,
// camera details, XMP, comments). The orientation is applied to the pixels
// first so photos keep their correct rotation without the EXIF tag.
async function removeImageMetadata(buffer, mimetype) {
  const image = sharp(buffer).rotate();

  if (mimetype === "image/png") {
    return image.png().toBuffer();
  }

  return image.jpeg({ quality: 90, mozjpeg: true }).toBuffer();
}

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

      let cleanedImage;

      try {
        cleanedImage = await removeImageMetadata(fileBuffer, imageFile.mimetype);
      } catch {
        return res.status(400).json({
          code: "UPLOAD_INVALID_IMAGE",
          params: { filename: imageFile.originalFilename },
          error: `${imageFile.originalFilename} could not be processed as an image.`,
        });
      }

      // The original filename can contain personal information and would be
      // part of the public URL.
      const blob = await put(
        `entry-image.${imageFile.mimetype === "image/png" ? "png" : "jpg"}`,
        cleanedImage,
        {
          access: "public",
          addRandomSuffix: true,
          contentType: imageFile.mimetype,
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
    logError("Upload error", error);

    return res.status(500).json({
      code: "UPLOAD_FAILED",
      error: "Upload failed",
    });
  }
}
