import { generateEmbeddings } from "../embeddings/openai.embeddings.js";
import Source from "../../models/source.model.js";

export default async function embedStage(context) {
  console.log(
    "EMBED STAGE INPUT:",
    context.chunks?.length
  );

  await Source.findByIdAndUpdate(
    context.source._id,
    {
      status: "embedding",
      error: "",
    }
  );

  if (!context.chunks?.length) {
    throw new Error(
      "No chunks available for embedding."
    );
  }

  const texts =
    context.chunks.map(
      (chunk) => chunk.text
    );

  const embeddings =
    await generateEmbeddings(texts);

  console.log(
    "EMBEDDINGS GENERATED:",
    embeddings?.length
  );

  if (
    !embeddings ||
    embeddings.length !==
      context.chunks.length
  ) {
    throw new Error(
      "Embedding count does not match chunk count."
    );
  }

  context.embeddedChunks =
    context.chunks.map(
      (chunk, index) => ({
        ...chunk,
        embedding:
          embeddings[index],
      })
    );

  console.log(
    "EMBED STAGE OUTPUT:",
    context.embeddedChunks.length
  );

  return context;
}