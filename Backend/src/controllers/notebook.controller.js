import Notebook from "../models/notebook.model.js";
import Source from "../models/source.model.js"
import asyncHandler from "../middleware/asyncHandler.js";

export const createNotebook = asyncHandler(async (req, res) => {
  const { title, emoji, description } = req.body;

  const notebook = await Notebook.create({
    title,
    emoji,
    description,
  });

  res.status(201).json({
    success: true,
    data: notebook,
  });
});

export const getAllNotebooks = asyncHandler(async (req, res) => {
  const notebooks = await Notebook.aggregate([
    {
      $lookup: {
        from: "sources",
        localField: "_id",
        foreignField: "notebook",
        as: "sources",
      },
    },
    {
      $addFields: {
        sourceCount: { $size: "$sources" },
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

export const getNotebookById = asyncHandler(async (req, res) => {
  const notebook = await Notebook.findById(req.params.id);
  const sources = await Source.find({ notebookId: req.params.id });


  if (!notebook) {
    return res.status(404).json({
      success: false,
      message: "Notebook not found",
    });
  }

  console.log(notebook,sources)

  res.status(200).json({
    success: true,
    data: notebook,
    sources
  });
});




export const updateNotebook = asyncHandler(async (req, res) => {
  const notebook = await Notebook.findByIdAndUpdate(
    req.params.id,
    req.body,
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

export const deleteNotebook = asyncHandler(async (req, res) => {
  const notebook = await Notebook.findByIdAndDelete(req.params.id);

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

export const togglePinNotebook = asyncHandler(
  async (req, res) => {
    const notebook = await Notebook.findById(
      req.params.id
    );

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
