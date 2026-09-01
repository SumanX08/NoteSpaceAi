import { v2 as cloudinary } from "cloudinary";
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export function uploadDocumentToCloudinary(
  buffer,
  filename,
  mimeType
) {
  return new Promise((resolve, reject) => {
    if (!buffer || buffer.length === 0) {
      return reject(
        new Error("File buffer is empty.")
      );
    }

    const uploadStream =
      cloudinary.uploader.upload_stream(
        {
          resource_type: "raw",
          folder: "notespace/documents",
          public_id: filename
            .replace(/\.[^/.]+$/, "")
            .replace(/[^a-zA-Z0-9_-]/g, "_"),

          overwrite: true,
        },
        (error, result) => {
          if (error) {
            console.error(
              "Cloudinary upload error:",
              error
            );

            return reject(error);
          }

          resolve({
            secureUrl: result.secure_url,
            publicId: result.public_id,
            bytes: result.bytes,
            originalFilename: filename,
            resourceType: result.resource_type,
          });
        }
      );

    Readable.from(buffer).pipe(uploadStream);
  });
}
