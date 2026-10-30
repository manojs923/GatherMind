<div align="center">

# 🌲 GatherMind

### **The Intelligent, Zero-Drift GenAI Event Planning Assistant**

[![Live App](https://img.shields.io/badge/Live-gathermind.vercel.app-brightgreen)](https://gathermind.vercel.app)
[![Gemini 2.5 Flash](https://img.shields.io/badge/AI-Google_Gemini_2.5_Flash-blue)](https://ai.google.dev)
[![Vercel Serverless](https://img.shields.io/badge/Backend-Vercel_Serverless-black)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*Design precision budgets, dynamic timelines, vendor evaluation checklists, and culturally rich creative concepts for weddings, birthday parties, and community festivals in seconds.*

</div>

---



## ✨ Visual Overview & Architecture

> **Interactive Experience:** GatherMind provides a seamless single-page application (SPA) experience divided into 5 dedicated analytical and creative views.

```text
 User Input & Event Archetype 
              │
              ▼ (Secure Serverless API)
 Google Gemini 2.5 Flash 
              │
              ▼ (Strict JSON Schema & Zod Validation)
  Deterministic Engine 
  ├── 🧮 Largest Remainder Math  ──► [1. Executive Overview]
  ├── ⚡ Live Weight Sliders     ──► [2. Budget Engine]
  ├── 📅 Date Offset Calculation ──► [3. Milestone Timeline]
  ├── 📋 Interview Scratchpads   ──► [4. Vendor Checklists]
  └── 🎨 Culturally Aware Ideas  ──► [5. Creative Ideation]

---

## ✨ Visual Overview & Architecture

> **Interactive Experience:** GatherMind provides a seamless single-page application (SPA) experience divided into 5 dedicated analytical and creative views.

```mermaid
graph TD
    A[User Input & Event Archetype] -->|Secure Serverless API| B(Google Gemini 2.5 Flash)
    B -->|Strict JSON Schema & Zod Validation| C{Deterministic Engine}
    C -->|Largest Remainder Math| D[1. Executive Overview]
    C -->|Live Weight Sliders| E[2. Budget Engine]
    C -->|Date Offset Calculation| F[3. Milestone Timeline]
    C -->|Interview Scratchpads| G[4. Vendor Checklists]
    C -->|Culturally Aware Concepts| H[5. Creative Ideation]

---

## ✨ Visual Overview & Architecture

> **Interactive Experience:** GatherMind provides a seamless single-page application (SPA) experience divided into 5 dedicated analytical and creative views.

```mermaid
graph TD
    A[User Input & Event Archetype] -->|Secure Serverless API| B(Google Gemini 2.5 Flash)
    B -->|Strict JSON Schema & Zod Validation| C{Deterministic Engine}
    C -->|Largest Remainder Math| D[1. Executive Overview]
    C -->|Live Weight Sliders| E[2. Budget Engine]
    C -->|Date Offset Calculation| F[3. Milestone Timeline]
    C -->|Interview Scratchpads| G[4. Vendor Checklists]
    C -->|Culturally Aware Concepts| H[5. Creative Ideation]

---

## ✨ Visual Overview & Architecture

> **Interactive Experience:** GatherMind provides a seamless single-page application (SPA) experience divided into 5 dedicated analytical and creative views.

```mermaid
graph TD
    A[User Input & Event Archetype] -->|Secure Serverless API| B(Google Gemini 2.5 Flash)
    B -->|Strict JSON Schema & Zod Validation| C{Deterministic Engine}
    C -->|Largest Remainder Math| D[1. Executive Overview]
    C -->|Live Weight Sliders| E[2. Budget Engine]
    C -->|Date Offset Calculation| F[3. Milestone Timeline]
    C -->|Interview Scratchpads| G[4. Vendor Checklists]
    C -->|Culturally Aware Concepts| H[5. Creative Ideation]
---

## ✨ Visual Overview & Architecture

> **Interactive Experience:** GatherMind provides a seamless single-page application (SPA) experience divided into 5 dedicated analytical and creative views.

```mermaid
graph TD
    A[User Input & Event Archetype] -->|Secure Serverless API| B(Google Gemini 2.5 Flash)
    B -->|Strict JSON Schema & Zod Validation| C{Deterministic Engine}
    C -->|Largest Remainder Math| D[1. Executive Overview]
    C -->|Live Weight Sliders| E[2. Budget Engine]
    C -->|Date Offset Calculation| F[3. Milestone Timeline]
    C -->|Interview Scratchpads| G[4. Vendor Checklists]
    C -->|Culturally Aware Concepts| H[5. Creative Ideation]

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
