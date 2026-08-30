
import Source from "../../models/source.model.js";

import PipelineContext from "./pipeline.context.js";

import extractStage from "./extract.stage.js";
import chunkStage from "./chunk.stage.js";
import embedStage from "./embed.stage.js";
import persistStage from "./persist.stage.js";
import finalizeStage from "./final.stage.js";

export async function processSource(sourceId) {
  const source = await Source.findById(sourceId);

  if (!source) {
    throw new Error("Source not found");
  }

  await Source.findByIdAndUpdate(sourceId, {
    status: "processing",
    error: "",
  });

  let context = new PipelineContext(source);

  const startTime = Date.now();

  try {
    context = await extractStage(context);

    console.log(
      "AFTER EXTRACT:",
      context.extracted?.text?.length
    );

    context = await chunkStage(context);

    console.log(
      "AFTER CHUNK:",
      context.chunks?.length
    );

    context = await embedStage(context);

    console.log(
      "AFTER EMBED:",
      context.embeddedChunks?.length
    );

    context = await persistStage(context);

    console.log(
      "AFTER PERSIST:",
      context.savedChunks?.length
    );

    context.stats.processingTime =
      Date.now() - startTime;

    await finalizeStage(context);

    console.log("SOURCE PROCESSING COMPLETE");

    return context;

  } catch (error) {
    console.error(
      `Processing failed for source ${sourceId}:`,
      error
    );

    await Source.findByIdAndUpdate(sourceId, {
      status: "failed",
      error: error.message,
    });

    throw error;
  }
}