import mongoose from "mongoose";

const chunkSchema = new mongoose.Schema(
  {
    notebook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notebook",
      required: true,
      index: true,
    },

    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Source",
      required: true,
      index: true,
    },

    chunkIndex: {
      type: Number,
      required: true,
    },

    text: {
      type: String,
      required: true,
    },

    vectorId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    metadata: {
      page: Number,
      start: Number,
      end: Number,
      tokenCount: Number,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

export default mongoose.model("Chunk", chunkSchema);