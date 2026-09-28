import express from "express";

import {
  askQuestion,
  getChatMessages,
  searchMessages,
} from "../controllers/chat.controller.js";

import {
  requireAuth,
} from "../middleware/auth.middleware.js";

const router = express.Router();

router.use(requireAuth);

router.post(
  "/",
  askQuestion
);

router.get(
  "/:notebookId/search",
  searchMessages
);

router.get(
  "/:notebookId/messages",
  getChatMessages
);

export default router;