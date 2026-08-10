import Source from "../../models/source.model.js";

import createPipelineContext from "./pipeline.context.js";

import extractStage from "./extract.stage.js";
import chunkStage from "./chunk.stage.js";
import embedStage from "./embed.stage.js";
import persistStage from "./persist.stage.js";
import finalizeStage from "./final.stage.js";

export async function processSource(sourceId) {
  const source = await Source.findById(sourceId);
  console.log(JSON.stringify(source, null, 2));

  if (!source) {
    throw new Error("Source not found");
  }

  await Source.findByIdAndUpdate(sourceId, {
    status: "processing",
  });

  source.status = "processing";

  const context = new createPipelineContext(source);
  const startTime = Date.now();

  try {
    await extractStage(context);
    await chunkStage(context);
    await embedStage(context);
    await persistStage(context);

    

    context.stats.processingTime = Date.now() - startTime;

      source.status = "ready";
  source.error = "";
  await source.save();

    await finalizeStage(context);

    return context;
  } catch (error) {
    console.error(
      `Processing failed for source ${sourceId}:`,
      error
    );

    context.error = error;

    await Source.findByIdAndUpdate(sourceId, {
      status: "failed",
      error: error.message,
    });

    source.status = "failed";
  source.error = error.message;
  await source.save();

    throw error;
  }
}