import test from "node:test";
import assert from "node:assert/strict";
import {
  buildCategories, categorizeTransaction, buildCategorizePrompt, getMileageRate, mileageDeduction,
  selfEmploymentTax, estimatedTaxSchedule, ttocName, INDUSTRIES
} from "../src/index.js";

test("every industry builds a chart of accounts with valid Schedule C lines", () => {
  for (const id of Object.keys(INDUSTRIES)) {
    const cats = buildCategories(id);
    assert.ok(cats.some(c => c.type === "income" && c.line === "1"), id);
    for (const c of cats) if (c.line) assert.ok(c.lineLabel, `${id}: ${c.name} line ${c.line}`);
  }
});

test("vendor rules sort purchases and deposits", () => {
  const hd = categorizeTransaction({ description: "HOME DEPOT #0642 SACRAMENTO CA", amount: -148.92, industry: "trades" });
  assert.equal(hd.category, "Job materials");
  assert.equal(hd.scheduleCLine, "4");
  assert.equal(hd.confidence, "rule_match");

  const uber = categorizeTransaction({ description: "UBER TRIP PAYOUT", amount: 220, industry: "transport" });
  assert.equal(uber.category, "Rideshare income");

  const usps = categorizeTransaction({ description: "USPS PO 0512", amount: -14 });
  assert.equal(usps.category, "Postage & shipping");
  assert.equal(usps.scheduleCLine, "18");
});

test("deposit-only rules ignore money going out", () => {
  const r = categorizeTransaction({ description: "UBER EATS ORDER", amount: -23.5, industry: "food" });
  assert.notEqual(r.category, "Delivery app sales");
});

test("unknown vendors need review", () => {
  const r = categorizeTransaction({ description: "POS PURCHASE TARGET 2391", amount: -38.17 });
  assert.equal(r.category, "Uncategorized");
  assert.equal(r.confidence, "needs_review");
});

test("AI prompt lists only real categories", () => {
  const p = buildCategorizePrompt([{ date: "2026-03-01", description: "TARGET", amount: -38.17 }], "beauty");
  assert.match(p, /Beauty supplies/);
  assert.match(p, /TARGET \| -38\.17/);
});

test("mileage rate follows the date of each trip", () => {
  assert.equal(getMileageRate("2025-12-31"), 0.70);
  assert.equal(getMileageRate("2026-01-01"), 0.725);
  assert.equal(getMileageRate("2026-07-01"), 0.76);
  assert.deepEqual(mileageDeduction([{ date: "2026-03-01", miles: 100 }, { date: "2026-08-01", miles: 100 }]), { miles: 200, deduction: 148.5 });
});

test("self-employment tax respects the Social Security wage base", () => {
  const a = selfEmploymentTax(50000);
  assert.equal(a.total, 7064.78);
  const b = selfEmploymentTax(50000, { w2Wages: 184500 });
  assert.equal(b.socialSecurity, 0);
  assert.equal(b.total, b.medicare);
});

test("California estimated tax split is 30/40/0/30", () => {
  const s = estimatedTaxSchedule(2026);
  assert.deepEqual(s.state.map(q => q.share), [0.30, 0.40, 0, 0.30]);
  assert.equal(s.federal[3].due, "2027-01-15");
  assert.equal(estimatedTaxSchedule(2027).federal[2].due, "2027-09-15");
});

test("TTOC names", () => {
  assert.equal(ttocName("603"), "Barbers, hairdressers, hairstylists, cosmetologists");
  assert.equal(ttocName("999"), null);
});
