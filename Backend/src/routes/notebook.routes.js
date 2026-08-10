import { Router } from "express";

import * as notebookController from "../controllers/notebook.controller.js";

const router = Router();

router.post("/",notebookController.createNotebook);

router.get("/",notebookController.getAllNotebooks);

router.get("/:id",notebookController.getNotebookById);

router.patch("/:id",notebookController.updateNotebook);

router.delete("/:id",notebookController.deleteNotebook);

router.patch("/:id/pin",notebookController.togglePinNotebook);

export default router;