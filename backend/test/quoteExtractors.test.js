import { describe, it, expect } from "vitest";
import {
  extractCurrency,
  extractLocationHint,
  extractQuoteTotal,
} from "../features/analyzeQuote/quoteExtractors.js";

describe("extractQuoteTotal", () => {
  it.each([
    ["Shop quoted $1,800.", 1800],
    ["Total: $2,450.50", 2450.5],
    ["2019 Honda Civic, quoted 950", 950],
    ["Estimate $400, then they revised the total to $650", 650],
    ["quoted 1,995 for brakes", 1995],
    ["Total €500", 500],
  ])("reads %j as %d", (text, expected) => {
    expect(extractQuoteTotal(text)).toBe(expected);
  });

  it.each([
    "Quote for 2019 Honda Civic bumper",
    "Quote for 2019, Honda Civic bumper",
    "they quoted 2000 for the job", // ambiguous without a currency symbol: leave it to the model
    "no numbers here at all",
    "Price for 4 tires installed is $600", // counts are not prices
    "The shop quoted 3 days and $1,200", // durations are not prices
    "total: 1.200,00 EUR", // European formatting: don't guess, leave it to the model
  ])("returns null for %j", text => {
    expect(extractQuoteTotal(text)).toBeNull();
  });
});

describe("extractCurrency", () => {
  it.each([
    ["€500 for brakes", "EUR"],
    ["£300", "GBP"],
    ["CAD 400", "CAD"],
    ["C$400", "CAD"],
    ["$500", "USD"],
    ["500 USD", "USD"],
  ])("detects %j as %s", (text, code) => {
    expect(extractCurrency(text)).toBe(code);
  });

  it("returns null when no currency is mentioned", () => {
    expect(extractCurrency("quoted 500")).toBeNull();
  });
});

describe("extractLocationHint", () => {
  it("prefers an explicit Location: label", () => {
    expect(extractLocationHint("Location: Austin, TX\n2015 F-150 brakes")).toBe("Austin, TX");
  });

  it("finds a City, ST pair without swallowing the preceding sentence", () => {
    expect(extractLocationHint("2019 Honda Civic, front bumper crack. San Diego, CA. Quoted $1,800.")).toBe("San Diego, CA");
  });

  it("handles abbreviations like St. Louis", () => {
    expect(extractLocationHint("Brakes done in St. Louis, MO last week")).toBe("St. Louis, MO");
  });

  it("falls back to a ZIP code", () => {
    expect(extractLocationHint("brake job near 78701, quoted $600")).toBe("78701");
  });

  it("returns null when there is no location", () => {
    expect(extractLocationHint("front bumper crack, quoted $900")).toBeNull();
  });
});
