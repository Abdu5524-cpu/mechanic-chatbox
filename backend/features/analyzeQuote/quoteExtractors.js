// Deterministic extraction for facts that are stated verbatim in the user's text.
// They run before the model call: the total is only a hint/fallback, the currency takes precedence.

// The lookaheads reject numbers that continue in another format ("1.200,00") and numbers
// followed by a unit ("4 tires", "3 days"): those are counts or European formatting, not totals.
const UNIT_WORDS = String.raw`(?:tires?|tyres?|hours?|hrs?|days?|weeks?|months?|miles?|mi|km|years?|yrs?|parts?|x|%)\b`;
const AMOUNT = String.raw`(\$|US\$|€|£)?\s*(\d[\d,]*(?:\.\d{1,2})?)(?![\d.,]?\d)(?!\s*` + UNIT_WORDS + `)`;
const TOTAL_PATTERNS = [
  new RegExp(String.raw`(?:grand total|total due|total amount|quote total|total quote|total)\s*(?:is|was|of|to|:)?\s*` + AMOUNT, "gi"),
  new RegExp(String.raw`(?:quoted|quote|estimated|estimate|charged|charge|price)\s*(?:is|was|at|of|me|for|:)?\s*` + AMOUNT, "gi"),
];

// A bare 4-digit number in a plausible model-year range is almost always the vehicle year, not the price.
function toAmount(symbol, rawDigits) {
  const digits = rawDigits.replace(/,+$/, "");
  const value = Number.parseFloat(digits.replace(/,/g, ""));
  if (!Number.isFinite(value)) return null;
  const looksLikeYear = !symbol && /^\d{4}$/.test(digits) && value >= 1950 && value <= 2040;
  return looksLikeYear ? null : value;
}

export function extractQuoteTotal(text) {
  for (const pattern of TOTAL_PATTERNS) {
    const amounts = [...text.matchAll(pattern)]
      .map(match => toAmount(match[1], match[2]))
      .filter(value => value !== null);
    if (amounts.length) return amounts.at(-1);
  }
  return null;
}

const CURRENCY_PATTERNS = [
  { code: "USD", pattern: /\bUSD\b|\bUS Dollars?\b|US\$/i },
  { code: "CAD", pattern: /\bCAD\b|C\$/i },
  { code: "AUD", pattern: /\bAUD\b|A\$/i },
  { code: "EUR", pattern: /\bEUR\b|€/i },
  { code: "GBP", pattern: /\bGBP\b|£/i },
];

export function extractCurrency(text) {
  for (const { code, pattern } of CURRENCY_PATTERNS) {
    if (pattern.test(text)) return code;
  }
  return /\$/.test(text) ? "USD" : null;
}

export function extractLocationHint(text) {
  const labeled = text.match(/(?:location hint|location|located in)\s*:\s*([^\n]+)/i);
  if (labeled) return labeled[1].trim() || null;

  // Up to three capitalized words followed by ", ST" (e.g. "San Diego, CA", "St. Louis, MO").
  const cityState = [...text.matchAll(/\b((?:[A-Z][a-zA-Z.'-]*\s){0,2}[A-Z][a-zA-Z.'-]*,\s*[A-Z]{2})\b/g)].pop();
  if (cityState) return cityState[1].trim();

  const zip = [...text.matchAll(/\b\d{5}(?:-\d{4})?\b/g)].pop();
  return zip ? zip[0] : null;
}
