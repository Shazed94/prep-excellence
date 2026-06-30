# Seed Login Credentials

> **All passwords:** `Test@1234`  
> Run `pnpm seed` first (roles + SuperAdmin), then `pnpm seed:full` for all test data.

---

## SuperAdmin

| Name | Email | Password | Notes |
|---|---|---|---|
| Admin User | info@prepexcellence.com | `A7f!Q9mR2@Kp` | Created by `seed.ts` — production admin |

---

## Teachers  *(seed-comprehensive.ts)*

| Name | Email | Password | Specialty | Rate |
|---|---|---|---|---|
| **Dr. Kaiser Alam** ⭐ | kaiser.alam@preptest.com | `Test@1234` | SAT Math, Calculus, College Prep — **owns all 5 LMS + 5 Coaching courses** | $120/hr online |
| Ms. Priya Sharma | priya.sharma@preptest.com | `Test@1234` | SAT Reading & Writing, ESL | $75/hr online |
| Mr. James Wilson | james.wilson@preptest.com | `Test@1234` | SAT Math & Reading, Test Strategy | $100/hr online |
| Dr. Fatima Hassan | fatima.hassan@preptest.com | `Test@1234` | SAT Math, AP Physics, AP Chemistry | $95/hr online |
| Mr. Lucas Chen | lucas.chen@preptest.com | `Test@1234` | SAT Data Analysis, Statistics | $70/hr online |

---

## Students  *(seed-comprehensive.ts)*

| Name | Email | Password | Grade | Level | Guardian |
|---|---|---|---|---|---|
| Aiden Martinez | aiden.martinez@preptest.com | `Test@1234` | 11 | Intermediate | carlos.martinez@preptest.com |
| Sophia Lee | sophia.lee@preptest.com | `Test@1234` | 12 | Advanced | jenny.lee@preptest.com |
| Noah Thompson | noah.thompson@preptest.com | `Test@1234` | 10 | Beginner | mark.thompson@preptest.com |
| Olivia Garcia | olivia.garcia@preptest.com | `Test@1234` | 11 | Intermediate | rosa.garcia@preptest.com |
| Ethan Wright | ethan.wright@preptest.com | `Test@1234` | 12 | Intermediate | david.wright@preptest.com |

---

## Courses Created  *(all by Dr. Kaiser Alam)*

### LMS Courses (Self-Paced)

| # | Title | Slug | Level | Price |
|---|---|---|---|---|
| 1 | SAT Math: Complete Mastery | `sat-math-complete-mastery-lms` | Advanced | $399 |
| 2 | SAT Evidence-Based Reading & Writing | `sat-ebrw-mastery-lms` | Intermediate | $349 |
| 3 | Algebra & Pre-Calculus Foundations | `algebra-precalculus-foundations-lms` | Beginner | $249 |
| 4 | Statistics & Data Analysis for SAT | `statistics-data-analysis-sat-lms` | Intermediate | $199 |
| 5 | Digital SAT Full Prep Program | `digital-sat-full-prep-lms` | Intermediate | $449 |

### Coaching Courses (Live, Instructor-Led)

| # | Title | Slug | Level | Price | Capacity |
|---|---|---|---|---|---|
| 1 | SAT Math Elite Coaching Program | `sat-math-elite-coaching` | Advanced | $2,400 | 8 |
| 2 | Academic Excellence Bootcamp | `academic-excellence-bootcamp-coaching` | Intermediate | $1,800 | 12 |
| 3 | College Entrance Prep Intensive | `college-entrance-prep-intensive-coaching` | Intermediate | $3,200 | 10 |
| 4 | Advanced Problem Solving Workshop | `advanced-problem-solving-workshop-coaching` | Advanced | $1,600 | 6 |
| 5 | Foundation Building Program | `foundation-building-program-coaching` | Beginner | $3,800 | 15 |

Each course has **2 modules × 2 lessons** (Video + Exam for LMS; Live Class + Assignment for Coaching).

---

## One-to-One Sessions  *(Dr. Kaiser Alam)*

| Student | Status | Scheduled At | Topic |
|---|---|---|---|
| Aiden Martinez | ✅ COMPLETED | 10 days ago @ 10:00 AM | Heart of Algebra — Linear equations & word problems |
| Sophia Lee | ✅ COMPLETED | 5 days ago @ 2:00 PM | Problem Solving & Data Analysis — Statistics |
| Noah Thompson | 📅 SCHEDULED | +3 days @ 10:00 AM | Foundation Review — Arithmetic & basic algebra |
| Olivia Garcia | 📅 SCHEDULED | +6 days @ 3:00 PM | Passport to Advanced Math — Quadratics & functions |
| Ethan Wright | 📅 SCHEDULED | +9 days @ 11:00 AM | Test Strategy & Timing — Section pacing |

> Completed sessions have recordings + 5-star reviews from Aiden and Sophia.

---

## Blogs  *(authored by Dr. Kaiser Alam — all PUBLISHED)*

| # | Title | Slug | Category |
|---|---|---|---|
| 1 | 10 Proven Strategies to Score 800 on SAT Math | `10-proven-strategies-score-800-sat-math` | SAT Tips & Tricks |
| 2 | How to Approach SAT Evidence-Based Reading Passages | `how-to-approach-sat-evidence-based-reading-passages` | SAT Tips & Tricks |
| 3 | Building a 12-Week SAT Study Plan That Actually Works | `building-12-week-sat-study-plan` | Study Strategy |
| 4 | The Digital SAT: Everything You Need to Know in 2025 | `digital-sat-everything-you-need-to-know-2025` | SAT Tips & Tricks |
| 5 | How to Choose the Right SAT Prep Program for Your Student | `how-to-choose-right-sat-prep-program` | College Prep |

---

## Extra Test Users  *(seed-test-data.ts — older seed)*

### Teachers
| Name | Email | Password |
|---|---|---|
| Sarah Johnson | sarah.johnson@test.com | `Test@1234` |
| David Kim | david.kim@test.com | `Test@1234` |

### Students
| Name | Email | Password |
|---|---|---|
| Alice Smith | alice.smith@test.com | `Test@1234` |
| Bob Jones | bob.jones@test.com | `Test@1234` |
| Charlie Brown | charlie.brown@test.com | `Test@1234` |
| Diana Prince | diana.prince@test.com | `Test@1234` |

---

## How to Run

```bash
# from repo root
cd apps/api

# Step 1 — Roles, permissions, SuperAdmin (run once)
pnpm seed

# Step 2 — Comprehensive test data (Dr. Kaiser Alam + all courses)
pnpm seed:full

# Step 3 — (Optional) Earlier smaller test dataset
pnpm seed:test
```

### Add scripts to apps/api/package.json if missing:
```json
"seed":      "npx tsx src/utils/seed.ts",
"seed:test": "npx tsx src/utils/seed-test-data.ts",
"seed:full": "npx tsx src/utils/seed-comprehensive.ts"
```
