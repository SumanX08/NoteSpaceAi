import mongoose from "mongoose";

const citationSchema = new mongoose.Schema(
  {
    source: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Source",
      required: true,
    },

    chunkId: String,

    page: Number,

    score: Number,

    text: String,
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
      enum: [
        "system",
        "user",
        "assistant",
      ],
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
    },

    citations: {
      type: [citationSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

messageSchema.index({
  chat: 1,
  createdAt: 1,
});

export default mongoose.model(
  "Message",
  messageSchema
);