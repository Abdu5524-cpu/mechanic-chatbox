import { quoteParser } from "./quoteParser.js";

const USER_FACING_ERROR = "We couldn't analyze that quote right now. Please try again in a moment.";

// Error boundary for the analysis pipeline: log the real cause, return a generic message.
export async function analyzeQuoteService({ userText }) {
  try {
    const parsed = await quoteParser({ userText });
    return { success: true, parsed };
  } catch (err) {
    console.error("[analyzeQuote] analysis failed:", err);
    return { success: false, error: USER_FACING_ERROR };
  }
}
