const nullableString = description => ({ type: ["string", "null"], description });
const nullableNumber = description => ({ type: ["number", "null"], description });
const stringList = description => ({ type: "array", items: { type: "string" }, description });

// Claude "answers" by calling this tool; input_schema is the response contract.
export const SUBMIT_ANALYSIS_TOOL = {
  name: "submit_quote_analysis",
  description: "Submit the structured analysis of the user's repair quote. Call exactly once, as your final action.",
  input_schema: {
    type: "object",
    properties: {
      parsedQuote: {
        type: "object",
        properties: {
          vehicle: {
            type: "object",
            properties: {
              make: nullableString("Manufacturer, e.g. Honda"),
              model: nullableString("Model, e.g. Civic"),
              year: nullableString("Model year, e.g. 2019"),
            },
            required: ["make", "model", "year"],
          },
          damages: stringList("Damage or symptoms described"),
          location: {
            type: "object",
            properties: {
              city: nullableString("City of the shop or user"),
              stateOrRegion: nullableString("State, province, or region"),
            },
            required: ["city", "stateOrRegion"],
          },
          services: stringList("Services or repairs quoted"),
          quoteTotal: nullableNumber("Total the user was quoted, only if explicitly stated"),
          currency: { type: "string", description: "ISO 4217 code, e.g. USD" },
          quoteRangeMin: nullableNumber("Low end of the typical total price for this repair"),
          quoteRangeMax: nullableNumber("High end of the typical total price for this repair"),
          shopName: nullableString("Shop name if stated"),
          notesFromUser: nullableString("Other relevant context from the user"),
        },
        required: [
          "vehicle", "damages", "location", "services", "quoteTotal", "currency",
          "quoteRangeMin", "quoteRangeMax", "shopName", "notesFromUser",
        ],
      },
      riskLevel: { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] },
      reasons: stringList("Why this risk level was chosen"),
      recommendations: stringList("Concrete next steps for the user"),
    },
    required: ["parsedQuote", "riskLevel", "reasons", "recommendations"],
  },
};
