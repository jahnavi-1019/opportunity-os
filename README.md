# 🎯 OpportunityOS — Explainable Opportunity & Scholarship Matching Engine

> Part of the **Antigravity 20-Project Systems Engineering Portfolio**

OpportunityOS replaces opaque algorithmic job and scholarship recommendations with transparent constraint satisfaction rules, explicitly reporting *why* you match and identifying upfront any disqualifying hard constraints (GPA, graduation year, work authorization).

---

## 🏗️ Architecture

```
Candidate Profile (GPA, Year, Citizenship, Skills)
                        │
                        ▼
┌──────────────────────────────────────────────────┐
│                ConstraintMatcher                 │
├──────────────────────────────────────────────────┤
│ 1. Hard Constraints (GPA floors, Visa, Year)     │
│ 2. Soft Skills & Domain Alignment                │
└──────────────────────────────────────────────────┘
                        │
                        ▼
┌──────────────────────────────────────────────────┐
│              Transparent Explanations            │ ──> FULLY_ELIGIBLE | BORDERLINE | DISQUALIFIED
└──────────────────────────────────────────────────┘
                        │
                        ▼
Interactive Opportunity Studio (ui/index.html)
```

---

## 🚀 Quick Start

### 1. Run Tests
```bash
npm test
```

### 2. Launch Individual UI Dashboard
```bash
npm run ui
```
Opens the opportunity console at `http://localhost:4009`.
