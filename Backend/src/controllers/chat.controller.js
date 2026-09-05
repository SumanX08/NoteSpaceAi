import asyncHandler from "../middleware/asyncHandler.js";

import Chat from "../models/chat.model.js";
import Message from "../models/message.model.js";

import search from "../rag/retrieval/search.js";
import {
  streamAnswer,
} from "../rag/retrieval/answer.js";

// =====================================
// ASK QUESTION
// =====================================

export const askQuestion = asyncHandler(
  async (req, res) => {

    console.log("\n========== CHAT START ==========");

    const {
      notebookId,
      question,
    } = req.body;

    const userId = req.userId;

    console.log("USER ID:", userId);
    console.log("NOTEBOOK ID:", notebookId);
    console.log("QUESTION:", question);

    // ================================
    // VALIDATION
    // ================================

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    if (!notebookId || !question) {
      return res.status(400).json({
        success: false,
        message:
          "Notebook ID and question are required.",
      });
    }

    // ================================
    // FIND / CREATE CHAT
    // ================================

    let chat =
      await Chat.findOne({
        notebook: notebookId,
        userId,
      });

    if (!chat) {
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

    await Message.create({
      chat: chat._id,
      role: "user",
      content: question,
    });

    // ================================
    // SEARCH RAG
    // ================================

    console.log("🔍 Searching RAG...");

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
    // STREAMING HEADERS
    // ================================

    res.status(200);

    res.setHeader(
      "Content-Type",
      "text/event-stream"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    res.setHeader(
      "X-Accel-Buffering",
      "no"
    );

    // Helpful for proxies
    if (res.flushHeaders) {
      res.flushHeaders();
    }

    // ================================
    // SEND EVENT HELPER
    // ================================

    const sendEvent = (event, data) => {
      res.write(
        `event: ${event}\n`
      );

      res.write(
        `data: ${JSON.stringify(data)}\n\n`
      );
    };

    // ================================
    // RAG COMPLETE
    // ================================

    sendEvent("rag_complete", {
      chunkCount:
        chunks?.length || 0,
    });

    // ================================
    // GENERATE + STREAM
    // ================================

    console.log(
      "✦ Starting streamed generation..."
    );

    const result =
      await streamAnswer(
        question,
        chunks,
        (token) => {

          console.log(
      "📤 SENDING TOKEN:",
      JSON.stringify(token)
    );


          sendEvent("token", {
            content: token,
          });

        }
      );

    console.log(
      "✅ Generation complete"
    );

    // ================================
    // SAVE ASSISTANT MESSAGE
    // ================================

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

    // ================================
    // SEND FINAL EVENT
    // ================================

    sendEvent("done", {
      messageId:
        assistantMessage._id.toString(),

      chatId:
        chat._id.toString(),

      citations:
        result.citations ?? [],
    });

    res.end();

    console.log(
      "========== CHAT END ==========\n"
    );
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