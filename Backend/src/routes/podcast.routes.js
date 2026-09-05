import { Router } from "express";

import {
  generatePodcast,
  getPodcasts,
} from "../controllers/podcast.controller.js";

import {
  requireAuth,
} from "../middleware/auth.middleware.js";

const router = Router();

router.use(requireAuth);

router.post(
  "/:notebookId/generate",
  generatePodcast
);

router.get(
  "/:notebookId",
  getPodcasts
);

export default router;