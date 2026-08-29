import Notebook from "../models/notebook.model.js";
import Source from "../models/source.model.js";
import asyncHandler from "../middleware/asyncHandler.js";

// =====================================================
// CREATE NOTEBOOK
// =====================================================

export const createNotebook = asyncHandler(async (req, res) => {
  const { title, emoji, description } = req.body;

  const notebook = await Notebook.create({
    title,
    emoji,
    description,

    // User comes from verified Clerk authentication
    userId: req.userId,
  });

  res.status(201).json({
    success: true,
    data: notebook,
  });
});

// =====================================================
// GET ALL NOTEBOOKS FOR LOGGED-IN USER
// =====================================================

export const getAllNotebooks = asyncHandler(async (req, res) => {
  const notebooks = await Notebook.aggregate([
    {
      $match: {
        userId: req.userId,
      },
    },

    {
      $lookup: {
        from: "sources",
        localField: "_id",
        foreignField: "notebookId",
        as: "sources",
      },
    },

    {
      $addFields: {
        sourceCount: {
          $size: "$sources",
        },
      },
    },

    {
      $project: {
        sources: 0,
      },
    },

    {
      $sort: {
        isPinned: -1,
        updatedAt: -1,
      },
    },
  ]);

  res.status(200).json({
    success: true,
    count: notebooks.length,
    data: notebooks,
  });
});

// =====================================================
// GET SINGLE NOTEBOOK
// =====================================================

export const getNotebookById = asyncHandler(async (req, res) => {
  const notebook = await Notebook.findOne({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!notebook) {
    return res.status(404).json({
      success: false,
      message: "Notebook not found",
    });
  }

  const sources = await Source.find({
    notebookId: notebook._id,
  });

  res.status(200).json({
    success: true,
    data: notebook,
    sources,
  });
});

// =====================================================
// UPDATE NOTEBOOK
// =====================================================

export const updateNotebook = asyncHandler(async (req, res) => {
  const { title, emoji, description } = req.body;

  const notebook = await Notebook.findOneAndUpdate(
    {
      _id: req.params.id,
      userId: req.userId,
    },
    {
      title,
      emoji,
      description,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!notebook) {
    return res.status(404).json({
      success: false,
      message: "Notebook not found",
    });
  }

  res.status(200).json({
    success: true,
    data: notebook,
  });
});

// =====================================================
// DELETE NOTEBOOK
// =====================================================

export const deleteNotebook = asyncHandler(async (req, res) => {
  const notebook = await Notebook.findOneAndDelete({
    _id: req.params.id,
    userId: req.userId,
  });

  if (!notebook) {
    return res.status(404).json({
      success: false,
      message: "Notebook not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "Notebook deleted successfully",
  });
});

// =====================================================
// PIN / UNPIN NOTEBOOK
// =====================================================

export const togglePinNotebook = asyncHandler(
  async (req, res) => {
    const notebook = await Notebook.findOne({
      _id: req.params.id,
      userId: req.userId,
    });

    if (!notebook) {
      return res.status(404).json({
        success: false,
        message: "Notebook not found",
      });
    }

    notebook.isPinned = !notebook.isPinned;

    await notebook.save();

    res.json({
      success: true,
      data: notebook,
    });
  }
);