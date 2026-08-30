import { v4 as uuid } from "uuid";

import Chunk from "../../models/chunk.model.js";
import vectorRepository from "../../vectorstore/vector.repository.js";

export default async function persistStage(context) {

  console.log(
    "PERSIST STAGE - embedded chunks:",
    context.embeddedChunks?.length
  );

  if (!context.embeddedChunks?.length) {
    throw new Error(
      "No embedded chunks available for persistence."
    );
  }

  const chunksToSave =
    context.embeddedChunks.map((chunk, index) => {

      const vectorId = uuid();

      return {
        notebook: context.source.notebookId,

        source: context.source._id,

        chunkIndex:
          chunk.chunkIndex ?? index,

        text: chunk.text,

        vectorId,

        metadata:
          chunk.metadata || {},

        embedding:
          chunk.embedding,
      };
    });


  console.log(
    "Saving chunks:",
    chunksToSave.length
  );


  // Save vectors FIRST
  await vectorRepository.upsertChunks(
    chunksToSave
  );


  // Remove embeddings before MongoDB
  const mongoChunks =
    chunksToSave.map(
      ({ embedding, ...chunk }) => chunk
    );


  await Chunk.insertMany(mongoChunks);


  context.savedChunks =
    mongoChunks;

  console.log(
    "PERSIST STAGE COMPLETE"
  );

  return context;
}