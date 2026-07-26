import fs from "fs/promises";

import asyncHandler from "../middleware/asyncHandler.js";

import Source from "../models/source.model.js";
import vectorRepository from "../vectorstore/vector.repository.js";
import { processSource } from "../rag/pipeline/processSource.js";
export const uploadSource = asyncHandler(async (req, res) => {
  const file = req.file;

  const {
    notebookId,
    title,
    type,
    url,
    content,
  } = req.body;

  if (!notebookId) {
    if (file) {
      await fs.unlink(file.path);
    }

    return res.status(400).json({
      success: false,
      message: "Notebook ID is required.",
    });
  }

  if (["pdf", "docx", "transcript"].includes(type) && !file) {
    return res.status(400).json({
      success: false,
      message: "File is required.",
    });
  }

  if (type === "website" && !url) {
    return res.status(400).json({
      success: false,
      message: "Website URL is required.",
    });
  }

  if (type === "youtube" && !url) {
    return res.status(400).json({
      success: false,
      message: "YouTube URL is required.",
    });
  }

  if (type === "text" && !content) {
    return res.status(400).json({
      success: false,
      message: "Content is required.",
    });
  }

  const sourceData = {
    notebook: notebookId,
    title: title || "Untitled",
    type,
    status: "uploading",
    content: {},
  };

  if (file) {
    sourceData.title = title || file.originalname;

    sourceData.content = {
      location: file.path,
      mimeType: file.mimetype,
      size: file.size,
      originalName: file.originalname,
    };
  }

  if (type === "website") {
    sourceData.content = {
      url,
    };

    sourceData.title = title || url;
  }

  if (type === "youtube") {
    sourceData.content = {
      url,
    };

    sourceData.title = title || url;
  }

  if (type === "text") {
    sourceData.content = {
      text: content,
    };

    sourceData.title = title || "Untitled Note";
  }

  const source = await Source.create(sourceData);

  processSource(source._id).catch((error) => {
    console.error("Background indexing failed:", error);
  });

  res.status(201).json({
    success: true,
    data: source,
  });
});

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

  res.json({
    success: true,
    message: "Source deleted successfully.",
  });
});

export const getNotebookSources = asyncHandler(async (req, res) => {
  const { notebookId } = req.params;

  const sources = await Source.find({
    notebook: notebookId,
  }).sort({
    createdAt: -1,
  });

  res.json({
    success: true,
    data:sources,
  });
});