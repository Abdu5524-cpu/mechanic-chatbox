import { Router } from "express";
import analyzeQuoteController from "./features/analyzeQuote/analyzeQuoteController.js";

const router = Router();

// Mounted under /api in createApp.js.
router.post("/analyzeQuote", analyzeQuoteController); // -> POST /api/analyzeQuote

export default router;
