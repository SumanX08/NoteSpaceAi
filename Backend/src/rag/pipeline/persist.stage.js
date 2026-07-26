import { v4 as uuid } from "uuid";
import Chunk from "../../models/chunk.model.js";
import vectorRepository from "../../vectorstore/vector.repository.js";

export default async function persistStage(context) {
  const chunksToSave = context.embeddedChunks.map((chunk, index) => {
    const vectorId = uuid();

    return {
      notebook: context.source.notebook,
      source: context.source._id,
      chunkIndex: index,
      text: chunk.text,
      vectorId,
      metadata: chunk.metadata || {},
      embedding: chunk.embedding,
    };
  });

  const mongoChunks = chunksToSave.map(({ embedding, ...chunk }) => chunk);

  await Chunk.insertMany(mongoChunks);

  await vectorRepository.upsertChunks(chunksToSave);

  context.savedChunks = mongoChunks;
}