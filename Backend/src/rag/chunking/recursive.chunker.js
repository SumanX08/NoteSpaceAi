import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export default async function chunkText(text) {
  if (!text || typeof text !== "string") {
    console.log(
      "Invalid text received for chunking:",
      text
    );

    return [];
  }

  const cleanText = text
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (!cleanText) {
    console.log(
      "Text is empty after cleaning"
    );

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

  let searchFrom = 0;

  const chunks =
    documents.map(
      (document, index) => {

        const chunkText =
          document.pageContent;

        let startIndex =
          cleanText.indexOf(
            chunkText,
            Math.max(
              0,
              searchFrom - 200
            )
          );

        if (startIndex === -1) {
          startIndex =
            cleanText.indexOf(chunkText);
        }

        const endIndex =
          startIndex !== -1
            ? startIndex +
              chunkText.length
            : null;

        if (startIndex !== -1) {
          searchFrom =
            startIndex + chunkText.length;
        }

        return {
          chunkIndex: index,

          text: chunkText,

          metadata: {
            ...document.metadata,

            startIndex:
              startIndex !== -1
                ? startIndex
                : null,

            endIndex,
          },
        };
      }
    );

  console.log(
    "Chunks created:",
    chunks.length
  );

  return chunks;
}