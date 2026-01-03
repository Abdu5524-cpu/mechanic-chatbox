import { callWrapper } from "../../lib/callWrapper.js";


export async function quoteParser({ userText, userLocationHint = null }) {

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




    const parsed = await callWrapper(
        systemContent,
        userText + (userLocationHint ? `\n\nUser location hint: ${userLocationHint}` : ""),
        responseFormat
    );


    if (!parsed || typeof parsed !== "object") {
        return null;
    } else {
        return parsed;
    }
    

}