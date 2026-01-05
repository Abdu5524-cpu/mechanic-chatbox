import { callWrapper } from "../../lib/callWrapper.js";

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

export async function quoteParser({ userText }) {

    const systemContent = `
    Parse user text input and convert it accurately into your specified JSON schema format.

    - Carefully analyze the user's text input, extracting the relevant information required by your JSON schema.
    - Ensure every field or value required by the schema is populated using information from the user input whenever possible. If required information is missing, infer values logically if feasible, otherwise use null or an empty string as appropriate.
    - Only output the resulting JSON; do not include explanations, apologies, or additional text.
    - Persist in mapping all relevant information until the entire schema is filled to the best extent possible before producing your response.

    Output rules:
    - The response should be a single, valid JSON object that fully matches the provided schema.
    - Do NOT wrap the JSON in Markdown code blocks or add any explanatory text.
    `;



    const responseFormat = {
        type: "json_schema",
        json_schema: {
            "name": "parsed_quote_analysis",
            "strict": true,
            "schema": {
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
                        "description": "The total amount of the quote, or null if not available."
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
        }
    };




    const { cleanedText, userLocationHint } = extractLocationHint(userText);
    const inputText = cleanedText + (userLocationHint ? `\n\nUser location hint: ${userLocationHint}` : "");
    
    try {
        const parsed = await callWrapper(
            systemContent,
            inputText,
            responseFormat
        );

        if (!parsed || typeof parsed !== "json_object") return null;
        return parsed;
    } catch (err) {
        return {error: err.message};
    }

}
