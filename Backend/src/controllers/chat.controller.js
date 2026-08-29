import asyncHandler from "../middleware/asyncHandler.js";

import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

import search from "../rag/retrieval/search.js";
import generateAnswer from "../rag/retrieval/answer.js";


// =====================================
// ASK QUESTION
// =====================================

export const askQuestion = asyncHandler(
  async (req, res) => {

    console.log("\n========== CHAT START ==========");

    console.log("BODY:", req.body);

    console.log("AUTH:", req.auth);


    const {
      notebookId,
      question,
    } = req.body;


    const userId =
      req.userId;


    console.log("USER ID:", userId);

    console.log("NOTEBOOK ID:", notebookId);


    // ================================
    // VALIDATION
    // ================================

    if (!userId) {

      console.log("❌ NO USER ID");

      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });

    }


    if (!notebookId || !question) {

      console.log("❌ MISSING DATA");

      return res.status(400).json({
        success: false,
        message:
          "Notebook ID and question are required.",
      });

    }


    // ================================
    // FIND OR CREATE CHAT
    // ================================

    console.log(
      "Finding chat..."
    );


    let chat =
      await Chat.findOne({
        notebook: notebookId,
        userId,
      });


    console.log(
      "Existing chat:",
      chat
    );


    if (!chat) {

      console.log(
        "Creating new chat..."
      );


      chat =
        await Chat.create({
          notebook: notebookId,
          userId,
          title:
            question.substring(0, 50),
        });


      console.log(
        "✅ CHAT CREATED:",
        chat._id.toString()
      );

    }


    
    // ================================
    // SAVE USER MESSAGE
    // ================================

    console.log(
      "Saving user message..."
    );


    const userMessage =
      await Message.create({

        chat: chat._id,

        role: "user",

        content: question,

      });


    console.log(
      "✅ USER MESSAGE SAVED:",
      userMessage._id.toString()
    );


    // ================================
    // SEARCH RAG
    // ================================

    console.log(
      "Searching RAG..."
    );


    const chunks =
      await search(
        question,
        notebookId
      );


    console.log(
      "Chunks found:",
      chunks?.length
    );


    // ================================
    // GENERATE ANSWER
    // ================================

    console.log(
      "Generating answer..."
    );


    const result =
      await generateAnswer(
        question,
        chunks
      );


    console.log(
      "Answer generated"
    );


    // ================================
    // SAVE AI MESSAGE
    // ================================

    console.log(
      "Saving assistant message..."
    );

    console.log(
  "RESULT CITATIONS:",
  result.citations
);

    const assistantMessage =
      await Message.create({

        chat: chat._id,

        role: "assistant",

        content: result.answer,

        citations:
          result.citations ?? [],

      });


    console.log(
      "✅ ASSISTANT MESSAGE SAVED:",
      assistantMessage._id.toString()
    );


    console.log(
      "========== CHAT END ==========\n"
    );


    return res.status(200).json({

      success: true,

      answer:
        assistantMessage.content,

      citations:
        assistantMessage.citations,

      chatId:
        chat._id.toString(),

    });

  }
);


// =====================================
// GET CHAT MESSAGES
// =====================================

export const getChatMessages =
  asyncHandler(
    async (req, res) => {

      console.log(
        "\n========== GET MESSAGES =========="
      );


      const { notebookId } =
        req.params;


      const userId =
        req.userId;


      console.log(
        "Notebook:",
        notebookId
      );

      console.log(
        "User:",
        userId
      );


      if (!userId) {

        return res.status(401).json({

          success: false,

          message: "Unauthorized",

        });

      }


      const chat =
        await Chat.findOne({

          notebook: notebookId,

          userId,

        });


      console.log(
        "Chat found:",
        chat?._id
      );


      if (!chat) {

        return res.status(200).json({

          success: true,

          data: [],

        });

      }


      const messages =
        await Message.find({

          chat: chat._id,

        }).sort({

          createdAt: 1,

        });


      console.log(
        "Messages found:",
        messages.length
      );


      return res.status(200).json({

        success: true,

        data: messages,

      });

    }
  );