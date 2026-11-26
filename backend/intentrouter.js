import { Router } from "express";
import analyzeQuoteController from "./features/analyzeQuote/analyzeQuoteController.js";

const router = Router();

// All routes are mounted under /api in app.js.
router.post("/analyzeQuote", analyzeQuoteController); // -> POST /api/analyzeQuote

export default router;
