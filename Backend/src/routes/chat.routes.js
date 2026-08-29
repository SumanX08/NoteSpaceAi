import express from "express";

import {
  askQuestion,
  getChatMessages,
} from "../controllers/chat.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = express.Router();

// Protect all routes below
router.use(requireAuth);

router.post("/", askQuestion);

router.get(
  "/:notebookId/messages",
  getChatMessages
);

export default router;