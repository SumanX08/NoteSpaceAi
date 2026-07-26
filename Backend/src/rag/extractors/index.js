import extractPdf from "./pdf.extractor.js";
import  extractWebsite  from "./website.extractor.js";
import  extractYoutube  from "./youtube.extractor.js";
import  extractText  from "./text.extractor.js";
import  extractTranscript  from "./transcript.extractor.js";

export default async function extractContent(source) {
  switch (source.type) {
    case "pdf":
      return extractPdf(source);

    case "website":
      return extractWebsite(source);

    case "youtube":
      return extractYoutube(source);

    case "text":
      return extractText(source);

    case "transcript":
      return extractTranscript(source);

    default:
      throw new Error(`Unsupported source type: ${source.type}`);
  }
}