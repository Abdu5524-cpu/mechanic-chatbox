import { quoteParser } from "./quoteParser.js";

export async function analyzeQuoteService(input) {
  const { userText } = input;

  const parsed = await quoteParser({ userText });

  if (parsed === null || parsed === undefined) {
    return {
      success: false,
      stage: "quoteParser",
      error: "parser failed to extract quote information",
    };
  }

  // Guard: quoteParser's catch branch returns { error: ... } on failure.
  if (parsed.error) {
    return {
      success: false,
      stage: "quoteParser",
      error: parsed.error,
    };
  }

  return {
    success: true,
    parsed,
  };
}
