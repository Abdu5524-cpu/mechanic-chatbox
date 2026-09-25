import Anthropic from "@anthropic-ai/sdk";

const DEFAULT_MODEL = "claude-sonnet-5";
const WEB_SEARCH_TOOL = { type: "web_search_20250305", name: "web_search", max_uses: 3 };

let client;

// Created lazily so importing this module never needs the API key (tests, tooling).
function getClient() {
  client ??= new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
    timeout: 60_000, // web search adds latency; the SDK aborts the request after this
    maxRetries: 1,
  });
  return client;
}

export function findToolInput(response, toolName) {
  const block = response?.content?.find(b => b.type === "tool_use" && b.name === toolName);
  return block ? block.input : null;
}

// Ask Claude to answer by calling `tool`, whose input_schema is the output shape we want.
// Without web search the tool is forced. With web search the model may search first and then submit.
export async function callStructured({ system, user, tool, webSearch = false, maxTokens = 4096 }) {
  const response = await getClient().messages.create({
    model: process.env.ANTHROPIC_MODEL || DEFAULT_MODEL,
    max_tokens: maxTokens,
    system,
    messages: [{ role: "user", content: user }],
    tools: webSearch ? [WEB_SEARCH_TOOL, tool] : [tool],
    tool_choice: webSearch ? { type: "auto" } : { type: "tool", name: tool.name },
  });
  return findToolInput(response, tool.name);
}
