import axios from "axios";
import pdf from "pdf-parse/lib/pdf-parse.js";

export default async function extractPdf(source) {
  const url = source.cloudinary?.url;

  if (!url) {
    throw new Error("Cloudinary PDF URL is missing.");
  }

  console.log("Downloading PDF from Cloudinary...");
  console.log("URL:", url);

  const response = await axios.get(url, {
    responseType: "arraybuffer",
    timeout: 30000,
  });

  const buffer = Buffer.from(response.data);

  console.log("Downloaded PDF:", buffer.length, "bytes");

  if (!buffer.length) {
    throw new Error("Downloaded PDF is empty.");
  }

  const result = await pdf(buffer);

  return {
    text: result.text,
    pages: result.numpages,
    metadata: result.info || {},
  };
}