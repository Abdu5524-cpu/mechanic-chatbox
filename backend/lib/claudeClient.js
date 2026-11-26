import Anthropic from "@anthropic-ai/sdk";

const DEFAULT_MODEL = "claude-sonnet-5";
// Most continuations a paused web-search turn gets before we give up and let the caller fall back.
const MAX_PAUSE_CONTINUATIONS = 2;

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

// The 20260209 web search filters results before they reach the context (fewer tokens, better
// matches). Older models only accept the basic 20250305 version.
const LEGACY_SEARCH_MODELS = /^claude-(3|haiku-4|sonnet-4-[05]|sonnet-4-2|opus-4-[015]|opus-4-2)/;

export function webSearchTool(model) {
  const type = LEGACY_SEARCH_MODELS.test(model) ? "web_search_20250305" : "web_search_20260209";
  return { type, name: "web_search", max_uses: 3 };
}

export function findToolInput(response, toolName) {
  const block = response?.content?.find(b => b.type === "tool_use" && b.name === toolName);
  return block ? block.input : null;
}

// Ask Claude to answer by calling `tool`, whose input_schema is the output shape we want.
// Without web search the tool is forced. With web search the model may search first and then submit.
// max_tokens covers thinking, search reasoning and the tool input; you only pay for tokens used.
export async function callStructured({ system, user, tool, webSearch = false, maxTokens = 16_000 }) {
  const model = process.env.ANTHROPIC_MODEL || DEFAULT_MODEL;
  const messages = [{ role: "user", content: user }];
  const params = {
    model,
    max_tokens: maxTokens,
    system,
    tools: webSearch ? [webSearchTool(model), tool] : [tool],
    tool_choice: webSearch ? { type: "auto" } : { type: "tool", name: tool.name },
  };
  // The search pass is slow; the caller's forced no-search pass is its retry.
  const options = webSearch ? { maxRetries: 0 } : undefined;

  let response = await getClient().messages.create({ ...params, messages }, options);

  // A long server-side search can pause the turn. Send it back as-is so the server picks up
  // where it stopped, instead of discarding the searches already done.
  for (let i = 0; response?.stop_reason === "pause_turn" && i < MAX_PAUSE_CONTINUATIONS; i++) {
    messages.push({ role: "assistant", content: response.content });
    response = await getClient().messages.create({ ...params, messages: [...messages] }, options);
  }

  const input = findToolInput(response, tool.name);
  if (!input) {
    console.warn(`[claudeClient] ${tool.name} not called (stop_reason: ${response?.stop_reason})`, response?.usage);
  }
  return input;
}
