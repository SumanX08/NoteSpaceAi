import asyncHandler from "../middleware/asyncHandler.js";

import Notebook from "../models/notebook.model.js";
import Podcast from "../models/podcast.model.js";

import {
  getNotebookChunks,
  generatePodcastScript,
  generatePodcastAudio,
} from "../services/podcast.service.js";

import {
  uploadAudioToCloudinary,
} from "../services/cloudinary.service.js";

export const generatePodcast =
  asyncHandler(async (req, res) => {
    console.log(
      "\n========== PODCAST GENERATION START =========="
    );

    const {
      notebookId,
    } = req.params;

    const {
      style = "teacher",
      voice = "female",
      duration = 10,
    } = req.body;

    const userId =
      req.userId;

    console.log(
      "USER:",
      userId
    );

    console.log(
      "NOTEBOOK:",
      notebookId
    );

    console.log(
      "STYLE:",
      style
    );

    console.log(
      "VOICE:",
      voice
    );

    console.log(
      "DURATION:",
      duration
    );

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const validStyles = [
      "teacher",
      "conversation",
      "interview",
      "revision",
    ];

    const validVoices = [
      "male",
      "female",
      "mixed",
    ];

    const validDurations = [
      5,
      10,
      20,
    ];

    if (
      !validStyles.includes(style)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid podcast style.",
      });
    }

    if (
      !validVoices.includes(voice)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid podcast voice.",
      });
    }

    const numericDuration =
      Number(duration);

    if (
      !validDurations.includes(
        numericDuration
      )
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid podcast duration.",
      });
    }

    // ------------------------------------------------
    // Verify notebook ownership
    // ------------------------------------------------

    const notebook =
      await Notebook.findOne({
        _id: notebookId,
        userId,
      }).lean();

    if (!notebook) {
      return res.status(404).json({
        success: false,
        message:
          "Notebook not found.",
      });
    }

    // ------------------------------------------------
    // Create podcast record
    // ------------------------------------------------

    const podcast =
      await Podcast.create({
        notebook:
          notebook._id,

        userId,

        title:
          `${notebook.title} Podcast`,

        style,

        voice,

        duration:
          numericDuration,

        status:
          "generating",
      });

    try {
      // ----------------------------------------------
      // Get complete notebook content
      // ----------------------------------------------

      console.log(
        "📚 Loading notebook chunks..."
      );

      const chunks =
        await getNotebookChunks(
          notebookId
        );

      console.log(
        "📚 Chunks:",
        chunks.length
      );

      if (!chunks.length) {
        throw new Error(
          "This notebook has no processed source content yet."
        );
      }

      // ----------------------------------------------
      // Generate script
      // ----------------------------------------------

      console.log(
        "🧠 Generating podcast script..."
      );

      const script =
        await generatePodcastScript({
          notebook,
          chunks,
          style,
          voice,
          duration:
            numericDuration,
        });

      console.log(
        "🧠 Script generated:",
        script.length,
        "characters"
      );

      podcast.script =
        script;

      await podcast.save();

      // ----------------------------------------------
      // Generate audio
      // ----------------------------------------------

      console.log(
        "🎙️ Generating podcast audio..."
      );

      const audioBuffer =
        await generatePodcastAudio({
          script,
          voice,
          style
        });

      console.log(
        "🎙️ Audio generated:",
        audioBuffer.length,
        "bytes"
      );

      // ----------------------------------------------
      // Upload audio
      // ----------------------------------------------

      console.log(
        "☁️ Uploading audio to Cloudinary..."
      );

      const upload =
        await uploadAudioToCloudinary(
          audioBuffer,
          `podcast-${podcast._id}.mp3`
        );

      console.log(
        "☁️ Audio uploaded:",
        upload.secureUrl
      );

      // ----------------------------------------------
      // Update podcast
      // ----------------------------------------------

      podcast.audioUrl =
        upload.secureUrl;

      podcast.audioPublicId =
        upload.publicId;

      podcast.status =
        "ready";

      podcast.error =
        "";

      await podcast.save();

      console.log(
        "========== PODCAST GENERATION COMPLETE ==========\n"
      );

      return res.status(201).json({
        success: true,

        message:
          "Podcast generated successfully.",

        data: {
          id:
            podcast._id,

          title:
            podcast.title,

          style:
            podcast.style,

          voice:
            podcast.voice,

          duration:
            podcast.duration,

          script:
            podcast.script,

          audioUrl:
            podcast.audioUrl,

          status:
            podcast.status,

          createdAt:
            podcast.createdAt,
        },
      });
    } catch (error) {
      console.error(
        "❌ Podcast generation failed:",
        error
      );

      podcast.status =
        "failed";

      podcast.error =
        error.message ||
        "Podcast generation failed.";

      await podcast.save();

      throw error;
    }
  });

export const getPodcasts =
  asyncHandler(async (req, res) => {
    const {
      notebookId,
    } = req.params;

    const userId =
      req.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const notebook =
      await Notebook.findOne({
        _id: notebookId,
        userId,
      }).lean();

    if (!notebook) {
      return res.status(404).json({
        success: false,
        message:
          "Notebook not found.",
      });
    }

    const podcasts =
      await Podcast.find({
        notebook: notebookId,
        userId,
      })
        .sort({
          createdAt: -1,
        })
        .lean();

    return res.status(200).json({
      success: true,
      data: podcasts,
    });
  });