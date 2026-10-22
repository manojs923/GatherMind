# 🌲 GatherMind — GenAI Event Planning Assistant

> An AI-powered event planning web application that designs precision budgets, dynamic timelines, vendor evaluation checklists, and creative concepts for weddings, birthday parties, and community festivals.

[![Live App](https://img.shields.sh/badge/Live-gathermind.vercel.app-brightgreen)](https://gathermind.vercel.app)
[![Node](https://img.shields.sh/badge/Node.js-20+-blue)](https://nodejs.org)
[![Vercel](https://img.shields.sh/badge/Serverless-Vercel-black)](https://vercel.com)
[![License: MIT](https://img.shields.sh/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Key Features

- **Deterministic Zero-Loss Budget Normalization:** Employs the **Largest Remainder Method** so budget allocations always sum *exactly* to the user's total budget without fractional loss or floating-point rounding drift.
- **Dynamic Interactive Sliders:** Real-time financial re-weighting allowing users to adjust priorities and instantly view updated integer allocations.
- **Structured GenAI Generation:** Powered by **Google Gemini 2.5 Flash** with strict `responseMimeType: 'application/json'` schema enforcement.
- **Hallucination Prevention:** Input grounding backed by strict **Zod runtime schema validation** (`.safeParse()`) and event archetype grounding templates.
- **Comprehensive Event Dashboard:** 5 interactive views:
  1. **Executive Overview:** AI strategic plan summary, key metrics, days remaining countdown, and priority highlights.
  2. **Budget Engine:** Zero-drift category breakdown with live weight sliders and savings recommendations.
  3. **Milestone Timeline:** Interactive actionable checklist with urgency badges and date offset calculation.
  4. **Vendor Checklists:** Vendor interview questions and note-taking scratchpads.
  5. **Creative Ideation:** Culturally aware concepts across theme, catering, and guest activities.
- **Export & Client Storage:** Export to JSON, print-to-PDF formatting, and automatic persistence via `localStorage`.

---

## 🏗️ Architecture & Tech Stack

```text
GatherMind/
├── .github/workflows/
│   └── test.yml           # GitHub Actions CI automated test workflow
├── api/
│   └── plan.js            # Vercel Serverless Function (Main API handler + rate limiting + cache)
├── lib/
│   ├── event-types.js     # Archetype templates and currency formatting
│   ├── prompt.js          # Gemini prompt builder and GenAI SDK integration
│   └── schema.js          # Zod validation schemas for input & AI response
├── public/
│   ├── index.html         # Single-Page Application (Tailwind CSS, FontAwesome, Chart.js)
│   ├── css/style.css      # Stylesheet
│   └── js/                # Client controllers & renderers
├── test/
│   └── planner.test.js    # Unit tests for budget math, dates & Zod schema validation
├── package.json
└── vercel.json
```

- **Frontend:** HTML5, Tailwind CSS, FontAwesome Icons, Vanilla JS SPA architecture
- **Backend:** Vercel Serverless Node.js Functions
- **AI Model:** Google Gemini 2.5 Flash (`@google/genai`)
- **Validation:** Zod Schema Validation
- **Testing:** Jest Automated Test Suite

---

## 🚀 Local Development Setup

### 1. Clone the repository
```bash
git clone https://github.com/manojs923/GatherMind.git
cd GatherMind
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### 4. Run the development server
```bash
# Preview via static server
npx serve public -l 3000

# Or with Vercel Serverless runtime
npx vercel dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Run automated test suite
```bash
npm test
```

---

## 🧪 Testing & Validation

Our automated test suite in [`test/planner.test.js`](test/planner.test.js) verifies:
- **Largest Remainder Allocation:** Zero remainder drift across prime, non-divisible budgets.
- **Edge cases:** Single-category allocations, zero-weight handling, and non-negative constraints.
- **Schema verification:** Zod validation on required fields, currency enums, and numerical bounds.
- **Timeline date arithmetic:** Accurate negative offset day calculations across month boundaries.

---

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
