import { inngest } from "../client.js";

import Source from "../../models/source.model.js";
import PipelineContext from "../../rag/pipeline/pipeline.context.js";

import extractStage from "../../rag/pipeline/extract.stage.js";
import chunkStage from "../../rag/pipeline/chunk.stage.js";
import embedStage from "../../rag/pipeline/embed.stage.js";
import persistStage from "../../rag/pipeline/persist.stage.js";

export const processSource = inngest.createFunction(
  {
    id: "process-source",
    retries: 2,

    triggers: {
      event: "source/created",
    },
  },

  async ({ event, step }) => {
    console.log("========== INNGEST EVENT ==========");
    console.log(JSON.stringify(event, null, 2));

    const sourceId = event.data?.sourceId;

    console.log("Received sourceId:", sourceId);

    if (!sourceId) {
      throw new Error(
        `sourceId missing from event. Event data: ${JSON.stringify(
          event.data
        )}`
      );
    }

    await step.run("process-rag-source", async () => {
      const source = await Source.findById(sourceId);

      if (!source) {
        throw new Error(`Source not found: ${sourceId}`);
      }

      await Source.findByIdAndUpdate(sourceId, {
        status: "processing",
        error: "",
      });

      try {
        const context = new PipelineContext(source);

        await extractStage(context);

        await chunkStage(context);

        await embedStage(context);

        await persistStage(context);

        await Source.findByIdAndUpdate(sourceId, {
          status: "ready",
          error: "",
        });

      } catch (error) {
        console.error("Source processing failed:", error);

        await Source.findByIdAndUpdate(sourceId, {
          status: "failed",
          error: error.message,
        });

        throw error;
      }
    });

    return {
      success: true,
      sourceId,
    };
  }
);