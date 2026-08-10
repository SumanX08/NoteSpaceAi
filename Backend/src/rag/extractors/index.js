import extractPdf from "./pdf.extractor.js";
import extractWebsite from "./website.extractor.js";
import extractText from "./text.extractor.js";
import extractYoutube from "./youtube.extractor.js";
import extractDocx from "./docx.extractor.js";

export default async function extractSource(source) {
  switch (source.type) {
    case "pdf":
      return extractPdf(source);

     case "youtube":
      return extractYoutube(source);

    case "website":
      return extractWebsite(source);

    case "text":
      return extractText(source);

    case "docx":
      return extractDocx(source)  

    default:
      throw new Error(`Unsupported source type: ${source.type}`);
  }
}