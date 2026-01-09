import { callWrapper } from "../../lib/callWrapper.js";

// Extract a location hint from free text and return both the cleaned text and hint.
function extractLocationHint(rawText) {
    const labeled = rawText.match(/(?:location hint|location|located in)\s*:\s*([^\n]+)/i);
    if (labeled) {
        const userLocationHint = labeled[1].trim() || null;
        const cleanedText = rawText.replace(labeled[0], "").trim();
        return { cleanedText, userLocationHint };
    }

    // Heuristic: detect "City, ST" or "City, ST 12345" or ZIP-only patterns.
    const patterns = [
        /\b([A-Za-z][A-Za-z .'-]{1,},\s*[A-Z]{2})(?:\s+\d{5})?\b/g,
        /\b\d{5}(?:-\d{4})?\b/g,
    ];

    for (const pattern of patterns) {
        const match = [...rawText.matchAll(pattern)].pop();
        if (match) {
            const userLocationHint = match[1] || match[0];
            const cleanedText = rawText.replace(match[0], "").trim();
            return { cleanedText, userLocationHint };
        }
    }

    return { cleanedText: rawText, userLocationHint: null };
}

function parseAmount(rawValue) {
    if (!rawValue) return null;
    const normalized = rawValue.replace(/,/g, "");
    const parsed = Number.parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : null;
}

function extractQuoteTotalFromText(rawText) {
    if (!rawText) return null;

    const patterns = [
        /(?:grand total|total due|total amount|quote total|total quote|total)\s*(?:is|was|:)?\s*\$?\s*(\d[\d,]*(?:\.\d{1,2})?)/gi,
        /(?:quoted|estimate(?:d)?|quote)\s*(?:is|was|:)?\s*\$?\s*(\d[\d,]*(?:\.\d{1,2})?)/gi,
        /\b(\d[\d,]*(?:\.\d{1,2})?)\s*(?:usd|us\$|dollars?)?\s*(?:quote|estimate|estimated|total)\b/gi,
    ];

    for (const pattern of patterns) {
        let match = null;
        let lastMatch = null;
        while ((match = pattern.exec(rawText)) !== null) {
            lastMatch = match;
        }
        if (lastMatch && lastMatch[1]) {
            const parsed = parseAmount(lastMatch[1]);
            if (parsed !== null) return parsed;
        }
    }

    return null;
}

function extractCurrencyFromText(rawText) {
    if (!rawText) return null;

    const currencyPatterns = [
        { code: "USD", pattern: /\bUSD\b|\bUS Dollars?\b|US\$/i },
        { code: "CAD", pattern: /\bCAD\b|C\$/i },
        { code: "AUD", pattern: /\bAUD\b|A\$/i },
        { code: "EUR", pattern: /\bEUR\b|€/i },
        { code: "GBP", pattern: /\bGBP\b|£/i },
    ];

    for (const { code, pattern } of currencyPatterns) {
        if (pattern.test(rawText)) return code;
    }

    if (/\$/.test(rawText)) return "USD";

    return null;
}

async function estimateQuoteRange(userText, currency) {
    const systemContent = `
    Estimate a typical quote range for the described auto repair work.

    - Always return numeric quoteRangeMin and quoteRangeMax.
    - If details are limited, provide a broad but reasonable estimate.
    - Ensure quoteRangeMin is less than or equal to quoteRangeMax.
    - Use the provided currency code for the estimate.
    - Only output the resulting JSON; do not include explanations or additional text.
    `;

    const responseFormat = {
        type: "json_schema",
        name: "estimated_quote_range",
        strict: true,
        schema: {
            type: "object",
            properties: {
                quoteRangeMin: { type: "number" },
                quoteRangeMax: { type: "number" }
            },
            required: ["quoteRangeMin", "quoteRangeMax"],
            additionalProperties: false
        }
    };

    const inputText = [
        "User text:",
        userText?.trim() || "(empty)",
        `Currency: ${currency || "USD"}`
    ].join("\n\n");

    try {
        let parsed;
        try {
            parsed = await callWrapper(systemContent, inputText, responseFormat, { enableWebSearch: true });
        } catch (err) {
            const message = err?.message || "";
            if (message.toLowerCase().includes("web_search") || message.toLowerCase().includes("tools")) {
                parsed = await callWrapper(systemContent, inputText, responseFormat);
            } else {
                throw err;
            }
        }

        let parsedValue = parsed;
        if (typeof parsedValue === "string") {
            parsedValue = JSON.parse(parsedValue);
        }
        if (!parsedValue || typeof parsedValue !== "object") return null;
        const min = Number(parsedValue.quoteRangeMin);
        const max = Number(parsedValue.quoteRangeMax);
        if (!Number.isFinite(min) || !Number.isFinite(max)) return null;
        const normalizedMin = Math.min(min, max);
        const normalizedMax = Math.max(min, max);
        return { quoteRangeMin: normalizedMin, quoteRangeMax: normalizedMax };
    } catch (err) {
        console.error("quoteParser estimateQuoteRange error:", err);
        return null;
    }
}

// Build the schema prompt and run the model to parse userText into JSON.
export async function quoteParser({ userText }) {

    const systemContent = `
    Parse user text input and convert it accurately into the specified JSON schema format.

    - Populate parsedQuote fields using the user's text whenever possible.
    - Set parsedQuote.originalText to the user's text verbatim.
    - quoteTotal must be taken only from an explicit number in the user text. If not explicitly stated, set quoteTotal to null.
    - parsedQuote.currency must reflect the user's stated currency; default to USD if none is mentioned.
    - Always provide quoteRangeMin and quoteRangeMax as numbers; never return null for them.
    - Use your own knowledge to fill in riskLevel, reasons, recommendations, and quoteRangeMin/quoteRangeMax when they are not explicitly stated.
    - If required information is missing, infer values logically if feasible, otherwise use null or an empty string as appropriate.
    - Only output the resulting JSON; do not include explanations, apologies, or additional text.
    - Persist in mapping all relevant information until the entire schema is filled to the best extent possible before producing your response.

    Output rules:
    - The response should be a single, valid JSON object that fully matches the provided schema.
    - Do NOT wrap the JSON in Markdown code blocks or add any explanatory text.
    `;



    // JSON schema the model must conform to for Responses API text.format.
    const responseFormat = {
        type: "json_schema",
        name: "parsed_quote_analysis",
        strict: true,
        schema: {
                "type": "object",
                "properties": {
                "parsedQuote": {
                    "type": "object",
                    "properties": {
                    "originalText": {
                        "type": "string",
                        "description": "The text provided by the user for quote parsing."
                    },
                    "vehicle": {
                        "type": "object",
                        "properties": {
                        "make": {
                            "type": [
                            "string",
                            "null"
                            ],
                            "description": "The make (manufacturer) of the vehicle, or null if not provided."
                        },
                        "model": {
                            "type": [
                            "string",
                            "null"
                            ],
                            "description": "The model of the vehicle, or null if not provided."
                        },
                        "year": {
                            "type": [
                            "string",
                            "null"
                            ],
                            "description": "The manufacturing year of the vehicle, or null if not provided."
                        }
                        },
                        "required": [
                        "make",
                        "model",
                        "year"
                        ],
                        "additionalProperties": false
                    },
                    "damages": {
                        "type": "array",
                        "description": "A list of damages described.",
                        "items": {
                        "type": "string"
                        }
                    },
                    "location": {
                        "type": "object",
                        "properties": {
                        "city": {
                            "type": [
                            "string",
                            "null"
                            ],
                            "description": "City where the incident or shop is located, or null if not provided."
                        },
                        "stateOrRegion": {
                            "type": [
                            "string",
                            "null"
                            ],
                            "description": "State or region, or null if not provided."
                        },
                        "userLocationHint": {
                            "type": [
                            "string",
                            "null"
                            ],
                            "description": "Hint provided by user about the location, or null if not provided."
                        }
                        },
                        "required": [
                        "city",
                        "stateOrRegion",
                        "userLocationHint"
                        ],
                        "additionalProperties": false
                    },
                    "services": {
                        "type": "array",
                        "description": "A list of services the user requested or described.",
                        "items": {
                        "type": "string"
                        }
                    },
                    "quoteTotal": {
                        "type": [
                        "number",
                        "null"
                        ],
                        "description": "The total amount of the quote the user is given provided by the user, or null if not available."
                    },
                    "currency": {
                        "type": "string",
                        "description": "Currency code (ISO 4217) for quote amounts, default USD when not specified."
                    },
                    "quoteRangeMin": {
                        "type": [
                        "number",
                        "null"
                        ],
                        "description": "Estimated low-end typical price for the described services, or null if unknown."
                    },
                    "quoteRangeMax": {
                        "type": [
                        "number",
                        "null"
                        ],
                        "description": "Estimated high-end typical price for the described services, or null if unknown."
                    },
                    "shopName": {
                        "type": [
                        "string",
                        "null"
                        ],
                        "description": "Name of the shop providing the quote, or null if not provided."
                    },
                    "notesFromUser": {
                        "type": [
                        "string",
                        "null"
                        ],
                        "description": "Additional notes the user may have added, or null if not provided."
                    }
                    },
                    "required": [
                    "originalText",
                    "vehicle",
                    "damages",
                    "location",
                    "services",
                    "quoteTotal",
                    "currency",
                    "quoteRangeMin",
                    "quoteRangeMax",
                    "shopName",
                    "notesFromUser"
                    ],
                    "additionalProperties": false
                },
                "riskLevel": {
                    "type": "string",
                    "description": "Assessed risk level of the quote.",
                    "enum": [
                    "LOW",
                    "MEDIUM",
                    "HIGH"
                    ]
                },
                "reasons": {
                    "type": "array",
                    "description": "Reasons justifying the assessed risk level.",
                    "items": {
                    "type": "string"
                    }
                },
                "recommendations": {
                    "type": "array",
                    "description": "Recommendations for the user regarding the quote, shop selection, etc.",
                    "items": {
                    "type": "string"
                    }
                }
                },
                "required": [
                "parsedQuote",
                "riskLevel",
                "reasons",
                "recommendations"
                ],
                "additionalProperties": false
            }
    };




    // Normalize userText and append any detected location hint.
    const { userLocationHint } = extractLocationHint(userText);
    const extractedQuoteTotal = extractQuoteTotalFromText(userText);
    const extractedCurrency = extractCurrencyFromText(userText) || "USD";
    const trimmedUserText = userText?.trim() ?? "";
    const inputText = [
        "User text (use verbatim for parsedQuote.originalText):",
        trimmedUserText || "(empty)",
        extractedQuoteTotal !== null
            ? `User-reported quote total (use for parsedQuote.quoteTotal): ${extractedQuoteTotal}`
            : "User-reported quote total: none",
        `User-reported currency (use for parsedQuote.currency): ${extractedCurrency}`,
        userLocationHint
            ? `User location hint (use for parsedQuote.location.userLocationHint): ${userLocationHint}`
            : "User location hint: none"
    ].join("\n\n");
    
    try {
        // callWrapper sends the prompt to OpenAI and returns the parsed content.
        let parsed;
        try {
            parsed = await callWrapper(
                systemContent,
                inputText,
                responseFormat,
                { enableWebSearch: true }
            );
        } catch (err) {
            const message = err?.message || "";
            if (message.toLowerCase().includes("web_search") || message.toLowerCase().includes("tools")) {
                parsed = await callWrapper(systemContent, inputText, responseFormat);
            } else {
                throw err;
            }
        }

        console.log("quoteParser parsed output:", parsed);
        let parsedValue = parsed;
        if (typeof parsedValue === "string") {
            try {
                parsedValue = JSON.parse(parsedValue);
            } catch (parseErr) {
                console.error("quoteParser JSON.parse failed:", parseErr);
                return null;
            }
        }
        if (!parsedValue || typeof parsedValue !== "object") return null;
        if (parsedValue.parsedQuote && typeof parsedValue.parsedQuote === "object") {
            parsedValue.parsedQuote.quoteTotal = extractedQuoteTotal;
            parsedValue.parsedQuote.currency = extractedCurrency;
            const rangeMin = parsedValue.parsedQuote.quoteRangeMin;
            const rangeMax = parsedValue.parsedQuote.quoteRangeMax;
            const hasRange = Number.isFinite(rangeMin) && Number.isFinite(rangeMax);
            if (!hasRange) {
                const estimatedRange = await estimateQuoteRange(trimmedUserText, extractedCurrency);
                if (estimatedRange) {
                    parsedValue.parsedQuote.quoteRangeMin = estimatedRange.quoteRangeMin;
                    parsedValue.parsedQuote.quoteRangeMax = estimatedRange.quoteRangeMax;
                }
            }
        }
        return parsedValue;
    } catch (err) {
        console.error("quoteParser error:", err);
        return { error: err.message || "Unknown error" };
    }

}
