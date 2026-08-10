import mongoose from "mongoose";

const notebookSchema = new mongoose.Schema(
  {
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
}
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

notebookSchema.index({
  title: "text",
});

export default mongoose.model(
  "Notebook",
  notebookSchema
);