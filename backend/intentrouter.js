import { Router } from "express";
import analyzeQuoteController from "./features/analyzeQuote/analyzeQuoteController.js";
import chatRouter from "./controllers/chat.js";

const router = Router();

// Central router: all routes are mounted under /api in app.js.
router.post("/analyzeQuote", analyzeQuoteController); // -> POST /api/analyzeQuote
router.post("/chat", chatRouter); // -> POST /api/chat

export default router;
