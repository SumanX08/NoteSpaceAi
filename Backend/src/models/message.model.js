import mongoose from "mongoose";

const citationSchema = new mongoose.Schema(
  {
    index: {
      type: Number,
      required: true,
    },

    sourceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Source",
      required: true,
    },

    page: {
      type: Number,
      default: null,
    },

    chunkIndex: {
      type: Number,
      default: null,
    },

    score: {
      type: Number,
      default: null,
    },

    // Add this
    text: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const messageSchema = new mongoose.Schema(
  {
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    citations: {
      type: [citationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "Message",
  messageSchema
);