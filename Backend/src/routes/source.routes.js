
import { Router } from "express";
import upload from "../middleware/upload.middleware.js";
import {
  uploadSource,
  deleteSource,
  getNotebookSources,
} from "../controllers/source.controller.js";

const router = Router();

router.post("/upload",upload.single("file"),uploadSource);


router.get("/:notebookId", getNotebookSources);

router.delete("/:sourceId", deleteSource);

export default router;