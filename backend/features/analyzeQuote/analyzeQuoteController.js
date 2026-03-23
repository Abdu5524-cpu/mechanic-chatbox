import { analyzeQuoteService } from "./analyzeQuoteService.js";

const MAX_LEN = 4000;
const MIN_LEN = 10;

async function analyzeQuoteController(req, res, next) {
  try {
    const { userText } = req.body;

    if (!userText || typeof userText !== "string") {
      return res.status(400).json({
        success: false,
        error: "userText is required and must be a string",
      });
    }

    if (userText.length > MAX_LEN) {
      return res.status(400).json({
        success: false,
        error: `Input too long (max ${MAX_LEN} characters)`,
      });
    }

    if (userText.trim().length < MIN_LEN) {
      return res.status(400).json({
        success: false,
        error: "Input too short to analyze",
      });
    }

    // Strip null bytes and non-printable control characters before passing to the model.
    const sanitized = userText.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();

    const result = await analyzeQuoteService({ userText: sanitized });

    if (!result || !result.success) {
      return res.status(502).json(result || {
        success: false,
        stage: "analyzeQuoteService",
        error: "service failed to analyze quote",
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
}

export default analyzeQuoteController;
