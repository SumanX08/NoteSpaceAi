import axios from "axios";
import mammoth from "mammoth";

export default async function extractDocx(source) {
  const url = source.cloudinary?.url;

  if (!url) {
    throw new Error("Cloudinary DOCX URL is missing.");
  }

  console.log("Downloading DOCX from Cloudinary...");
  console.log("URL:", url);

  const response = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 30000,
  });

  const buffer = Buffer.from(response.data);

  console.log(
    "Downloaded DOCX:",
    buffer.length,
    "bytes"
  );

  if (!buffer.length) {
    throw new Error("Downloaded DOCX is empty.");
  }

  const result = await mammoth.extractRawText({
    buffer,
  });

  if (!result.value?.trim()) {
    throw new Error(
      "Failed to extract DOCX content."
    );
  }

  return {
    text: result.value,
    metadata: {
      filename: source.originalName,
    },
  };
}