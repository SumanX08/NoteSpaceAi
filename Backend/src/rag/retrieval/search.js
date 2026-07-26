import Chunk from "../../models/chunk.model.js";
import vectorRepository from "../../vectorstore/vector.repository.js";
import generateEmbeddings from "../embeddings/openai.embeddings.js"
import generateEmbedding from "../embeddings/openai.embeddings.js";
export default async function search(question, notebookId, limit = 5) {
  // Generate embedding for the user's question
  const queryVector = await generateEmbedding(question);

  // Search Qdrant
  const results = await vectorRepository.search(queryVector, {
    notebookId,
    limit,
  });

  if (!results.length) {
    return [];
  }

  // Get vector IDs
  const vectorIds = results.map((result) => result.vectorId);

  // Fetch chunks from MongoDB
  const chunks = await Chunk.find({
    vectorId: { $in: vectorIds },
  }).lean();

  // Preserve relevance order
  const chunkMap = new Map(
    chunks.map((chunk) => [chunk.vectorId, chunk])
  );

  return results
    .map((result) => {
      const chunk = chunkMap.get(result.vectorId);

      if (!chunk) return null;

      return {
        text: chunk.text,
        page: chunk.metadata?.page ?? null,
        sourceId: chunk.source,
        score: result.score,
        chunkIndex: chunk.chunkIndex,
      };
    })
    .filter(Boolean);
}