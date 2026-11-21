import { SCHEDULE_C_LINES, BASE_CATEGORIES, INDUSTRIES, IRS_MILEAGE_RATES, DEFAULT_RULES, TTOC_CODES } from "./data.js";

export { SCHEDULE_C_LINES, BASE_CATEGORIES, INDUSTRIES, IRS_MILEAGE_RATES, DEFAULT_RULES, TTOC_CODES };

/** 2026 Social Security wage base (SSA). */
export const SS_WAGE_BASE_2026 = 184500;

const UNCATEGORIZED = "Uncategorized";
const asList = v => (v == null ? [] : Array.isArray(v) ? v : [v]);

/**
 * Chart of accounts for one or more industries.
 * Returns [{ name, type, line, lineLabel }], income first, then expenses, equity, transfers.
 */
export function buildCategories(industries = []) {
  const packs = asList(industries).map(id => {
    const p = INDUSTRIES[id];
    if (!p) throw new Error(`Unknown industry "${id}". Try one of: ${Object.keys(INDUSTRIES).join(", ")}`);
    return p;
  });
  const base = new Set(BASE_CATEGORIES.map(c => c[0]));
  const income = [], extra = [];
  for (const p of packs) {
    for (const n of p.inc) if (!base.has(n) && !income.includes(n)) income.push(n);
    for (const [n, line] of p.exp) if (!base.has(n) && !extra.some(e => e[0] === n)) extra.push([n, "expense", line]);
  }
  if (!income.length) income.push("Gross receipts");
  const rows = [...income.map(n => [n, "income", "1"]), ...BASE_CATEGORIES.filter(c => c[1] === "income"), ...extra, ...BASE_CATEGORIES.filter(c => c[1] !== "income")];
  return rows.map(([name, type, line]) => ({ name, type, line, lineLabel: line ? SCHEDULE_C_LINES[line] : null }));
}

/** Vendor rules for the given industries, industry rules first, then the defaults. */
export function rulesFor(industries = []) {
  const out = [];
  for (const id of asList(industries)) for (const r of (INDUSTRIES[id] || { rules: [] }).rules) out.push(r);
  return [...out, ...DEFAULT_RULES];
}

function parseRule(line) {
  const m = String(line).match(/^(.+?)\s*(\+?)=>\s*(.+)$/);
  if (!m) return null;
  return { keyword: m[1].trim().toUpperCase(), depositsOnly: m[2] === "+", category: m[3].trim() };
}

/**
 * Sort one bank transaction into a Schedule C category with keyword rules.
 * amount: positive = money in, negative = money out.
 * Returns { category, type, scheduleCLine, lineLabel, confidence: "rule_match" | "needs_review", rule }.
 */
export function categorizeTransaction({ description = "", amount = 0, industry = [], rules } = {}) {
  const cats = buildCategories(industry);
  const byName = Object.fromEntries(cats.map(c => [c.name, c]));
  const text = String(description).toUpperCase();
  for (const raw of rules || rulesFor(industry)) {
    const r = parseRule(raw);
    if (!r || !r.keyword || !byName[r.category]) continue;
    if (r.depositsOnly && !(amount > 0)) continue;
    if (text.includes(r.keyword)) {
      const c = byName[r.category];
      return { category: c.name, type: c.type, scheduleCLine: c.line, lineLabel: c.lineLabel, confidence: "rule_match", rule: raw };
    }
  }
  return { category: UNCATEGORIZED, type: "none", scheduleCLine: null, lineLabel: null, confidence: "needs_review", rule: null };
}

/**
 * Prompt for an AI model to sort the transactions the rules couldn't.
 * Send it to any chat model; it should answer with a JSON array of category names.
 */
export function buildCategorizePrompt(transactions, industry = []) {
  const names = buildCategories(industry).filter(c => c.type !== "none").map(c => c.name);
  const list = transactions.map((t, i) => `${i + 1}. ${t.date || ""} | ${t.description} | ${Number(t.amount).toFixed(2)}`).join("\n");
  return `You sort small-business bank transactions into Schedule C categories.
Positive amounts are money in; negative amounts are money out.
Use only these categories: ${JSON.stringify(names)}.
If you can't tell, use "${UNCATEGORIZED}".
Reply with only a JSON array of category names, one per transaction, in order.

Transactions:
${list}`;
}

/** IRS standard mileage rate in force on a date (YYYY-MM-DD), in dollars per mile. */
export function getMileageRate(date) {
  const d = String(date).slice(0, 10);
  if (d < IRS_MILEAGE_RATES[0][0]) throw new Error(`No rate on file before ${IRS_MILEAGE_RATES[0][0]}`);
  let rate = IRS_MILEAGE_RATES[0][1];
  for (const [from, r] of IRS_MILEAGE_RATES) if (d >= from) rate = r;
  return rate;
}

/** Mileage deduction for a list of trips [{ date, miles }], each priced at the rate on its own date. */
export function mileageDeduction(trips) {
  let miles = 0, deduction = 0;
  for (const t of trips) { const m = +t.miles || 0; miles += m; deduction += m * getMileageRate(t.date); }
  return { miles: round2(miles), deduction: round2(deduction) };
}

/**
 * Self-employment tax on net Schedule C profit (Schedule SE).
 * w2Wages: Social Security wages from a job, which use up part of the wage base.
 */
export function selfEmploymentTax(netProfit, { w2Wages = 0, wageBase = SS_WAGE_BASE_2026 } = {}) {
  const base = Math.max(0, netProfit) * 0.9235;
  const ssRoom = Math.max(0, wageBase - w2Wages);
  const socialSecurity = Math.min(base, ssRoom) * 0.124;
  const medicare = base * 0.029;
  const total = socialSecurity + medicare;
  return { taxableBase: round2(base), socialSecurity: round2(socialSecurity), medicare: round2(medicare), total: round2(total), deductibleHalf: round2(total / 2) };
}

/** Moves a date that falls on a weekend to the next Monday. */
export function nextBusinessDay(iso) {
  const d = new Date(iso + "T12:00:00Z"), w = d.getUTCDay();
  if (w === 6) d.setUTCDate(d.getUTCDate() + 2);
  if (w === 0) d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().slice(0, 10);
}

/**
 * Quarterly estimated tax due dates and the share of the year's tax due each quarter.
 * California splits 30 / 40 / 0 / 30; federal and most states split evenly. Holidays are not adjusted.
 */
export function estimatedTaxSchedule(year, { state = "CA" } = {}) {
  const n = year + 1;
  const federal = [["Q1", `${year}-04-15`], ["Q2", `${year}-06-15`], ["Q3", `${year}-09-15`], ["Q4", `${n}-01-15`]]
    .map(([quarter, due]) => ({ quarter, due: nextBusinessDay(due), share: 0.25 }));
  const caShares = [0.30, 0.40, 0, 0.30];
  const stateSched = state === "CA" ? federal.map((q, i) => ({ ...q, share: caShares[i] })) : federal.map(q => ({ ...q }));
  return { federal, state: stateSched };
}

/** Name for a Treasury Tipped Occupation Code, e.g. "603". */
export function ttocName(code) {
  const hit = TTOC_CODES.find(c => c[0] === String(code));
  return hit ? hit[1] : null;
}

function round2(n) { return Math.round(n * 100) / 100; }
