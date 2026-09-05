import mongoose from "mongoose";

const sourceSchema = new mongoose.Schema(
  {
    notebookId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notebook",
      required: true,
      index: true,
    },

    type: {
      type: String,
      enum: [
        "pdf",
        "website",
        "youtube",
        "text",
        "transcript",
        "docx",
      ],
      required: true,
    },

    title: {
      type: String,
      trim: true,
    },

    originalName: String,

    url: String,

    mimeType: String,

    size: Number,

    cloudinary: {
      publicId: String,
      resourceType: String,
      url: String,
    },

    status: {
      type: String,
      enum: ["uploading", "extracting","chunking","embedding","storing", "ready", "failed"],
      default: "uploading",
      index: true,
    },

    error: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Source", sourceSchema);