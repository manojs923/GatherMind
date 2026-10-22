/**
 * planner.test.js — Unit tests for core budget & date logic
 * ──────────────────────────────────────────────────────────────────────────────
 * Run with: npm test
 */

// ── Inline normalizeBudget (mirrors api/plan.js logic for isolated testing) ───
function normalizeBudget(categories, totalBudget) {
  const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0);
  const items = categories.map((cat, i) => {
    const exact   = (cat.weight / totalWeight) * totalBudget;
    const floored = Math.floor(exact);
    return { ...cat, amount: floored, frac: exact - floored, index: i };
  });

  let remainder = totalBudget - items.reduce((s, it) => s + it.amount, 0);
  items
    .slice()
    .sort((a, b) => b.frac - a.frac)
    .forEach(item => {
      if (remainder > 0) {
        items[item.index].amount += 1;
        remainder -= 1;
      }
    });

  return items.map(({ index, frac, ...rest }) => rest);
}

// ── Inline computeMilestoneDate (mirrors renderer.js logic) ──────────────────
function computeMilestoneDate(eventDateStr, offsetWeeksBefore) {
  const d = new Date(eventDateStr + 'T00:00:00');
  d.setDate(d.getDate() - offsetWeeksBefore * 7);
  return d.toISOString().split('T')[0];
}

// ── Schema Validation Tests ───────────────────────────────────────────────────
import { eventRequestSchema } from '../lib/schema.js';

describe('eventRequestSchema Zod Validation', () => {
  const validPayload = {
    eventType: 'wedding',
    eventName: 'Summer Gala',
    date: '2026-10-24',
    location: 'Napa Valley',
    guestCount: 150,
    budget: 45000,
    currency: 'USD',
    language: 'en',
    style: 'Rustic Chic',
    priorities: ['Catering', 'Music']
  };

  test('validates a well-formed event request', () => {
    const parsed = eventRequestSchema.safeParse(validPayload);
    expect(parsed.success).toBe(true);
  });

  test('rejects negative or zero guest count', () => {
    const invalid = { ...validPayload, guestCount: 0 };
    const parsed = eventRequestSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  test('rejects unsupported currency', () => {
    const invalid = { ...validPayload, currency: 'BTC' };
    const parsed = eventRequestSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });

  test('rejects invalid date format', () => {
    const invalid = { ...validPayload, date: '10/24/2026' };
    const parsed = eventRequestSchema.safeParse(invalid);
    expect(parsed.success).toBe(false);
  });
});

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('normalizeBudget', () => {
  test('allocations sum exactly to the total budget', () => {
    const categories = [
      { category: 'Venue',    weight: 5, tips: '' },
      { category: 'Catering', weight: 3, tips: '' },
      { category: 'Decor',    weight: 2, tips: '' },
    ];
    const total  = 100000;
    const result = normalizeBudget(categories, total);
    const sum    = result.reduce((s, c) => s + c.amount, 0);
    expect(sum).toBe(total);
  });

  test('handles a budget that is not divisible by weights', () => {
    const categories = [
      { category: 'A', weight: 1, tips: '' },
      { category: 'B', weight: 1, tips: '' },
      { category: 'C', weight: 1, tips: '' },
    ];
    const total  = 100; // 33.33… each
    const result = normalizeBudget(categories, total);
    const sum    = result.reduce((s, c) => s + c.amount, 0);
    expect(sum).toBe(100);
  });

  test('no category receives a negative allocation', () => {
    const categories = [
      { category: 'X', weight: 10, tips: '' },
      { category: 'Y', weight: 1,  tips: '' },
    ];
    const result = normalizeBudget(categories, 500);
    result.forEach(cat => expect(cat.amount).toBeGreaterThan(0));
  });

  test('higher weight means higher allocation', () => {
    const categories = [
      { category: 'Big',   weight: 8, tips: '' },
      { category: 'Small', weight: 2, tips: '' },
    ];
    const result = normalizeBudget(categories, 1000);
    const big   = result.find(c => c.category === 'Big').amount;
    const small = result.find(c => c.category === 'Small').amount;
    expect(big).toBeGreaterThan(small);
  });

  test('single-category edge case — gets the full budget', () => {
    const categories = [{ category: 'All', weight: 1, tips: '' }];
    const result = normalizeBudget(categories, 999);
    expect(result[0].amount).toBe(999);
  });
});

describe('computeMilestoneDate', () => {
  test('0 weeks before returns the event date itself', () => {
    expect(computeMilestoneDate('2025-12-25', 0)).toBe('2025-12-25');
  });

  test('52 weeks before a date is ~1 year earlier', () => {
    const result = computeMilestoneDate('2025-12-25', 52);
    expect(result).toBe('2024-12-26'); // 52*7 = 364 days before
  });

  test('month boundary is handled correctly', () => {
    const result = computeMilestoneDate('2025-03-01', 4); // 28 days before
    expect(result).toBe('2025-02-01');
  });
});
