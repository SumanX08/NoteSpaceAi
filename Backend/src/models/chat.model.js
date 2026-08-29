import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
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
      default: "New Chat",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

chatSchema.index(
  {
    notebook: 1,
    userId: 1,
  },
  {
    unique: true,
  }
);

export default mongoose.model(
  "Chat",
  chatSchema
);