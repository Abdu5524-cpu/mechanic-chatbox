import { quoteParser } from "./quoteParser.js";


export async function analyzeQuoteService(input) {

    // extract input
    const { userText, userLocationHint = null } = input;

    const parsed = await quoteParser({ userText, userLocationHint});
    
    if (parsed === null || parsed === undefined) {
        return {
            success: false,
            error: "parser failed to extract quote information"
        };
    } else {
        return {
        success: true,
        parsed
        };
    }
}

/**
 * Analyzes a mechanic quote described in free text.
 *
 * @param {object} input
 * @param {string} input.userText - The raw text the user typed or pasted;
 * @param {string} [input.userLocationHint] - Optional location string like "Brooklyn, NY"'
 *
 * @returns {Promise<object>} result
 * @returns {object} result.parsedQuote - Structured version of the quote.
 * @returns {string} result.riskLevel - "LOW", "MEDIUM", or "HIGH"
 * @returns {string[]} result.reasons - List of reasons for the risk level.
 * @returns {string[]} result.recommendations - List of recommendations to the user.
*/

/*const parsedQuote = {
        originalText: userText,
        vehicle: {
            make: null,
            model: null,
            year: null
        },
        damages: [],
        location: {
            city: null,
            stateOrRegion: null,
            country: null,
            userLocationHint
        },
        services: [],
        quoteTotal: null,
        shopName: null,
        notesFromUser: null
    };


    const riskLevel = "MEDIUM"; 
    const reasons = [
        "This is a placeholder analysis. Real quote parsing and risk logic not yet implemented."
    ];
    const recommendations = [
        "Get quotes from multiple shops to compare prices.",
        "Check reviews of the repair shops before choosing one."
    ];*/ 