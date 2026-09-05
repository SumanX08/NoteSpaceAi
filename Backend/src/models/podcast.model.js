import mongoose from "mongoose";

const podcastSchema = new mongoose.Schema(
  {
    notebook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notebook",
      required: true,
      index: true,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    style: {
      type: String,
      enum: [
        "teacher",
        "conversation",
        "interview",
        "revision",
      ],
      required: true,
    },

    voice: {
      type: String,
      enum: ["male", "female", "mixed"],
      required: true,
    },

    duration: {
      type: Number,
      enum: [5, 10, 20],
      required: true,
    },

    script: {
      type: String,
      default: "",
    },

    audioUrl: {
      type: String,
      default: "",
    },

    audioPublicId: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
        "generating",
        "ready",
        "failed",
      ],
      default: "generating",
      index: true,
    },

    error: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

podcastSchema.index({
  notebook: 1,
  createdAt: -1,
});

podcastSchema.index({
  userId: 1,
  createdAt: -1,
});

export default mongoose.model(
  "Podcast",
  podcastSchema
);