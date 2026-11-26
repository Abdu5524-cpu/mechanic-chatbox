import { quoteParser } from "./quoteParser.js";

export async function analyzeQuoteService({ userText }) {
  const parsed = await quoteParser({ userText });
  return { success: true, parsed };
}
