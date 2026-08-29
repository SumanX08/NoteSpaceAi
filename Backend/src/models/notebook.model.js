import mongoose from "mongoose";

const notebookSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: [true, "Notebook title is required"],
      trim: true,
      maxlength: 100,
    },

    emoji: {
      type: String,
      default: "📚",
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },

    isPinned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

notebookSchema.index({
  userId: 1,
  updatedAt: -1,
});

notebookSchema.index({
  userId: 1,
  title: "text",
});

export default mongoose.model(
  "Notebook",
  notebookSchema
);