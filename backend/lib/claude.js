import Anthropic from "@anthropic-ai/sdk";

// The key is read from the server environment only (ANTHROPIC_API_KEY).
// It is never sent to the browser and never logged.
const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: 45_000, // ms; fail fast so a portfolio visitor isn't left waiting
  maxRetries: 1,
});

export const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5-5";

// Hard ceiling on billed output per request. Generous enough for the JSON
// answer plus adaptive thinking, small enough to bound cost on a public demo.
const MAX_TOKENS = 8000;

export class ModelError extends Error {
  constructor(message, { status = 502, cause } = {}) {
    super(message);
    this.name = "ModelError";
    this.status = status;
    this.cause = cause;
  }
}

/**
 * Ask Claude for a JSON answer that matches `schema` (structured outputs).
 * Returns the parsed object, or throws a ModelError with a user-safe message.
 */
export async function generateJson({ system, user, schema }) {
  let response;
  try {
    response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system,
      messages: [{ role: "user", content: user }],
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema },
      },
      // If a safety classifier declines, the API retries on a fallback model
      // inside the same call instead of failing outright.
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      throw new ModelError("The analyzer is busy right now. Try again in a minute.", { status: 503, cause: err });
    }
    if (err instanceof Anthropic.AuthenticationError || err instanceof Anthropic.PermissionDeniedError) {
      console.error("[claude] authentication failed; check ANTHROPIC_API_KEY");
      throw new ModelError("The analyzer isn't configured correctly.", { status: 500, cause: err });
    }
    if (err instanceof Anthropic.APIConnectionTimeoutError) {
      throw new ModelError("The analysis took too long. Try again.", { status: 504, cause: err });
    }
    if (err instanceof Anthropic.APIError) {
      console.error(`[claude] API error ${err.status}: ${err.message}`);
      throw new ModelError("The analyzer couldn't process that request.", { cause: err });
    }
    throw err;
  }

  if (response.stop_reason === "refusal") {
    throw new ModelError("That request couldn't be analyzed. Try describing the repair quote differently.", { status: 422 });
  }
  if (response.stop_reason === "max_tokens") {
    throw new ModelError("The analysis was cut short. Try a shorter description.");
  }

  const text = response.content
    .filter(block => block.type === "text")
    .map(block => block.text)
    .join("");

  try {
    return JSON.parse(text);
  } catch (err) {
    console.error("[claude] response was not valid JSON");
    throw new ModelError("The analyzer returned an unreadable answer. Try again.", { cause: err });
  }
}
