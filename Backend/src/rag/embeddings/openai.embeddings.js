import openai from "../../config/openai.js";

const MODEL =
  process.env.EMBEDDING_MODEL ||
  "text-embedding-3-small";

export default async function generateEmbedding(text) {
  const response =
    await openai.embeddings.create({
      model: MODEL,
      input: text,
    });

  return response.data[0].embedding;
}

export async function generateEmbeddings(texts) {
  const response =
    await openai.embeddings.create({
      model: MODEL,
      input: texts,
    });

  return response.data.map(
    (item) => item.embedding
  );
}