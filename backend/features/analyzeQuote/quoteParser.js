import { callStructured } from "../../lib/claudeClient.js";
import { SYSTEM_PROMPT, buildUserMessage } from "./prompts.js";
import { extractCurrency, extractLocationHint, extractQuoteTotal } from "./quoteExtractors.js";
import { SUBMIT_ANALYSIS_TOOL } from "./schema.js";

const RISK_LEVELS = ["LOW", "MEDIUM", "HIGH"];
const num = v => (typeof v === "number" && Number.isFinite(v) ? v : null);
const strings = v => (Array.isArray(v) ? v.filter(s => typeof s === "string") : []);
const isoCurrency = v => (typeof v === "string" && /^[A-Z]{3}$/.test(v) ? v : null);

export async function quoteParser({ userText }) {
  const quoteTotal = extractQuoteTotal(userText);
  const currency = extractCurrency(userText);
  const request = {
    system: SYSTEM_PROMPT,
    user: buildUserMessage({ userText, quoteTotal, currency, locationHint: extractLocationHint(userText) }),
    tool: SUBMIT_ANALYSIS_TOOL,
  };

  // The first pass researches local prices with web search. If search is unavailable, or the model
  // finishes without calling the tool, retry once with the tool forced and no search.
  let analysis = null;
  try {
    analysis = await callStructured({ ...request, webSearch: true });
  } catch (err) {
    console.warn("[quoteParser] web-search pass failed, retrying without search:", err.message);
  }
  if (!analysis) analysis = await callStructured({ ...request, webSearch: false });
  if (!analysis?.parsedQuote) throw new Error("Model did not return a quote analysis");

  return normalizeAnalysis(analysis, { quoteTotal, currency });
}

// Coerce model output into the exact shape the frontend expects. Totals and currency stated in
// the text win over the model's reading.
export function normalizeAnalysis(analysis, { quoteTotal, currency }) {
  const q = analysis.parsedQuote ?? {};
  const min = num(q.quoteRangeMin);
  const max = num(q.quoteRangeMax);
  const hasRange = min !== null && max !== null;
  const year = q.vehicle?.year;

  return {
    parsedQuote: {
      vehicle: {
        make: q.vehicle?.make ?? null,
        model: q.vehicle?.model ?? null,
        year: year === null || year === undefined ? null : String(year),
      },
      damages: strings(q.damages),
      location: { city: q.location?.city ?? null, stateOrRegion: q.location?.stateOrRegion ?? null },
      services: strings(q.services),
      quoteTotal: quoteTotal ?? num(q.quoteTotal),
      currency: currency ?? isoCurrency(q.currency) ?? "USD",
      quoteRangeMin: hasRange ? Math.min(min, max) : null,
      quoteRangeMax: hasRange ? Math.max(min, max) : null,
      shopName: q.shopName ?? null,
      notesFromUser: q.notesFromUser ?? null,
    },
    riskLevel: RISK_LEVELS.includes(analysis.riskLevel) ? analysis.riskLevel : "MEDIUM",
    reasons: strings(analysis.reasons),
    recommendations: strings(analysis.recommendations),
  };
}
