import { Router } from "express";

import multer from "../middleware/upload.middleware.js";

import {
  uploadSource,
  deleteSource,
  getNotebookSources,
} from "../controllers/source.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Protect all source routes
router.use(requireAuth);

router.post(
  "/upload",
  multer.single("file"),
  uploadSource
);

router.get(
  "/:notebookId",
  getNotebookSources
);

router.delete(
  "/:sourceId",
  deleteSource
);

export default router;