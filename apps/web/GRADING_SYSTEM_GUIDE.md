# Student Test Attempts Grading System

## Overview
A comprehensive grading system that allows teachers to review student test attempts and assign marks question by question on a separate dedicated page.

## Routes

### 1. **Student Attempts List Page**
**Route:** `/dashboard/student-test-attempts/`

**Features:**
- DataTable showing all student test attempts
- Search by student name
- Export functionality (PDF, Excel, CSV)
- Pagination support
- Color-coded status badges:
  - 🔵 **IN_PROGRESS** - Test currently being taken
  - 🟡 **COMPLETED** - Test finished but not submitted
  - 🟣 **SUBMITTED** - Awaiting teacher grading
  - 🟢 **GRADED** - Fully graded with feedback

**Columns:**
- Student Name & Email
- Test Name & Subject
- Status Badge
- Progress (answered/total questions)
- Score (if graded)
- Time Spent
- Started At timestamp
- **Action Button:** "Grade Test" - navigates to grading page

---

### 2. **Grading Page**
**Route:** `/dashboard/student-test-attempts/$attemptId`

**Layout:**
```
┌─────────────────────────────────────────────────────────────────┐
│  Header: Back Button | Test Name | Save | Submit Final Grade   │
├───────────────┬─────────────────────────────────────────────────┤
│  Left Sidebar │           Main Grading Content                  │
│               │                                                  │
│  Questions    │  Question Display with Answer Comparison        │
│  Navigator    │                                                  │
│  (Grid 4x?)   │  ┌──────────────────────────────────────────┐  │
│               │  │ Question Content                         │  │
│  ○ ○ ○ ○     │  │ Student's Answer vs Correct Answer      │  │
│  ● ○ ○ ○     │  │                                         │  │
│  ○ ○ ○ ○     │  │ ┌─────────────────────────────────────┐ │  │
│               │  │ │ Grade This Question Section         │ │  │
│  Stats Card   │  │ │ • Quick Grade Buttons                │ │  │
│  • Score      │  │ │   [Full] [Half] [Zero]              │ │  │
│  • %          │  │ │ • Manual Points Input               │ │  │
│  • Time       │  │ │ • Teacher Feedback Textarea         │ │  │
│               │  │ └─────────────────────────────────────┘ │  │
│               │  └──────────────────────────────────────────┘  │
│               │                                                  │
│               │  [Previous Question] Q1 of 44 [Next Question]  │
└───────────────┴─────────────────────────────────────────────────┘
```

#### **Left Sidebar Features:**

**Questions Navigator:**
- Grid layout (4 columns)
- Numbered buttons for each question
- Visual indicators:
  - Current question (highlighted)
  - Graded + correct (green background)
  - Graded + incorrect (red background)
  - Not yet graded (default)
  - Flagged for review (orange flag icon)
- Click to jump to any question

**Stats Card:**
- Current score / max score
- Percentage
- Time spent
- Start date

#### **Main Content Features:**

**Question Display:**
- Question number with badges:
  - Difficulty (Easy/Medium/Hard)
  - Question type (Single Choice, Multiple Choice, etc.)
  - Points available
  - Flagged indicator
- Domain & Skill tags
- Time spent on question

**Answer Comparison:**

**For Multiple Choice Questions:**
- List of all options with visual coding:
  - ✅ Green + thick border = Correct answer selected by student
  - ❌ Red + thick border = Incorrect answer selected by student
  - ✓ Green + dashed border = Correct answer (not selected)
  - Gray = Incorrect option (not selected)
- "Student Selected" badge on chosen options
- "Correct" indicator on right answers

**For Text Answers:**
- Side-by-side comparison:
  - Left: Student's Answer (blue background)
  - Right: Correct Answer (green background)
- Pre-formatted to preserve line breaks

**Grading Section:**
- **Quick Grade Buttons:**
  - Full Credit (green) - awards maximum points
  - Partial (yellow) - awards half points
  - No Credit (red) - awards zero points
- **Manual Points Input:**
  - Number input with validation
  - Min: 0, Max: question points
  - Supports decimal values (0.5 increments)
- **Teacher Feedback:**
  - Large textarea for constructive comments
  - Optional but recommended
  - Sent to student with grade

**Navigation:**
- Previous/Next buttons
- Disabled at boundaries
- Shows current position (Q1 of 44)

#### **Header Actions:**

1. **Back to Attempts** - Return to listing page
2. **Save Progress** - Save current grades without finalizing
3. **Submit Final Grade** - Opens confirmation dialog

**Confirmation Dialog Shows:**
- Student name
- Final score / max score
- Percentage
- Questions graded count
- Prevents submission if not all questions graded

---

## Question Types Supported

### 1. **SINGLE_CHOICE**
- Radio button selection
- One correct answer
- Auto-graded when correct option selected
- Teacher can override grade

### 2. **MULTIPLE_CHOICE**
- Checkbox selection
- Multiple correct answers
- Requires all correct selections for full credit
- Teacher assigns points manually

### 3. **SHORT_ANSWER**
- Text input
- Requires manual grading
- Side-by-side comparison with correct answer
- Supports multi-line answers

### 4. **FILL_IN_THE_BLANK**
- Text input for specific blanks
- May have alternative acceptable answers
- Requires manual grading

### 5. **TRUE_FALSE**
- Boolean selection
- Auto-graded
- Can be manually overridden

---

## Grading Workflow

1. Teacher navigates to Student Test Attempts page
2. Searches/filters to find specific attempt
3. Clicks "Grade Test" button
4. Lands on grading page with first question
5. Reviews question and student's answer
6. Uses quick grade or manual input to assign points
7. (Optional) Adds teacher feedback
8. Clicks "Next Question" or uses navigator
9. Repeats for all questions
10. Clicks "Save Progress" periodically
11. When complete, clicks "Submit Final Grade"
12. Confirms in dialog
13. Redirected back to attempts list

---

## UX Improvements

### Visual Feedback
- Color-coded question grid shows grading status at a glance
- Real-time score calculation
- Unsaved changes indicator
- Progress tracking (X of Y graded)

### Efficiency Features
- Quick grade buttons for common scenarios
- Keyboard navigation support
- Jump to any question
- Save without submitting

### Student Experience
- Clear feedback on each question
- Understand where they made mistakes
- Teacher comments for improvement
- Complete score breakdown

---

## Technical Implementation

### Components Used
- `DataTable` - Main listing with search/filter
- `Card` - Content containers
- `Badge` - Status and metadata indicators
- `Button` - Actions
- `Input` - Point entry
- `Textarea` - Feedback
- `ScrollArea` - Question navigator
- `AlertDialog` - Final submission confirmation
- `Separator` - Visual dividers
- `Label` - Form labels

### State Management
- React useState for local grading state
- Unsaved changes tracking
- Question navigation state
- Real-time score calculation

### Routing
- TanStack Router
- Dynamic route params (`$attemptId`)
- Type-safe navigation
- Link components for routing

---

## Future Enhancements

### Planned Features
1. Bulk grading actions
2. Grading templates/rubrics
3. Comment library for common feedback
4. Keyboard shortcuts
5. Export graded tests as PDF
6. Student performance analytics
7. Time-per-question insights
8. Comparison with class averages
9. Auto-grading for objective questions
10. Partial credit presets

### Backend Integration Points
- Fetch attempt data: `GET /api/attempts/:attemptId`
- Save grades: `POST /api/attempts/:attemptId/grade`
- Submit final: `POST /api/attempts/:attemptId/submit-grade`
- List attempts: `GET /api/attempts`

---

## Dummy Data Included

Sample data includes:
- 5 student attempts with various statuses
- Multiple question types demonstrated
- Realistic test scenarios
- Different difficulty levels
- Flagged questions
- Time tracking data

This data can be replaced with API calls when backend is ready.
