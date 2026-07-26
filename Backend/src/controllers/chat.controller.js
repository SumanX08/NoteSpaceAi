import asyncHandler from "../middleware/asyncHandler.js";
import search from "../rag/retrieval/search.js";
import generateAnswer from "../rag/retrieval/answer.js";

export const askQuestion = asyncHandler(async (req, res) => {
  const { notebookId, question } = req.body;

   console.log("CHAT ROUTE HIT");
  console.log(req.body);


  if (!notebookId || !question) {
    return res.status(400).json({
      success: false,
      message: "Notebook ID and question are required.",
    });
  }

  const chunks = await search(question, notebookId);

  const result = await generateAnswer(question, chunks);

  res.status(200).json({
    success: true,
    answer: result.answer,
    citations: result.citations,
  });
});