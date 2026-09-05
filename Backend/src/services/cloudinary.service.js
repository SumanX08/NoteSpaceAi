import { v2 as cloudinary } from "cloudinary";

const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const uploadPreset =
  process.env.CLOUDINARY_UPLOAD_PRESET;

export async function uploadDocumentToCloudinary(
  buffer,
  filename,
  mimeType
) {
  if (!cloudName) {
    throw new Error(
      "Cloudinary is not configured."
    );
  }

  if (!buffer || buffer.length === 0) {
    throw new Error("File buffer is empty.");
  }

  const form = new FormData();

  form.append(
    "file",
    new Blob(
      [new Uint8Array(buffer)],
      { type: mimeType }
    ),
    filename
  );

  form.append(
    "upload_preset",
    uploadPreset
  );

  form.append(
    "folder",
    "notespace/documents"
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    {
      method: "POST",
      body: form,
    }
  );

  const result = await response.json();

  if (!response.ok) {
    console.error(
      "Cloudinary upload error:",
      result
    );

    throw new Error(
      result.error?.message ||
        `Cloudinary upload failed (${response.status})`
    );
  }

  return {
    secureUrl: result.secure_url,
    publicId: result.public_id,
    bytes: result.bytes,
    originalFilename: filename,
    resourceType:
      result.resource_type === "image"
        ? "image"
        : "raw",
  };
}

export async function uploadAudioToCloudinary(
  buffer,
  filename = "podcast.mp3"
) {
  if (!cloudName) {
    throw new Error(
      "Cloudinary is not configured."
    );
  }

  if (!buffer || buffer.length === 0) {
    throw new Error(
      "Audio buffer is empty."
    );
  }

  const form = new FormData();

  form.append(
    "file",
    new Blob(
      [new Uint8Array(buffer)],
      {
        type: "audio/mpeg",
      }
    ),
    filename
  );

  form.append(
    "upload_preset",
    uploadPreset
  );

  form.append(
    "folder",
    "notespace/podcasts"
  );

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/raw/upload`,
    {
      method: "POST",
      body: form,
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    console.error(
      "Cloudinary audio upload error:",
      result
    );

    throw new Error(
      result.error?.message ||
        `Cloudinary audio upload failed (${response.status})`
    );
  }

  return {
    secureUrl:
      result.secure_url,

    publicId:
      result.public_id,

    bytes:
      result.bytes,

    resourceType:
      result.resource_type || "raw",
  };
}
