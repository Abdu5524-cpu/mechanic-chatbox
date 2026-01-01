/**
 * Analyzes a mechanic quote described in free text.
 *
 * @param {Object} input
 * @param {string} input.userText - The raw text the user typed or pasted;
 * @param {string} [input.userLocationHint] - Optional location string like "Brooklyn, NY"'
 *
 * @returns {Promise<Object>} result
 * @returns {Object} result.parsedQuote - Structured version of the quote.
 * @returns {String} result.riskLevel - "LOW", "MEDIUM", or "HIGH"
 * @returns {String[]} result.reasons - List of reasons for the risk level.
 * @returns {String[]} result.recommendations - List of recommendations to the user.
*/

async function analyzeQuote(input) {
    // implement me
    const { userText, userLocationHint = null } = input;


    const parsedQuote = {
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
    ];

    return {
        parsedQuote,
        riskLevel,
        reasons,
        recommendations
    };

}

module.exports = {
    analyzeQuote
};