import { GoogleGenAI } from '@google/genai';
import { EVENT_TEMPLATES } from './event-types.js';
import { eventPlanSchema } from './schema.js';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * buildPrompt
 * ──────────────────────────────────────────────────────────────────────────────
 * Constructs the structured prompt sent to Gemini. Injecting template defaults
 * reduces the token burden on the model and anchors it to realistic structures,
 * minimising hallucination.
 */
function buildPrompt(eventData) {
  const template = EVENT_TEMPLATES[eventData.eventType];
  const suggestedCategories = template.defaultCategories.join(', ');
  const suggestedMilestones = template.defaultMilestones
    .map(m => `  - "${m.task}" (${m.offsetWeeksBefore} weeks before)`)
    .join('\n');

  return `You are a world-class event planner with decades of experience across cultures and budgets.
Create a comprehensive, realistic, and enthusiastic event plan for the following event.

EVENT DETAILS:
- Type: ${eventData.eventType}
- Name: "${eventData.eventName}"
- Date: ${eventData.date}
- Location: ${eventData.location}
- Guest Count: ${eventData.guestCount}
- Total Budget: ${eventData.budget} ${eventData.currency}
- Style/Preferences: ${eventData.style || 'Balanced and elegant'}
- Priorities: ${eventData.priorities?.join(', ') || 'Equal focus on all areas'}
- Output Language: ${eventData.language}

SUGGESTED BUDGET CATEGORIES (use these as a base, adjust as needed):
${suggestedCategories}

SUGGESTED TIMELINE MILESTONES (use these as a base, add more specific ones):
${suggestedMilestones}

INSTRUCTIONS:
1. "budgetCategories": Assign relative integer weights (not percentages or amounts). The weights will be normalised server-side into exact currency amounts. Include a practical money-saving tip for each category.
2. "timeline": Return tasks as { task, offsetWeeksBefore } where offsetWeeksBefore is a non-negative integer. Include at least 6 milestones.
3. "vendors": For each major vendor category, provide 3–5 specific questions a client should ask before booking.
4. "ideas": Provide 3 creative, culturally aware suggestions for theme, food & drink, and activities.
5. Write all descriptive text in the requested language (${eventData.language}), but keep JSON keys in English.

Return ONLY valid JSON with this exact structure:
{
  "summary": "An encouraging 2–3 sentence overview of the plan",
  "budgetCategories": [
    { "category": "Category Name", "weight": <integer>, "tips": "Practical saving tip" }
  ],
  "timeline": [
    { "task": "Task description", "offsetWeeksBefore": <integer> }
  ],
  "vendors": [
    { "category": "Vendor type", "checklist": ["Question 1", "Question 2", "Question 3"] }
  ],
  "ideas": {
    "theme": ["Idea 1", "Idea 2", "Idea 3"],
    "foodAndDrink": ["Idea 1", "Idea 2", "Idea 3"],
    "activities": ["Idea 1", "Idea 2", "Idea 3"]
  }
}`;
}

/**
 * generateEventPlan
 * ──────────────────────────────────────────────────────────────────────────────
 * Calls Gemini 2.5 Flash with responseMimeType: 'application/json' to get a
 * structured plan, then validates the output shape with Zod before returning.
 */
export async function generateEventPlan(eventData) {
  const prompt = buildPrompt(eventData);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      temperature: 0.7,
      maxOutputTokens: 4096,
    },
  });

  const raw = JSON.parse(response.text);

  // Runtime validation of Gemini's output — throws if shape is wrong
  const parsed = eventPlanSchema.safeParse(raw);
  if (!parsed.success) {
    console.error('Gemini output failed schema validation:', parsed.error.format());
    throw new Error('AI returned an unexpected response structure.');
  }

  return parsed.data;
}
