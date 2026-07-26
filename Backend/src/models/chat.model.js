import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    notebook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notebook",
      required: true,
      index: true,
    },

    title: {
      type: String,
      default: "New Chat",
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

chatSchema.index({
  notebook: 1,
  updatedAt: -1,
});

export default mongoose.model(
  "Chat",
  chatSchema
);