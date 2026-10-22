import { z } from 'zod';

// ── Request schema ────────────────────────────────────────────────────────────
export const eventRequestSchema = z.object({
  eventType: z.enum(['wedding', 'birthday', 'community']),
  eventName: z.string().min(1).max(100),
  date: z.string().date(),
  location: z.string().min(1).max(100),
  guestCount: z.number().int().positive().max(100000),
  budget: z.number().positive().max(100000000),
  currency: z.enum(['USD', 'INR', 'EUR', 'GBP', 'AED']),
  language: z.enum(['en', 'hi', 'ta', 'bn', 'es', 'fr']),
  style: z.string().max(200).optional(),
  priorities: z.array(z.string()).max(5).optional(),
});

// ── AI output schema (for runtime validation of Gemini's response) ────────────
export const budgetCategorySchema = z.object({
  category: z.string(),
  weight: z.number().positive(),
  tips: z.string(),
});

export const timelineItemSchema = z.object({
  task: z.string(),
  offsetWeeksBefore: z.number().int().nonnegative(),
});

export const vendorSchema = z.object({
  category: z.string(),
  checklist: z.array(z.string()),
});

export const ideasSchema = z.object({
  theme: z.array(z.string()),
  foodAndDrink: z.array(z.string()),
  activities: z.array(z.string()),
});

export const eventPlanSchema = z.object({
  summary: z.string(),
  budgetCategories: z.array(budgetCategorySchema),
  timeline: z.array(timelineItemSchema),
  vendors: z.array(vendorSchema),
  ideas: ideasSchema,
});
