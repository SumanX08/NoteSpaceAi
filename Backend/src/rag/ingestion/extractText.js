import extractPdf from "./pdf.ingestion.js";
import extractDocx from "./docx.ingestion.js";
import extractTextFile from "./text.ingestion.js";

export default async function extractText(source) {
  switch (source.type) {
    case "pdf":
      return extractPdf(source);

    case "docx":
      return extractDocx(source);

    case "text":
      return extractTextFile(source);

    default:
      throw new Error(
        `Unsupported source type: ${source.type}`
      );
  }
}