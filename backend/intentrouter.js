import { Router } from "express";
import analyzeQuoteController from "./features/analyzeQuote/analyzeQuoteController.js";
import chatRouter from "./controllers/chat.js";

const router = Router();

router.post("/analyzeQuote", analyzeQuoteController.post); // -> POST /api/analyzeQuote
router.use("/chat", chatRouter); // -> POST /api/chat

export default router;
