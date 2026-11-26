import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const { quoteParser } = vi.hoisted(() => ({ quoteParser: vi.fn() }));
vi.mock("../features/analyzeQuote/quoteParser.js", () => ({ quoteParser }));

import { createApp } from "../createApp.js";
import { resetDailyCap } from "../lib/dailyCap.js";

const ORIGIN = "http://localhost:3001";
const VALID = "2019 Honda Civic front bumper crack, San Diego, CA. Quoted $1,800.";
const makeApp = (opts = {}) => createApp({ allowedOrigins: [ORIGIN], logRequests: false, ...opts });

beforeEach(() => {
  quoteParser.mockReset();
  resetDailyCap();
  delete process.env.DAILY_REQUEST_CAP;
});

describe("POST /api/analyzeQuote", () => {
  it("returns the analysis on success", async () => {
    quoteParser.mockResolvedValue({ riskLevel: "LOW" });
    const res = await request(makeApp()).post("/api/analyzeQuote").send({ userText: VALID });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ success: true, parsed: { riskLevel: "LOW" } });
    expect(quoteParser).toHaveBeenCalledWith({ userText: VALID });
  });

  it("rejects a missing userText", async () => {
    const res = await request(makeApp()).post("/api/analyzeQuote").send({});
    expect(res.status).toBe(400);
    expect(quoteParser).not.toHaveBeenCalled();
  });

  it("rejects input that is too short once control characters are stripped", async () => {
    const res = await request(makeApp()).post("/api/analyzeQuote").send({ userText: "\u0000\u0001abc\u0002\u0003\u0004\u0005\u0006" });
    expect(res.status).toBe(400);
  });

  it("rejects input over 4000 characters", async () => {
    const res = await request(makeApp()).post("/api/analyzeQuote").send({ userText: "a".repeat(4001) });
    expect(res.status).toBe(400);
  });

  it("strips control characters before calling the parser", async () => {
    quoteParser.mockResolvedValue({ riskLevel: "LOW" });
    await request(makeApp()).post("/api/analyzeQuote").send({ userText: "2019 Civic\u0000 bumper $900" });
    expect(quoteParser).toHaveBeenCalledWith({ userText: "2019 Civic bumper $900" });
  });

  it("returns a generic 502 without leaking upstream error details", async () => {
    quoteParser.mockRejectedValue(new Error("401 invalid x-api-key sk-ant-secret"));
    const res = await request(makeApp()).post("/api/analyzeQuote").send({ userText: VALID });
    expect(res.status).toBe(502);
    expect(res.body.success).toBe(false);
    expect(JSON.stringify(res.body)).not.toMatch(/api-key|sk-ant|401/);
  });

  it("returns 400, not 500, for malformed JSON", async () => {
    const res = await request(makeApp())
      .post("/api/analyzeQuote")
      .set("Content-Type", "application/json")
      .send('{"userText":');
    expect(res.status).toBe(400);
  });

  it("returns 400 when the body is not JSON", async () => {
    const res = await request(makeApp())
      .post("/api/analyzeQuote")
      .set("Content-Type", "text/plain")
      .send("hello there friend");
    expect(res.status).toBe(400);
  });
});

describe("security middleware", () => {
  it("blocks disallowed browser origins before doing any work", async () => {
    const res = await request(makeApp())
      .post("/api/analyzeQuote")
      .set("Origin", "https://evil.example")
      .send({ userText: VALID });
    expect(res.status).toBe(403);
    expect(quoteParser).not.toHaveBeenCalled();
  });

  it("sets CORS headers for the configured origin, without credentials", async () => {
    const res = await request(makeApp()).get("/health").set("Origin", ORIGIN);
    expect(res.status).toBe(200);
    expect(res.headers["access-control-allow-origin"]).toBe(ORIGIN);
    expect(res.headers["access-control-allow-credentials"]).toBeUndefined();
  });

  it("answers CORS preflight for the configured origin", async () => {
    const res = await request(makeApp())
      .options("/api/analyzeQuote")
      .set("Origin", ORIGIN)
      .set("Access-Control-Request-Method", "POST");
    expect(res.status).toBe(204);
  });

  it("allows requests with no Origin header (curl, health checks)", async () => {
    const res = await request(makeApp()).get("/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });

  it("rate limits /api after the configured number of requests", async () => {
    const app = makeApp({ rateLimitMax: 2 });
    await request(app).post("/api/analyzeQuote").send({});
    await request(app).post("/api/analyzeQuote").send({});
    const res = await request(app).post("/api/analyzeQuote").send({});
    expect(res.status).toBe(429);
    expect(res.body.error).toMatch(/too many requests/i);
  });

  it("does not rate limit /health", async () => {
    const app = makeApp({ rateLimitMax: 1 });
    for (let i = 0; i < 3; i++) {
      expect((await request(app).get("/health")).status).toBe(200);
    }
  });

  it("trusts exactly one proxy hop so the limiter sees real client IPs on Render", () => {
    expect(makeApp().get("trust proxy")).toBe(1);
  });

  it("no longer exposes /api/chat", async () => {
    const res = await request(makeApp()).post("/api/chat").send({ messages: [] });
    expect(res.status).toBe(404);
  });
});

describe("hardening", () => {
  it("accepts an ALLOWED_ORIGINS entry with a trailing slash", async () => {
    quoteParser.mockResolvedValue({ riskLevel: "LOW" });
    const app = createApp({ allowedOrigins: [`${ORIGIN}/`], logRequests: false });
    const res = await request(app).post("/api/analyzeQuote").set("Origin", ORIGIN).send({ userText: VALID });
    expect(res.status).toBe(200);
  });

  it("accepts 4000 CJK characters (more than 10 KB of JSON)", async () => {
    quoteParser.mockResolvedValue({ riskLevel: "LOW" });
    const res = await request(makeApp()).post("/api/analyzeQuote").send({ userText: "修".repeat(4000) });
    expect(res.status).toBe(200);
  });

  it("says the quote is too long when the body exceeds the size limit", async () => {
    const res = await request(makeApp())
      .post("/api/analyzeQuote")
      .set("Content-Type", "application/json")
      .send(JSON.stringify({ userText: "a".repeat(40_000) }));
    expect(res.status).toBe(413);
    expect(res.body.error).toBe("Quote is too long.");
  });

  it("stops analyzing once the daily cap is used, without calling the model", async () => {
    process.env.DAILY_REQUEST_CAP = "2";
    quoteParser.mockResolvedValue({ riskLevel: "LOW" });
    const app = makeApp({ rateLimitMax: 100 });
    for (let i = 0; i < 2; i++) {
      expect((await request(app).post("/api/analyzeQuote").send({ userText: VALID })).status).toBe(200);
    }
    const res = await request(app).post("/api/analyzeQuote").send({ userText: VALID });
    expect(res.status).toBe(429);
    expect(res.body.error).toMatch(/daily limit/);
    expect(quoteParser).toHaveBeenCalledTimes(2);
  });

  it("does not count invalid requests against the daily cap", async () => {
    process.env.DAILY_REQUEST_CAP = "1";
    quoteParser.mockResolvedValue({ riskLevel: "LOW" });
    const app = makeApp({ rateLimitMax: 100 });
    await request(app).post("/api/analyzeQuote").send({ userText: "short" });
    expect((await request(app).post("/api/analyzeQuote").send({ userText: VALID })).status).toBe(200);
  });
});
