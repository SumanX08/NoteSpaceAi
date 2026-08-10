import asyncHandler from "../middleware/asyncHandler.js";

import Source from "../models/source.model.js";
import vectorRepository from "../vectorstore/vector.repository.js";
import { inngest } from "../inngest/index.js";
import { uploadDocumentToCloudinary } from "../services/cloudinary.service.js";

export const uploadSource = asyncHandler(async (req, res) => {
  const file = req.file;

  if (file) {
  console.log("Uploaded file:", {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    bufferLength: file.buffer?.length,
  });
}

  const {
    notebookId,
    title,
    type,
    url,
  } = req.body;

 

  if (!notebookId) {
    return res.status(400).json({
      success: false,
      message: "Notebook ID is required.",
    });
  }

 
 // =====================================================
// DOCUMENTS — PDF / DOCX
// =====================================================

if (file) {
  const mimeToType = {
    "application/pdf": "pdf",

    "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      "docx",

    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      "pptx",

    "text/plain": "text",

    "text/vtt": "transcript",
  };

  const detectedType = mimeToType[file.mimetype];

  if (!detectedType) {
    return res.status(400).json({
      success: false,
      message: `Unsupported document type: ${file.mimetype}`,
    });
  }

  const uploaded =
    await uploadDocumentToCloudinary(
      file.buffer,
      file.originalname,
      file.mimetype
    );

  const source = await Source.create({
    notebookId,

    // IMPORTANT:
    // Use the type detected from the actual file
    type: detectedType,

    title:
      title?.trim() ||
      file.originalname.replace(
        /\.(pdf|docx|pptx|txt|vtt)$/i,
        ""
      ),

    originalName: file.originalname,

    mimeType: file.mimetype,

    size: file.size,

    cloudinary: {
      publicId: uploaded.publicId,
      resourceType: uploaded.resourceType,
      url: uploaded.secureUrl,
    },

    status: "uploading",
  });

  await inngest.send({
    name: "source/created",

    data: {
      sourceId: source._id.toString(),
    },
  });

  return res.status(201).json({
    success: true,
    data: source,
  });
}

  // =====================================================
  // WEBSITE
  // =====================================================

  if (type === "website") {
    if (!url) {
      return res.status(400).json({
        success: false,
        message: "Website URL is required.",
      });
    }

    const source = await Source.create({
      notebookId,

      type: "website",

      title: title?.trim() || url,

      url,

      status: "uploading",
    });

    await inngest.send({
      name: "source/created",
      data: {
        sourceId: source._id.toString(),
      },
    });

    return res.status(201).json({
      success: true,
      data: source,
    });
  }

  // =====================================================
  // YOUTUBE
  // =====================================================

  if (type === "youtube") {
    if (!url) {
      return res.status(400).json({
        success: false,
        message: "YouTube URL is required.",
      });
    }

    const source = await Source.create({
      notebookId,

      type: "youtube",

      title: title?.trim() || url,

      url,

      status: "uploading",
    });

    await inngest.send({
      name: "source/created",
      data: {
        sourceId: source._id.toString(),
      },
    });

    return res.status(201).json({
      success: true,
      data: source,
    });
  }

  // =====================================================
  // Unsupported source
  // =====================================================

  return res.status(400).json({
    success: false,
    message: `Unsupported source type: ${type}`,
  });
});


// =====================================================
// DELETE SOURCE
// =====================================================

export const deleteSource = asyncHandler(async (req, res) => {
  const { sourceId } = req.params;

  const source = await Source.findById(sourceId);

  if (!source) {
    return res.status(404).json({
      success: false,
      message: "Source not found.",
    });
  }

  await vectorRepository.deleteBySource(source._id);

  await Source.findByIdAndDelete(sourceId);

  return res.json({
    success: true,
    message: "Source deleted successfully.",
  });
});


// =====================================================
// GET NOTEBOOK SOURCES
// =====================================================

export const getNotebookSources = asyncHandler(async (req, res) => {
  const { notebookId } = req.params;

  const sources = await Source.find({
    notebookId,
  }).sort({
    createdAt: -1,
  });

  return res.json({
    success: true,
    data: sources,
  });
});
