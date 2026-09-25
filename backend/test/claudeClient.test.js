import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockCreate, AnthropicMock } = vi.hoisted(() => {
  const mockCreate = vi.fn();
  const AnthropicMock = vi.fn(function () {
    this.messages = { create: mockCreate };
  });
  return { mockCreate, AnthropicMock };
});
vi.mock("@anthropic-ai/sdk", () => ({ default: AnthropicMock }));

import { callStructured, findToolInput } from "../lib/claudeClient.js";

const TOOL = { name: "submit_x", description: "Submit", input_schema: { type: "object", properties: {} } };
const toolUse = input => ({ content: [{ type: "tool_use", id: "t1", name: "submit_x", input }] });

beforeEach(() => {
  mockCreate.mockReset();
  delete process.env.ANTHROPIC_MODEL;
});

describe("findToolInput", () => {
  it("returns the input of the named tool_use block, skipping search and text blocks", () => {
    const response = {
      content: [
        { type: "server_tool_use", name: "web_search", input: { query: "civic bumper cost" } },
        { type: "text", text: "Here is my analysis." },
        { type: "tool_use", name: "submit_x", input: { ok: true } },
      ],
    };
    expect(findToolInput(response, "submit_x")).toEqual({ ok: true });
  });

  it("returns null when the tool was not called", () => {
    expect(findToolInput({ content: [{ type: "text", text: "hi" }] }, "submit_x")).toBeNull();
  });
});

describe("callStructured", () => {
  it("forces the submit tool when web search is off", async () => {
    mockCreate.mockResolvedValue(toolUse({ a: 1 }));
    await expect(callStructured({ system: "sys", user: "hello", tool: TOOL })).resolves.toEqual({ a: 1 });

    const params = mockCreate.mock.calls[0][0];
    expect(params.model).toBe("claude-sonnet-5");
    expect(params.max_tokens).toBe(4096);
    expect(params.system).toBe("sys");
    expect(params.messages).toEqual([{ role: "user", content: "hello" }]);
    expect(params.tools).toEqual([TOOL]);
    expect(params.tool_choice).toEqual({ type: "tool", name: "submit_x" });
  });

  it("adds the web search tool and lets the model choose when web search is on", async () => {
    mockCreate.mockResolvedValue(toolUse({ a: 1 }));
    await callStructured({ system: "sys", user: "hello", tool: TOOL, webSearch: true });

    const params = mockCreate.mock.calls[0][0];
    expect(params.tools[0]).toEqual({ type: "web_search_20250305", name: "web_search", max_uses: 3 });
    expect(params.tools[1]).toEqual(TOOL);
    expect(params.tool_choice).toEqual({ type: "auto" });
  });

  it("uses ANTHROPIC_MODEL when set", async () => {
    process.env.ANTHROPIC_MODEL = "claude-haiku-4-5-20251001";
    mockCreate.mockResolvedValue(toolUse({}));
    await callStructured({ system: "s", user: "u", tool: TOOL });
    expect(mockCreate.mock.calls[0][0].model).toBe("claude-haiku-4-5-20251001");
  });

  it("returns null when the model answers without calling the tool", async () => {
    mockCreate.mockResolvedValue({ content: [{ type: "text", text: "I can't help with that." }] });
    await expect(callStructured({ system: "s", user: "u", tool: TOOL, webSearch: true })).resolves.toBeNull();
  });
});
