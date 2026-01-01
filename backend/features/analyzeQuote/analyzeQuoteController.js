import OpenAI from "openai";
const { analyzeQuote } = require("./analyzeQuoteService");



async function analyzeQuoteController(req, res, next) {
  try {
    
    const { input } = req.body;

    const result = await analyzeQuote(input);

    res.json(result);
  } catch (err) {
    next(err);
  }
    // 3) do work
    // 4) respond
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