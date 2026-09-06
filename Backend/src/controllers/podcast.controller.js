import Notebook from "../models/notebook.model.js";
import Podcast from "../models/podcast.model.js";
import { inngest } from "../inngest/index.js";

const VALID_STYLES = [
  "teacher",
  "conversation",
  "interview",
  "revision",
];

const VALID_VOICES = [
  "male",
  "female",
  "mixed",
];

const VALID_DURATIONS = [
  5,
  10,
  20,
];

export async function generatePodcast(
  req,
  res,
  next
) {
  try {
    const { notebookId } =
      req.params;

    const {
      style,
      voice,
      duration,
    } = req.body;

    const userId =
      req.userId;

    /*
     * ---------------------------------------------
     * Validation
     * ---------------------------------------------
     */

    if (
      !VALID_STYLES.includes(style)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid podcast style.",
      });
    }

    if (
      !VALID_VOICES.includes(voice)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid podcast voice.",
      });
    }

    const numericDuration =
      Number(duration);

    if (
      !VALID_DURATIONS.includes(
        numericDuration
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid podcast duration.",
      });
    }

    /*
     * ---------------------------------------------
     * Verify notebook ownership
     * ---------------------------------------------
     */

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

    /*
     * ---------------------------------------------
     * Create podcast record
     * ---------------------------------------------
     */

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

        script: "",

        audioUrl: "",

        audioPublicId: "",

        error: "",
      });

    /*
     * ---------------------------------------------
     * Trigger background generation
     * ---------------------------------------------
     */

    await inngest.send({
      name: "podcast/generate",

      data: {
        podcastId:
          podcast._id.toString(),

        notebookId:
          notebook._id.toString(),

        userId,

        style,

        voice,

        duration:
          numericDuration,
      },
    });

    /*
     * ---------------------------------------------
     * Return immediately
     * ---------------------------------------------
     */

    return res.status(202).json({
      success: true,

      message:
        "Podcast generation started.",

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

        script: "",

        audioUrl: "",

        status:
          "generating",

        createdAt:
          podcast.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
}

export async function getPodcasts(
  req,
  res,
  next
) {
  try {
    const { notebookId } =
      req.params;

    const userId =
      req.userId;

    /*
     * Verify notebook ownership.
     */

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
  } catch (error) {
    next(error);
  }
}