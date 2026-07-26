import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1200,
  chunkOverlap: 200,
  separators: [
    "\n\n",
    "\n",
    ". ",
    " ",
    "",
  ],
});

export default async function chunkText(text) {
  const chunks =
    await splitter.createDocuments([text]);

  return chunks.map((chunk, index) => ({
    chunkIndex: index,
    text: chunk.pageContent,
    metadata: chunk.metadata,
  }));
}