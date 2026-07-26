import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema(
  {
    notebook: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notebook",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      required: true,
      enum: [
        "pdf",
        "website",
        "youtube",
        "text",
        "docx",
      ],
    },

    status: {
      type: String,
      enum: [
        "uploading",
        "processing",
        "ready",
        "failed",
      ],
      default: "uploading",
      index: true,
    },

    content: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
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

sourceSchema.index({
  notebook: 1,
  createdAt: -1,
});

export default mongoose.model("Source", sourceSchema);