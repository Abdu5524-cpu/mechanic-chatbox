import { analyzeQuoteService } from "./analyzeQuoteService.js";



async function analyzeQuoteController(req, res, next) {
  try {
    // extract input
    const { userText } = req.body;

    // Validate the incoming request body.
    console.log("analyzeQuote request body:", req.body);
    if (!userText || typeof userText !== "string") {
  return res.status(400).json({
    success: false,
    error: "userText is required and must be a string"
  });
}
  // Call the analyze-quote service and return its result.
    const result = await analyzeQuoteService({ userText });

    if (!result || !result.success) {
      return res.status(502).json(result || {
        success: false,
        stage: "analyzeQuoteService",
        error: "service failed to analyze quote"
      });
    }

    res.json(result);
  } catch (err) {
    next(err);
  }
    
}

export default analyzeQuoteController;



// src/features/analyzeQuote/types.ts
/*
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";

export interface VehicleInfo {
  make: string | null;
  model: string | null;
  year: number | null;
}

export interface DamageInfo {
  panel: string | null;              // "rear bumper"
  type: "dent" | "scratch" | "crack" | "paint" | "other";
  severity: "MINOR" | "MODERATE" | "SEVERE" | "UNKNOWN";
}

export interface ServiceItem {
  description: string;
  category: "BODYWORK" | "PAINT" | "MECHANICAL" | "OTHER";
  estimatedHours: number | null;
  linePrice: number | null;
}

export interface ParsedQuote {
  originalText: string;
  vehicle: VehicleInfo;
  location: {
    city: string | null;
    stateOrRegion: string | null;
    country: string | null;
  };
  currency: string | null;           // "USD"
  services: ServiceItem[];
  quoteTotal: number | null;
  notesFromUser: string | null;
}

export interface AnalyzeQuoteResult {
  parsedQuote: ParsedQuote;
  riskLevel: RiskLevel;
  reasons: string[];
  recommendations: string[];
}
*/
