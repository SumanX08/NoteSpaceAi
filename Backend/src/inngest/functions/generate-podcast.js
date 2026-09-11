import { inngest } from "../client.js";

import Podcast from "../../models/podcast.model.js";
import Notebook from "../../models/notebook.model.js";

import {
  getNotebookChunks,
  generatePodcastScript,
  generatePodcastAudio,
} from "../../services/podcast.service.js";

import {
  uploadAudioToCloudinary,
} from "../../services/cloudinary.service.js";

export const generatePodcast =
  inngest.createFunction(
    {
      id: "generate-podcast",
      name: "Generate Podcast",

      triggers: [
        {
          event: "podcast/generate",
        },
      ],

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

      try {
       

        const notebook =
          await step.run(
            "get-notebook",
            async () => {
              return await Notebook.findOne({
                _id: notebookId,
                userId,
              }).lean();
            }
          );

        if (!notebook) {
          throw new Error(
            "Notebook not found or access denied."
          );
        }

        /*
         * ============================================
         * 2. GET NOTEBOOK CHUNKS
         * ============================================
         */

        const chunks =
          await step.run(
            "get-notebook-chunks",
            async () => {
              return await getNotebookChunks(
                notebookId
              );
            }
          );

        if (!chunks?.length) {
          throw new Error(
            "No processed source content is available for this notebook."
          );
        }

        /*
         * ============================================
          3. GENERATE SCRIPT
         * ============================================
         */

        const script =
          await step.run(
            "generate-podcast-script",
            async () => {
              return await generatePodcastScript({
                notebook,
                chunks,
                style,
                voice,
                duration,
              });
            }
          );

        if (!script) {
          throw new Error(
            "Podcast script generation returned an empty result."
          );
        }

        /*
         * ============================================
         * 4. SAVE SCRIPT
         * ============================================
         */

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
          }
        );

        /*
         * ============================================
         * 5. GENERATE + UPLOAD AUDIO
         * ============================================
         *
         * IMPORTANT:
         *
         * We DO NOT return the audio Buffer
         * from the Inngest step.
         *
         * The Buffer is generated and uploaded
         * inside the same step.
         *
         * Only small metadata is returned.
         */

        const upload =
          await step.run(
            "generate-and-upload-audio",
            async () => {
              const audioBuffer =
                await generatePodcastAudio({
                  script,
                  voice,
                  style,
                });

              if (
                !audioBuffer ||
                audioBuffer.length === 0
              ) {
                throw new Error(
                  "Podcast audio generation returned an empty file."
                );
              }

              const result =
                await uploadAudioToCloudinary(
                  audioBuffer,
                  `podcast-${podcastId}.mp3`
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
         * ============================================
         * 6. MARK READY
         * ============================================
         */

        const podcast =
          await step.run(
            "mark-podcast-ready",
            async () => {
              return await Podcast.findByIdAndUpdate(
                podcastId,
                {
                  audioUrl:
                    upload.secureUrl,

                  audioPublicId:
                    upload.publicId,

                  status: "ready",

                  error: "",
                },
                {
                  new: true,
                }
              ).lean();
            }
          );

        /*
         * ============================================
         * 7. DONE
         * ============================================
         */

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
        console.error(
          "Podcast generation failed:",
          {
            podcastId,
            notebookId,
            error:
              error?.message ||
              error,
            stack:
              error?.stack,
          }
        );

        /*
         * Mark the podcast as failed.
         */

        await Podcast.findByIdAndUpdate(
          podcastId,
          {
            status: "failed",

            error:
              error?.message ||
              "Podcast generation failed.",
          }
        );

        throw error;
      }
    }
  );
