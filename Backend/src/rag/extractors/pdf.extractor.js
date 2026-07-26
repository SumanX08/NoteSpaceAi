import fs from "fs/promises";
import pdf from "pdf-parse/lib/pdf-parse.js";

export default async function extractPdf(source) {
  const buffer = await fs.readFile(source.content.location);

  const result = await pdf(buffer);

  return {
    text: result.text,
    pages: result.numpages,
    metadata: result.info,
  };
}