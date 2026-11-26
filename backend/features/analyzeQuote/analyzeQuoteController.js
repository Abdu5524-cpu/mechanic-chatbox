import { analyzeQuoteService } from "./analyzeQuoteService.js";
import { ModelError } from "../../lib/claude.js";
import { tryConsumeDailyCap } from "../../lib/dailyCap.js";

const MAX_LEN = 4000;
const MIN_LEN = 10;

async function analyzeQuoteController(req, res, next) {
  try {
    const { userText } = req.body ?? {};

    if (!userText || typeof userText !== "string") {
      return res.status(400).json({ success: false, error: "Describe the repair or paste the quote first." });
    }

    // Strip null bytes and non-printable control characters before validating length.
    const sanitized = userText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();

    if (sanitized.length > MAX_LEN) {
      return res.status(400).json({ success: false, error: `That's too long. Keep it under ${MAX_LEN} characters.` });
    }

    if (sanitized.length < MIN_LEN) {
      return res.status(400).json({ success: false, error: "Add a little more detail: the vehicle, the work, and the price." });
    }

    if (!tryConsumeDailyCap()) {
      return res.status(429).json({ success: false, error: "The demo has hit its daily limit. Try again tomorrow." });
    }

    const result = await analyzeQuoteService({ userText: sanitized });
    res.json(result);
  } catch (err) {
    if (err instanceof ModelError) {
      return res.status(err.status).json({ success: false, error: err.message });
    }
    next(err);
  }
}

export default analyzeQuoteController;
