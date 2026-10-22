import { eventRequestSchema } from '../lib/schema.js';
import { generateEventPlan } from '../lib/prompt.js';

// ── In-memory cache & rate limiter (warm-instance scoped) ────────────────────
// Key: SHA-256-like hash of request body  Value: { plan, ts }
const cache = new Map();

// Key: IP address  Value: { count, windowStart }
const rateLimitMap = new Map();

const CACHE_TTL_MS       = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX     = 5;               // max requests per window
const RATE_LIMIT_WINDOW  = 60 * 1000;       // 1 minute window

/**
 * simpleHash
 * Deterministic string hash for cache keying. Not cryptographic — just fast.
 */
function simpleHash(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = (h * 0x01000193) >>> 0;
  }
  return h.toString(16);
}

/**
 * checkRateLimit
 * Returns true if the IP is within the allowed request rate.
 */
function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) ?? { count: 0, windowStart: now };

  if (now - entry.windowStart > RATE_LIMIT_WINDOW) {
    // Reset window
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) return false;

  entry.count += 1;
  rateLimitMap.set(ip, entry);
  return true;
}

/**
 * normalizeBudget  ← Largest Remainder Method
 * ──────────────────────────────────────────────────────────────────────────────
 * Converts AI-returned relative weights into exact integer currency amounts that
 * sum precisely to the user's total budget. Eliminates floating-point drift.
 *
 * Algorithm:
 *  1. exactAmount  = (weight / totalWeight) × budget      (may be fractional)
 *  2. roundedAmount = Math.floor(exactAmount)              (always undershoots)
 *  3. remainder    = budget − Σ roundedAmounts             (integer leftover)
 *  4. Sort by fractional part descending, add 1 to top-N  (fair distribution)
 */
function normalizeBudget(categories, totalBudget) {
  const totalWeight = categories.reduce((sum, c) => sum + c.weight, 0);

  // Step 1 & 2: floor allocations
  const items = categories.map((cat, i) => {
    const exact    = (cat.weight / totalWeight) * totalBudget;
    const floored  = Math.floor(exact);
    return { ...cat, amount: floored, frac: exact - floored, index: i };
  });

  // Step 3: compute remainder
  let remainder = totalBudget - items.reduce((s, it) => s + it.amount, 0);

  // Step 4: distribute remainder units by largest fractional part
  items
    .slice()
    .sort((a, b) => b.frac - a.frac)
    .forEach(item => {
      if (remainder > 0) {
        items[item.index].amount += 1;
        remainder -= 1;
      }
    });

  return items.map(({ index, frac, ...rest }) => rest); // strip internal fields
}

// ── Main handler ─────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  // CORS headers (allow Vercel preview URLs + localhost)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(204).end();
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Rate limiting ───────────────────────────────────────────────────────────
  const ip = req.headers['x-forwarded-for']?.split(',')[0] ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many requests. Please wait a minute.' });
  }

  try {
    // ── Input validation ──────────────────────────────────────────────────────
    const validation = eventRequestSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        error: 'Invalid request payload',
        details: validation.error.format(),
      });
    }

    const eventData = validation.data;

    // ── Cache lookup ──────────────────────────────────────────────────────────
    const cacheKey = simpleHash(JSON.stringify(eventData));
    const cached   = cache.get(cacheKey);

    if (cached && Date.now() - cached.ts < CACHE_TTL_MS) {
      res.setHeader('X-Cache', 'HIT');
      return res.status(200).json(cached.plan);
    }

    // ── Generate plan via Gemini ──────────────────────────────────────────────
    const rawPlan = await generateEventPlan(eventData);

    // ── Deterministic budget normalization ────────────────────────────────────
    rawPlan.budgetCategories = normalizeBudget(
      rawPlan.budgetCategories,
      eventData.budget,
    );

    // Attach metadata the frontend needs for rendering
    const finalPlan = {
      ...rawPlan,
      meta: {
        eventName:  eventData.eventName,
        eventType:  eventData.eventType,
        date:       eventData.date,
        location:   eventData.location,
        guestCount: eventData.guestCount,
        budget:     eventData.budget,
        currency:   eventData.currency,
        language:   eventData.language,
        generatedAt: new Date().toISOString(),
      },
    };

    // ── Store in cache ────────────────────────────────────────────────────────
    cache.set(cacheKey, { plan: finalPlan, ts: Date.now() });

    res.setHeader('X-Cache', 'MISS');
    return res.status(200).json(finalPlan);

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({
      error: 'Internal server error while generating plan.',
      message: error.message,
    });
  }
}
