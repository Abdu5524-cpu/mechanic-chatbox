import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Normalize the Responses API output into a usable value for callers.
export function extractOutput(response) {
  const firstContent = response?.output?.[0]?.content?.[0];
  if (firstContent?.type === "output_text" && firstContent.text?.value) {
    return firstContent.text.value;
  }
  if (firstContent?.type === "output_text" && typeof firstContent.text === "string") {
    return firstContent.text;
  }
  if (firstContent?.type === "json_object" && firstContent.json_object) {
    return firstContent.json_object;
  }
  if (firstContent) {
    return firstContent;
  }
  if (response?.output_text !== undefined) {
    return response.output_text;
  }
  if (response?.output) {
    return response.output;
  }
  return response ?? null;
}

// Send a prompt to the model with an optional response schema/format.
// Enforces a 30-second hard timeout to prevent hanging requests.
export async function callWrapper(systemContent, userContent, responseFormat, options = {}) {
  const { enableWebSearch = false } = options;
  const tools = enableWebSearch ? [{ type: "web_search_preview" }] : undefined;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 30_000);

  try {
    const response = await openai.responses.create({
      model: "gpt-4.1",
      input: [
        { role: "system", content: systemContent },
        { role: "user", content: userContent },
      ],
      text: { format: responseFormat },
      ...(tools ? { tools } : {}),
    }, { signal: controller.signal });

    return extractOutput(response);
  } finally {
    clearTimeout(timer);
  }
}

export default callWrapper;
