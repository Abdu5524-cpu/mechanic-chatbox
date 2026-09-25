import { quoteParser } from "./quoteParser.js";

const USER_FACING_ERROR = "We couldn't analyze that quote right now. Please try again in a moment.";

// Error boundary for the analysis pipeline: log the real cause, return a generic message.
export async function analyzeQuoteService({ userText }) {
  try {
    const parsed = await quoteParser({ userText });
    // The legacy parser signals failure with { error }; removed in Task 5 once it throws instead.
    if (!parsed || parsed.error) throw new Error(parsed?.error ?? "Parser returned nothing");
    return { success: true, parsed };
  } catch (err) {
    console.error("[analyzeQuote] analysis failed:", err);
    return { success: false, error: USER_FACING_ERROR };
  }
}
