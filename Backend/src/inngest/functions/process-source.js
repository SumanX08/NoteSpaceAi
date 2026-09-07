import { inngest } from "../client.js";

import Source from "../../models/source.model.js";
import PipelineContext from "../../rag/pipeline/pipeline.context.js";

import extractStage from "../../rag/pipeline/extract.stage.js";
import generateTitleStage from "../../rag/pipeline/generateTitle.stage.js";
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

    // =================================
    // EXTRACT
    // =================================

    const context = await step.run(
      "extract-source",
      async () => {
        const source = await Source.findById(sourceId);

        if (!source) {
          throw new Error(
            `Source not found: ${sourceId}`
          );
        }

        await Source.findByIdAndUpdate(sourceId, {
          status: "extracting",
          error: "",
        });

        const pipelineContext =
          new PipelineContext(source);

        await extractStage(pipelineContext);

        console.log(
          "AFTER EXTRACT:",
          pipelineContext.extracted?.text?.length
        );

        return pipelineContext;
      }
    );

    // =================================
    // GENERATE WORKSPACE TITLE
    // =================================

    await step.run(
      "generate-workspace-title",
      async () => {
        await generateTitleStage(context);

        return {
          success: true,
        };
      }
    );

    // =================================
    // CHUNK
    // =================================

    await step.run(
      "chunk-source",
      async () => {
        await Source.findByIdAndUpdate(sourceId, {
          status: "chunking",
        });

        await chunkStage(context);

        console.log(
          "AFTER CHUNK:",
          context.chunks?.length
        );

        return {
          success: true,
          chunks: context.chunks?.length || 0,
        };
      }
    );

    // =================================
    // EMBEDDING
    // =================================

    await step.run(
      "embed-source",
      async () => {
        await Source.findByIdAndUpdate(sourceId, {
          status: "embedding",
        });

        await embedStage(context);

        console.log(
          "AFTER EMBED:",
          context.embeddedChunks?.length
        );

        return {
          success: true,
        };
      }
    );

    // =================================
    // PERSIST
    // =================================

    await step.run(
      "persist-source",
      async () => {
        await Source.findByIdAndUpdate(sourceId, {
          status: "storing",
        });

        await persistStage(context);

        console.log(
          "AFTER PERSIST:",
          context.savedChunks?.length
        );

        return {
          success: true,
        };
      }
    );

    // =================================
    // FINALIZE
    // =================================

    await step.run(
      "finalize-source",
      async () => {
        await Source.findByIdAndUpdate(sourceId, {
          status: "ready",
          error: "",
        });

        return {
          success: true,
        };
      }
    );

    console.log(
      "========== SOURCE PROCESSING COMPLETE =========="
    );

    return {
      success: true,
      sourceId,
    };
  }
);