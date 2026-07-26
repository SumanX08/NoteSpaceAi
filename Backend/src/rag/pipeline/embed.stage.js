import { generateEmbeddings } from "../embeddings/openai.embeddings.js";
export default async function embedStage(context) {
  if (!context.chunks.length) {
    context.embeddedChunks = [];
    return;
  }

  const texts = context.chunks.map((chunk) => chunk.text);

  const embeddings = await generateEmbeddings(texts);

  if (embeddings.length !== context.chunks.length) {
    throw new Error(
      "Embedding count does not match chunk count."
    );
  }

  context.embeddedChunks = context.chunks.map((chunk, index) => ({
    ...chunk,
    embedding: embeddings[index],
  }));
}