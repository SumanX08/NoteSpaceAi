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
    console.log(
      "========== INNGEST EVENT =========="
    );

    const sourceId =
      event.data?.sourceId;

    console.log(
      "Received sourceId:",
      sourceId
    );

    if (!sourceId) {
      throw new Error(
        "sourceId missing from event"
      );
    }

    // =================================
    // EXTRACT
    // =================================

    const extracted = await step.run(
      "extract-source",
      async () => {
        const source =
          await Source.findById(sourceId);

        if (!source) {
          throw new Error(
            `Source not found: ${sourceId}`
          );
        }

        await Source.findByIdAndUpdate(
          sourceId,
          {
            status: "extracting",
            error: "",
          }
        );

        const context =
          new PipelineContext(source);

        await extractStage(context);

        console.log(
          "AFTER EXTRACT:",
          context.extracted?.text?.length
        );

        return context.extracted;
      }
    );

    // =================================
    // GENERATE TITLE
    // =================================

    await step.run(
      "generate-workspace-title",
      async () => {
        const source =
          await Source.findById(sourceId);

        if (!source) {
          throw new Error(
            `Source not found: ${sourceId}`
          );
        }

        const context =
          new PipelineContext(source);

        context.extracted =
          extracted;

        await generateTitleStage(
          context
        );

        return {
          success: true,
        };
      }
    );

    // =================================
    // CHUNK
    // =================================

    const chunks = await step.run(
      "chunk-source",
      async () => {
        const source =
          await Source.findById(sourceId);

        if (!source) {
          throw new Error(
            `Source not found: ${sourceId}`
          );
        }

        await Source.findByIdAndUpdate(
          sourceId,
          {
            status: "chunking",
          }
        );

        const context =
          new PipelineContext(source);

        context.extracted =
          extracted;

        await chunkStage(context);

        console.log(
          "AFTER CHUNK:",
          context.chunks?.length
        );

        return context.chunks;
      }
    );

    // =================================
    // EMBEDDING
    // =================================

    const embeddedChunks =
      await step.run(
        "embed-source",
        async () => {
          const source =
            await Source.findById(
              sourceId
            );

          if (!source) {
            throw new Error(
              `Source not found: ${sourceId}`
            );
          }

          await Source.findByIdAndUpdate(
            sourceId,
            {
              status: "embedding",
            }
          );

          const context =
            new PipelineContext(source);

          context.chunks =
            chunks;

          await embedStage(context);

          console.log(
            "AFTER EMBED:",
            context.embeddedChunks?.length
          );

          return context.embeddedChunks;
        }
      );

    // =================================
    // PERSIST
    // =================================

    await step.run(
      "persist-source",
      async () => {
        const source =
          await Source.findById(
            sourceId
          );

        if (!source) {
          throw new Error(
            `Source not found: ${sourceId}`
          );
        }

        await Source.findByIdAndUpdate(
          sourceId,
          {
            status: "storing",
          }
        );

        const context =
          new PipelineContext(source);

        context.embeddedChunks =
          embeddedChunks;

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
    // READY
    // =================================

    await step.run(
      "finalize-source",
      async () => {
        await Source.findByIdAndUpdate(
          sourceId,
          {
            status: "ready",
            error: "",
          }
        );

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