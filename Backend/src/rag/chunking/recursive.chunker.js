import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export default async function chunkText(text) {
  // Safety check
  if (!text || typeof text !== "string") {
    console.log("Invalid text received for chunking:", text);

    return [];
  }

  // Clean extracted text
  const cleanText = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleanText) {
    console.log("Text is empty after cleaning");

    return [];
  }

  console.log(
    "Chunking text length:",
    cleanText.length
  );

  const splitter =
    new RecursiveCharacterTextSplitter({
      chunkSize: 1200,
      chunkOverlap: 200,

      separators: [
        "\n\n",
        "\n",
        ". ",
        " ",
      ],
    });

  const documents =
    await splitter.createDocuments([
      cleanText,
    ]);

  const chunks =
    documents.map((document, index) => ({
      chunkIndex: index,

      text: document.pageContent,

      metadata: {
        ...document.metadata,
      },
    }));

  console.log(
    "Chunks created:",
    chunks.length
  );

  return chunks;
}