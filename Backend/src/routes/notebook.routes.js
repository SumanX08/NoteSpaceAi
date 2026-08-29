import { Router } from "express";

import * as notebookController from "../controllers/notebook.controller.js";

import { requireAuth } from "../middleware/auth.middleware.js";

const router = Router();

// Protect every route below
router.use(requireAuth);

router.post("/", notebookController.createNotebook);

router.get("/", notebookController.getAllNotebooks);

router.get("/:id", notebookController.getNotebookById);

router.patch("/:id", notebookController.updateNotebook);

router.delete("/:id", notebookController.deleteNotebook);

router.patch("/:id/pin", notebookController.togglePinNotebook);

export default router;