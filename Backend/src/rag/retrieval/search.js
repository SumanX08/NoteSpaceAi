import Chunk from "../../models/chunk.model.js";
import vectorRepository from "../../vectorstore/vector.repository.js";
import generateEmbedding from "../embeddings/openai.embeddings.js";

export default async function search(
  question,
  notebookId,
  limit = 5
) {
  const queryVector =
    await generateEmbedding(question);

  const results =
    await vectorRepository.search(
      queryVector,
      {
        notebookId,
        limit,
      }
    );

  if (!results.length) {
    return [];
  }

  const vectorIds =
    results.map(
      (result) => result.vectorId
    );

  const chunks =
    await Chunk.find({
      vectorId: {
        $in: vectorIds,
      },

      notebook: notebookId,
    }).lean();

  const chunkMap =
    new Map(
      chunks.map((chunk) => [
        chunk.vectorId,
        chunk,
      ])
    );

const finalChunks = results
  .map((result) => {
    const chunk = chunkMap.get(
      result.vectorId
    );

    if (!chunk) return null;

    return {
      text: chunk.text,

      page:
        chunk.metadata?.page ?? null,

      sourceId:
        chunk.source,

      score:
        result.score,

      chunkIndex:
        chunk.chunkIndex,
    };
  })
  .filter(Boolean);

console.log(
  "FINAL RETRIEVED CHUNKS:",
  finalChunks
);

return finalChunks;
}