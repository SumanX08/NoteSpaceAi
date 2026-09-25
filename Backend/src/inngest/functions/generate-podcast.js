import { inngest } from "../client.js";
import Podcast from "../../models/podcast.model.js";
import Notebook from "../../models/notebook.model.js";

import {
  getNotebookChunks,
  generatePodcastScript,
  generatePodcastAudio,
} from "../../services/podcast.service.js";

import { uploadAudioToCloudinary } from "../../services/cloudinary.service.js";

export const generatePodcast = inngest.createFunction(
  {
    id: "generate-podcast",
    name: "Generate Podcast",
    triggers: [{ event: "podcast/generate" }],
    retries: 2,
  },

  async ({ event, step }) => {
    const {
      podcastId,
      notebookId,
      userId,
      style,
      voice,
      duration,
    } = event.data;

    console.log("========================================");
    console.log("🎙️ PODCAST JOB STARTED");
    console.log("🎙️ podcastId:", podcastId);
    console.log("🎙️ notebookId:", notebookId);
    console.log("🎙️ style:", style);
    console.log("🎙️ voice:", voice);
    console.log("🎙️ duration:", duration);
    console.log("========================================");

    try {
      /*
      =========================================================
      STEP 1 — GET NOTEBOOK
      =========================================================
      */

      console.log("📚 Getting notebook...");

      const notebook = await step.run(
        "get-notebook",
        async () => {
          console.log("📚 Running get-notebook step");

          const result = await Notebook.findOne({
            _id: notebookId,
            userId,
          }).lean();

          console.log(
            "📚 Notebook found:",
            Boolean(result)
          );

          return result;
        }
      );

      if (!notebook) {
        throw new Error(
          "Notebook not found or access denied."
        );
      }

      console.log(
        "✅ Notebook loaded:",
        notebook.title
      );

      /*
      =========================================================
      STEP 2 — GET NOTEBOOK CHUNKS
      =========================================================
      */

      console.log("📦 Getting notebook chunks...");

      const chunks = await step.run(
        "get-notebook-chunks",
        async () => {
          console.log(
            "📦 Running get-notebook-chunks step"
          );

          const result =
            await getNotebookChunks(notebookId);

          console.log(
            "📦 Chunks found:",
            result?.length || 0
          );

          return result;
        }
      );

      if (!chunks?.length) {
        throw new Error(
          "No processed source content is available for this notebook."
        );
      }

      console.log(
        `✅ ${chunks.length} chunks loaded`
      );

      /*
      =========================================================
      STEP 3 — GENERATE PODCAST SCRIPT
      =========================================================
      */

      console.log(
        "📝 STARTING PODCAST SCRIPT GENERATION..."
      );

      const script = await step.run(
        "generate-podcast-script",
        async () => {
          console.log(
            "📝 Calling generatePodcastScript..."
          );

          const result =
            await generatePodcastScript({
              notebook,
              chunks,
              style,
              voice,
              duration,
            });

          console.log(
            "📝 Script generation completed."
          );

          console.log(
            "📝 Script length:",
            result?.length || 0
          );

          return result;
        }
      );

      if (!script) {
        throw new Error(
          "Podcast script generation returned an empty result."
        );
      }

      console.log(
        "✅ PODCAST SCRIPT GENERATED"
      );

      console.log(
        "📝 Script characters:",
        script.length
      );

      /*
      =========================================================
      STEP 4 — SAVE SCRIPT
      =========================================================
      */

      console.log(
        "💾 Saving podcast script..."
      );

      await step.run(
        "save-podcast-script",
        async () => {
          await Podcast.findByIdAndUpdate(
            podcastId,
            {
              script,
              status: "generating",
              error: "",
            }
          );

          console.log(
            "✅ Podcast script saved."
          );
        }
      );

      /*
      =========================================================
      STEP 5 — GENERATE AUDIO
      =========================================================
      */

      console.log(
        "========================================"
      );

      console.log(
        "🎧 STARTING AUDIO GENERATION"
      );

      console.log(
        "🎧 style:",
        style
      );

      console.log(
        "🎧 voice:",
        voice
      );

      console.log(
        "🎧 script length:",
        script.length
      );

      console.log(
        "========================================"
      );

      const upload = await step.run(
        "generate-and-upload-audio",
        async () => {
          /*
          -----------------------------------------------------
          AUDIO GENERATION
          -----------------------------------------------------
          */

          console.log(
            "🎙️ CALLING generatePodcastAudio..."
          );

          const audioBuffer =
            await generatePodcastAudio({
              script,
              voice,
              style,
            });

          console.log(
            "🎙️ generatePodcastAudio COMPLETED"
          );

          console.log(
            "🎙️ Audio buffer exists:",
            Boolean(audioBuffer)
          );

          console.log(
            "🎙️ Audio buffer size:",
            audioBuffer?.length || 0,
            "bytes"
          );

          if (
            !audioBuffer ||
            audioBuffer.length === 0
          ) {
            throw new Error(
              "Podcast audio generation returned an empty file."
            );
          }

          /*
          -----------------------------------------------------
          CLOUDINARY UPLOAD
          -----------------------------------------------------
          */

          console.log(
            "☁️ STARTING CLOUDINARY AUDIO UPLOAD..."
          );

          console.log(
            "☁️ Filename:",
            `podcast-${podcastId}.mp3`
          );

          const result =
            await uploadAudioToCloudinary(
              audioBuffer,
              `podcast-${podcastId}.mp3`
            );

          console.log(
            "☁️ CLOUDINARY UPLOAD COMPLETED"
          );

          console.log(
            "☁️ secureUrl:",
            Boolean(result?.secureUrl)
          );

          console.log(
            "☁️ publicId:",
            result?.publicId
          );

          console.log(
            "☁️ bytes:",
            result?.bytes
          );

          return {
            secureUrl:
              result.secureUrl,

            publicId:
              result.publicId,

            bytes:
              result.bytes,

            resourceType:
              result.resourceType,
          };
        }
      );

      /*
      =========================================================
      STEP 6 — MARK PODCAST READY
      =========================================================
      */

      console.log(
        "========================================"
      );

      console.log(
        "💾 MARKING PODCAST READY"
      );

      console.log(
        "========================================"
      );

      const podcast = await step.run(
        "mark-podcast-ready",
        async () => {
          console.log(
            "💾 Updating podcast document..."
          );

          const result =
            await Podcast.findByIdAndUpdate(
              podcastId,
              {
                audioUrl:
                  upload.secureUrl,

                audioPublicId:
                  upload.publicId,

                status:
                  "ready",

                error: "",
              },
              {
                new: true,
              }
            ).lean();

          console.log(
            "💾 Podcast database status:",
            result?.status
          );

          return result;
        }
      );

      /*
      =========================================================
      COMPLETE
      =========================================================
      */

      console.log(
        "========================================"
      );

      console.log(
        "🎉 PODCAST GENERATION COMPLETED"
      );

      console.log(
        "🎉 podcastId:",
        podcastId
      );

      console.log(
        "🎉 status:",
        podcast?.status
      );

      console.log(
        "🎉 audioUrl:",
        Boolean(upload?.secureUrl)
      );

      console.log(
        "========================================"
      );

      return {
        success: true,

        podcastId,

        status:
          podcast?.status ||
          "ready",

        audioUrl:
          upload.secureUrl,
      };
    } catch (error) {
      /*
      =========================================================
      ERROR HANDLING
      =========================================================
      */

      console.error(
        "========================================"
      );

      console.error(
        "❌ PODCAST GENERATION FAILED"
      );

      console.error(
        "❌ podcastId:",
        podcastId
      );

      console.error(
        "❌ notebookId:",
        notebookId
      );

      console.error(
        "❌ error:",
        error?.message ||
          error
      );

      console.error(
        "❌ stack:",
        error?.stack
      );

      console.error(
        "========================================"
      );

      try {
        await Podcast.findByIdAndUpdate(
          podcastId,
          {
            status: "failed",

            error:
              error?.message ||
              "Podcast generation failed.",
          }
        );

        console.log(
          "✅ Podcast marked as failed in database."
        );
      } catch (dbError) {
        console.error(
          "❌ Failed to update podcast status:",
          dbError?.message ||
            dbError
        );
      }

      throw error;
    }
  }
);