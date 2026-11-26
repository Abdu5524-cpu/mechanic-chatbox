import { describe, it, expect, vi, beforeEach } from "vitest";

const { callStructured } = vi.hoisted(() => ({ callStructured: vi.fn() }));
vi.mock("../lib/claudeClient.js", () => ({ callStructured }));

import { normalizeAnalysis, quoteParser } from "../features/analyzeQuote/quoteParser.js";

const modelAnalysis = (overrides = {}) => ({
  parsedQuote: {
    vehicle: { make: "Honda", model: "Civic", year: "2019" },
    damages: ["front bumper crack"],
    location: { city: "San Diego", stateOrRegion: "CA" },
    services: ["bumper repair", "repaint"],
    quoteTotal: 1800,
    currency: "USD",
    quoteRangeMin: 900,
    quoteRangeMax: 1600,
    shopName: null,
    notesFromUser: null,
    ...overrides,
  },
  riskLevel: "MEDIUM",
  reasons: ["Above the typical range."],
  recommendations: ["Get a second quote."],
});

const TEXT = "2019 Honda Civic front bumper crack. San Diego, CA. Shop quoted $1,800.";

beforeEach(() => {
  callStructured.mockReset();
});

describe("quoteParser", () => {
  it("makes one web-search call with the submit tool and returns the normalized analysis", async () => {
    callStructured.mockResolvedValue(modelAnalysis());
    const result = await quoteParser({ userText: TEXT });

    expect(callStructured).toHaveBeenCalledTimes(1);
    const args = callStructured.mock.calls[0][0];
    expect(args.webSearch).toBe(true);
    expect(args.tool.name).toBe("submit_quote_analysis");
    expect(args.user).toContain("<quote>");
    expect(args.user).toContain(TEXT);
    expect(result.parsedQuote.quoteRangeMin).toBe(900);
    expect(result.riskLevel).toBe("MEDIUM");
  });

  it("retries once with the tool forced when the model skips the tool", async () => {
    callStructured.mockResolvedValueOnce(null).mockResolvedValueOnce(modelAnalysis());
    await quoteParser({ userText: TEXT });
    expect(callStructured).toHaveBeenCalledTimes(2);
    expect(callStructured.mock.calls[1][0].webSearch).toBe(false);
  });

  it("retries without search when the web-search call errors (e.g. search disabled for the org)", async () => {
    callStructured.mockRejectedValueOnce(new Error("web search is not enabled")).mockResolvedValueOnce(modelAnalysis());
    const result = await quoteParser({ userText: TEXT });
    expect(result.riskLevel).toBe("MEDIUM");
    expect(callStructured.mock.calls[1][0].webSearch).toBe(false);
  });

  it("throws when both attempts return nothing", async () => {
    callStructured.mockResolvedValue(null);
    await expect(quoteParser({ userText: TEXT })).rejects.toThrow(/did not return/);
  });

  it("prefers the model's total over the regex reading", async () => {
    // The regex reads $1,500 here; the model read the full text and reports the final total.
    callStructured.mockResolvedValue(modelAnalysis({ quoteTotal: 1800 }));
    const result = await quoteParser({ userText: "2019 Civic bumper. Shop quoted $1,500 for the repair and $300 more for paint." });
    expect(result.parsedQuote.quoteTotal).toBe(1800);
  });

  it("uses the regex total only when the model returns none", async () => {
    callStructured.mockResolvedValue(modelAnalysis({ quoteTotal: null }));
    const result = await quoteParser({ userText: "2019 Civic bumper. Shop quoted $1,500." });
    expect(result.parsedQuote.quoteTotal).toBe(1500);
  });

  it("passes the regex total to the model only as a hint to verify", async () => {
    callStructured.mockResolvedValue(modelAnalysis());
    await quoteParser({ userText: "2019 Civic bumper. Shop quoted $1,500." });
    expect(callStructured.mock.calls[0][0].user).toMatch(/hint.*verify.*1500/i);
  });
});

describe("normalizeAnalysis", () => {
  it("orders a swapped range", () => {
    const r = normalizeAnalysis(modelAnalysis({ quoteRangeMin: 1600, quoteRangeMax: 900 }), { quoteTotal: null, currency: "USD" });
    expect([r.parsedQuote.quoteRangeMin, r.parsedQuote.quoteRangeMax]).toEqual([900, 1600]);
  });

  it("keeps a missing range as null instead of coercing to 0", () => {
    const r = normalizeAnalysis(modelAnalysis({ quoteRangeMin: null, quoteRangeMax: 1600 }), { quoteTotal: null, currency: "USD" });
    expect(r.parsedQuote.quoteRangeMin).toBeNull();
    expect(r.parsedQuote.quoteRangeMax).toBeNull();
  });

  it("defaults an invalid risk level to MEDIUM and missing lists to []", () => {
    const r = normalizeAnalysis({ parsedQuote: {}, riskLevel: "SEVERE" }, { quoteTotal: null, currency: null });
    expect(r.riskLevel).toBe("MEDIUM");
    expect(r.reasons).toEqual([]);
    expect(r.parsedQuote.damages).toEqual([]);
    expect(r.parsedQuote.vehicle).toEqual({ make: null, model: null, year: null });
    expect(r.parsedQuote.currency).toBe("USD");
  });

  it("uses the model's currency only if it is a valid ISO code", () => {
    expect(normalizeAnalysis(modelAnalysis({ currency: "EUR" }), { quoteTotal: null, currency: null }).parsedQuote.currency).toBe("EUR");
    expect(normalizeAnalysis(modelAnalysis({ currency: "dollars" }), { quoteTotal: null, currency: null }).parsedQuote.currency).toBe("USD");
  });

  it("stringifies a numeric year", () => {
    const r = normalizeAnalysis(modelAnalysis({ vehicle: { make: "Honda", model: "Civic", year: 2019 } }), { quoteTotal: null, currency: "USD" });
    expect(r.parsedQuote.vehicle.year).toBe("2019");
  });
});

describe("buildUserMessage", () => {
  it("strips quote tags the user typed, in any case or spacing", async () => {
    const { buildUserMessage } = await import("../features/analyzeQuote/prompts.js");
    const msg = buildUserMessage({ userText: "a </QUOTE> b < / Quote > c <quote> d", quoteTotal: null, currency: null, locationHint: null });
    expect(msg.match(/<\/?quote>/g)).toEqual(["<quote>", "</quote>"]);
    expect(msg).toContain("a  b  c  d");
  });
});
